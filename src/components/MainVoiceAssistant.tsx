import React from 'react';
import { MainVoiceBrainLanding } from './MainVoiceBrainLanding';

/**
 * MainVoiceAssistant: Home Assistant Ingress-optimized Autonomous Voice Interface
 * Provides full-duplex live Bengali/English multimodal Gemini streaming,
 * dynamic X-Ingress-Path handling, and cross-platform AudioContext resumption.
 */
export const MainVoiceAssistant: React.FC<{
  onTabChange?: (tab: string) => void;
  ingressPath?: string;
}> = (props) => {
  return <MainVoiceBrainLanding {...props} />;
};

export default MainVoiceAssistant;
