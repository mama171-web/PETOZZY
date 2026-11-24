import React, { useState } from 'react';
import { Eye, Upload, CheckCircle2, Star, ChevronDown, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Language, PageId, CartItem } from '../types';
import { TRANSLATIONS, PASTEL_COLORS, PET_MUG_PRODUCTS } from '../data/translations';
import { FAQS_LIST, TESTIMONIALS_LIST } from '../data/content';
import { Hero } from '../components/Hero';

interface HomePageProps {
  currentLang: Language;
  onNavigate: (page: PageId) => void;
  onAddToCart: (item: CartItem) => void;
  onSelectForCustomizer: (petName: string, colorId: string, photoUrl: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentLang,
  onNavigate,
  onAddToCart,
  onSelectForCustomizer,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [openFaqId, setOpenFaqId] = useState<string>(FAQS_LIST[0].id);

  return (
    <div>
      {/* 1. Emotional Hero */}
      <Hero currentLang={currentLang} onNavigate={onNavigate} />

      {/* 2. Visual Digital Preview Guarantee Block (#C3D1E2 Atmospheric Card) */}
      <section className="py-16 lg:py-20 bg-white border-b border-[#C3D1E2]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EDF2F8] rounded-3xl p-8 sm:p-12 border border-[#C3D1E2]">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-wider text-[#3B5B82] mb-2">
                {t.previewGuarantee.kicker}
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E324B] tracking-tight mb-3 text-balance">
                {t.previewGuarantee.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                {t.previewGuarantee.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-2xl p-6 border border-[#C3D1E2]/70 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#C3D1E2]/50 text-[#1E324B] flex items-center justify-center mb-4">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1E324B] mb-2">
                  {t.previewGuarantee.step1Title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {t.previewGuarantee.step1Desc}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#C3D1E2]/70 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#C3D1E2]/50 text-[#1E324B] flex items-center justify-center mb-4">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1E324B] mb-2">
                  {t.previewGuarantee.step2Title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {t.previewGuarantee.step2Desc}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#C3D1E2]/70 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1E324B] mb-2">
                  {t.previewGuarantee.step3Title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {t.previewGuarantee.step3Desc}
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => onNavigate('personalitzador')}
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#8E759E] hover:bg-[#7A5F8A] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm transition-all cursor-pointer"
              >
                <span>{t.previewGuarantee.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Collection Teaser (Links to dedicated Catalog Page) */}
      <section className="py-16 lg:py-20 bg-[#F7F9FC] border-b border-[#C3D1E2]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#3B5B82] mb-1">
                {t.catalog.kicker}
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E324B]">
                {t.catalog.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('cataleg')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#243B53] hover:underline cursor-pointer shrink-0"
            >
              <span>{t.hero.ctaSecondary}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PET_MUG_PRODUCTS.map((prod) => {
              const colorObj = PASTEL_COLORS.find((c) => c.id === prod.defaultColorId) || PASTEL_COLORS[0];
              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl p-4 border border-[#C3D1E2]/70 shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-4/3 mb-3 bg-slate-100">
                    <img
                      src={prod.image}
                      alt={prod.title[currentLang]}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-[#1E324B]">Tassa {prod.petName}</h3>
                    <span className="text-sm font-extrabold text-[#243B53] font-mono tabular-nums">
                      {prod.price.toFixed(2)} €
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block border border-black/10"
                      style={{ backgroundColor: colorObj.hex }}
                    />
                    <span>{colorObj.name[currentLang]}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelectForCustomizer(prod.petName, colorObj.id, prod.image)}
                    className="mt-auto w-full py-2.5 px-4 text-xs font-bold text-[#1E324B] bg-[#EDF2F8] hover:bg-[#C3D1E2]/70 rounded-full transition-colors cursor-pointer"
                  >
                    {t.catalog.customizeYours}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Real Testimonials & Visual Customer Gallery */}
      <section className="py-16 lg:py-20 bg-white border-b border-[#C3D1E2]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[#3B5B82] mb-2">
              {t.testimonials.kicker}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E324B] mb-3 text-balance">
              {t.testimonials.title}
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              {t.testimonials.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS_LIST.map((item) => (
              <div
                key={item.id}
                className="bg-[#F7F9FC] rounded-3xl border border-[#C3D1E2]/70 overflow-hidden flex flex-col"
              >
                <div className="h-56 overflow-hidden bg-[#EDF2F8]">
                  <img
                    src={item.image}
                    alt={`${item.customerName} i la seva mascota ${item.petName}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium mb-4 flex-1">
                    “{item.quote[currentLang]}”
                  </p>
                  <div className="pt-4 border-t border-[#C3D1E2]/60 text-xs">
                    <p className="font-bold text-[#1E324B]">
                      {item.customerName} · <span className="text-[#3B5B82]">{item.petName}</span>
                    </p>
                    <p className="text-slate-500 mt-0.5">
                      {item.city} · {item.outcome[currentLang]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQs Accordion + Quick Navigation to Order Tracking & Legal Blog */}
      <section className="py-16 lg:py-20 bg-[#EDF2F8]/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[#3B5B82] mb-2">
              {t.faqs.kicker}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E324B] mb-3">
              {t.faqs.title}
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              {t.faqs.subtitle}
            </p>
          </div>

          <div className="space-y-3 mb-12">
            {FAQS_LIST.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-[#C3D1E2] overflow-hidden shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-[#1E324B] hover:bg-[#F7F9FC] transition-colors cursor-pointer"
                  >
                    <span>{faq.question[currentLang]}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#3B5B82] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3">
                      {faq.answer[currentLang]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct conversion & trust shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onNavigate('seguiment')}
              className="p-5 bg-white hover:bg-[#F7F9FC] rounded-2xl border border-[#C3D1E2] flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C3D1E2]/50 text-[#1E324B] flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1E324B]">{t.tracking.title}</p>
                  <p className="text-xs text-slate-500">PTZ-1042 · Consulta en temps real</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#3B5B82]" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('blog')}
              className="p-5 bg-white hover:bg-[#F7F9FC] rounded-2xl border border-[#C3D1E2] flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C3D1E2]/50 text-[#1E324B] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1E324B]">{t.blog.title}</p>
                  <p className="text-xs text-slate-500">{t.blog.kicker}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#3B5B82]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
