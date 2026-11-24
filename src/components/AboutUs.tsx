import React from 'react';
import { Coffee, ShieldCheck, Leaf, HeartHandshake, Recycle } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PetozzyLogo } from './PetozzyLogo';

interface AboutUsProps {
  currentLang: Language;
}

const ODS_ICONS = [Recycle, HeartHandshake, Leaf];

export const AboutUs: React.FC<AboutUsProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];

  const logoCaption =
    currentLang === 'pt'
      ? 'Café quentinho, patinhas de carinho e tons suaves.'
      : currentLang === 'es'
        ? 'Café caliente, huellitas de cariño y tonos suaves.'
        : 'Cafè calent, petjades d’estimació i tons suaus.';

  const commitmentBar =
    currentLang === 'pt'
      ? 'Cerâmica segura UE 1935/2004 · Trabalho local digno · Prévia digital garantida'
      : currentLang === 'es'
        ? 'Cerámica segura UE 1935/2004 · Trabajo local digno · Previsualización garantizada'
        : 'Ceràmica segura UE 1935/2004 · Treball local digne · Previsualització garantida';

  return (
    <section className="py-12 lg:py-18 bg-[#F7F9FC] min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Compact Visual Story Block */}
        <div>
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#3B5B82] mb-2">
              {t.about.kicker}
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E324B] tracking-tight text-balance">
              {t.about.title}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Official High-Resolution Logo Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative">
                <div className="w-72 sm:w-80 bg-[#EBF2FF] rounded-3xl p-6 border border-[#C3D1E2] shadow-md flex flex-col items-center justify-center text-center">
                  <PetozzyLogo size="xl" showText={false} />
                  <p className="mt-3 text-xs font-bold text-[#1E324B] max-w-[220px]">
                    {logoCaption}
                  </p>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-[#C3D1E2] text-xs font-bold text-[#1E324B] flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#3B5B82]" />
                  <span>Vila-Seca, Tarragona</span>
                </div>
              </div>
            </div>

            {/* Scannable Highlights & Visual KPIs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-[#C3D1E2] shadow-xs space-y-3">
                <p className="text-base sm:text-lg text-[#1E324B] font-extrabold leading-snug">
                  {t.about.p1}
                </p>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {t.about.p2}
                </p>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {t.about.p3}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white rounded-2xl border border-[#C3D1E2] shadow-xs">
                  <p className="text-xl sm:text-2xl font-extrabold text-[#1E324B] font-mono tabular-nums">
                    {t.about.stat1}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">
                    {t.about.stat1Label}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#C3D1E2] shadow-xs">
                  <p className="text-xl sm:text-2xl font-extrabold text-[#3B5B82] font-mono tabular-nums">
                    {t.about.stat2}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">
                    {t.about.stat2Label}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#C3D1E2] shadow-xs">
                  <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
                    {t.about.stat3}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">
                    {t.about.stat3Label}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EDF2F8] border border-[#C3D1E2] flex items-center gap-3 text-xs text-[#1E324B] font-semibold">
                <ShieldCheck className="w-5 h-5 text-[#243B53] shrink-0" />
                <span>{commitmentBar}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual 3-Pillar Agenda 2030 & Progressive Ethical Commitment */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C3D1E2] shadow-xs">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-[#3B5B82] mb-1.5">
              {t.about.odsKicker}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E324B] tracking-tight mb-2.5 text-balance">
              {t.about.odsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {t.about.odsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.about.odsItems.map((item, idx) => {
              const IconComp = ODS_ICONS[idx % ODS_ICONS.length];
              return (
                <div
                  key={item.code + idx}
                  className="p-6 rounded-2xl bg-[#F7F9FC] border border-[#C3D1E2]/80 flex flex-col items-center text-center hover:bg-[#EDF2F8]/60 transition-colors"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#C3D1E2]/65 text-[#1E324B] flex items-center justify-center mb-4 shadow-xs">
                    <IconComp className="w-7 h-7" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#3B5B82] mb-1">
                    {item.code}
                  </p>
                  <h3 className="text-base font-extrabold text-[#1E324B] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
