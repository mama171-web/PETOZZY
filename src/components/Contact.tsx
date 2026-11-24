import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Language, ContactFormData } from '../types';
import { TRANSLATIONS, PASTEL_COLORS } from '../data/translations';
import { PetozzyLogo } from './PetozzyLogo';

interface ContactProps {
  currentLang: Language;
}

export const Contact: React.FC<ContactProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    petName: '',
    selectedColorId: 'blau-cel',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('https://formspree.io/f/mqpqwwap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          petName: formData.petName,
          selectedColor: formData.selectedColorId,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Error submitting form to Formspree:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      petName: '',
      selectedColorId: 'blau-cel',
      message: '',
    });
    setSubmitted(false);
  };

  return (
    <section className="py-12 lg:py-20 bg-[#F7F9FC] min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-wider text-[#3B5B82] mb-2">
            {t.contact.kicker}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E324B] tracking-tight mb-4">
            {t.contact.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Vila-Seca, Tarragona & info@petozzy.intern */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#C3D1E2] p-6 rounded-3xl border border-[#AEBFD4] shadow-xs flex items-center gap-4">
              <div className="bg-[#EBF2FF] p-1 rounded-2xl shadow-xs border border-[#AEBFD4] overflow-hidden shrink-0">
                <PetozzyLogo size="md" showText={false} />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-wider text-[#1E324B] uppercase">
                  PETOZZY
                </h2>
                <p className="text-xs font-bold text-[#243B53]">
                  {t.customizer.guaranteeNote}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#C3D1E2] flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#EDF2F8] text-[#1E324B] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E324B] mb-1">
                  {t.contact.officeTitle}
                </h3>
                <p className="text-xs text-slate-600 font-semibold">
                  {t.contact.officeAddress}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#C3D1E2] flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#EDF2F8] text-[#1E324B] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E324B] mb-1">Email</h3>
                <a
                  href={`mailto:${t.contact.emailSupport}`}
                  className="text-xs font-bold text-[#243B53] hover:underline"
                >
                  {t.contact.emailSupport}
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#C3D1E2] flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#EDF2F8] text-[#1E324B] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E324B] mb-1">
                  {currentLang === 'pt' ? 'WhatsApp / Atendimento' : 'Telèfon / Atenció'}
                </h3>
                <p className="text-xs font-bold text-slate-700 font-mono">
                  {t.contact.phoneSupport}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#C3D1E2] shadow-sm">
            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#1E324B]">
                  {t.contact.successTitle}
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto font-medium">
                  {t.contact.successDesc}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2.5 text-xs font-bold text-[#1E324B] bg-[#EDF2F8] border border-[#C3D1E2] rounded-full hover:bg-[#C3D1E2]/60 transition-colors cursor-pointer"
                  >
                    Enviar un altre missatge
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.contact.formName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Maria Rovira"
                      className="w-full px-4 py-2.5 text-sm rounded-2xl border border-[#C3D1E2] focus:outline-none focus:ring-2 focus:ring-[#243B53] bg-[#F7F9FC] font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.contact.formEmail} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nom@exemple.com"
                      className="w-full px-4 py-2.5 text-sm rounded-2xl border border-[#C3D1E2] focus:outline-none focus:ring-2 focus:ring-[#243B53] bg-[#F7F9FC] font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.contact.formPetName}
                    </label>
                    <input
                      type="text"
                      value={formData.petName}
                      onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                      placeholder="Ex: Toby, Luna, Max..."
                      className="w-full px-4 py-2.5 text-sm rounded-2xl border border-[#C3D1E2] focus:outline-none focus:ring-2 focus:ring-[#243B53] bg-[#F7F9FC] font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.contact.formColor}
                    </label>
                    <select
                      value={formData.selectedColorId}
                      onChange={(e) => setFormData({ ...formData, selectedColorId: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-2xl border border-[#C3D1E2] focus:outline-none focus:ring-2 focus:ring-[#243B53] bg-[#F7F9FC] font-medium cursor-pointer"
                    >
                      {PASTEL_COLORS.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.name[currentLang]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.contact.formMessage}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.contact.formPlaceholder}
                    className="w-full px-4 py-2.5 text-sm rounded-2xl border border-[#C3D1E2] focus:outline-none focus:ring-2 focus:ring-[#243B53] bg-[#F7F9FC] font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#243B53] hover:bg-[#1E324B] disabled:bg-slate-400 text-white text-sm font-bold rounded-full shadow-md transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>{t.contact.sendingBtn}</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#C3D1E2]" />
                      <span>{t.contact.sendBtn}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
