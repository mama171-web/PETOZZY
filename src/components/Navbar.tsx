import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Globe,
  Menu,
  X,
  ChevronDown,
  Home,
  Coffee,
  Wand2,
  Truck,
  BookOpen,
  HeartHandshake,
  Mail,
  CreditCard,
  Scale,
} from 'lucide-react';
import { Language, CartItem, PageId } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PetozzyLogo } from './PetozzyLogo';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activePage,
  onNavigate,
  cartItems,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);

  const optionsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[currentLang];
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setOptionsMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navTabs: { id: PageId; label: string }[] = [
    { id: 'inici', label: t.nav.home },
    { id: 'cataleg', label: t.nav.catalog },
    { id: 'seguiment', label: t.nav.tracking },
    { id: 'blog', label: t.nav.blog },
    { id: 'qui-som', label: t.nav.about },
    { id: 'contacte', label: t.nav.contact },
  ];

  const optionsLabel =
    currentLang === 'pt' ? 'Opções' : currentLang === 'es' ? 'Opciones' : 'Opcions';

  const allTabOptions: {
    id: PageId;
    label: string;
    desc: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      id: 'inici',
      label: t.nav.home,
      desc:
        currentLang === 'pt'
          ? 'Capa, garantia de prévia e avaliações'
          : currentLang === 'es'
            ? 'Portada, garantía previa y opiniones'
            : 'Portada, garantia de vista prèvia i opinions',
      icon: Home,
    },
    {
      id: 'cataleg',
      label: t.nav.catalog,
      desc:
        currentLang === 'pt'
          ? 'Canecas com pets reais e 5 cores pastel'
          : currentLang === 'es'
            ? 'Tazas con mascotas reales y 5 colores pastel'
            : 'Tasses amb mascotes reals i 5 colors pastel',
      icon: Coffee,
    },
    {
      id: 'personalitzador',
      label:
        currentLang === 'pt'
          ? 'Personalizador'
          : currentLang === 'es'
            ? 'Personalizador'
            : 'Personalitzador',
      desc:
        currentLang === 'pt'
          ? 'Envie a foto e compare os 5 interiores'
          : currentLang === 'es'
            ? 'Sube tu foto y compara los 5 interiores'
            : 'Puja la foto i compara els 5 interiors',
      icon: Wand2,
    },
    {
      id: 'seguiment',
      label: t.nav.tracking,
      desc:
        currentLang === 'pt'
          ? 'Acompanhamento ao vivo e aprovação digital'
          : currentLang === 'es'
            ? 'Seguimiento en tiempo real y aprobación'
            : 'Seguiment en temps real i aprovació digital',
      icon: Truck,
    },
    {
      id: 'sheet-tracking',
      label: 'SheetDB Seguiment (API Externa)',
      desc: 'Seguiment connectat directament a Google Sheets via SheetDB',
      icon: Truck,
    },
    {
      id: 'blog',
      label: t.nav.blog,
      desc:
        currentLang === 'pt'
          ? 'Cerâmica artesanal e bem-estar animal'
          : currentLang === 'es'
            ? 'Cerámica artesanal y bienestar animal'
            : 'Ceràmica artesanal i benestar animal',
      icon: BookOpen,
    },
    {
      id: 'qui-som',
      label: t.nav.about,
      desc:
        currentLang === 'pt'
          ? 'História da marca e Agenda 2030 (ODS)'
          : currentLang === 'es'
            ? 'Historia de marca y Agenda 2030 (ODS)'
            : 'Història de marca i Agenda 2030 (ODS)',
      icon: HeartHandshake,
    },
    {
      id: 'contacte',
      label: t.nav.contact,
      desc:
        currentLang === 'pt'
          ? 'Ateliê em Vila-Seca e atendimento direto'
          : currentLang === 'es'
            ? 'Taller en Vila-Seca y consulta directa'
            : 'Taller a Vila-Seca i atenció directa',
      icon: Mail,
    },
    {
      id: 'checkout',
      label:
        currentLang === 'pt'
          ? 'Pagamento Seguro'
          : currentLang === 'es'
            ? 'Pago y Checkout'
            : 'Pagament i Checkout',
      desc:
        currentLang === 'pt'
          ? 'Cartão, Pix/Bizum, transferência e entrega'
          : currentLang === 'es'
            ? 'Tarjeta, Bizum/Pix, transferencia y entrega'
            : 'Targeta, Bizum/Pix, transferència i lliurament',
      icon: CreditCard,
    },
    {
      id: 'legal',
      label:
        currentLang === 'pt'
          ? 'Legal & Garantia'
          : currentLang === 'es'
            ? 'Legal y Garantía'
            : 'Legal i Garantia',
      desc:
        currentLang === 'pt'
          ? 'Aviso legal, privacidade, cookies e garantia'
          : currentLang === 'es'
            ? 'Aviso legal, privacidad, cookies y garantía'
            : 'Avís legal, privacitat, cookies i garantia',
      icon: Scale,
    },
  ];

  const languages: { code: Language; label: string; flag: string; country: string }[] = [
    { code: 'ca', label: 'Català', flag: 'CA', country: 'Catalunya' },
    { code: 'pt', label: 'Português', flag: 'BR', country: 'Brasil' },
    { code: 'es', label: 'Español', flag: 'ES', country: 'España' },
  ];

  const handleNavClick = (id: PageId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setOptionsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#C3D1E2]/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[76px] sm:min-h-[88px] py-2 gap-4 xl:gap-6">
          {/* Zone 1: Prominent Official Petozzy Brand Mark */}
          <button
            type="button"
            onClick={() => handleNavClick('inici')}
            className="group flex items-center gap-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#243B53] rounded-2xl p-1 shrink-0 cursor-pointer"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#EBF2FF] flex items-center justify-center border border-[#C3D1E2] overflow-hidden shadow-xs group-hover:scale-105 transition-transform">
              <PetozzyLogo size="header" showText={false} />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-[0.16em] text-[#1E324B] uppercase whitespace-nowrap shrink-0">
              PETOZZY
            </span>
          </button>

          {/* Zone 2: Clean Single-Line Navigation Links + All-Tabs Options Dropdown */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-semibold text-slate-600">
            {navTabs.map((tab) => {
              const isActive = activePage === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleNavClick(tab.id)}
                  className={`relative py-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#1E324B] font-bold'
                      : 'text-slate-600 hover:text-[#1E324B]'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#243B53] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Dedicated Options Tab showing every single page/tab */}
            <div className="relative" ref={optionsRef}>
              <button
                type="button"
                onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  optionsMenuOpen
                    ? 'bg-[#243B53] text-white border-[#243B53]'
                    : 'bg-[#EDF2F8] text-[#1E324B] border-[#C3D1E2] hover:bg-[#C3D1E2]/55'
                }`}
                aria-expanded={optionsMenuOpen}
              >
                <span>{optionsLabel}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    optionsMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {optionsMenuOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#C3D1E2] p-3 z-50">
                  <div className="px-3 py-2 border-b border-[#C3D1E2]/50 mb-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#3B5B82]">
                      {optionsLabel} · Petozzy
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-1 max-h-[70vh] overflow-y-auto">
                    {allTabOptions.map((opt) => {
                      const IconComp = opt.icon;
                      const isCurrent = activePage === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleNavClick(opt.id)}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-[#EDF2F8] text-[#1E324B] font-bold'
                              : 'hover:bg-[#F7F9FC] text-slate-700'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isCurrent
                                ? 'bg-[#243B53] text-white'
                                : 'bg-[#EDF2F8] text-[#3B5B82]'
                            }`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#1E324B] truncate">
                              {opt.label}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate font-medium">
                              {opt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Language Selector + Primary Cart Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#1E324B] bg-[#EDF2F8] hover:bg-[#C3D1E2]/60 rounded-full border border-[#C3D1E2] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                aria-label="Seleccionar idioma"
              >
                <Globe className="w-3.5 h-3.5 text-[#3B5B82]" />
                <span className="uppercase text-[11px] tracking-wider">
                  {currentLang === 'pt' ? 'PT-BR' : currentLang.toUpperCase()}
                </span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-[#C3D1E2]/70 py-1.5 z-50 text-xs">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors cursor-pointer ${
                        currentLang === lang.code
                          ? 'bg-[#EDF2F8] text-[#1E324B] font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{lang.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{lang.country}</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        {lang.flag}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onOpenCart}
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#243B53] hover:bg-[#1E324B] rounded-full shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
              aria-label="Obrir carret"
            >
              <ShoppingBag className="w-4 h-4 text-[#C3D1E2]" />
              <span className="hidden sm:inline">{t.nav.cart}</span>
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[11px] font-bold text-[#1E324B] bg-[#C3D1E2] rounded-full tabular-nums">
                {totalCartCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#1E324B] bg-[#EDF2F8] hover:bg-[#C3D1E2]/60 rounded-full border border-[#C3D1E2]"
              aria-label="Menú i opcions"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="hidden xs:inline">{optionsLabel}</span>
            </button>
          </div>
        </div>

        {/* Mobile Full Options & Tabs Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 px-1 border-t border-[#C3D1E2]/50 grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[70vh] overflow-y-auto">
            {allTabOptions.map((tab) => {
              const IconComp = tab.icon;
              const isCurrent = activePage === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleNavClick(tab.id)}
                  className={`w-full flex items-center gap-3 text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                    isCurrent
                      ? 'bg-[#C3D1E2]/55 text-[#1E324B]'
                      : 'text-slate-700 hover:bg-[#EDF2F8]'
                  }`}
                >
                  <IconComp className="w-4 h-4 text-[#3B5B82] shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate">{tab.label}</p>
                    <p className="text-[10px] font-medium text-slate-500 truncate">{tab.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
