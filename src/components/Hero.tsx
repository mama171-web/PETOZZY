import React, { useState } from 'react';
import { Heart, Eye, ShieldCheck, Sparkles } from 'lucide-react';
import { Language, PageId } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PetozzyLogo } from './PetozzyLogo';

interface HeroProps {
  currentLang: Language;
  onNavigate: (page: PageId) => void;
}

export const Hero: React.FC<HeroProps> = ({ currentLang, onNavigate }) => {
  const t = TRANSLATIONS[currentLang];
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#C3D1E2]/45 via-[#F4F7FB] to-white pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-[#C3D1E2]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            <p className="text-xs font-bold tracking-wider uppercase text-[#3B5B82] mb-4">
              {t.hero.badge}
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1E324B] leading-[1.15] text-balance mb-6">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8 font-medium">
              {t.hero.subtitle}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                type="button"
                onClick={() => onNavigate('personalitzador')}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-bold text-white bg-[#8E759E] hover:bg-[#7A5F8A] rounded-full shadow-md shadow-[#8E759E]/20 transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <span>{t.hero.ctaPrimary}</span>
                <Heart className="w-4 h-4 text-[#D3C7DE] fill-[#D3C7DE]" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('cataleg')}
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold text-[#1E324B] bg-white hover:bg-[#EDF2F8] rounded-full border border-[#C3D1E2] shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                {t.hero.ctaSecondary}
              </button>
            </div>

            {/* Trust Row */}
            <div className="pt-6 border-t border-[#C3D1E2]/70 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#3B5B82] shrink-0" />
                <span>{t.hero.trust1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3B5B82] shrink-0" />
                <span>{t.hero.trust2}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.hero.trust3}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-xl shadow-[#C3D1E2]/45 border border-[#C3D1E2]/80">
              {!imgError ? (
                <img
                  src="/src/assets/images/hero_petozzy_showcase_1794854515803.jpg"
                  alt="Col·lecció de tasses personalitzades Petozzy en tons pastel suaus"
                  className="w-full h-72 sm:h-96 lg:h-[400px] object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-80 bg-[#EBF2FF] rounded-2xl flex flex-col items-center justify-center p-8">
                  <PetozzyLogo size="lg" showText={false} />
                </div>
              )}

              {/* Bottom Caption Card */}
              <div className="mt-3 px-3 py-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#EBF2FF] border border-[#C3D1E2]/70 flex items-center justify-center overflow-hidden shrink-0">
                    <PetozzyLogo size="sm" showText={false} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E324B]">Charlie, Luna & Ollie · Ceràmica Artesanal</p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {t.customizer.guaranteeNote}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-[#243B53] font-mono tabular-nums whitespace-nowrap">
                  15,90 €
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
