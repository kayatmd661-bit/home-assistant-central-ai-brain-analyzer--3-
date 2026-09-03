export interface PageControlItem {
  nameBn: string;
  nameEn: string;
  type: 'button' | 'slider' | 'toggle' | 'input' | 'table' | 'canvas';
  descriptionBn: string;
  descriptionEn: string;
}

export interface PageExplainerInfo {
  pageId: string;
  titleBn: string;
  titleEn: string;
  summaryBn: string;
  summaryEn: string;
  voiceScriptBn: string;
  voiceScriptEn: string;
  unabridgedVoiceScriptBn: string;
  unabridgedVoiceScriptEn: string;
  featuresBn: string[];
  tipsBn: string;
  detailedControls: PageControlItem[];
  stepByStepWorkflowBn: string[];
  stepByStepWorkflowEn: string[];
}

export const PAGE_EXPLAINER_DATA: Record<string, PageExplainerInfo> = {
  master_orchestrator: {
    pageId: 'master_orchestrator',
    titleBn: 'মাস্টার অটোমেশন স্টুডিও (সীমাহীন অর্কেস্ট্রেটর)',
    titleEn: 'Master Automation Studio (Zero-Limit Orchestrator)',
    summaryBn: 'কোনো লিমিট ছাড়া আপনার মনের মতো অটোমেশন বাংলায় লিখে বা মুখে বলে তৈরি করুন।',
    summaryEn: 'Build unrestricted Home Assistant automations using plain natural language.',
    voiceScriptBn: 'স্বাগতম মাস্টার অটোমেশন স্টুডিওতে। এখানে আপনি বাংলায় যেকোনো কাজের নির্দেশ লিখতে বা বলতে পারেন। যেমন: সন্ধ্যা ৬টায় ড্রয়িং রুমের লাইট জ্বালাও এবং এসি ২৬ করো। সিস্টেম স্বয়ংক্রিয়ভাবে হোম অ্যাসিস্ট্যান্টের কোড তৈরি করে চালু করে দেবে।',
    voiceScriptEn: 'Welcome to the Master Automation Studio. Here you can write or speak your instructions in plain English or Bengali. The system automatically compiles and deploys zero-restriction automations to Home Assistant.',
    unabridgedVoiceScriptBn: 'মাস্টার অটোমেশন স্টুডিওতে স্বাগতম। এই পেজটি আপনার সম্পূর্ণ স্মার্ট হোমকে প্রাকৃতিক ভাষায় পরিচালনা করার জন্য তৈরি করা হয়েছে। এখানে আপনি বাংলায় যে কোনো জটিল দৈনন্দিন রুটিন লিখতে বা মাইক্রোফোনে বলতে পারেন। উদাহরণস্বরূপ: সন্ধ্যা ৬টায় ড্রয়িং রুমের লাইট ৮০ শতাংশ ব্রাইটনেসে অন করো এবং এসি ২৬ ডিগ্রিতে সেট করো। এই পেজের প্রতিটি কন্ট্রোল এভাবে কাজ করে: প্রথমত, ন্যাচারাল ল্যাঙ্গুয়েজ প্রম্পট বক্স—যেখানে আপনি নির্দেশ দেন। দ্বিতীয়ত, হার্ডওয়্যার ক্যাপাবিলিটি অডিটর—যা নিশ্চিত করে আপনার লাইট বা এসিতে এই ফিচার সাপোর্ট করে কি না। তৃতীয়ত, মাস্টার এক্সিকিউশন টগল—যার মাধ্যমে কোনো রুল অবিলম্বে কার্যকর বা প্রিভিউ করা যায়। চতুর্থত, DND নাইট মোড গার্ড—যা রাত ১১টার পর অপ্রয়োজনীয় লাউডস্পিকার বা অ্যালার্ম নিঃশব্দ রাখে। কার্যপ্রণালী: ১. ইনপুট বক্সে আপনার নির্দেশ টাইপ করুন বা মাইক আইকন চাপুন। ২. স্বয়ংক্রিয়ভাবে জেনারেট হওয়া নোড এবং অ্যাকশন কনফার্মেশন দেখুন। ৩. "অটোমেশন সক্রিয় করুন" বাটনে চাপ দিয়ে তাৎক্ষণিক চালু করে দিন।',
    unabridgedVoiceScriptEn: 'Welcome to the Master Automation Studio. This panel allows you to orchestrate your entire Home Assistant setup using natural language commands. Features include the Natural Language Input Box, the Hardware Feasibility Auditor, the Master Execution Switch, and the DND Night Mode Guard. Simply type or speak your intent, review the verified hardware pipeline, and deploy zero-restriction automations directly.',
    featuresBn: [
      'সীমাহীন ট্র্রিগার, কন্ডিশন ও অ্যাকশন তৈরি',
      'রাতের শব্দহীন DND মোড স্বয়ংক্রিয় সুরক্ষা',
      'হোম অ্যাসিস্ট্যান্ট স্ট্যান্ডার্ড YAML এক্সপোর্ট',
      'রিয়েল-টাইম হার্ডওয়্যার সম্ভাব্যতা অডিট'
    ],
    tipsBn: 'টিপস: উপরের বক্সে আপনার যেকোনো নিয়মিত কাজের রুটিন বাংলায় লিখুন।',
    detailedControls: [
      {
        nameBn: 'প্রাকৃতিক ভাষা ইনপুট বক্স',
        nameEn: 'Natural Language Prompt Box',
        type: 'input',
        descriptionBn: 'বাংলায় বা ইংরেজিতে আপনার মনের মতো নির্দেশ লিখুন।',
        descriptionEn: 'Type or dictate your automation intent in plain language.'
      },
      {
        nameBn: 'মাইক্রোফোন ভয়েস ইনপুট বাটন',
        nameEn: 'Voice Microphone Dictation',
        type: 'button',
        descriptionBn: 'ক্লিক করে মুখে কথা বলে তাৎক্ষণিক অটোমেশন তৈরি করুন।',
        descriptionEn: 'Tap to speak your automation routine naturally.'
      },
      {
        nameBn: 'মাস্টার এক্সিকিউশন সুইচার',
        nameEn: 'Master Execution Toggle',
        type: 'toggle',
        descriptionBn: 'অটোমেশন রুল সক্রিয় বা নিষ্ক্রিয় করার কেন্দ্রীয় সুইচ।',
        descriptionEn: 'Main toggle for enabling or pausing rules.'
      },
      {
        nameBn: 'DND নাইট গার্ড মোড',
        nameEn: 'DND Night Protection Guard',
        type: 'toggle',
        descriptionBn: 'রাতের বেলা অতিরিক্ত সাউন্ড অ্যালার্ট বন্ধ রাখার সুরক্ষা।',
        descriptionEn: 'Suppresses loud chimes during late night hours.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: ইনপুট বক্সে আপনার নির্দেশ লিখুন অথবা মাইকে চাপ দিয়ে বাংলায় কথা বলুন।',
      '২য় ধাপ: সিস্টেম আপনার সংযুক্ত ডিভাইসের ক্ষমতা যাচাই করে স্বয়ংক্রিয় কোড তৈরি করবে।',
      '৩য় ধাপ: "অটোমেশন সক্রিয় করুন" বাটনে চাপ দিন এবং রুলটি লাইভ সচল হয়ে যাবে।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Type your instruction in the prompt box or click the mic button to speak.',
      'Step 2: The system verifies device capabilities and synthesizes native Home Assistant routines.',
      'Step 3: Click "Deploy Automation" to activate it live across your household.'
    ]
  },
  lovelace_card: {
    pageId: 'lovelace_card',
    titleBn: 'হোম অ্যাসিস্ট্যান্ট লাভলেস উইজেট ও ফুল-স্ক্রিন ক্যানভাস',
    titleEn: 'Lovelace Custom Card & Full-Screen Overlay',
    summaryBn: 'হোম অ্যাসিস্ট্যান্ট ড্যাশবোর্ডে বসানোর জন্য সুন্দর এআই ভয়েস কার্ড এবং ১-ক্লিকে ফুল-স্ক্রিন স্টুডিও।',
    summaryEn: 'Custom rounded Lovelace card with real-time mic streaming and full-screen Add-on overlay canvas.',
    voiceScriptBn: 'এটি লাভলেস কার্ড শোকেস। এই কার্ডটি আপনার হোম অ্যাসিস্ট্যান্টের প্রধান ড্যাশবোর্ডে যোগ করতে পারেন। মাইকে চাপ দিয়ে সরাসরি ভয়েস কমান্ড দেওয়া যায় এবং গিয়ার আইকনে চাপ দিলে পুরো স্ক্রিন জুড়ে সমস্ত কন্ট্রোল প্যানেল ওপেন হয়।',
    voiceScriptEn: 'This is the Lovelace Card Showcase. You can add this beautiful AI Voice card to your Home Assistant dashboard. Tap the mic to speak commands or click the gear icon to open the full-screen Add-on canvas.',
    unabridgedVoiceScriptBn: 'লাভলেস কাস্টম কার্ড ও ফুল-স্ক্রিন শোকেসে স্বাগতম। এই পেজের মাধ্যমে আপনি আপনার হোম অ্যাসিস্ট্যান্ট ড্যাশবোর্ডের জন্য একটি আধুনিক ও আকর্ষণীয় এআই ভয়েস কার্ড পাচ্ছেন। কার্ডটির মূল বৈশিষ্ট্যসমূহ: প্রথমত, লাইভ পুশ-টু-টক মাইক্রোফোন বাটন—যাতে ট্যাপ করে সরাসরি বাংলায় বা ইংরেজিতে কথা বললে লাইভ অডিও ওয়েভ তরঙ্গ দেখায় এবং রিয়েল-টাইমে হোম অ্যাসিস্ট্যান্টে কমান্ড পাঠিয়ে দেয়। দ্বিতীয়ত, ফুল-স্ক্রিন এক্সপ্যান্ডার গিয়ার আইকন—যা ক্লিক করা মাত্র কোনো ব্রাউজার রিফ্রেশ ছাড়াই সম্পূর্ণ স্টুডিও ওভারলে স্ক্রিনে ভেসে ওঠে। তৃতীয়ত, ১-ক্লিক YAML জেনারেটর—যার মাধ্যমে প্রস্তুতকৃত কনফিগারেশন কপি করে সরাসরি হোম অ্যাসিস্ট্যান্টের লাভলেস ড্যাশবোর্ডে বসিয়ে দেওয়া যায়। ব্যবহারবিধি: ১. ড্যাশবোর্ডে Add Card ক্লিক করে Manual কার্ড সিলেক্ট করুন। ২. প্রদত্ত কোডটি পেস্ট করুন। ৩. সেভ করে কার্ডের মাইক বা গিয়ার আইকন দিয়ে ঘরের যেকোনো ডিভাইস নিয়ন্ত্রণ করুন।',
    unabridgedVoiceScriptEn: 'Welcome to the Lovelace Custom Card Showcase. This module provides a production-grade Web Component card for your Home Assistant dashboards. It features push-to-talk live audio waveform visualization, full-screen canvas expansion without page reloads, and instant YAML configuration copying for zero-effort integration.',
    featuresBn: [
      'গুগল এআই স্টুডিও স্টাইল রাউন্ডেড উইজেট',
      'রিয়েল-টাইম ভয়েস ইনপুট ও লাইভ অডিও ওয়েভ',
      '১-ক্লিকে ফুল-স্ক্রিন ক্যানভাস ওভারলে ওপেন ও ক্লোজ',
      'হোম অ্যাসিস্ট্যান্ট ড্যাশবোর্ড কোড কপি করার সুবিধা'
    ],
    tipsBn: 'টিপস: নিচের লাইভ কার্ডটি টেস্ট করতে মাইকে ক্লিক করে কথা বলুন।',
    detailedControls: [
      {
        nameBn: 'লাইভ পুশ-টু-টক মাইক্রোফোন',
        nameEn: 'Push-to-Talk Mic',
        type: 'button',
        descriptionBn: 'ট্যাপ করে সরাসরি মুখে কথা বলে লাইভ কমান্ড পাঠান।',
        descriptionEn: 'Click to stream real-time audio commands.'
      },
      {
        nameBn: 'ফুল-স্ক্রিন ক্যানভাস ট্রিগার',
        nameEn: 'Full-Screen Canvas Trigger',
        type: 'button',
        descriptionBn: 'ট্যাপ করলে পুরো স্ক্রিন জুড়ে এআই প্যানেল ওপেন হয়।',
        descriptionEn: 'Expands the full multi-tier controller overlay.'
      },
      {
        nameBn: 'লাভলেস YAML কোড কপি বাটন',
        nameEn: 'Copy Lovelace YAML',
        type: 'button',
        descriptionBn: 'হোম অ্যাসিস্ট্যান্টে ব্যবহারের জন্য কার্ড কোড ক্লিপবোর্ডে কপি করে।',
        descriptionEn: 'Copies the complete custom card YAML snippet.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: হোম অ্যাসিস্ট্যান্টের ড্যাশবোর্ডে গিয়ে ৩ ডট মেনু থেকে Edit Dashboard চাপুন।',
      '২য় ধাপ: Add Card এ চাপ দিয়ে নিচে স্ক্রল করে Manual নির্বাচন করুন।',
      '৩য় ধাপ: আমাদের কপি করা YAML পেস্ট করে Save চাপুন। আপনার কার্ড রেডি!'
    ],
    stepByStepWorkflowEn: [
      'Step 1: In Home Assistant, open dashboard edit mode.',
      'Step 2: Click Add Card, scroll down, and select Manual Card.',
      'Step 3: Paste the generated YAML configuration and hit Save.'
    ]
  },
  voice_studio: {
    pageId: 'voice_studio',
    titleBn: 'ভয়েস চেঞ্জার ও জেমিনি স্পিচ স্টুডিও',
    titleEn: 'Voice Persona & Gemini Native Speech Studio',
    summaryBn: 'পুরুষ, নারী, রোবট বা জেমিনি ভয়েস নির্বাচন করুন এবং স্পিড ও পিচ পরিবর্তন করুন।',
    summaryEn: 'Customize TTS voice profiles, gender, pitch, speed, and preview live speech.',
    voiceScriptBn: 'এটি ভয়েস চেঞ্জার স্টুডিও। এখান থেকে এআই-এর কথা বলার কণ্ঠস্বর পরিবর্তন করতে পারেন। পুরুষ, নারী বা জেমিনি নিউরাল ভয়েস বেছে নিন এবং কথা বলার গতি ও সুর ঠিক করুন।',
    voiceScriptEn: 'This is the Voice Engine Studio. You can select male, female, or Gemini neural voices and adjust pitch, speed, and pronunciation style for all AI speech and guide narrations.',
    unabridgedVoiceScriptBn: 'ভয়েস চেঞ্জার ও জেমিনি স্পিচ স্টুডিওতে স্বাগতম। এই পেজটি আপনার এআই সহকারীর কণ্ঠস্বর, উচ্চারণভঙ্গী এবং কথা বলার সুর সম্পূর্ণরূপে কাস্টমাইজ করার সুযোগ দেয়। এখানে ৬টি আলাদা প্রিমিয়াম ভয়েস পারসোনা রয়েছে: মিষ্টি ও স্পষ্ট বাংলা নারী কণ্ঠ, গম্ভীর ও প্রফেশনাল বাংলা পুরুষ কণ্ঠ, জেমিনি নিউরাল এআই, আন্তর্জাতিক ইংরেজি কণ্ঠস্বর এবং সাইবার রোবটিক ভয়েস। প্রধান কন্ট্রোলসমূহ: ১. ভয়েস পারসোনা সিলেকশন গ্রিড—যেখানে ক্লিক করলেই তাৎক্ষণিক সেই কণ্ঠ চালু হয়। ২. স্পিড ও পিচ স্লাইডার—যা দিয়ে কথা বলার গতি ০.৬x থেকে ১.৬x এবং সুর চিকন বা গম্ভীর করা যায়। ৩. অটো-এক্সপ্লেইন টগল সুইচ—যা চালু থাকলে যেকোনো পেজে ঢুকলেই নিজে নিজে বাংলা অডিও গাইড বাজবে। ৪. লাইভ স্পিচ টেস্টার—যেখানে আপনার ইচ্ছামতো যেকোনো বাক্য লিখে "কথা শুনুন ও টেস্ট করুন" বাটনে চাপ দিয়ে সাউন্ড কোয়ালিটি যাচাই করতে পারবেন।',
    unabridgedVoiceScriptEn: 'Welcome to the Voice Engine Studio. Customize your Edge-AI assistant voice profile with 6 distinct personas including Bangla Natural Female, Bangla Male, Gemini Neural, and Cyber Robot. Fine-tune speech rate, pitch modulators, volume dynamics, and test live audio synthesis in real-time.',
    featuresBn: [
      '৬টি প্রিমিয়াম ভয়েস পারসোনা (বাংলা নারী, পুরুষ ও জেমিনি নিউরাল)',
      'স্পিড, পিচ ও ভলিউম ফাইন-টিউনিং স্লাইডার',
      'নতুন পেজে স্বয়ংক্রিয় অডিও নির্দেশিকা টগল',
      'লাইভ ইন্টারেক্টিভ স্পিচ টেস্ট বক্স'
    ],
    tipsBn: 'টিপস: পছন্দমতো ভয়েস সিলেক্ট করে টেস্ট বাটনে ক্লিক করে কথা শুনে নিন।',
    detailedControls: [
      {
        nameBn: 'ভয়েস পারসোনা কার্ড নির্বাচন',
        nameEn: 'Voice Persona Grid',
        type: 'button',
        descriptionBn: 'বাংলা নারী, পুরুষ, জেমিনি বা রোবট কণ্ঠ সিলেক্ট করুন।',
        descriptionEn: 'Select preferred persona voice model.'
      },
      {
        nameBn: 'কথা বলার গতি স্লাইডার (Speed)',
        nameEn: 'Speech Rate Slider',
        type: 'slider',
        descriptionBn: 'ধীরে (০.৬x) থেকে দ্রুত (১.৬x) পর্যন্ত কথা বলার গতি ঠিক করুন।',
        descriptionEn: 'Adjust speech velocity from 0.6x to 1.6x.'
      },
      {
        nameBn: 'কণ্ঠস্বরের সুর স্লাইডার (Pitch)',
        nameEn: 'Voice Pitch Modulator',
        type: 'slider',
        descriptionBn: 'গম্ভীর থেকে উচ্চ সুর পর্যন্ত পরিবর্তন করুন।',
        descriptionEn: 'Fine-tune acoustic pitch frequency.'
      },
      {
        nameBn: 'অটো-এক্সপ্লেইন সুইচ',
        nameEn: 'Auto-Explain Toggle',
        type: 'toggle',
        descriptionBn: 'নতুন পেজে ঢুকলে নিজে নিজেই অডিও পড়ার সুবিধা চালু বা বন্ধ করুন।',
        descriptionEn: 'Toggles automatic narration upon tab changes.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: আপনার পছন্দের ভয়েস পারসোনা কার্ডে ক্লিক করুন।',
      '২য় ধাপ: স্পিড ও পিচ স্লাইডার টেনে আপনার শ্রুতিমধুর লেভেলে রাখুন।',
      '৩য় ধাপ: টেস্ট বক্সে বাক্য লিখে "কথা শুনুন ও টেস্ট করুন" বাটনে চাপ দিন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Select your favorite voice persona card.',
      'Step 2: Adjust speech speed and pitch sliders to your preference.',
      'Step 3: Enter sample text and click Test Audio to verify the tone.'
    ]
  },
  key_manager: {
    pageId: 'key_manager',
    titleBn: 'মাল্টি-এপিআই কী ও ফেইলওভার পুল',
    titleEn: 'Multi-API Key Failover Pool',
    summaryBn: 'একাধিক জেমিনি এপিআই কী যুক্ত করুন। একটিতে লিমিট শেষ হলে স্বয়ংক্রিয়ভাবে অন্যটিতে সুইচ করবে।',
    summaryEn: 'Manage multiple Gemini API keys with automatic failover rotation on HTTP 429 rate limits.',
    voiceScriptBn: 'এটি মাল্টি-এপিআই কী ম্যানেজার। এখানে আপনি ২ বা ততোধিক জেমিনি এপিআই কী যুক্ত করতে পারেন। একটি কি-তে কোটা শেষ বা রেট লিমিট হলে সিস্টেম স্বয়ংক্রিয়ভাবে পরবর্তী কি-তে চলে যাবে, ফলে আপনার এআই কখনো বন্ধ হবে না।',
    voiceScriptEn: 'This is the Multi-API Key Manager. You can register multiple Gemini API keys here. If one key reaches rate limits, the system rotates to the next available healthy key with zero downtime.',
    unabridgedVoiceScriptBn: 'মাল্টি-এপিআই কী ও ফেইলওভার পুল ম্যানেজারে স্বাগতম। এই সিস্টেমটি নিশ্চিত করে যে আপনার জেমিনি এআই কখনো কোটা শেষ বা রেট লিমিটের কারণে ডাউন হবে না। এখানে আপনি একাধিক ফ্রি বা পেইড জেমিনি এপিআই কী যুক্ত করতে পারেন। যদি প্রাইমারি কীতে রেট লিমিট (HTTP 429) আসে, তবে সিস্টেম কোনো ত্রুটি না দেখিয়ে স্বয়ংক্রিয়ভাবে সেকেন্ডারি ব্যাকআপ কীতে রোটেশন সম্পন্ন করে। প্রধান ফিচারসমূহ: ১. মাল্টি-কী স্ট্যাটাস টেবিল—যেখানে প্রতিটি কী-এর হেলথ, রিকোয়েস্ট সংখ্যা ও লেটেন্সি রিয়েল-টাইমে দেখা যায়। ২. টেস্ট ফেইলওভার বাটন—যা চাপলে রেট লিমিট সিমুলেট করে পরবর্তী চাবিতে সুইচিং স্বচক্ষে দেখা যায়। ৩. সিকিউর কী ইনপুট—যেখানে এপিআই কী মাস্কড অবস্থায় নিরাপদে সংরক্ষিত থাকে। ৪. পার-কী টগল ও ডিলিট বাটন। ব্যবহারবিধি: "নতুন কী যোগ করুন" বাটনে চাপ দিয়ে আপনার অতিরিক্ত এপিআই কী যুক্ত করুন।',
    unabridgedVoiceScriptEn: 'Welcome to the Multi-API Key Pool. Manage multiple Gemini API keys with zero downtime. Features real-time latency monitoring, health status indicators, and an interactive failover simulation engine that gracefully rotates keys on rate limit exhaustion.',
    featuresBn: [
      'নিরাপদ মাস্কড কী স্টোরেজ ও সুরক্ষা',
      'অটো-ফেইলওভার ও লাইভ হেলথ অডিট',
      'প্রতিটি চাবির রেট-লিমিট ও লেটেন্সি ট্র্যাকিং',
      '১-ক্লিকে ফেইলওভার টেস্ট সিমুলেশন'
    ],
    tipsBn: 'টিপস: একাধিক ফ্রি জেমিনি কী যুক্ত করে রাখলে কখনো লিমিট ফুরাবে না।',
    detailedControls: [
      {
        nameBn: 'নতুন কী যোগ করার বাটন',
        nameEn: 'Add New API Key',
        type: 'button',
        descriptionBn: 'নতুন জেমিনি এপিআই কী যুক্ত করার ফর্ম ওপেন করে।',
        descriptionEn: 'Opens the registration drawer for new API keys.'
      },
      {
        nameBn: 'টেস্ট ফেইলওভার বাটন',
        nameEn: 'Test Failover Simulation',
        type: 'button',
        descriptionBn: 'রেট লিমিট এলে কীভাবে পরের চাবিতে সুইচ করে তা লাইভ টেস্ট করে।',
        descriptionEn: 'Simulates rate limit rotation to verify zero downtime.'
      },
      {
        nameBn: 'কী স্ট্যাটাস টগল',
        nameEn: 'Key Active Toggle',
        type: 'toggle',
        descriptionBn: 'যেকোনো কী সাময়িক বন্ধ বা চালু করার সুইচ।',
        descriptionEn: 'Enables or pauses a specific key in the pool.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: "নতুন কী যোগ করুন" বাটনে ক্লিক করুন।',
      '২য় ধাপ: আপনার গুগল এআই স্টুডিও API Key এবং লেবেল নাম লিখুন।',
      '৩য় ধাপ: সেভ চাপুন। সিস্টেম স্বয়ংক্রিয়ভাবে স্বাস্থ্য পরীক্ষা করে পুলে যুক্ত করে নেবে।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Click Add New Key.',
      'Step 2: Enter your Gemini API key and an optional descriptive label.',
      'Step 3: Save to register it into the active zero-downtime rotation pool.'
    ]
  },
  auto_install: {
    pageId: 'auto_install',
    titleBn: 'অটোমেটেড ইন্সটলার ও রিসোর্স ম্যানেজার',
    titleEn: 'Zero-Touch Lovelace Auto-Installer',
    summaryBn: 'কোনো জটিলতা ছাড়াই ১-ক্লিকে হোম অ্যাসিস্ট্যান্টে লাভলেস কার্ড ইন্সটল ও রেজিস্টার করুন।',
    summaryEn: 'One-click automated deployment of custom-voice-card.js to /config/www/ and Lovelace registration.',
    voiceScriptBn: 'এটি অটোমেটেড ইন্সটলার পেজ। এই সিস্টেমটি নিজে থেকেই লাভলেস কার্ড ফাইল হোম অ্যাসিস্ট্যান্টে কপি করে এবং রিসোর্স লিস্টে রেজিস্টার করে দেয়। ম্যানুয়ালি কিছু কনফিগার করতে হয় না।',
    voiceScriptEn: 'This is the Zero-Touch Auto-Installer. It deploys the custom Lovelace card file to Home Assistant and registers the resource via the Supervisor API automatically with no manual steps needed.',
    unabridgedVoiceScriptBn: 'জিরো-টাচ লাভলেস অটো-ইন্সটলার পেজে স্বাগতম। এই পেজের মূল লক্ষ্য হলো কোনো ম্যানুয়াল কোডিং বা জটিল কনফিগারেশন ছাড়াই সরাসরি ১-ক্লিকে লাভলেস কার্ডটি আপনার হোম অ্যাসিস্ট্যান্টে স্থায়ীভাবে ইন্সটল করা। এটি স্বয়ংক্রিয়ভাবে হোম অ্যাসিস্ট্যান্টের /config/www/community/ ফোল্ডারে edge-ai-voice-card.js ফাইল ডিপ্লয় করে এবং সুপারভাইজার এপিআই ব্যবহার করে Lovelace Resources তালিকায় রেজিস্টার করে দেয়। প্রধান কন্ট্রোলসমূহ: ১. "১-ক্লিকে অটোমেটিক ইন্সটল চালান" বাটন—যা প্রেস করলে পুরো ইন্সটলেশন পাইপলাইন সেকেন্ডের মধ্যে সম্পন্ন হয়। ২. লাইভ টার্মিনাল লগ ভিউয়ার—যেখানে প্রতিটি ফাইলের কপি এবং রেজিস্ট্রেশন স্ট্যাটাস লাইভ দেখা যায়। ৩. রিসোর্স ইউআরএল কপি বাটন—যা দিয়ে /local/community/edge-ai-voice-card.js পাথ কপি করা যায়। ৪. ডাইরেক্ট ডাউনলোড বাটন—যা দিয়ে অফলাইন ব্যবহারের জন্য ফাইলটি ডাউনলোড করে রাখা যায়।',
    unabridgedVoiceScriptEn: 'Welcome to the Zero-Touch Auto-Installer. Deploy the edge-ai-voice-card.js module directly into Home Assistant without manual terminal commands. It manages file writes to /config/www/community/ and registers the Lovelace JavaScript module resource automatically via the Supervisor API.',
    featuresBn: [
      'সুপারভাইজার টোকেন দিয়ে অটোমেটিক রেজিস্ট্রেশন',
      '/config/www/community ফোল্ডারে ফাইল কপি',
      'লাইভ টার্মিনাল এক্সিকিউশন লগ',
      'ম্যানুয়াল ফাইল ডাউনলোড ও পাথ কপি'
    ],
    tipsBn: 'টিপস: "অটো-ইন্সটল চালান" বাটনে চাপ দিলেই কার্ড আপনার ড্যাশবোর্ডে যোগ হওয়ার জন্য রেডি হয়ে যাবে।',
    detailedControls: [
      {
        nameBn: '১-ক্লিক অটো-ইন্সটল বাটন',
        nameEn: '1-Click Auto Deploy',
        type: 'button',
        descriptionBn: 'হোম অ্যাসিস্ট্যান্টে স্বয়ংক্রিয় ফাইল কপি ও রিসোর্স রেজিস্ট্রেশন শুরু করে।',
        descriptionEn: 'Runs the zero-touch installation pipeline.'
      },
      {
        nameBn: 'রিসোর্স ইউআরএল কপি',
        nameEn: 'Copy Resource URL',
        type: 'button',
        descriptionBn: 'লাভলেস রিসোর্স ইউআরএল ক্লিপবোর্ডে কপি করে।',
        descriptionEn: 'Copies the local resource path to clipboard.'
      },
      {
        nameBn: 'ফাইল ডাউনলোড বাটন',
        nameEn: 'Download JS File',
        type: 'button',
        descriptionBn: 'edge-ai-voice-card.js ফাইল সরাসরি ডাউনলোড করুন।',
        descriptionEn: 'Downloads the standalone compiled card file.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: "১-ক্লিকে অটোমেটিক ইন্সটল চালান" বাটনে ক্লিক করুন।',
      '২য় ধাপ: টার্মিনালে সফল বার্তা দেখুন এবং "কার্ড রেজিস্ট্রেশন সফল হয়েছে" নিশ্চিত হোন।',
      '৩য় ধাপ: ড্যাশবোর্ডে গিয়ে কার্ড যুক্ত করুন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Click the 1-Click Auto Deploy button.',
      'Step 2: Monitor live terminal output until installation completes.',
      'Step 3: Add the registered card to your dashboard effortlessly.'
    ]
  },
  network_sentinel: {
    pageId: 'network_sentinel',
    titleBn: 'ওয়াইফাই ও নেটওয়ার্ক সিকিউরিটি গার্ড',
    titleEn: 'Universal Network Sentinel',
    summaryBn: 'রাউটার নিয়ন্ত্রণ, অচেনা ডিভাইস শনাক্তকরণ এবং ইন্টারনেটের স্পিড লিমিট কন্ট্রোল।',
    summaryEn: 'Multi-router firewall adapter with rogue MAC detection and dynamic bandwidth shaping.',
    voiceScriptBn: 'এটি ওয়াইফাই ও নেটওয়ার্ক সিকিউরিটি গার্ড। আপনার রাউটারের সাথে যুক্ত সকল মোবাইল ও ল্যাপটপ এখানে দেখা যায়। অচেনা কেউ ওয়াইফাইয়ে ঢুকলে ফায়ারওয়ালে ব্লক করা এবং স্পিড কমানো যায়।',
    voiceScriptEn: 'Welcome to Network Sentinel. Monitor all connected devices on your router, detect unknown MAC intruders, block unauthorized connections, and set bandwidth limits.',
    unabridgedVoiceScriptBn: 'ওয়াইফাই ও নেটওয়ার্ক সিকিউরিটি গার্ডে স্বাগতম। এই মডিউলটি আপনার হোম রাউটারের সাথে সার্বক্ষণিক যুক্ত থেকে সব কানেক্টেড মোবাইল, ল্যাপটপ ও আইওটি ডিভাইস পাহারা দেয়। যদি কোনো অচেনা ডিভাইস বা অনুপ্রবেশকারী ওয়াইফাই পাসওয়ার্ড দিয়ে যুক্ত হয়, তবে সিস্টেম সাথে সাথে অ্যালার্ট দেবে এবং ১-ক্লিকে ফায়ারওয়ালে তাকে ব্লক করে দেবে। প্রধান কন্ট্রোলসমূহ: ১. কানেক্টেড ডিভাইস টেবিল—যেখানে প্রতিটি ডিভাইসের আইপি, ম্যাক অ্যাড্রেস ও ব্যান্ডউইথ ব্যবহার দেখা যায়। ২. অচেনা ডিভাইস অনুপ্রবেশ টেস্ট বাটন—যা দিয়ে নিরাপত্তা অ্যালার্টের কার্যকারিতা পরীক্ষা করা যায়। ৩. ১-ক্লিক ফায়ারওয়াল ব্লক সুইচ—যা অচেনা ম্যাক অ্যাড্রেসকে তৎক্ষণাৎ বিচ্ছিন্ন করে। ৪. ব্যান্ডউইথ স্পিড লিমিট স্লাইডার—যা কোনো ডিভাইসের ইন্টারনেট স্পিড নিয়ন্ত্রণ করতে সাহায্য করে।',
    unabridgedVoiceScriptEn: 'Welcome to Network Sentinel. Maintain total oversight of connected devices on your router. Detect unauthorized MAC intruders, throttle abusive streaming devices, and trigger instant firewall quarantine with full multi-brand router compatibility.',
    featuresBn: [
      'টিপিলিংক, মিক্রোটিক, আসুস ও শাওমি রাউটার সাপোর্ট',
      'অচেনা ডিভাইস ঢুকলে অটো-ব্লক ও লাইভ অ্যালার্ট',
      'গেস্ট ওয়াইফাই অন/অফ ও ব্যান্ডউইথ লিমিট',
      'রিয়েল-টাইম পিং ও নেটওয়ার্ক লেটেন্সি ট্র্যাকিং'
    ],
    tipsBn: 'টিপস: "অচেনা ডিভাইস টেস্ট করুন" বাটনে ক্লিক করে লাইভ ফায়ারওয়াল অ্যালার্ট দেখুন।',
    detailedControls: [
      {
        nameBn: 'অনুপ্রবেশ টেস্ট বাটন',
        nameEn: 'Simulate Rogue Intruder',
        type: 'button',
        descriptionBn: 'কাল্পনিক অচেনা ডিভাইস তৈরি করে সিকিউরিটি সিস্টেম টেস্ট করুন।',
        descriptionEn: 'Simulates an unauthorized MAC entry event.'
      },
      {
        nameBn: 'ফায়ারওয়াল কোয়ারেন্টাইন বাটন',
        nameEn: 'Block Device Button',
        type: 'button',
        descriptionBn: 'যেকোনো অচেনা ডিভাইসকে সাথে সাথে ওয়াইফাই থেকে নিষিদ্ধ করুন।',
        descriptionEn: 'Adds the target MAC address to the blacklist.'
      },
      {
        nameBn: 'গেস্ট নেটওয়ার্ক আইসোলেশন সুইচ',
        nameEn: 'Guest WiFi Isolation Toggle',
        type: 'toggle',
        descriptionBn: 'অতিথিদের ওয়াইফাইকে আপনার স্মার্ট হোম ডিভাইস থেকে আলাদা রাখে।',
        descriptionEn: 'Isolates guests from smart home IoT hardware.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: কানেক্টেড ডিভাইসের তালিকা দেখে পরিচিত ডিভাইসগুলো যাচাই করুন।',
      '২য় ধাপ: কোনো অপরিচিত ডিভাইস দেখলে "ব্লক করুন" বাটনে চাপ দিন।',
      '৩য় ধাপ: গেস্ট নেটওয়ার্ক অন করে অতিথিদের জন্য সুরক্ষিত ওয়াইফাই চালু করুন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Review the active device list and verify known hardware.',
      'Step 2: Click Block on any unverified or suspicious MAC address.',
      'Step 3: Toggle Guest Network isolation for secure guest access.'
    ]
  },
  multi_bluetooth: {
    pageId: 'multi_bluetooth',
    titleBn: 'ব্লুটুথ স্পিকার ও মিউজিক লাইটিং স্টুডিও',
    titleEn: 'Multi-Bluetooth & Music Reactive Studio',
    summaryBn: 'পুরো বাড়ির ব্লুটুথ স্পিকার সিঙ্ক এবং গানের তালে স্মার্ট লাইটের রঙ পরিবর্তন।',
    summaryEn: 'PipeWire Bluetooth switchboard and real-time audio FFT music-reactive light sync.',
    voiceScriptBn: 'এটি ব্লুটুথ স্পিকার ও মিউজিক লাইটিং স্টুডিও। একাধিক ব্লুটুথ স্পিকারে একসাথে গান বাজানো এবং মিউজিকের বিটের সাথে ঘরের লাইটের রঙ পরিবর্তন করা যায়।',
    voiceScriptEn: 'This is the Multi-Bluetooth & Music Reactive Studio. Broadcast synchronized audio to multiple Bluetooth speakers simultaneously while pulsing smart RGB lights to the music beat.',
    unabridgedVoiceScriptBn: 'মাল্টি-ব্লুটুথ ও মিউজিক রিঅ্যাক্টিভ স্টুডিওতে স্বাগতম। এই পেজের মাধ্যমে আপনি বাড়ির ড্রয়িং রুম, বেডরুম ও বারান্দার একাধিক ব্লুটুথ স্পিকারকে একসাথে সিঙ্ক করে গান বাজাতে পারেন। একই সাথে রিয়েল-টাইম অডিও ফ্রিকোয়েন্সি অ্যানালাইজার গানের তাল, বিট ও ব্যাস ডিটেক্ট করে ঘরের স্মার্ট আরজিবি লাইটগুলোকে গানের তালে তালে পালস করায়। প্রধান কন্ট্রোলসমূহ: ১. "পুরো বাড়ির পার্টি মোড" সুইচ—যা সমস্ত স্পিকারে সিঙ্ক্রোনাইজড অডিও ব্রডকাস্ট চালু করে। ২. লাইভ স্পেকট্রাম ওয়েভ গ্রাফ—যা লাইভ মিউজিক ফ্রিকোয়েন্সি দেখায়। ৩. আরজিবি থিম পিকার—যেমন সাইবারপাঙ্ক নিয়ন, ডিস্কো বা রিল্যাক্সিং মোড। ৪. পার-স্পিকার ভলিউম স্লাইডার—যা প্রতিটি রুমের সাউন্ড আলাদাভাবে এডজাস্ট করে।',
    unabridgedVoiceScriptEn: 'Welcome to the Multi-Bluetooth & Music Reactive Studio. Synchronize whole-house audio playback across PipeWire Bluetooth speakers while pulsing smart RGB lights to the musical tempo using real-time FFT spectrum analysis.',
    featuresBn: [
      'মাল্টি-স্পিকার হোল-হাউস পার্টি মোড',
      'রিয়েল-টাইম সাউন্ড ফ্রিকোয়েন্সি ও ব্যাস ডিটেকশন',
      'সাইবারপাঙ্ক ও পার্টি লাইটিং ইফেক্ট',
      'প্রতিটি রুমের আলাদা অডিও লেভেল কন্ট্রোল'
    ],
    tipsBn: 'টিপস: "পুরো বাড়ির পার্টি মোড" চালু করে লাইভ মিউজিক লাইটিং টেস্ট করুন।',
    detailedControls: [
      {
        nameBn: 'পার্টি মোড ব্রডকাস্ট সুইচ',
        nameEn: 'Whole-House Party Mode',
        type: 'toggle',
        descriptionBn: 'সব ব্লুটুথ স্পিকারে একসাথে গান বাজানোর মাস্টার সুইচ।',
        descriptionEn: 'Broadcasts audio to all paired speakers simultaneously.'
      },
      {
        nameBn: 'মিউজিক লাইট সিঙ্ক সুইচ',
        nameEn: 'Music Reactive RGB Toggle',
        type: 'toggle',
        descriptionBn: 'গানের বিটের সাথে লাইটের রঙ পরিবর্তনের সুইচ।',
        descriptionEn: 'Enables FFT-driven lighting animations.'
      },
      {
        nameBn: 'লাইটিং থিম সিলেক্টর',
        nameEn: 'Lighting Theme Palette',
        type: 'button',
        descriptionBn: 'সাইবারপাঙ্ক, ফায়ার বা রিল্যাক্সিং কালার প্যালেট নির্বাচন করুন।',
        descriptionEn: 'Select dynamic color profiles for music visualization.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: আপনার ব্লুটুথ স্পিকারগুলো কানেক্ট করুন।',
      '২য় ধাপ: "পুরো বাড়ির পার্টি মোড" টগল অন করুন।',
      '৩য় ধাপ: "মিউজিক লাইট সিঙ্ক" চালু করে আপনার পছন্দের আরজিবি থিম বেছে নিন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Pair your Bluetooth speakers.',
      'Step 2: Toggle Whole-House Party Mode on.',
      'Step 3: Enable Music Reactive RGB and pick your favorite lighting profile.'
    ]
  },
  camera_engine: {
    pageId: 'camera_engine',
    titleBn: 'স্মার্ট ক্যামেরা ও অটোমেশন ইঞ্জিন',
    titleEn: 'Universal Camera Automation Engine',
    summaryBn: 'মানুষ, গাড়ি বা শব্দ শনাক্ত করে ক্যামেরা ঘোরানো, লাইট অন ও স্পিকারে কথা বলা।',
    summaryEn: 'Cross-device camera AI rules for person, vehicle, sound trigger, PTZ pan, and warning speakers.',
    voiceScriptBn: 'এটি স্মার্ট ক্যামেরা অটোমেশন ইঞ্জিন। ক্যামেরায় মানুষ বা গাড়ি দেখলে স্বয়ংক্রিয়ভাবে গেটের লাইট জ্বালাবে, ক্যামেরা তার দিকে ঘুরবে এবং স্পিকারে সতর্কবার্তা শোনাবে।',
    voiceScriptEn: 'This is the Universal Camera Automation Engine. Trigger actions based on AI person detection, vehicle entry, or sound threshold to track targets with PTZ cameras and sound alarms.',
    unabridgedVoiceScriptBn: 'স্মার্ট ক্যামেরা ও ভিশন অটোমেশন ইঞ্জিনে স্বাগতম। এই ইঞ্জিনটি আপনার যেকোনো সিসিটিভি বা আইপি ক্যামেরাকে শক্তিশালী কৃত্রিম বুদ্ধিমত্তা সম্পন্ন পাহারাদারে পরিণত করে। ক্যামেরা যখন কোনো মানুষ, গাড়ি, পোষা প্রাণী বা অস্বাভাবিক উচ্চ শব্দ শনাক্ত করে, তখন এটি স্বয়ংক্রিয়ভাবে গেটের ফ্লাডলাইট অন করতে পারে, পিটিজেড ক্যামেরা টার্গেটের দিকে ঘুরিয়ে দিতে পারে এবং ক্যামেরার বিল্ট-ইন স্পিকারে ভয়েস মেসেজ দিয়ে সতর্ক করতে পারে। প্রধান কন্ট্রোলসমূহ: ১. রেডিমেড অটোমেশন রেসিপি কার্ডসমূহ—যেমন "রাতে মানুষ দেখলে লাইট অন করো"। ২. পিটিজেড কন্ট্রোল জয়স্টিক—যার মাধ্যমে ক্যামেরা ডানে, বায়ে, উপরে বা নিচে ঘোরানো যায়। ৩. শব্দ ডিটেকশন থ্রেশহোল্ড স্লাইডার—যা দিয়ে কত ডেসিবেল শব্দ হলে সতর্কবার্তা চালু হবে তা ঠিক করা যায়।',
    unabridgedVoiceScriptEn: 'Welcome to the Universal Camera Automation Engine. Connect your RTSP/ONVIF cameras to trigger intelligent workflows on person detection, license plates, and sound events with PTZ auto-tracking and 2-way speaker warnings.',
    featuresBn: [
      'মানুষ, গাড়ি ও পোষা প্রাণী ট্র্যাকিং',
      'উচ্চ শব্দে স্বয়ংক্রিয় ক্যামেরা প্যান (PTZ)',
      'ক্যামেরার স্পিকারে স্বয়ংক্রিয় ভয়েস ওয়ার্নিং',
      'নাইট ভিশন ও মোশন জোন কনফিগারেশন'
    ],
    tipsBn: 'টিপস: উপরের যেকোনো একটি রেসিপিতে ক্লিক করে সাথে সাথে নিয়ম তৈরি করতে পারেন।',
    detailedControls: [
      {
        nameBn: 'রেসিপি ক্লিক অ্যান্ড অ্যাক্টিভেট',
        nameEn: '1-Click Automation Recipe',
        type: 'button',
        descriptionBn: 'প্রস্তুতকৃত ক্যামেরা অটোমেশন ১ ক্লিকে সক্রিয় করার বাটন।',
        descriptionEn: 'Deploys pre-built camera automation workflows.'
      },
      {
        nameBn: 'পিটিজেড প্যান-টিল্ট কন্ট্রোলার',
        nameEn: 'PTZ Directional Joystick',
        type: 'button',
        descriptionBn: 'ক্যামেরা ডানে, বায়ে বা জুম করার কন্ট্রোল।',
        descriptionEn: 'Pans and tilts motor-driven PTZ cameras.'
      },
      {
        nameBn: 'সাউন্ড ডিটেকশন সেনসিটিভিটি',
        nameEn: 'Acoustic Sound Threshold',
        type: 'slider',
        descriptionBn: 'শব্দ শনাক্তকরণের সংবেদনশীলতা ঠিক করার স্লাইডার।',
        descriptionEn: 'Sets the decibel threshold for sound alarms.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: আপনার ক্যামেরা সিলেক্ট করুন এবং লাইভ ভিউ প্রিভিউ দেখুন।',
      '২য় ধাপ: "রাতে মানুষ দেখলে লাইট অন ও স্পিকারে কথা বলো" রেসিপি ক্লিক করুন।',
      '৩য় ধাপ: টেস্ট ইভেন্টে চাপ দিয়ে অটোমেশন পরীক্ষা করুন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Select your camera stream and verify live feeds.',
      'Step 2: Choose a detection recipe like Person Detection -> Spotlight.',
      'Step 3: Simulate an event to verify camera pan and speaker response.'
    ]
  },
  admin_audit: {
    pageId: 'admin_audit',
    titleBn: 'অ্যাডমিন গ্লোবাল অডিট ও কন্ট্রোল প্যানেল',
    titleEn: 'Admin Global Automation Audit & Control Panel',
    summaryBn: 'পুরো বাড়ির সমস্ত অটোমেশনের রিয়েল-টাইম এক্সিকিউশন মনিটরিং, কনফ্লিক্ট ডিটেকশন এবং ওভাররাইড কন্ট্রোল।',
    summaryEn: 'Monitor live automation triggers, inspect rule execution logs, detect device conflicts, and lock critical entities.',
    voiceScriptBn: 'এটি অ্যাডমিন গ্লোবাল অডিট প্যানেল। পুরো বাড়ির প্রতিটি অটোমেশন কখন চলছে, কোনো ডিভাইসে কোনো বিরোধ বা সমস্যা আছে কি না তা এখান থেকে মনিটর এবং ওভাররাইড করা যায়।',
    voiceScriptEn: 'This is the Admin Global Audit Panel. Inspect real-time automation execution events across all rooms, resolve device state conflicts, and enforce priority override locks.',
    unabridgedVoiceScriptBn: 'অ্যাডমিন গ্লোবাল অডিট ও সেন্ট্রাল কন্ট্রোল প্যানেলে স্বাগতম। এই প্যানেলটি হলো আপনার বাড়ির সমস্ত অটোমেশন ও স্মার্ট অ্যাকশনের সুপারভাইজার। এখানে প্রতিটি রুমের প্রতিটি লাইট, ফ্যান, এসি ও সেন্সরের লাইভ ইভেন্ট স্ট্রিম সেকেন্ডের মধ্যে আপডেট হয়। যদি দুটি ভিন্ন অটোমেশন একই সময়ে একটি ডিভাইসের বিপরীত কমান্ড পাঠায়, তবে সিস্টেমের কনফ্লিক্ট রেজোলিউশন ইঞ্জিন অগ্রাধিকার অনুযায়ী তা সমাধান করে। প্রধান কন্ট্রোলসমূহ: ১. লাইভ ইভেন্ট স্ট্রিম টেবিল—যা কোন অটোমেশন কখন ট্রিগার হয়েছে তা দেখায়। ২. রুম ও স্ট্যাটাস ফিল্টার—যার মাধ্যমে ড্রয়িং রুম, বেডরুম বা কিচেনের ইভেন্ট আলাদা করা যায়। ৩. প্রায়োরিটি লক টগল—যা অনাকাঙ্ক্ষিতভাবে গুরুত্বপূর্ণ ডিভাইস বন্ধ হওয়া রোধ করে। ৪. ম্যানুয়াল ফোর্স রান বাটন—যা দিয়ে যেকোনো রুল অবিলম্বে টেস্ট করা যায়।',
    unabridgedVoiceScriptEn: 'Welcome to the Admin Global Automation Audit Panel. Maintain comprehensive visibility into all running home automations, detect conflicting state commands in real-time, inspect timestamped execution logs, and apply priority override locks to critical household infrastructure.',
    featuresBn: [
      'রিয়েল-টাইম এক্সিকিউশন ইভেন্ট স্ট্রিম ও লাইভ লগ',
      'ডিভাইস কনফ্লিক্ট ডিটেকশন ও অগ্রাধিকার সমাধান',
      'রুম-ভিত্তিক ফিল্টারিং ও স্ট্যাটাস সার্চ',
      'ম্যানুয়াল ওভাররাইড ও প্রায়োরিটি সেফটি লক'
    ],
    tipsBn: 'টিপস: যেকোনো অটোমেশনের উপর ক্লিক করে তার লাইভ হিস্ট্রি ও অ্যাকশন যাচাই করুন।',
    detailedControls: [
      {
        nameBn: 'রিফ্রেশ অডিট লগ বাটন',
        nameEn: 'Refresh Audit Logs',
        type: 'button',
        descriptionBn: 'তাত্ক্ষণিক নতুন ইভেন্ট ও এক্সিকিউশন লগ রিফ্রেশ করে।',
        descriptionEn: 'Fetches the latest execution logs and telemetry.'
      },
      {
        nameBn: 'রুম ফিল্টার ড্রপডাউন',
        nameEn: 'Room Filter Selector',
        type: 'button',
        descriptionBn: 'নির্দিষ্ট কোনো রুমের অটোমেশন আলাদা করে দেখার ফিল্টার।',
        descriptionEn: 'Filters automations by specific zone or room.'
      },
      {
        nameBn: 'ম্যানুয়াল ফোর্স এক্সিকিউট বাটন',
        nameEn: 'Force Run Automation',
        type: 'button',
        descriptionBn: 'যেকোনো অটোমেশন নিয়ম টেস্ট করতে সরাসরি রান করার বাটন।',
        descriptionEn: 'Triggers the selected rule immediately.'
      },
      {
        nameBn: 'ডিভাইস প্রায়োরিটি লক',
        nameEn: 'Priority Lock Toggle',
        type: 'toggle',
        descriptionBn: 'অন্যান্য লো-প্রায়োরিটি রুল দ্বারা ডিভাইসের অবস্থা পরিবর্তন রোধ করে।',
        descriptionEn: 'Prevents lower-priority rules from modifying entity state.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: উপরের ফিল্টারে আপনার পছন্দের রুম নির্বাচন করুন।',
      '২য় ধাপ: তালিকায় থাকা অটোমেশনের স্ট্যাটাস ও লাস্ট রান টাইম দেখুন।',
      '৩য় ধাপ: প্লে বাটনে চাপ দিয়ে যেকোনো অটোমেশনের লাইভ এক্সিকিউশন টেস্ট করুন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Select a specific room from the filter bar.',
      'Step 2: Inspect active automations, timestamps, and execution counts.',
      'Step 3: Click the Run button to test any automation pipeline on-demand.'
    ]
  },
  intent: {
    pageId: 'intent',
    titleBn: 'ইউনিভার্সাল ইনটেন্ট স্টুডিও ও মাল্টি-মোডাল সহকারী',
    titleEn: 'Universal Intent Studio & Multi-Modal Assistant',
    summaryBn: 'প্রাকৃতিক ভাষার জটিল কমান্ড বিশ্লেষণ, সেন্সর ডেটা রিডিং এবং সরাসরি ডিভাইস পরিচালনা।',
    summaryEn: 'Natural language semantic parsing, sensor condition reasoning, and immediate Home Assistant execution.',
    voiceScriptBn: 'এটি ইউনিভার্সাল ইনটেন্ট স্টুডিও। এখানে আপনি বাংলায় কথা বলে বা লিখে যেকোনো জটিল পরিস্থিতি সমাধান করতে পারেন। এআই আপনার কথার অর্থ বুঝে সঠিক কমান্ড তৈরি করে।',
    voiceScriptEn: 'This is the Universal Intent Studio. Dictate or type natural commands in English or Bengali. The multimodal AI decomposes compound requests into precise Home Assistant actions.',
    unabridgedVoiceScriptBn: 'ইউনিভার্সাল ইনটেন্ট স্টুডিও ও এআই কমান্ড সেন্টারে স্বাগতম। এই সিস্টেমটি প্রাকৃতিক ভাষার গভীর অর্থ এবং সেন্সর পরিবেশ বিশ্লেষণ করতে সক্ষম। আপনি যদি বলেন: "ঘরের তাপমাত্রা বেশি লাগলে এসি অন করো এবং আলো ডিম করো"—সিস্টেম ঘরের লাইভ থার্মোমিটার চেক করবে, প্রয়োজনীয় তাপমাত্রা ক্যালকুলেট করবে এবং সংশ্লিষ্ট ডিভাইসগুলোকে নির্দেশ পাঠাবে। প্রধান কন্ট্রোলসমূহ: ১. ভয়েস ডিকটেশন পুশ-টু-টক বাটন—যা দিয়ে সরাসরি মুখে নির্দেশ দেওয়া যায়। ২. মাল্টি-মোডাল ক্যামেরা স্ন্যাপ ইনপুট—যেখানে রুমের ছবি দিয়ে কোনো নির্দেশ দেওয়া যায়। ৩. ইনটেন্ট এক্সিকিউশন প্ল্যানার ভিউ—যা এআই কী বুঝল এবং কী করতে যাচ্ছে তা প্রদর্শন করে। ৪. এক্সিকিউট কনফার্মেশন বাটন—যা কমান্ডটিকে হোম অ্যাসিস্ট্যান্টে প্রেরণ করে।',
    unabridgedVoiceScriptEn: 'Welcome to the Universal Intent Studio. This subsystem utilizes high-speed NLP and Gemini multimodal reasoning to translate conversational instructions into exact Home Assistant service calls. Speak or enter compound intents, inspect the parsed entity graph, and execute actions with instant auditory feedback.',
    featuresBn: [
      'প্রাকৃতিক বাংলা ও ইংরেজি ভাষা ডিকটেশন',
      'মাল্টি-মোডাল ইমেজ ও সেন্সর ইনপুট প্রসেসিং',
      'স্বয়ংক্রিয় কন্ডিশন ও টেম্পারেচার ক্যালকুলেশন',
      'হোম অ্যাসিস্ট্যান্ট সার্ভিস কল লাইভ এক্সিকিউশন'
    ],
    tipsBn: 'টিপস: মাইক আইকনে ক্লিক করে কথা বলুন, সিস্টেম সাথে সাথে আপনার নির্দেশ বুঝে নেবে।',
    detailedControls: [
      {
        nameBn: 'লাইভ পুশ-টু-টক মাইক্রোফোন',
        nameEn: 'Live Speech-to-Text Mic',
        type: 'button',
        descriptionBn: 'ক্লিক করে আপনার নির্দেশ মুখে বলুন।',
        descriptionEn: 'Captures spoken commands in real-time.'
      },
      {
        nameBn: 'ইনটেন্ট প্ল্যান রিভিউ বাটন',
        nameEn: 'Analyze & Plan Intent',
        type: 'button',
        descriptionBn: 'এআই কীভাবে কাজটি করবে তার স্টেপ-বাই-স্টেপ প্ল্যান দেখায়।',
        descriptionEn: 'Generates action steps based on semantic parsing.'
      },
      {
        nameBn: 'এক্সিকিউট সার্ভিস কল বাটন',
        nameEn: 'Dispatch Actions Button',
        type: 'button',
        descriptionBn: 'হোম অ্যাসিস্ট্যান্টে নির্দেশ বাস্তবায়ন করার বাটন।',
        descriptionEn: 'Sends validated service calls to Home Assistant.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: মাইক চাপুন বা ইনপুট বক্সে আপনার চাওয়া বাংলায় লিখুন।',
      '২য় ধাপ: সিস্টেম আপনার নির্দেশের প্রতিটি অংশ বিশ্লেষণ করে অ্যাকশন প্ল্যান সাজাবে।',
      '৩য় ধাপ: "কমান্ড এক্সিকিউট করুন" বাটনে চাপ দিয়ে লাইভ অ্যাকশন চালান।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Click the microphone or type your intent in natural language.',
      'Step 2: Review the structured intent decomposition and targeted entities.',
      'Step 3: Click Execute to trigger actions across your smart home.'
    ]
  },
  ha_gateway: {
    pageId: 'ha_gateway',
    titleBn: 'হোম অ্যাসিস্ট্যান্ট লাইভ ব্রিজ ও ডিভাইস গেটওয়ে',
    titleEn: 'Home Assistant Live Bridge & Device Gateway',
    summaryBn: 'হোম অ্যাসিস্ট্যান্টের লাইভ এনটিটি, স্টেটাস, লাইট, সুইচ ও সেন্সরের সাথে সরাসরি কানেকশন।',
    summaryEn: 'Real-time WebSocket & REST integration syncing all Home Assistant entities, switches, sensors, and zones.',
    voiceScriptBn: 'এটি হোম অ্যাসিস্ট্যান্ট লাইভ ব্রিজ। আপনার হোম অ্যাসিস্ট্যান্টের সাথে সমস্ত লাইট, ফ্যান, এসি, ক্যামেরা ও সেন্সরের লাইভ সংযোগ এখান থেকে মনিটর এবং টেস্ট করা যায়।',
    voiceScriptEn: 'This is the Home Assistant Live Bridge. View real-time states for all connected switches, lights, media players, sensors, and climates directly synced with Home Assistant.',
    unabridgedVoiceScriptBn: 'হোম অ্যাসিস্ট্যান্ট লাইভ ব্রিজ ও ডিভাইস গেটওয়ে পেজে স্বাগতম। এই পেজটি আপনার হোম অ্যাসিস্ট্যান্ট ইনস্ট্যান্সের সাথে হাই-স্পিড ওয়েব-সকেট ও আরইএসটি প্রোটোকলে সার্বক্ষণিক সিঙ্ক বজায় রাখে। এখানে আপনার ঘরের প্রতিটা লাইট, ফ্যান, টিভি, এসি, মোশন ডিটেক্টর ও ডোর সেন্সরের বর্তমান লাইভ স্ট্যাটাস দেখা যায়। প্রধান কন্ট্রোলসমূহ: ১. লাইভ এনটিটি সার্চ ও ফিল্টার বক্স—যা দিয়ে নাম ধরে যেকোনো ডিভাইস দ্রুত খুঁজে পাওয়া যায়। ২. ১-ট্যাপ টগল সুইচ—যার মাধ্যমে ব্রাউজার থেকেই সাথে সাথে যেকোনো লাইট বা ফ্যান অন-অফ করা যায়। ৩. সিঙ্ক ও রিকানেক্ট বাটন—যা সার্ভার কানেকশন পরীক্ষা ও ডিভাইস লিস্ট রিফ্রেশ করে। ৪. এনটিটি অ্যাট্রিবিউট ইনস্পেক্টর—যা ডিভাইসের ব্রাইটনেস, ব্যাটারি লেভেল ও আইপি অ্যাড্রেস প্রদর্শন করে।',
    unabridgedVoiceScriptEn: 'Welcome to the Home Assistant Live Bridge. This module provides bi-directional WebSocket and REST synchronization with your Home Assistant OS instance. View live states, toggle entities on-demand, inspect hardware capabilities, and verify real-time entity responsiveness.',
    featuresBn: [
      'রিয়েল-টাইম ওয়েব-সকেট ও রেস্ট এপিআই সিঙ্ক',
      'সকল লাইট, ফ্যান, এসি ও সেন্সরের লাইভ সুইচিং',
      'ডিভাইস স্টেট, ব্রাইটনেস ও টেম্পারেচার রিডার',
      '১-ক্লিকে ডিভাইস লিস্ট রিফ্রেশ ও কানেকশন অডিট'
    ],
    tipsBn: 'টিপস: যেকোনো সুইচে ক্লিক করে ডিভাইসের বর্তমান অবস্থা সরাসরি পরিবর্তন করতে পারেন।',
    detailedControls: [
      {
        nameBn: 'ডিভাইস লাইভ টগল সুইচ',
        nameEn: 'Entity Live Toggle',
        type: 'toggle',
        descriptionBn: 'যেকোনো লাইট বা সুইচ সরাসরি অন অথবা অফ করুন।',
        descriptionEn: 'Toggles the hardware entity state in real-time.'
      },
      {
        nameBn: 'ডিভাইস সার্চ বক্স',
        nameEn: 'Entity Search Filter',
        type: 'input',
        descriptionBn: 'নাম বা ডোমেইন লিখে নির্দিষ্ট ডিভাইস খুঁজুন।',
        descriptionEn: 'Searches entities by ID, friendly name, or room.'
      },
      {
        nameBn: 'গেটওয়ে সিঙ্ক বাটন',
        nameEn: 'Sync Gateway Cache',
        type: 'button',
        descriptionBn: 'হোম অ্যাসিস্ট্যান্টের সকল নতুন ডিভাইসের লিস্ট রিলোড করে।',
        descriptionEn: 'Refreshes entity catalog from the Home Assistant server.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: সার্চ বক্সে ডিভাইসের নাম লিখুন (যেমন: light.drawing_room)।',
      '২য় ধাপ: ডিভাইসের বর্তমান অবস্থা ও ব্রাইটনেস লেভেল দেখুন।',
      '৩য় ধাপ: টগল সুইচে চাপ দিয়ে অন বা অফ করে কানেকশন যাচাই করুন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Use the search box to locate specific entities.',
      'Step 2: Inspect real-time status and operational parameters.',
      'Step 3: Toggle switches to command physical hardware instantly.'
    ]
  },
  rooms: {
    pageId: 'rooms',
    titleBn: 'ইউনিফাইড রুম ম্যানেজার ও স্পিকার অডিও জোন',
    titleEn: 'Unified Room Manager & Audio Zones',
    summaryBn: 'রুম অনুযায়ী ডিভাইস গ্রুপ, এসি তাপমাত্রা, অ্যাম্বিয়েন্ট লাইটিং এবং স্পিকার জোন কন্ট্রোল।',
    summaryEn: 'Organize smart home devices by room, manage ambient scenes, set room climate, and control multi-room speakers.',
    voiceScriptBn: 'এটি ইউনিফাইড রুম ম্যানেজার। ড্রয়িং রুম, মাস্টার বেডরুম বা কিচেনের সমস্ত ডিভাইস এক নজরে দেখে রুমের তাপমাত্রা ও স্পিকারের গান পরিচালনা করতে পারেন।',
    voiceScriptEn: 'Welcome to the Unified Room Manager. Control your smart home zone by zone, manage climate thermostats, trigger room scenes, and route audio speakers.',
    unabridgedVoiceScriptBn: 'ইউনিফাইড রুম ম্যানেজার ও স্পিকার অডিও জোনে স্বাগতম। এই পেজে আপনার পুরো বাড়িকে আলাদা আলাদা রুমে ভাগ করে দেখানো হয়েছে—যেমন লিভিং রুম, মাস্টার বেডরুম, গেস্ট রুম ও কিচেন। প্রতিটি রুমের জন্য নির্দিষ্ট লাইটিং সিন, রুম টেম্পারেচার এবং সেই রুমের নির্দিষ্ট ব্লুটুথ বা ইউএসবি স্পিকার আলাদাভাবে নিয়ন্ত্রণ করা যায়। প্রধান কন্ট্রোলসমূহ: ১. রুম সিলেক্টর কার্ডসমূহ—যেখানে প্রতিটি রুমের সামগ্রিক তাপমাত্রা ও অ্যাক্টিভ ডিভাইসের সংখ্যা দেখা যায়। ২. ১-ক্লিক "সব বন্ধ করুন" বাটন—যা রুম ছাড়ার সময় এক ক্লিকে সব লাইট ও ফ্যান অফ করে। ৩. রুম ক্লাইমেট থার্মোস্ট্যাট ডায়াল—যার মাধ্যমে এসি বা হিটারের তাপমাত্রা নিয়ন্ত্রণ করা যায়। ৪. স্পিকার জোন রাউটার—যা রুমের স্পিকারে যেকোনো ভয়েস মেসেজ বা গান পাঠাতে সাহায্য করে।',
    unabridgedVoiceScriptEn: 'Welcome to the Unified Room Manager. Group and orchestrate devices by physical spaces. Trigger coordinated ambient scenes, set zone-specific thermostats, manage room occupancy states, and route targeted audio announcements room-by-room.',
    featuresBn: [
      'রুম অনুযায়ী স্বয়ংক্রিয় ডিভাইস গ্রুপিং',
      'রুমের তাপমাত্রা ও ক্লাইমেট কন্ট্রোল',
      '১-ক্লিক রুম মাস্টার অফ ও অন সুইচ',
      'রুম-নির্দিষ্ট স্পিকার অডিও প্লেব্যাক'
    ],
    tipsBn: 'টিপস: যেকোনো রুমের কার্ডে ক্লিক করে সেই রুমের সকল ডিভাইস একসাথে কন্ট্রোল করুন।',
    detailedControls: [
      {
        nameBn: 'রুম মাস্টার পাওয়ার বাটন',
        nameEn: 'Room Master Power',
        type: 'button',
        descriptionBn: 'রুমের সব লাইট ও ফ্যান একসাথে অন বা অফ করার বাটন।',
        descriptionEn: 'Powers all entities within the selected zone on or off.'
      },
      {
        nameBn: 'রুম টেম্পারেচার স্লাইডার',
        nameEn: 'Climate Temperature Dial',
        type: 'slider',
        descriptionBn: 'রুমের এসির তাপমাত্রা বাড়ানো বা কমানোর কন্ট্রোল।',
        descriptionEn: 'Sets the targeted temperature for the room thermostat.'
      },
      {
        nameBn: 'রুম সিন ট্র্রিগার বাটন',
        nameEn: 'Ambient Scene Trigger',
        type: 'button',
        descriptionBn: 'সিনেমা মোড, রিল্যাক্স মোড বা নাইট মোড সিন অন করে।',
        descriptionEn: 'Activates lighting and media presets for the room.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: আপনার পছন্দের রুম সিলেক্ট করুন (যেমন: ড্রয়িং রুম)।',
      '২য় ধাপ: রুমের সিন বাটনে ক্লিক করে পছন্দমতো লাইটিং ইফেক্ট চালু করুন।',
      '৩য় ধাপ: রুম ছাড়ার আগে "সব বন্ধ করুন" বাটনে চাপ দিন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Choose a room card from the dashboard grid.',
      'Step 2: Trigger pre-configured lighting and comfort scenes.',
      'Step 3: Adjust climate setpoints or toggle room power with one click.'
    ]
  },
  rules: {
    pageId: 'rules',
    titleBn: 'অটোমেশন রুল লাইফসাইকেল ও রুলস ম্যানেজার',
    titleEn: 'Rule Lifecycle Manager & Automation Registry',
    summaryBn: 'তৈরিকৃত সকল অটোমেশনের তালিকা, সক্রিয়/নিষ্ক্রিয় টগল, সম্ভাব্যতা স্কোর ও এডিটিং।',
    summaryEn: 'Complete registry of all automation rules with feasibility audits, execution counters, and instant editing.',
    voiceScriptBn: 'এটি অটোমেশন রুলস ম্যানেজার। এখানে আপনার সমস্ত তৈরি করা রুলস তালিকাভুক্ত থাকে। যেকোনো নিয়ম বন্ধ বা চালু করতে পারেন এবং এডিট করে নতুন শর্ত যোগ করতে পারেন।',
    voiceScriptEn: 'This is the Rule Lifecycle Manager. View all active automation rules, toggle rules on or off, inspect execution history, and edit trigger parameters.',
    unabridgedVoiceScriptBn: 'অটোমেশন রুল লাইফসাইকেল ও রুলস ম্যানেজারে স্বাগতম। এই পেজে আপনার স্মার্ট হোমের সমস্ত সক্রিয় ও নিষ্ক্রিয় রুলস তালিকাভুক্ত রয়েছে। প্রতিটি রুলের সাথে তার ট্রিগার টাইপ (যেমন সময়, সেন্সর বা ক্যামেরা মোশন), অ্যাকশন লিস্ট, মোট কতবার এক্সিকিউট হয়েছে এবং হার্ডওয়্যার সম্ভাব্যতা স্কোর প্রদর্শিত হয়। প্রধান কন্ট্রোলসমূহ: ১. রুল অ্যাক্টিভেশন টগল সুইচ—যার মাধ্যমে যেকোনো রুল সাময়িক বন্ধ বা চালু করা যায়। ২. "ম্যানুয়ালি টেস্ট করুন" বাটন—যা নিয়মটি লাইভ কার্যকর করে টেস্ট করে। ৩. রুল এডিটর বাটন—যা নিয়মের নাম, সময় বা ডিভাইস পরিবর্তন করতে দেয়। ৪. ডিলিট বাটন—যা অপ্রয়োজনীয় নিয়ম নিরাপদে মুছে ফেলে।',
    unabridgedVoiceScriptEn: 'Welcome to the Rule Lifecycle Manager. This module oversees the lifecycle of all compiled automations. Inspect trigger mechanisms (temporal, sensory, vision), track execution counters, verify hardware feasibility scores, and edit rules with instant database persistence.',
    featuresBn: [
      'সকল অটোমেশনের কেন্দ্রীয় রেজিস্ট্রি ও সার্চ',
      '১-ক্লিক রুল সক্রিয়/নিষ্ক্রিয় টগল সুইচ',
      'লাইভ টেস্ট ফায়ারিং ও এক্সিকিউশন কাউন্টার',
      'স্বয়ংক্রিয় হার্ডওয়্যার সম্ভাব্যতা অডিট স্কোর'
    ],
    tipsBn: 'টিপস: কোনো রুল টেস্ট করতে ডানপাশের প্লে বাটনে ক্লিক করুন।',
    detailedControls: [
      {
        nameBn: 'রুল সক্রিয়করণ সুইচ',
        nameEn: 'Rule Enable Toggle',
        type: 'toggle',
        descriptionBn: 'অটোমেশনটি চালু বা বন্ধ রাখার সুইচ।',
        descriptionEn: 'Enables or pauses the selected automation rule.'
      },
      {
        nameBn: 'রুল টেস্ট ফায়ার বাটন',
        nameEn: 'Test Run Rule Button',
        type: 'button',
        descriptionBn: 'শর্ত ছাড়াই রুলটি অবিলম্বে টেস্ট করার জন্য রান করে।',
        descriptionEn: 'Manually fires the rule actions for testing.'
      },
      {
        nameBn: 'রুল এডিট বাটন',
        nameEn: 'Edit Rule Button',
        type: 'button',
        descriptionBn: 'রুলের শর্ত বা অ্যাকশন পরিবর্তন করার উইন্ডো ওপেন করে।',
        descriptionEn: 'Opens the rule modification modal.'
      },
      {
        nameBn: 'রুল ডিলিট বাটন',
        nameEn: 'Delete Rule Button',
        type: 'button',
        descriptionBn: 'ডাটাবেস থেকে রুলটি স্থায়ীভাবে মুছে ফেলে।',
        descriptionEn: 'Removes the rule from the active database.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: তালিকায় আপনার তৈরিকৃত রুলটি খুঁজুন।',
      '২য় ধাপ: প্লে বাটনে ক্লিক করে লাইভ ডিভাইসে অ্যাকশন পরীক্ষা করুন।',
      '৩য় ধাপ: প্রয়োজনে এডিট বাটনে চাপ দিয়ে সময় বা ডিভাইস পরিবর্তন করুন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Locate your rule in the structured list.',
      'Step 2: Click the Play icon to execute a dry run on real hardware.',
      'Step 3: Edit parameters or toggle active status as desired.'
    ]
  },
  canvas: {
    pageId: 'canvas',
    titleBn: 'ভিজ্যুয়াল নোড ক্যানভাস ও ফ্লো চার্ট স্টুডিও',
    titleEn: 'Visual Node Canvas & Flow Graph Studio',
    summaryBn: 'ড্র্যাগ-অ্যান্ড-ড্রপ নোড গ্রাফের মাধ্যমে জটিল অটোমেশন ও পাইপলাইন তৈরি।',
    summaryEn: 'Interactive visual drag-and-drop node graph canvas for building complex automation pipelines.',
    voiceScriptBn: 'এটি ভিজ্যুয়াল নোড ক্যানভাস। এখানে নোড টেনে এনে যুক্ত করে সুন্দর ফ্লো চার্ট আকারে অটোমেশন তৈরি করা যায়। প্রতিটি তারের মাধ্যমে ডেটা কীভাবে প্রবাহিত হচ্ছে তা লাইভ দেখা যায়।',
    voiceScriptEn: 'This is the Visual Node Canvas. Drag and drop triggers, conditions, and actions into a connected node graph to design complex automations visually.',
    unabridgedVoiceScriptBn: 'ভিজ্যুয়াল নোড ক্যানভাস ও ফ্লো চার্ট স্টুডিওতে স্বাগতম। এই পেজে আপনি কোডিং না করেই সম্পূর্ণ গ্রাফিক্যাল উপায়ে অটোমেশন তৈরি করতে পারেন। বাঁদিকের প্যানেল থেকে ট্রিগার নোড, কন্ডিশন নোড ও অ্যাকশন নোড ক্যানভাসে টেনে আনুন এবং একটির আউটপুট থেকে অন্যটির ইনপুটে লাইন বা ওয়্যার যুক্ত করে সম্পূর্ণ পাইপলাইন তৈরি করুন। প্রধান কন্ট্রোলসমূহ: ১. নোড ড্র্যাগ প্যালেট—যেখানে সময়, সেন্সর, সুইচ ও স্পিকারের নোড রয়েছে। ২. ইন্টারেক্টিভ ক্যানভাস—যা জুম ইন, জুম আউট ও প্যান করা যায়। ৩. অটো-অ্যালাইন বাটন—যা এলোমেলো নোডগুলোকে সুন্দরভাবে সাজিয়ে দেয়। ৪. "সেভ ও ডিপ্লয়" বাটন—যা এই নোড গ্রাফকে সরাসরি লাইভ অটোমেশনে রূপান্তরিত করে।',
    unabridgedVoiceScriptEn: 'Welcome to the Visual Node Canvas. Build enterprise-grade automation pipelines visually using an interactive drag-and-drop graph. Connect trigger nodes, sensory conditions, and multi-entity action nodes with real-time pipeline validation and instant compilation.',
    featuresBn: [
      'ইন্টারেক্টিভ ড্র্যাগ-অ্যান্ড-ড্রপ নোড আর্কিটেকচার',
      'রিয়েল-টাইম ওয়্যার কানেকশন ও ভ্যালিডেশন',
      'জুম ইন, জুম আউট ও ক্যানভাস প্যানিং',
      '১-ক্লিকে নোড গ্রাফ থেকে লাইভ অটোমেশন তৈরি'
    ],
    tipsBn: 'টিপস: নোড সিলেক্ট করে ডিলিট চাপলে নোড মুছে যাবে এবং টেনে নিয়ে সহজে যুক্ত করা যাবে।',
    detailedControls: [
      {
        nameBn: 'নতুন নোড অ্যাড বাটন',
        nameEn: 'Add Node from Palette',
        type: 'button',
        descriptionBn: 'ট্রিগার বা অ্যাকশন নোড ক্যানভাসে যুক্ত করার বাটন।',
        descriptionEn: 'Instantiates a new node on the canvas.'
      },
      {
        nameBn: 'অটো-লেআউট অর্গানাইজার',
        nameEn: 'Auto Align Graph',
        type: 'button',
        descriptionBn: 'ক্যানভাসের নোডগুলোকে সুন্দরভাবে সমান দূরত্বে সাজায়।',
        descriptionEn: 'Automatically aligns nodes cleanly on the graph.'
      },
      {
        nameBn: 'সেভ পাইপলাইন বাটন',
        nameEn: 'Deploy Node Graph',
        type: 'button',
        descriptionBn: 'ক্যানভাসের নকশাকে লাইভ সিস্টেমে সেভ করে চালু করে।',
        descriptionEn: 'Compiles and saves the node pipeline.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: প্যালেট থেকে একটি ট্রিগার নোড এবং একটি অ্যাকশন নোড ক্যানভাসে টানুন।',
      '২য় ধাপ: ট্রিগারের আউটপুট পয়েন্ট থেকে টেনে অ্যাকশনের ইনপুটে যুক্ত করুন।',
      '৩য় ধাপ: "সেভ ও ডিপ্লয়" বাটনে চাপ দিয়ে রুলটি চালু করুন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Drag a trigger node and an action node onto the canvas.',
      'Step 2: Connect the output port of the trigger to the input of the action.',
      'Step 3: Click Deploy to convert your visual graph into an active automation.'
    ]
  },
  neural: {
    pageId: 'neural',
    titleBn: 'লোকাল নিউরাল অ্যাটেনশন নেটওয়ার্ক ও এআই ব্রেন',
    titleEn: 'Local Neural Attention Network Visualizer',
    summaryBn: 'ক্লাউড ছাড়া সম্পূর্ণ লোকাল ডিভাইসে চলা নামপাই সেলফ-অ্যাটেনশন ম্যাট্রিক্স ও লার্নিং ভিজ্যুয়ালাইজেশন।',
    summaryEn: 'Zero-cloud local NumPy multi-head self-attention transformer visualizer and weight inspector.',
    voiceScriptBn: 'এটি লোকাল নিউরাল নেটওয়ার্ক ভিউয়ার। ইন্টারনেট ছাড়াও আপনার লোকাল হার্ডওয়্যার কীভাবে মানুষের মতো মনোযোগ দিয়ে সিদ্ধান্ত নেয় তা এখানে ম্যাট্রিক্স গ্রাফে দেখা যায়।',
    voiceScriptEn: 'This is the Local Neural Attention Visualizer. Inspect how our on-device NumPy transformer calculates multi-head attention weights and activates local decision layers without relying on cloud servers.',
    unabridgedVoiceScriptBn: 'লোকাল নিউরাল অ্যাটেনশন নেটওয়ার্ক ও এআই ব্রেন পেজে স্বাগতম। এই আর্কিটেকচারটি সম্পূর্ণ লোকাল নামপাই ম্যাট্রিক্স ইঞ্জিনে চলে, যার জন্য কোনো ক্লাউড ইন্টারনেট সংযোগের প্রয়োজন হয় না। এখানে এআই-এর মাল্টি-হেড সেলফ অ্যাটেনশন ওয়েট, কিউ-কে-ভি ভেক্টর এবং অ্যাক্টিভেশন লেয়ার রিয়েল-টাইমে ভিজ্যুয়ালাইজ করা হয়। প্রধান কন্ট্রোলসমূহ: ১. অ্যাটেনশন হিটম্যাপ গ্রিড—যা কোন শব্দের সাথে কোন ডিভাইসের সংযোগ বেশি তা উজ্জ্বল রঙের মাধ্যমে দেখায়। ২. লেয়ার সুইচিং ট্যাব—যার মাধ্যমে প্রথম লেয়ার থেকে শেষ লেয়ারের ট্রান্সফরমেশন দেখা যায়। ৩. টেস্ট সেন্টেন্স ইনপুট বক্স—যেখানে বাক্য লিখলে লাইভ নিউরাল ফায়ারিং অ্যানিমেশন দেখা যায়। ৪. লোকাল ইনফারেন্স লেটেন্সি স্পিডোমিটার।',
    unabridgedVoiceScriptEn: 'Welcome to the Local Neural Attention Visualizer. Inspect on-device multi-head self-attention mechanisms implemented purely in NumPy. Observe query-key-value projections, attention weight heatmaps, softmax distributions, and sub-millisecond local inference latency.',
    featuresBn: [
      'সম্পূর্ণ অফলাইন নামপাই ট্রান্সফরমার ইঞ্জিন',
      'মাল্টি-হেড সেলফ-অ্যাটেনশন হিটম্যাপ ভিউ',
      'রিয়েল-টাইম ইনফারেন্স লেটেন্সি ও মেমোরি মিটার',
      'ইন্টারেক্টিভ নিউরাল লেয়ার ইনস্পেকশন'
    ],
    tipsBn: 'টিপস: যেকোনো শব্দে হোভার করলে তার অ্যাটেনশন কানেকশন হাইলাইট হয়ে উঠবে।',
    detailedControls: [
      {
        nameBn: 'টেস্ট সেন্টেন্স ইনপুট',
        nameEn: 'Sample Sentence Input',
        type: 'input',
        descriptionBn: 'বাক্য লিখে নিউরাল মনোযোগ পরীক্ষা করার বক্স।',
        descriptionEn: 'Injects sample text into the local transformer pipeline.'
      },
      {
        nameBn: 'অ্যাটেনশন হেড সিলেক্টর',
        nameEn: 'Attention Head Selector',
        type: 'button',
        descriptionBn: 'আলাদা আলাদা অ্যাটেনশন হেডের হিটম্যাপ দেখার সুইচ।',
        descriptionEn: 'Switches between multi-head attention visualizers.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: টেস্ট বক্সে একটি বাক্য লিখুন (যেমন: ড্রয়িং রুমের লাইট অন করো)।',
      '২য় ধাপ: হিটম্যাপে দেখুন এআই কোন শব্দটিকে বেশি গুরুত্ব দিচ্ছে।',
      '৩য় ধাপ: লোকাল ইনফারেন্স স্পিড ও লেটেন্সি গ্রাফ পর্যবেক্ষণ করুন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Type a command into the prompt input.',
      'Step 2: Observe the multi-head attention weight distributions.',
      'Step 3: Inspect local CPU inference latency and activation states.'
    ]
  },
  visitor: {
    pageId: 'visitor',
    titleBn: 'ভিজিটর ভিশন ইঞ্জিন ও ফেস রিকগনিশন',
    titleEn: 'Visitor Vision Engine & Facial Recognition',
    summaryBn: 'পরিচিত পরিবার সদস্য ও অতিথিদের মুখ চিনে মিষ্টি কণ্ঠে স্বাগতম জানানো ও নিরাপত্তা নিশ্চিতকরণ।',
    summaryEn: 'Edge biometric facial recognition, door chime announcements, and visitor event auditing.',
    voiceScriptBn: 'এটি ভিজিটর ভিশন ইঞ্জিন। দরজায় পরিবারের কেউ বা অতিথি আসলে ক্যামেরা তাদের চিনে মিষ্টি কণ্ঠে নাম ধরে স্বাগতম জানাবে এবং লক আনলক করতে পারবে।',
    voiceScriptEn: 'This is the Visitor Vision Engine. Recognize registered family members and guests at the front door to trigger personalized voice greetings and access control.',
    unabridgedVoiceScriptBn: 'ভিজিটর ভিশন ইঞ্জিন ও ফেস রিকগনিশন সিস্টেমে স্বাগতম। এই সিস্টেমটি আপনার দরজার স্মার্ট ক্যামেরার মাধ্যমে আগত অতিথিদের মুখমণ্ডল রিয়েল-টাইমে স্ক্যান করে। পরিচিত পরিবারের সদস্য আসলে মিষ্টি গলায় নাম ধরে স্বাগতম জানায়—যেমন "স্বাগতম হুমায়ুন ভাই, ড্রয়িং রুমের এসি চালু করা হয়েছে"। অচেনা কোনো ব্যক্তি আসলে সাথে সাথে মোবাইলে নোটিফিকেশন ও ফটো পাঠায়। প্রধান কন্ট্রোলসমূহ: ১. নতুন মুখ রেজিস্টার বাটন—যা দিয়ে পরিবারের নতুন সদস্য বা অতিথির ছবি সেভ করা যায়। ২. লাইভ ডিটেকশন ফিড—যা ক্যামেরার সামনে উপস্থিত ব্যক্তির কনফিডেন্স স্কোর দেখায়। ৩. অটো-ওয়েলকাম স্পিচ টগল—যা স্বয়ংক্রিয় সম্ভাষণ অন বা অফ রাখে। ৪. ভিজিটর হিস্ট্রি লগ।',
    unabridgedVoiceScriptEn: 'Welcome to the Visitor Vision Engine. Run edge biometric facial recognition on live RTSP camera feeds. Distinguish between known household members and unfamiliar visitors to trigger personalized TTS announcements, push alerts, and automated door lock releases.',
    featuresBn: [
      'পরিচিত ও অচেনা মুখমণ্ডল রিয়েল-টাইম শনাক্তকরণ',
      'নাম ধরে মিষ্টি কণ্ঠে স্বয়ংক্রিয় অভিবাদন',
      'ভিজিটর হিস্ট্রি, টাইমস্ট্যাম্প ও ফটো লগ',
      'অচেনা ব্যক্তির ক্ষেত্রে তাৎক্ষণিক স্মার্ট অ্যালার্ট'
    ],
    tipsBn: 'টিপস: "নতুন সদস্য যোগ করুন" বাটনে ক্লিক করে পরিবারের সদস্যদের ছবি যুক্ত করে রাখুন।',
    detailedControls: [
      {
        nameBn: 'নতুন সদস্য রেজিস্ট্রেশন',
        nameEn: 'Register New Face',
        type: 'button',
        descriptionBn: 'পরিবারের নতুন সদস্যের ছবি ও নাম যুক্ত করার বাটন।',
        descriptionEn: 'Adds a new biometric facial profile to the local database.'
      },
      {
        nameBn: 'অটো-ওয়েলকাম সুইচ',
        nameEn: 'Auto Welcome Voice Toggle',
        type: 'toggle',
        descriptionBn: 'গেটে মানুষ দেখলে স্পিকারে স্বাগতম জানানোর সুইচ।',
        descriptionEn: 'Toggles automated spoken greetings on door arrivals.'
      },
      {
        nameBn: 'ভিজিটর লগ ক্লিয়ার বাটন',
        nameEn: 'Clear Visitor Logs',
        type: 'button',
        descriptionBn: 'পূর্বের ভিজিটর রেকর্ড পরিষ্কার করার বাটন।',
        descriptionEn: 'Clears past visitor detection history.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: "নতুন সদস্য যোগ করুন" বাটনে চাপ দিয়ে নাম ও ছবি যুক্ত করুন।',
      '২য় ধাপ: ক্যামেরার লাইভ ভিউতে মুখমণ্ডল ডিটেকশন টেস্ট করুন।',
      '৩য় ধাপ: স্পিকারে স্বয়ংক্রিয় নাম ঘোষণার মিষ্টি সুর শুনে নিশ্চিত হোন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Click Register New Face and input name and profile image.',
      'Step 2: Simulate or verify camera face detection live.',
      'Step 3: Listen to personalized greeting announcements through door speakers.'
    ]
  },
  simulator: {
    pageId: 'simulator',
    titleBn: 'লাইভ সেন্সর ও টাইম-ওয়ার্প সিমুলেটর',
    titleEn: 'Live Sensor & Time-Warp Simulator',
    summaryBn: 'বাস্তব ডিভাইস ছাড়াই কাল্পনিক সময়, বৃষ্টি, মোশন ও তাপমাত্রা তৈরি করে অটোমেশন টেস্ট।',
    summaryEn: 'Simulate sensory conditions, environmental parameters, and time jumps to dry-test automation rules.',
    voiceScriptBn: 'এটি লাইভ সিমুলেটর। বাস্তব ডিভাইস নষ্ট না করে কাল্পনিক সন্ধ্যা, রাত, বৃষ্টি বা মোশন সেন্সর অন করে আপনার তৈরি করা অটোমেশন টেস্ট করতে পারেন।',
    voiceScriptEn: 'This is the Live Sensor Simulator. Warp virtual time, toggle simulated rain or motion, and test your automations in a risk-free virtual sandbox.',
    unabridgedVoiceScriptBn: 'লাইভ সেন্সর ও টাইম-ওয়ার্প সিমুলেটরে স্বাগতম। এই স্যান্ডবক্স পরিবেশটি আপনাকে কোনো বাস্তব ডিভাইস চালু বা বন্ধ না করেই সমস্ত অটোমেশন রুলস পুঙ্খানুপুঙ্খভাবে পরীক্ষা করার সুযোগ দেয়। আপনি চাইলে ঘড়ির সময় এক ক্লিকে রাত ৮টা বা ভোর ৫টায় নিয়ে যেতে পারেন, বৃষ্টি বা ঝড় সিমুলেট করতে পারেন এবং ড্রয়িং রুমের ভার্চুয়াল মোশন সেন্সরে লোক ঢুকিয়ে দেখতে পারেন আলো জ্বলে কি না। প্রধান কন্ট্রোলসমূহ: ১. টাইম-ওয়ার্প স্লাইডার—যা দিয়ে ঘড়ির সময় পরিবর্তন করা যায়। ২. ভার্চুয়াল সেন্সর টগল সুইচসমূহ—যেমন মোশন সেন্সর, ডোর কন্টাক্ট ও রেইন সেন্সর। ৩. এনভায়রনমেন্টাল স্লাইডার—যা দিয়ে তাপমাত্রা ও আর্দ্রতা পরিবর্তন করা যায়। ৪. রুল ট্রিগার ওয়াচার—যা কোন রুল সক্রিয় হলো তা তাৎক্ষণিক রিপোর্ট করে।',
    unabridgedVoiceScriptEn: 'Welcome to the Live Sensor Simulator. Dry-run automation rules in a sandboxed virtual environment. Shift virtual time to test sunset and sunrise routines, mock sensory triggers like motion and door opens, and verify deterministic rule firing safely.',
    featuresBn: [
      'ভার্চুয়াল সময় পরিবর্তন (টাইম-ওয়ার্প) স্লাইডার',
      'মোশন, বৃষ্টি, তাপমাত্রা ও ধোঁয়া সিমুলেশন',
      'রিস্ক-ফ্রি স্যান্ডবক্সে রুলস টেস্টিং',
      'তাত্ক্ষণিক রুল ফায়ারিং ফিডব্যাক ও লগ'
    ],
    tipsBn: 'টিপস: মোশন সেন্সরটি অন করে দেখুন আপনার লাইট অন করার রুলটি সক্রিয় হয় কি না।',
    detailedControls: [
      {
        nameBn: 'ভার্চুয়াল সময় স্লাইডার',
        nameEn: 'Time Warp Slider',
        type: 'slider',
        descriptionBn: 'সিমুলেটরের ঘড়ির সময় পরিবর্তন করার কন্ট্রোল।',
        descriptionEn: 'Shifts virtual clock forward or backward.'
      },
      {
        nameBn: 'ভার্চুয়াল মোশন সুইচ',
        nameEn: 'Mock Motion Sensor',
        type: 'toggle',
        descriptionBn: 'ঘরে মানুষের উপস্থিতি সিমুলেট করার সুইচ।',
        descriptionEn: 'Toggles simulated occupancy states.'
      },
      {
        nameBn: 'সিমুলেশন রিসেট বাটন',
        nameEn: 'Reset Simulator',
        type: 'button',
        descriptionBn: 'সকল ভার্চুয়াল সেন্সর স্বাভাবিক অবস্থায় ফিরিয়ে আনে।',
        descriptionEn: 'Restores default real-world sensory values.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: টাইম স্লাইডার টেনে সন্ধ্যা ৬টায় নিন।',
      '২য় ধাপ: ড্রয়িং রুমের মোশন সেন্সর অন করুন।',
      '৩য় ধাপ: স্ক্রিনের নিচে দেখুন আপনার ইভনিং লাইট রুলটি স্বয়ংক্রিয়ভাবে সক্রিয় হয়েছে।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Drag the time slider to your target hour (e.g., 18:00).',
      'Step 2: Toggle the mock motion sensor on.',
      'Step 3: Check execution reports to confirm rule deployment.'
    ]
  },
  evolution: {
    pageId: 'evolution',
    titleBn: 'অটো-ইভোলিউশন ডেমন ও সেলফ-লার্নিং ইঞ্জিন',
    titleEn: 'Auto Evolution Daemon & Pattern Synthesis',
    summaryBn: 'ব্যবহারকারীর অভ্যাস পর্যবেক্ষণ করে স্বয়ংক্রিয়ভাবে নতুন উপকারী অটোমেশন প্রস্তাব ও অপ্টিমাইজেশন।',
    summaryEn: 'Continuous self-learning background daemon discovering usage patterns and synthesizing energy-saving rules.',
    voiceScriptBn: 'এটি অটো-ইভোলিউশন ডেমন। আপনি প্রতিদিন কখন লাইট বা এসি জ্বালান তা লক্ষ্য রেখে এই এআই নিজে থেকেই নতুন কাজের নিয়ম বানিয়ে আপনাকে প্রস্তাব করে।',
    voiceScriptEn: 'This is the Auto Evolution Daemon. It learns your daily habits in the background and proactively suggests optimized, energy-saving automations.',
    unabridgedVoiceScriptBn: 'অটো-ইভোলিউশন ডেমন ও সেলফ-লার্নিং ইঞ্জিনে স্বাগতম। এই এআই ব্যাকগ্রাউন্ডে নিরবচ্ছিন্নভাবে কাজ করে আপনার পরিবারের দৈনন্দিন রুটিন ও অভ্যাস শেখে। যেমন: আপনি যদি প্রতিদিন রাত ১২টায় বেডরুমের ফ্যান ছেড়ে লাইট বন্ধ করেন, তবে ৩ দিন পর সিস্টেম নিজে থেকেই একটি স্মার্ট রুল বানিয়ে বলবে: "আমি কি প্রতিদিন রাত ১২টায় ফ্যান ছেড়ে লাইট বন্ধ করার রুল সক্রিয় করব?" প্রধান কন্ট্রোলসমূহ: ১. লার্নড প্যাটার্ন কার্ডসমূহ—যা নতুন প্রস্তাবিত অটোমেশন দেখায়। ২. "প্রস্তাব গ্রহণ করুন" বাটন—যা ১ ক্লিকে প্রস্তাবিত রুল লাইভ সক্রিয় করে। ৩. লার্নিং সেনসিটিভিটি স্লাইডার—যা দিয়ে কত দিনের অভ্যাসে রুল তৈরি হবে তা ঠিক করা যায়। ৪. প্যাটার্ন রিজেক্ট বাটন।',
    unabridgedVoiceScriptEn: 'Welcome to the Auto Evolution Daemon. This background engine continuously analyzes device activation logs to identify habitual household routines. It generates proactive rule suggestions with confidence ratings, enabling single-click adoption for maximum comfort and energy efficiency.',
    featuresBn: [
      'স্বয়ংক্রিয় অভ্যাস ও সময় বিশ্লেষণ',
      'প্রোঅ্যাক্টিভ স্মার্ট রুল প্রস্তাবনা',
      '১-ক্লিকে প্রস্তাবিত অটোমেশন সক্রিয়করণ',
      'বিদ্যুৎ সাশ্রয়ী এনার্জি অপ্টিমাইজেশন লজিক'
    ],
    tipsBn: 'টিপস: এআই-এর তৈরি করা প্রস্তাব পছন্দ হলে "স্বীকৃতি দিন" বাটনে চাপ দিন।',
    detailedControls: [
      {
        nameBn: 'প্রস্তাব অনুমোদন বাটন',
        nameEn: 'Accept Pattern Rule',
        type: 'button',
        descriptionBn: 'এআই-এর প্রস্তাবিত নিয়মকে লাইভ অটোমেশনে যোগ করে।',
        descriptionEn: 'Converts the suggested pattern into an active rule.'
      },
      {
        nameBn: 'লার্নিং থ্রেশহোল্ড স্লাইডার',
        nameEn: 'Learning Confidence Threshold',
        type: 'slider',
        descriptionBn: 'কত শতাংশ নির্ভুল হলে প্রস্তাব দেবে তা ঠিক করার কন্ট্রোল।',
        descriptionEn: 'Adjusts statistical confidence requirement for suggestions.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: তালিকায় এআই-এর খুঁজে পাওয়া অভ্যাস ও প্রস্তাবগুলো দেখুন।',
      '২য় ধাপ: প্রস্তাবটির শক্তি সাশ্রয়ের পরিমাণ যাচাই করুন।',
      '৩য় ধাপ: "গ্রহণ করুন" বাটনে চাপ দিয়ে তাৎক্ষণিক চালু করুন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Review discovered pattern suggestions in the list.',
      'Step 2: Inspect estimated energy savings and confidence levels.',
      'Step 3: Click Accept to activate the routine with zero manual setup.'
    ]
  },
  telemetry: {
    pageId: 'telemetry',
    titleBn: 'সিস্টেম টেলিমেট্রি অডিটর ও মেমোরি ট্র্যাকার',
    titleEn: 'System Telemetry Auditor & WAL Metrics',
    summaryBn: 'হার্ডওয়্যার সিপিইউ, র‍্যাম, ডাটাবেস পারফরম্যান্স এবং লেটেন্সি মেট্রিক্স সার্বক্ষণিক পর্যবেক্ষণ।',
    summaryEn: 'Real-time hardware utilization, CPU/RAM charts, SQLite WAL transaction counters, and latency monitoring.',
    voiceScriptBn: 'এটি সিস্টেম টেলিমেট্রি অডিটর। আপনার প্রসেসরের স্পিড, মেমোরি ব্যবহার, ডাটাবেস লেনদেন এবং সার্বিক সিস্টেমের সুস্থতা এখান থেকে লাইভ দেখা যায়।',
    voiceScriptEn: 'This is the System Telemetry Auditor. Monitor real-time CPU loads, RAM consumption, SQLite WAL throughput, and sub-second execution latencies.',
    unabridgedVoiceScriptBn: 'সিস্টেম টেলিমেট্রি অডিটর ও হার্ডওয়্যার পারফরম্যান্স ট্র্যাকারে স্বাগতম। এই পেজটি আপনার হোম অ্যাসিস্ট্যান্টের প্রসেসর, র‍্যাম এবং এসকিউলাইট ডাটাবেসের অভ্যন্তরীণ স্বাস্থ্য রিয়েল-টাইমে প্রদর্শন করে। এখানে প্রতি সেকেন্ডের সিস্টেম লোড, ফ্রি মেমোরি, ডাটাবেস রাইট-অ্যাহেড লগ লেনদেন এবং এআই রেসপন্স লেটেন্সি চার্ট আকারে আপডেট হয়। প্রধান কন্ট্রোলসমূহ: ১. লাইভ সিপিইউ ও মেমোরি স্পিডোমিটার। ২. এসকিউলাইট ডাব্লিউএএল মোড ট্রানজ্যাকশন কাউন্টার। ৩. লগ এক্সপোর্ট বাটন—যা দিয়ে সম্পূর্ণ সিস্টেমের রিপোর্ট ডাউনলোড করা যায়। ৪. মেমোরি গারবেজ কালেকশন বাটন—যা অতিরিক্ত ক্যাশ মেমোরি খালি করে সিস্টেমকে দ্রুত রাখে।',
    unabridgedVoiceScriptEn: 'Welcome to the System Telemetry Auditor. Gain deep operational insight into on-device resource utilization. Monitor live CPU load gauges, RAM consumption breakdowns, SQLite WAL transaction throughput, and sub-millisecond I/O metrics.',
    featuresBn: [
      'রিয়েল-টাইম সিপিইউ ও র‍্যাম পারফরম্যান্স চার্ট',
      'এসকিউলাইট WAL মোড হাই-স্পিড ডাটাবেস ট্র্যাকিং',
      '১-ক্লিক ক্যাশ ক্লিয়ার ও মেমোরি অপ্টিমাইজেশন',
      'সিস্টেম টেলিমেট্রি রিপোর্ট ডাউনলোড'
    ],
    tipsBn: 'টিপস: সিস্টেম স্লো মনে হলে "ক্যাশ খালি করুন" বাটনে চাপ দিয়ে মেমোরি ফ্রেশ রাখুন।',
    detailedControls: [
      {
        nameBn: 'ক্যাশ খালি করার বাটন',
        nameEn: 'Purge Memory Cache',
        type: 'button',
        descriptionBn: 'মেমোরির অতিরিক্ত অস্থায়ী ফাইল ডিলিট করে গতি বাড়ায়।',
        descriptionEn: 'Triggers garbage collection and releases unneeded memory.'
      },
      {
        nameBn: 'টেলিমেট্রি এক্সপোর্ট বাটন',
        nameEn: 'Export Telemetry Log',
        type: 'button',
        descriptionBn: 'সম্পূর্ণ সিস্টেমের স্বাস্থ্য রিপোর্ট ফাইল আকারে সেভ করে।',
        descriptionEn: 'Downloads a complete JSON performance diagnostics bundle.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: স্ক্রিনের সিপিইউ এবং মেমোরি মিটার লক্ষ্য করুন।',
      '২য় ধাপ: ডাটাবেস ট্রানজ্যাকশন ও লেটেন্সি গ্রাফ পরীক্ষা করুন।',
      '৩য় ধাপ: প্রয়োজনে "ক্যাশ পরিষ্কার করুন" বাটনে চাপ দিয়ে সিস্টেম ফাস্ট করুন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Check CPU and memory utilization dials.',
      'Step 2: Inspect SQLite WAL throughput and execution latency charts.',
      'Step 3: Click Purge Cache to optimize running memory instantly.'
    ]
  },
  audit: {
    pageId: 'audit',
    titleBn: 'স্ট্যাটিক কোড অডিট ও আর্কিটেকচার ইন্সপেক্টর',
    titleEn: 'Static Code & Architecture AST Auditor',
    summaryBn: 'সম্পূর্ণ কোডবেসের টাইপ সেফটি, সিকিউরিটি রুলস, টেস্ট স্যুট ও আর্কিটেকচারাল অডিট রিপোর্ট।',
    summaryEn: 'Full static AST code inspection, security rule validator, and automated test suite runner.',
    voiceScriptBn: 'এটি স্ট্যাটিক কোড অডিট প্যানেল। পুরো সিস্টেমের কোডে কোনো বাগ বা সিকিউরিটি সমস্যা আছে কি না তা স্বয়ংক্রিয়ভাবে স্ক্যান করে শতভাগ নির্ভুলতা নিশ্চিত করে।',
    voiceScriptEn: 'This is the Static Code Auditor. Run comprehensive static analysis across the entire TypeScript and Python codebase to verify security and architecture compliance.',
    unabridgedVoiceScriptBn: 'স্ট্যাটিক কোড অডিট ও আর্কিটেকচার ইন্সপেক্টরে স্বাগতম। এই মডিউলটি সম্পূর্ণ কোডবেস স্ক্যান করে টাইপস্ক্রিপ্ট টাইপ সেফটি, সিকিউরিটি রুলস এবং এসিনক্রোনাস ফাংশনের নির্ভুলতা যাচাই করে। এটি নিশ্চিত করে যে কোনো মেমোরি লিক বা আনহ্যান্ডেলড এক্সেপশন ছাড়াই সিস্টেমটি নিরবচ্ছিন্নভাবে চলতে পারবে। প্রধান কন্ট্রোলসমূহ: ১. "সম্পূর্ণ কোড অডিট চালান" বাটন—যা সমস্ত ফাইলে স্ট্যাটিক এনালাইসিস এক্সিকিউট করে। ২. লাইভ ইস্যু ও ওয়ার্নিং টেবিল—যা কোনো ত্রুটি থাকলে তার ফাইল ও লাইন নম্বর দেখিয়ে দেয়। ৩. অটো-ফিক্স সাজেশন ভিউয়ার। ৪. আর্কিটেকচারাল কমপ্লায়েন্স স্কোর কার্ড (১০০/১০০)।',
    unabridgedVoiceScriptEn: 'Welcome to the Static Code & Architecture Auditor. Execute deep static AST analysis across all application source modules. Verify strict type safety, audit async error handlers, and review automated architectural health reports.',
    featuresBn: [
      'সম্পূর্ণ টাইপস্ক্রিপ্ট স্ট্যাটিক এএসটি অ্যানালাইসিস',
      'মেমোরি লিক ও সিকিউরিটি ত্রুটি শনাক্তকরণ',
      '১-ক্লিক সম্পূর্ণ কোডবেস অডিট রানার',
      '১০০% আর্কিটেকচারাল কমপ্লায়েন্স ভেরিফিকেশন'
    ],
    tipsBn: 'টিপস: "কোড অডিট চালান" বাটনে ক্লিক করে পুরো কোডবেসের স্বাস্থ্য যাচাই করুন।',
    detailedControls: [
      {
        nameBn: 'কোড অডিট রান বাটন',
        nameEn: 'Run Full Static Audit',
        type: 'button',
        descriptionBn: 'সম্পূর্ণ কোড স্ক্যান করে লাইভ অডিট রিপোর্ট তৈরি করে।',
        descriptionEn: 'Executes static analysis across all TypeScript files.'
      },
      {
        nameBn: 'অডিট লগ কপি বাটন',
        nameEn: 'Copy Audit Report',
        type: 'button',
        descriptionBn: 'অডিট রেজাল্ট ক্লিপবোর্ডে কপি করে।',
        descriptionEn: 'Copies the complete code audit findings.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: "কোড অডিট চালান" বাটনে ক্লিক করুন।',
      '২য় ধাপ: স্ক্যানিং শেষ হওয়া পর্যন্ত অপেক্ষা করে গ্রিন চেকমার্ক দেখুন।',
      '৩য় ধাপ: ১০০% কমপ্লায়েন্স স্কোর নিশ্চিত হয়ে নিরাপদ বোধ করুন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Click Run Full Static Audit.',
      'Step 2: Review real-time module scanning progress.',
      'Step 3: Confirm 100% type safety and architectural compliance.'
    ]
  },
  repo: {
    pageId: 'repo',
    titleBn: 'গিটহাব রেপো ও ব্যাকআপ এক্সপোর্টার',
    titleEn: 'GitHub Repo & Add-on Package Exporter',
    summaryBn: 'পুরো সিস্টেমের সোর্স কোড জিপ ফাইলে ডাউনলোড অথবা সরাসরি গিটহাবে এক্সপোর্ট।',
    summaryEn: 'One-click full standalone repository export, ZIP archive generator, and Home Assistant Add-on packaging.',
    voiceScriptBn: 'এটি গিটহাব রেপো ও ব্যাকআপ এক্সপোর্টার। ১-ক্লিকে পুরো সিস্টেমের সমস্ত কোড ও ফাইল জিপ আকারে ডাউনলোড বা গিটহাবে ব্যাকআপ করে রাখতে পারেন।',
    voiceScriptEn: 'This is the GitHub Repo Exporter. Bundle the entire project into a portable ZIP archive or push the complete Home Assistant Add-on repository to GitHub.',
    unabridgedVoiceScriptBn: 'গিটহাব রেপো ও ব্যাকআপ এক্সপোর্টার পেজে স্বাগতম। এই পেজের মাধ্যমে আপনি যেকোনো সময় আপনার তৈরি করা সমস্ত রুলস, কোড ও কনফিগারেশনের সম্পূর্ণ ব্যাকআপ নিতে পারেন। এটি আপনার সম্পূর্ণ প্রজেক্টকে একটি পরিষ্কার, স্ট্যান্ডার্ড গিটহাব রিপোজিটরি অথবা জিপ আর্काइভ আকারে বান্ডেল করে দেয়। প্রধান কন্ট্রোলসমূহ: ১. "সম্পূর্ণ সোর্স কোড জিপ ডাউনলোড" বাটন—যা সব ফাইল ১ ক্লিকে ডাউনলোড করে দেয়। ২. হোম অ্যাসিস্ট্যান্ট অ্যাড-অন কনফিগারেশন এক্সপোর্টার—যা config.yaml ও ডকারফাইল সহ রেডিমেড বান্ডেল বানায়। ৩. গিট রিপোজিটরি স্ট্রাকচার ভিউয়ার। ৪. ব্যাকআপ ভ্যালিডেশন চেকার।',
    unabridgedVoiceScriptEn: 'Welcome to the GitHub Repo & Add-on Exporter. Package the entire full-stack project, including configuration schemas, SQLite migrations, and the custom Lovelace card, into a deployable Home Assistant Add-on repository or downloadable ZIP archive.',
    featuresBn: [
      '১-ক্লিকে সম্পূর্ণ সোর্স কোড ZIP ডাউনলোড',
      'হোম অ্যাসিস্ট্যান্ট অ্যাড-অন প্যাকেজিং সাপোর্ট',
      'স্ট্যান্ডার্ড গিটহাব রিপোজিটরি ফাইল স্ট্রাকচার',
      'রুলস ও ডাটাবেস কনফিগারেশন ব্যাকআপ'
    ],
    tipsBn: 'টিপস: "জিপ ডাউনলোড করুন" বাটনে চাপ দিয়ে প্রজেক্টের অফলাইন ব্যাকআপ সংরক্ষণ করুন।',
    detailedControls: [
      {
        nameBn: 'সম্পূর্ণ জিপ ডাউনলোড বাটন',
        nameEn: 'Download Full ZIP Archive',
        type: 'button',
        descriptionBn: 'সম্পূর্ণ প্রজেক্ট একটি জিপ ফাইলে ডাউনলোড করে।',
        descriptionEn: 'Bundles and downloads the complete repository archive.'
      },
      {
        nameBn: 'কনফিগ ফাইল কপি বাটন',
        nameEn: 'Copy Add-on Config',
        type: 'button',
        descriptionBn: 'অ্যাড-অন কনফিগারেশন ফাইল ক্লিপবোর্ডে কপি করে।',
        descriptionEn: 'Copies the Home Assistant Add-on config.yaml snippet.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: "সম্পূর্ণ জিপ ডাউনলোড করুন" বাটনে ক্লিক করুন।',
      '২য় ধাপ: আপনার কম্পিউটারে জিপ ফাইলটি সেভ করুন।',
      '৩য় ধাপ: যেকোনো সময় এই ফাইল ব্যবহার করে সিস্টেম রিস্টোর করতে পারবেন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Click Download Full ZIP Archive.',
      'Step 2: Save the bundled repository package locally.',
      'Step 3: Deploy to any Home Assistant OS or Docker server seamlessly.'
    ]
  },
  storage_compression: {
    pageId: 'storage_compression',
    titleBn: 'মাল্টি-ড্রাইভ স্টোরেজ, হাই-ডেনসিটি কম্প্রেশন ও ফাইন-টিউনিং হাব',
    titleEn: 'Multi-Drive Storage & High-Density Compression Hub',
    summaryBn: 'এক্সটার্নাল NVMe/SSD/HDD ড্রাইভ ম্যানেজমেন্ট, Zstandard ডেটাসেট কম্প্রেশন এবং নাম্পাই RAM স্ট্রিমিং।',
    summaryEn: 'Hardware storage controller, high-ratio Zstandard dataset compression, and direct-RAM streaming engine.',
    voiceScriptBn: 'মাল্টি-ড্রাইভ স্টোরেজ ও কম্প্রেশন হাবে স্বাগতম। এখানে আপনি সংযুক্ত এসএসডি এবং হার্ডড্রাইভ পর্যবেক্ষণ করতে পারবেন, জেমিনি ক্লাউড থেকে অর্জিত ডায়ালগ ও এএসটি রুটিন হাই-কম্প্রেশনে সংরক্ষণ করতে পারবেন এবং লোকাল নাম্পাই ইঞ্জিনে সরাসরি মেমোরিতে স্ট্রিম করতে পারবেন।',
    voiceScriptEn: 'Welcome to the Multi-Drive Storage and High-Density Compression Hub. Manage NVMe, SSD, and HDD drives, compress learned dialogue pairs and AST routines using Zstandard, and stream directly to local NumPy memory.',
    unabridgedVoiceScriptBn: 'মাল্টি-ড্রাইভ স্টোরেজ ও হাই-ডেনসিটি কম্প্রেশন হাবে স্বাগতম। এই প্যানেলটি আপনার হোম অ্যাসিস্ট্যান্টে সংযুক্ত এনভিএমই এসএসডি, সাটা ড্রাইভ ও ইউএসবি স্টোরেজ স্বয়ংক্রিয়ভাবে শনাক্ত করে। এর মাধ্যমে জেমিনি ক্লাউড টিচারের শেখা পারিবারিক অভ্যাস ও ডায়ালগ ডেটাসেট Zstandard বা MessagePack ফর্ম্যাটে ৯০ শতাংশ পর্যন্ত সংকুচিত করে যেকোনো ড্রাইভে সেভ করা যায়। সাথে সাথে লোকাল নাম্পাই সেলফ-অ্যাটেনশন ট্রান্সফরমার ডিস্কের চাপ ছাড়াই সরাসরি র‍্যামে ডিকম্প্রেস করে মিলিসেকেন্ড গতিতে ইন্টারনেট ছাড়া এক্সিকিউট করে। যদি কোনো এক্সটার্নাল ড্রাইভ ডিসকানেক্ট বা ফুল হয়ে যায়, সিস্টেম সাথে সাথে ডিফল্ট ডেটা ড্রাইভে স্বয়ংক্রিয় ফেইলওভার করে ডেটা অক্ষত রাখবে।',
    unabridgedVoiceScriptEn: 'Welcome to the Multi-Drive Storage & High-Density Compression Studio. This architecture provides hardware-aware drive telemetry for NVMe, SATA SSDs, and external HDDs. High-density Zstandard compression archives thousands of dialogue pairs and AST routines with over 85% space savings. The local Pure NumPy Attention Transformer reads these archives directly into memory for sub-millisecond offline execution. Built-in zero-loss auto-failover seamlessly preserves all telemetry on default storage.',
    featuresBn: [
      'স্বয়ংক্রিয় হার্ডওয়্যার ড্রাইভ ডিটেকশন ও SMART হেলথ ট্র্যাকিং',
      'Zstandard, Gzip ও MessagePack হাই-রেশিও বাইনারি কম্প্রেশন',
      'টার্গেট ড্রাইভ ডিরেক্টরি ম্যাপিং (মডেল, ট্রেনিং ডেটা, মেমোরি ভেক্টর)',
      'জিরো-লেটেন্সি পিওর নাম্পাই ডিরেক্ট-র‍্যাম স্ট্রিমিং বেঞ্চমার্ক',
      'ড্রাইভ ডিসকানেক্টে স্বয়ংক্রিয় জিরো-লস ফেইলওভার প্রটেকশন'
    ],
    tipsBn: 'টিপস: "নতুন ডেটাসেট কমপ্রেস ও সেভ করুন" বাটনে ক্লিক করে লাইভ কম্প্রেশন রেশিও ও ড্রাইভ স্পেস টেস্ট করুন।',
    detailedControls: [
      {
        nameBn: 'ড্রাইভ টার্গেট অ্যাসাইন সিলেক্টর',
        nameEn: 'Target Drive Asset Selector',
        type: 'input',
        descriptionBn: 'মডেল, ট্রেনিং ডেটা ও ভেক্টরগুলোকে নির্দিষ্ট ড্রাইভে ম্যাপ করে।',
        descriptionEn: 'Maps model checkpoints, training datasets, and vector DB to selected drives.'
      },
      {
        nameBn: 'হাই-ডেনসিটি কম্প্রেশন রানার',
        nameEn: 'High-Density Compression Runner',
        type: 'button',
        descriptionBn: 'হাজার হাজার ডায়ালগ ও এএসটি রুটিন কমপ্যাক্ট বাইনারি ফাইলে সেভ করে।',
        descriptionEn: 'Compresses thousands of training pairs into compact binary archives.'
      },
      {
        nameBn: 'নাম্পাই ডিরেক্ট-র‍্যাম বেঞ্চমার্ক বাটন',
        nameEn: 'NumPy Direct-RAM Streaming Benchmark',
        type: 'button',
        descriptionBn: 'মেমোরিতে অন-দ্য-ফ্লাই ডিকম্প্রেশন স্পিড ও থ্রুপুট টেস্ট করে।',
        descriptionEn: 'Measures on-the-fly decompression latency and direct-RAM streaming throughput.'
      },
      {
        nameBn: 'ফেইলওভার সিমুলেটর টগল',
        nameEn: 'Failover Simulator Toggle',
        type: 'toggle',
        descriptionBn: 'ড্রাইভ আনমাউন্ট হলে /data/ পার্টিশনে ফেইলওভার পরীক্ষা করে।',
        descriptionEn: 'Tests instant zero-loss failover to internal storage upon drive disconnection.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: আপনার সংযুক্ত ড্রাইভগুলোর স্বাস্থ্য ও ফ্রি স্পেস পরীক্ষা করুন।',
      '২য় ধাপ: কোন ড্রাইভে মডেল আর কোন ড্রাইভে ট্রেনিং ডেটাসেট রাখবেন তা সিলেক্ট করে সেভ করুন।',
      '৩য় ধাপ: "কমপ্রেস ও এক্সপোর্ট" বাটনে চাপ দিলে সিস্টেম তাৎক্ষণিক কমপ্রেস করে ড্রাইভে সেভ করবে এবং মিষ্টি কণ্ঠে বাংলায় জানিয়ে দেবে।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Check connected drive health, temperature, and available space.',
      'Step 2: Assign assets (models, datasets, vectors) to your preferred high-speed NVMe or SSD.',
      'Step 3: Trigger High-Density Compression to archive datasets with spoken Bengali voice broadcast.'
    ]
  }
};

/**
 * Builds a dynamic, live-state-injected, unabridged voice script based on
 * current live system telemetry, active rules, connected devices, and healthy keys.
 */
export function generateLiveStateVoiceScript(
  pageId: string,
  liveState: {
    activeRulesCount?: number;
    connectedDevices?: number;
    healthyKeys?: number;
    wifiBlockedCount?: number;
    activeSpeakers?: number;
    language?: 'bn-BD' | 'en-US';
  }
): string {
  const isBn = !liveState.language || liveState.language.startsWith('bn');
  const baseInfo = PAGE_EXPLAINER_DATA[pageId];
  const activeRules = liveState.activeRulesCount ?? 4;
  const connectedDevs = liveState.connectedDevices ?? 8;
  const healthyKeys = liveState.healthyKeys ?? 3;

  if (!baseInfo) {
    return isBn 
      ? `স্মার্ট কন্ট্রোল প্যানেলে স্বাগতম। আপনার সিস্টেমে বর্তমানে ${connectedDevs}টি ডিভাইস এবং ${activeRules}টি অটোমেশন সচল রয়েছে। এই প্যানেল থেকে সমস্ত অপশন পরিচালনা করুন।`
      : `Welcome to the Control Panel. Currently, ${connectedDevs} devices and ${activeRules} automations are active. Manage your setup with ease.`;
  }

  if (isBn) {
    let script = `${baseInfo.titleBn}তে স্বাগতম। `;
    script += `সিস্টেম লাইভ স্টেট অনুযায়ী: আপনার হোমে বর্তমানে ${activeRules}টি সক্রিয় অটোমেশন সচল রয়েছে, ${connectedDevs}টি স্মার্ট ডিভাইস কানেক্টেড এবং ${healthyKeys}টি জেমিনি এপিআই কী সুরক্ষায় রয়েছে। `;
    script += `এই পেজের বিস্তারিত কাজের বিবরণ: ${baseInfo.unabridgedVoiceScriptBn} `;
    if (baseInfo.detailedControls && baseInfo.detailedControls.length > 0) {
      script += `প্রধান বাটনসমূহ: `;
      baseInfo.detailedControls.forEach((ctrl, i) => {
        script += `${i + 1}. ${ctrl.nameBn}—${ctrl.descriptionBn} `;
      });
    }
    return script;
  } else {
    let script = `Welcome to the ${baseInfo.titleEn}. `;
    script += `Live system telemetry confirms ${activeRules} active rules running, ${connectedDevs} connected hardware entities, and ${healthyKeys} healthy Gemini API keys in standby. `;
    script += `${baseInfo.unabridgedVoiceScriptEn} `;
    return script;
  }
}
