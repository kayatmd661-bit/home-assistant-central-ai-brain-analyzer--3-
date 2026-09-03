import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DeviceFormFactor, PlatformEnvironment, HAEnvironmentContextType } from '../types';

const HAEnvironmentContext = createContext<HAEnvironmentContextType | undefined>(undefined);

export const HAEnvironmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [viewportHeight, setViewportHeight] = useState<number>(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );
  const [touchEnabled, setTouchEnabled] = useState<boolean>(false);
  const [isHAAddon, setIsHAAddon] = useState<boolean>(false);
  const [isIngress, setIsIngress] = useState<boolean>(false);
  const [isCompanionApp, setIsCompanionApp] = useState<boolean>(false);
  const [platform, setPlatform] = useState<PlatformEnvironment>('STANDALONE_WEB');
  const [formFactor, setFormFactor] = useState<DeviceFormFactor>('DESKTOP');
  const [theme, setTheme] = useState<'dark' | 'light' | 'auto'>('dark');
  const [haThemeVariables, setHaThemeVariables] = useState<Record<string, string>>({});
  const [ingressPath, setIngressPath] = useState<string>('');

  // 1. DEVICE & ENVIRONMENT BRAIN AUDIT
  const performEnvironmentAudit = () => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    setViewportWidth(width);
    setViewportHeight(height);

    // Touch support detection
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setTouchEnabled(isTouch);

    // Form Factor Sensing
    const ua = navigator.userAgent || '';
    const isMobileUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTabletUA = /iPad|Tablet|PlayBook/i.test(ua) || (isTouch && width >= 768 && width <= 1024);

    let detectedFormFactor: DeviceFormFactor = 'DESKTOP';
    if (width < 768 || isMobileUA) {
      detectedFormFactor = 'MOBILE';
    } else if (width <= 1024 || isTabletUA) {
      detectedFormFactor = 'TABLET';
    } else {
      detectedFormFactor = 'DESKTOP';
    }
    setFormFactor(detectedFormFactor);

    // Platform Check (HA Ingress / Companion App / Standalone)
    const isIframe = window.self !== window.top;
    const urlParams = new URLSearchParams(window.location.search);
    const hasIngressParam = urlParams.get('ingress') === 'true' || window.location.pathname.includes('ingress');
    const isHAApp = /Home Assistant|HomeAssistant/i.test(ua);

    setIsCompanionApp(isHAApp);

    if (isIframe || hasIngressParam) {
      setIsHAAddon(true);
      setIsIngress(true);
      setPlatform('HA_INGRESS_ADDON');
      setIngressPath('/api/hassio_ingress/edge_ai_master_hub');
    } else if (isHAApp) {
      setIsHAAddon(true);
      setPlatform('HA_COMPANION_APP');
    } else {
      setPlatform('STANDALONE_WEB');
    }

    // Try reading Home Assistant CSS Variables from document
    syncWithHATheme();
  };

  // 2. THEME SYNC WITH HOME ASSISTANT
  const syncWithHATheme = () => {
    if (typeof window === 'undefined') return;

    try {
      const computed = window.getComputedStyle(document.documentElement);
      const primaryColor = computed.getPropertyValue('--primary-color').trim();
      const cardBg = computed.getPropertyValue('--card-background-color').trim() || computed.getPropertyValue('--ha-card-background').trim();
      const primaryText = computed.getPropertyValue('--primary-text-color').trim();
      const appHeaderBg = computed.getPropertyValue('--app-header-background-color').trim();

      const extracted: Record<string, string> = {};
      if (primaryColor) extracted['--primary-color'] = primaryColor;
      if (cardBg) extracted['--card-background-color'] = cardBg;
      if (primaryText) extracted['--primary-text-color'] = primaryText;
      if (appHeaderBg) extracted['--app-header-background-color'] = appHeaderBg;

      // Detect dark vs light mode from media query or HA attributes
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'dark'); // Default to high-contrast dark suite for cyber aesthetic

      if (Object.keys(extracted).length > 0) {
        setHaThemeVariables(extracted);
      }
    } catch {
      // Fallback safe
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    performEnvironmentAudit();

    // Fetch server-side HA environment info
    fetch('/api/ha/environment')
      .then(res => res.json())
      .then(data => {
        if (data?.environment?.isIngress) {
          setIsIngress(true);
          setIsHAAddon(true);
          setPlatform('HA_INGRESS_ADDON');
          if (data.environment.ingressPath) {
            setIngressPath(data.environment.ingressPath);
          }
        }
        if (data?.environment?.isHACompanionApp) {
          setIsCompanionApp(true);
        }
      })
      .catch(() => {});

    // Resize listener for responsive form factor changes
    const handleResize = () => {
      performEnvironmentAudit();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const isMobileOrTablet = formFactor === 'MOBILE' || formFactor === 'TABLET';
  const defaultMode = isMobileOrTablet ? 'QUICK_ACTIONS' : 'AUDIT_AND_CONFIG';

  return (
    <HAEnvironmentContext.Provider
      value={{
        isHAAddon,
        isIngress,
        isCompanionApp,
        platform,
        formFactor,
        isMobileOrTablet,
        theme,
        haThemeVariables,
        viewportWidth,
        viewportHeight,
        touchEnabled,
        defaultMode,
        ingressPath,
        syncWithHATheme,
        toggleTheme
      }}
    >
      {children}
    </HAEnvironmentContext.Provider>
  );
};

export const useHAEnvironment = (): HAEnvironmentContextType => {
  const context = useContext(HAEnvironmentContext);
  if (!context) {
    throw new Error('useHAEnvironment must be used within a HAEnvironmentProvider');
  }
  return context;
};
