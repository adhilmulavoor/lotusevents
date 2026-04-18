"use client";

import { useEffect, useState } from 'react';
import { Download, X, Smartphone, ShareIcon } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Check if already installed (standalone mode)
    const checkStandalone = () => {
      return (
        window.matchMedia('(display-mode: standalone)').matches || 
        (navigator as any).standalone === true ||
        document.referrer.includes('android-app://')
      );
    };

    const standalone = checkStandalone();
    setIsStandalone(standalone);
    if (standalone) return;

    // 2. Identify iOS devices
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // 3. Android / Chrome Install Prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if not already dismissed for this session
      const isDismissed = sessionStorage.getItem('pwa_install_dismissed');
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Special check for iOS (Safari)
    // iOS doesn't support 'beforeinstallprompt', so we show a custom guide
    if (isIOSDevice && !standalone) {
      const isDismissed = sessionStorage.getItem('pwa_install_dismissed');
      if (!isDismissed) {
        setTimeout(() => setIsVisible(true), 3000); // Show after 3 seconds
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Trigger native browser prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_install_dismissed', 'true');
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] md:hidden animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="bg-[#121212]/95 backdrop-blur-2xl border border-white/10 p-4 rounded-[2rem] shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-red-600 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <Smartphone className="text-white w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-white leading-none mb-1">Lotus Events</h4>
            <p className="text-[10px] text-gray-400">Install app for premium experience</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isIOS ? (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] font-medium text-gray-300">Tap</span>
              <div className="p-1 bg-blue-500/20 rounded">
                <ShareIcon className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-[10px] font-medium text-gray-300">then &apos;Add to Home Screen&apos;</span>
            </div>
          ) : (
            <button 
              onClick={handleInstallClick}
              className="bg-white text-black text-[11px] font-black px-5 py-2.5 rounded-xl uppercase tracking-wider hover:bg-emerald-400 transition-colors"
            >
              Install
            </button>
          )}
          
          <button 
            onClick={handleDismiss}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
