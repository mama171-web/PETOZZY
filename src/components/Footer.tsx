import React from 'react';
import { Heart, GraduationCap } from 'lucide-react';
import { Language, PageId } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PetozzyLogo } from './PetozzyLogo';
import { LegalTabId } from '../pages/LegalPage';

interface FooterProps {
  currentLang: Language;
  onNavigate: (page: PageId) => void;
  onOpenLegal: (tab: LegalTabId) => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onNavigate,
  onOpenLegal,
}) => {
  const t = TRANSLATIONS[currentLang];

  const madeWithText =
    currentLang === 'pt'
      ? { prefix: 'Feito com', suffix: 'para quem ama cães e gatos' }
      : currentLang === 'es'
        ? { prefix: 'Hecho con', suffix: 'para amantes de perros y gatos' }
        : { prefix: 'Fet amb', suffix: 'per a amants dels gossos i gats' };

  return (
    <footer className="bg-[#17284E] text-slate-300 border-t border-[#03045E]">
      {/* Compulsory Academic Banner (Highlighted) */}
      <div className="bg-[#03045E] border-b border-[#17284E] py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 text-center text-xs text-amber-200 font-bold">
          <GraduationCap className="w-4 h-4 shrink-0 text-amber-300" />
          <p>{t.footer.academicNotice}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-10 border-b border-[#2E4868]">
          {/* Petozzy Logo and Brand presentation */}
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-13 h-13 rounded-2xl bg-[#EBF2FF] flex items-center justify-center overflow-hidden border border-[#C3D1E2] shrink-0">
              <PetozzyLogo size="sm" showText={false} />
            </div>
            <div>
              <span className="text-xl font-black tracking-widest text-white uppercase">
                PETOZZY
              </span>
              <p className="text-xs text-[#C3D1E2] font-medium max-w-xs">
                {t.footer.tagline}
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-[#C3D1E2]">
            <button
              type="button"
              onClick={() => onNavigate('inici')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.home}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('cataleg')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.catalog}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('seguiment')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.tracking}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('blog')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.blog}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('qui-som')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.about}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contacte')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.contact}
            </button>
          </nav>

          {/* Dedicated Legal Page Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-[#C3D1E2]">
            <button
              type="button"
              onClick={() => onOpenLegal('avis')}
              className="hover:text-white underline underline-offset-4 cursor-pointer"
            >
              {t.footer.legalNotice}
            </button>
            <span className="text-slate-500">·</span>
            <button
              type="button"
              onClick={() => onOpenLegal('privacitat')}
              className="hover:text-white underline underline-offset-4 cursor-pointer"
            >
              {t.footer.privacyPolicy}
            </button>
            <span className="text-slate-500">·</span>
            <button
              type="button"
              onClick={() => onOpenLegal('cookies')}
              className="hover:text-white underline underline-offset-4 cursor-pointer"
            >
              {t.footer.cookiePolicy}
            </button>
            <span className="text-slate-500">·</span>
            <button
              type="button"
              onClick={() => onOpenLegal('garantia')}
              className="hover:text-white underline underline-offset-4 cursor-pointer"
            >
              {t.footer.warranty}
            </button>
          </div>
        </div>

        {/* Bottom copyright & heartwarming message */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#C3D1E2]/80 gap-3">
          <p>{t.footer.rights} · Versió 1.5 (24/11/2026)</p>
          <p className="flex items-center gap-1.5">
            <span>{madeWithText.prefix}</span>
            <Heart className="w-3.5 h-3.5 text-pink-300 fill-pink-300" />
            <span>{madeWithText.suffix}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
