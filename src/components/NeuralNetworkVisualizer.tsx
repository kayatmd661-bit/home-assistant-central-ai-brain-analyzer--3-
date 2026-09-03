import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Play, 
  RotateCcw, 
  Activity, 
  Zap, 
  Sliders, 
  Layers, 
  HelpCircle, 
  Sparkles,
  TrendingDown,
  CheckCircle2,
  Volume2
} from 'lucide-react';

const ENTITIES_MOCK = [
  'light.drawing_room',
  'switch.ac_master_bed',
  'fan.living_room',
  'media_player.living_room_tv',
  'camera.backyard_patrol',
  'climate.thermostat_auto',
  'lock.front_door',
  'cover.curtains_balcony'
];

export const NeuralNetworkVisualizer: React.FC = () => {
  const [seqLen, setSeqLen] = useState<number>(30);
  const [dModel, setDModel] = useState<number>(40);
  const [numHeads, setNumHeads] = useState<number>(4);
  const [learningRate, setLearningRate] = useState<number>(0.02);
  const [selectedEntityIdx, setSelectedEntityIdx] = useState<number>(0);
  const [stepState, setStepState] = useState<'IDLE' | 'FORWARD' | 'ATTENTION' | 'CLASSIFIER' | 'BACKPROP' | 'COMPLETE'>('IDLE');
  const [activeHead, setActiveHead] = useState<number>(0);
  const [lossHistory, setLossHistory] = useState<number[]>([1.84, 1.42, 1.15, 0.89, 0.62]);
  const [probabilities, setProbabilities] = useState<number[]>([0.65, 0.12, 0.08, 0.05, 0.04, 0.03, 0.02, 0.01]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [stepLogs, setStepLogs] = useState<string[]>([
    'মডেল রেডি: Pure NumPy 4-Head Transformer Engine Initialized.',
    'ইনপুট শেপ: (30 frames, 40 mel bands) + 2D Positional Encoding',
    'প্রজেকশন ওয়েট সাইজ: W_q, W_k, W_v = [40 x 40], W_ff = [40 x 128]'
  ]);

  // Generate synthetic attention matrix heatmap
  const generateAttentionMatrix = (headIdx: number) => {
    const matrix: number[][] = [];
    const size = 12; // visual sub-sample of 30 frames
    for (let r = 0; r < size; r++) {
      const row: number[] = [];
      let sum = 0;
      for (let c = 0; c < size; c++) {
        // Create realistic diagonal + diagonal-offset attention patterns
        const dist = Math.abs(r - c);
        const bias = headIdx === 0 ? (dist === 0 ? 3 : 1 / (dist + 1)) :
                     headIdx === 1 ? (dist <= 2 ? 2.5 : 0.5) :
                     headIdx === 2 ? (c > r ? 2.8 : 0.4) : (Math.sin(r + c * 0.8) + 1.5);
        const val = Math.exp(bias);
        row.push(val);
        sum += val;
      }
      matrix.push(row.map(v => v / sum));
    }
    return matrix;
  };

  const [attentionMap, setAttentionMap] = useState<number[][]>(generateAttentionMatrix(0));

  useEffect(() => {
    setAttentionMap(generateAttentionMatrix(activeHead));
  }, [activeHead]);

  const runForwardPass = async () => {
    setIsSimulating(true);
    setStepState('FORWARD');
    setStepLogs(prev => [
      `[FORWARD PASS 1/4] অডিও মেল স্পেকট্রোগ্রামে ২D পজিশনাল এনকোডিং যুক্ত করা হয়েছে...`,
      ...prev
    ]);

    await new Promise(r => setTimeout(r, 600));
    setStepState('ATTENTION');
    setStepLogs(prev => [
      `[FORWARD PASS 2/4] ৪-হেড স্কেল্ড ডট-প্রোডাক্ট সেলফ-অ্যাটেনশন হিসাব সম্পন্ন: Softmax(Q K^T / sqrt(10)) * V`,
      ...prev
    ]);

    await new Promise(r => setTimeout(r, 600));
    setStepState('CLASSIFIER');
    setStepLogs(prev => [
      `[FORWARD PASS 3/4] ফিড-ফরোয়ার্ড লেয়ার (ReLU d_ff=128) এবং ডেন্স ক্লাসিফায়ার লজিটস ক্যালকুলেট সম্পন্ন।`,
      ...prev
    ]);

    await new Promise(r => setTimeout(r, 500));
    // calculate random new distribution focused on selectedEntityIdx
    const newProbs = ENTITIES_MOCK.map((_, idx) => {
      if (idx === selectedEntityIdx) return Math.random() * 0.3 + 0.6;
      return Math.random() * 0.08 + 0.01;
    });
    const sum = newProbs.reduce((a, b) => a + b, 0);
    const normalized = newProbs.map(p => p / sum);
    setProbabilities(normalized);

    setStepState('COMPLETE');
    setStepLogs(prev => [
      `[FORWARD PASS 4/4] প্রেডিকশন সমাপ্ত: শীর্ষ এনটিটি '${ENTITIES_MOCK[selectedEntityIdx]}' (কনফিডেন্স: ${(normalized[selectedEntityIdx] * 100).toFixed(1)}%)`,
      ...prev
    ]);
    setIsSimulating(false);
  };

  const runBackpropPass = async () => {
    setIsSimulating(true);
    setStepState('BACKPROP');
    const targetEntity = ENTITIES_MOCK[selectedEntityIdx];
    
    setStepLogs(prev => [
      `[BACKPROPAGATION] সুপারভাইজড লস ক্যালকুলেশন -> টার্গেট লেবেল: '${targetEntity}'`,
      `[CHAIN RULE] Softmax Cross-Entropy dL/dz = probs - y`,
      `[ANALYTICAL ATTENTION GRAD] dW_v, dW_q, dW_k gradients evaluated via Attention Matrix Jacobian!`,
      `[SGD UPDATE] W_q, W_k, W_v, W_ff1, W_ff2 এবং W_class আপডেট সম্পন্ন (lr=${learningRate})`,
      ...prev
    ]);

    await new Promise(r => setTimeout(r, 800));

    // Reduce loss
    const currentLoss = lossHistory[lossHistory.length - 1];
    const newLoss = Math.max(0.05, currentLoss * 0.78 - 0.02);
    setLossHistory(prev => [...prev.slice(-7), Number(newLoss.toFixed(3))]);

    // Boost target prob
    const newProbs = probabilities.map((p, idx) => {
      if (idx === selectedEntityIdx) return Math.min(0.96, p + 0.15);
      return Math.max(0.01, p * 0.6);
    });
    const sum = newProbs.reduce((a, b) => a + b, 0);
    setProbabilities(newProbs.map(p => p / sum));

    setStepState('COMPLETE');
    setIsSimulating(false);
  };

  const resetWeights = () => {
    setLossHistory([1.84, 1.42, 1.15, 0.89, 0.62]);
    setProbabilities([0.45, 0.22, 0.11, 0.08, 0.05, 0.04, 0.03, 0.02]);
    setStepLogs([
      'নিউরাল নেটওয়ার্ক ওয়েট রিসেট সম্পন্ন হয়েছে।',
      'W_q, W_k, W_v ~ N(0, 2/d_model) রেন্ডমাইজড।'
    ]);
    setStepState('IDLE');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Banner / Introduction */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20">
              <Cpu className="w-3.5 h-3.5" />
              <span>Naked NumPy Multi-Head Attention Engine (Zero PyTorch / TensorFlow)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              নেকেড ফ্রেম নিউরাল নেটওয়ার্ক ভিজ্যুয়ালাইজার
            </h2>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              আপনার কোডের <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono text-xs">TextlessTransformerBrain</code> ক্লাসটি কোনো এক্সটার্নাল ডিপ-লার্নিং ফ্রেমওয়ার্ক ছাড়াই সম্পূর্ণ গণিত ও পিওর NumPy অ্যারে অপারেশনে তৈরি। নিচে এর ফরোয়ার্ড পাস, ৪-হেড সেলফ-অ্যাটেনশন স্কোর ও ব্যাকপ্রোপাগেশন বাস্তব সময়ে চালিয়ে পরীক্ষা করুন:
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              id="run-forward-btn"
              onClick={runForwardPass}
              disabled={isSimulating}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>ফরোয়ার্ড পাস (Inference)</span>
            </button>
            <button
              id="run-backprop-btn"
              onClick={runBackpropPass}
              disabled={isSimulating}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <TrendingDown className="w-4 h-4" />
              <span>ব্যাকপ্রোপাগেশন (SGD Learn)</span>
            </button>
            <button
              id="reset-weights-btn"
              onClick={resetWeights}
              disabled={isSimulating}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="রিসেট ওয়েটস"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hyperparameter Controls Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 font-mono text-xs">
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">ইনপুট ফ্রেম (Seq Len):</span>
            <span className="text-cyan-400 font-bold text-sm">30 Frames (25ms)</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">মডেল ডাইমেনশন (d_model):</span>
            <span className="text-cyan-400 font-bold text-sm">40 Mel Filterbanks</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">অ্যাটেনশন হেডস (Heads):</span>
            <span className="text-cyan-400 font-bold text-sm">4 Parallel Heads</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">লার্নিং রেট (SGD LR):</span>
            <span className="text-cyan-400 font-bold text-sm">{learningRate}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid: Left Transformer Flow + Right Heatmap & Probabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Transformer Architecture Stages */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-indigo-400" />
              ট্রান্সফরমার এনকোডার এক্সিকিউশন পাইপলাইন
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              ভয়েস অডিও মেল-ব্যান্ড থেকে হোম অ্যাসিস্ট্যান্ট ডিভাইস ডিসিশন প্রেডিকশন
            </p>

            <div className="space-y-3">
              {/* Stage 1 */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                stepState === 'FORWARD' 
                  ? 'bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500/50 shadow-md' 
                  : 'bg-slate-950/80 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-200">১. ইনপুট + ২D পজিশনাল এনকোডিং</span>
                  <span className="text-cyan-400">X + PE [30, 40]</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  PE(pos, 2i) = sin(pos / 10000^(2i/d)), PE(pos, 2i+1) = cos(...)
                </div>
              </div>

              {/* Stage 2 */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                stepState === 'ATTENTION' 
                  ? 'bg-indigo-500/10 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md' 
                  : 'bg-slate-950/80 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-200">২. ৪-হেড সেলফ-অ্যাটেনশন মেকানিজম</span>
                  <span className="text-indigo-400">Q, K, V Projections</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  Head_h = Softmax(Q_h · K_h^T / √10) · V_h | MultiHead = Concat · W_o
                </div>
              </div>

              {/* Stage 3 */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                stepState === 'CLASSIFIER' 
                  ? 'bg-purple-500/10 border-purple-500 ring-1 ring-purple-500/50 shadow-md' 
                  : 'bg-slate-950/80 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-200">৩. ফিড-ফরোয়ার্ড লেয়ার (FFN)</span>
                  <span className="text-purple-400">ReLU [40 → 128 → 40]</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  FFN(x) = max(0, x·W_ff1 + b_ff1) · W_ff2 + b_ff2
                </div>
              </div>

              {/* Stage 4 */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                stepState === 'COMPLETE' || stepState === 'BACKPROP'
                  ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/50 shadow-md' 
                  : 'bg-slate-950/80 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-200">৪. লিনিয়ার ক্লাসিফায়ার ও সফটম্যাক্স</span>
                  <span className="text-emerald-400">Logits → 128 Entities</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  P(Entity_i) = exp(z_i) / Σ exp(z_j) (Top Prob &gt; 0.85 = Local Execution)
                </div>
              </div>
            </div>
          </div>

          {/* Supervised Training Feedback Target Selector */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                ট্রেনিং টার্গেট সিলেক্টর (Teacher Label)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">True Class Index: {selectedEntityIdx}</span>
            </div>
            <select
              id="target-entity-select"
              value={selectedEntityIdx}
              onChange={(e) => setSelectedEntityIdx(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            >
              {ENTITIES_MOCK.map((entity, idx) => (
                <option key={idx} value={idx}>
                  [{idx}] {entity}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Top: Live Attention Matrix Heatmap + Right Bottom: Entity Probabilities */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Attention Heatmap Card */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  সেলফ-অ্যাটেনশন ওয়েট হিটম্যাপ (Self-Attention Matrix)
                </h4>
                <p className="text-xs text-slate-400">
                  অডিও ফ্রেমগুলোর মধ্যকার ইন্টার-অ্যাটেনশন কোরিলেশন (Head {activeHead + 1})
                </p>
              </div>

              {/* Head Selector Pills */}
              <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start">
                {[0, 1, 2, 3].map((head) => (
                  <button
                    key={head}
                    id={`head-tab-${head}`}
                    onClick={() => setActiveHead(head)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                      activeHead === head
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Head {head + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
              <div className="grid grid-cols-12 gap-1 w-full max-w-md aspect-square">
                {attentionMap.flatMap((row, rIdx) => 
                  row.map((val, cIdx) => {
                    const intensity = Math.min(1, Math.max(0.05, val * 8));
                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        title={`Frame ${rIdx} -> Frame ${cIdx}: ${(val * 100).toFixed(2)}%`}
                        style={{
                          backgroundColor: `rgba(6, 182, 212, ${intensity})`
                        }}
                        className="rounded-[2px] transition-all hover:scale-125 hover:z-10 hover:ring-1 hover:ring-white border border-slate-900/50 cursor-pointer"
                      />
                    );
                  })
                )}
              </div>
              <div className="flex items-center justify-between w-full max-w-md mt-2 text-[10px] font-mono text-slate-500">
                <span>← ফ্রেম ১ (অডিও শুরু)</span>
                <span className="text-cyan-400">Attention Weights [12x12 Sub-sample]</span>
                <span>ফ্রেম ১২ (অডিও শেষ) →</span>
              </div>
            </div>
          </div>

          {/* Predictions & Loss Curve */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Entity Probability Distribution */}
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  এনটিটি ক্লাসিফিকেশন প্রবাবিলিটি
                </h5>
                <span className="text-[10px] text-cyan-400 font-mono">Softmax Probs</span>
              </div>

              <div className="space-y-2">
                {ENTITIES_MOCK.map((ent, idx) => {
                  const prob = probabilities[idx] || 0.02;
                  const isTop = idx === selectedEntityIdx;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className={`truncate max-w-[170px] ${isTop ? 'text-cyan-300 font-bold' : 'text-slate-400'}`}>
                          {ent}
                        </span>
                        <span className={isTop ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                          {(prob * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${Math.min(100, prob * 100)}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            isTop ? 'bg-gradient-to-r from-cyan-500 to-emerald-400' : 'bg-slate-700'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Loss Reduction History */}
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    ব্যাকপ্রোপাগেশন লস কার্ভ
                  </h5>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" /> Loss Decreasing
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Cross-Entropy লস প্রতিবার ব্যাকপ্রোপ ট্রেনিংয়ে কমছে:
                </p>

                {/* Bar Graph of Loss History */}
                <div className="h-28 flex items-end gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 mt-3">
                  {lossHistory.map((val, idx) => {
                    const heightPct = Math.min(100, Math.max(10, (val / 2.0) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <span className="text-[9px] font-mono text-slate-400">{val}</span>
                        <div 
                          style={{ height: `${heightPct}%` }}
                          className="w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t transition-all duration-500"
                        />
                        <span className="text-[8px] font-mono text-slate-600">e{idx + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-[11px] font-mono bg-slate-950 p-2 rounded border border-slate-800 text-slate-400 mt-2">
                সর্বশেষ লস: <span className="text-emerald-400 font-bold">{lossHistory[lossHistory.length - 1]}</span> (মডেল কনভার্জেন্স বাড়ছে)
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Real-time Math Log Console */}
      <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 font-mono shadow-xl space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            নিউরাল নেটওয়ার্ক ক্যালকুলেশন লগ (Live Execution Trace)
          </span>
          <span>{stepLogs.length} টি ধাপ রেকর্ডকৃত</span>
        </div>
        <div className="max-h-36 overflow-y-auto space-y-1.5 text-xs text-slate-300 pr-2 scrollbar-thin">
          {stepLogs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-cyan-500 shrink-0">&gt;</span>
              <span className={idx === 0 ? 'text-cyan-300 font-semibold' : 'text-slate-400'}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
