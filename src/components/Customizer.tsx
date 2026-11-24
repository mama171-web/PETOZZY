import React, { useState, useRef, useEffect } from 'react';
import { Upload, Check, ShoppingBag, Eye } from 'lucide-react';
import { Language, PastelColor, CartItem } from '../types';
import { TRANSLATIONS, PASTEL_COLORS } from '../data/translations';
import { MugVisualPreview } from './MugVisualPreview';

interface CustomizerProps {
  currentLang: Language;
  onAddToCart: (item: CartItem) => void;
  presetPetName?: string;
  presetColorId?: string;
  presetPhotoUrl?: string;
}

const PRESET_PET_PHOTOS = [
  {
    name: 'Buddy',
    photo: '/src/assets/images/mug_buddy_golden_1794328863250.jpg',
  },
  {
    name: 'Luna',
    photo: '/src/assets/images/mug_luna_kitten_1794328863214.jpg',
  },
  {
    name: 'Rocky',
    photo: '/src/assets/images/mug_rocky_frenchie_1794328864159.jpg',
  },
  {
    name: 'Daisy',
    photo: '/src/assets/images/mug_daisy_cat_1794328864383.jpg',
  },
];

export const Customizer: React.FC<CustomizerProps> = ({
  currentLang,
  onAddToCart,
  presetPetName = 'Buddy',
  presetColorId = 'blau-cel',
  presetPhotoUrl,
}) => {
  const t = TRANSLATIONS[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [petName, setPetName] = useState<string>(presetPetName);
  const [selectedColor, setSelectedColor] = useState<PastelColor>(
    PASTEL_COLORS.find((c) => c.id === presetColorId) || PASTEL_COLORS[0]
  );
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(presetPhotoUrl || null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setPetName(presetPetName);
    const foundColor = PASTEL_COLORS.find((c) => c.id === presetColorId);
    if (foundColor) setSelectedColor(foundColor);
    if (presetPhotoUrl) setUploadedPhotoUrl(presetPhotoUrl);
  }, [presetPetName, presetColorId, presetPhotoUrl]);

  const activePhoto = uploadedPhotoUrl || PRESET_PET_PHOTOS[selectedPresetIndex].photo;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setUploadedPhotoUrl(url);
    }
  };

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setUploadedPhotoUrl(null);
    setPetName(PRESET_PET_PHOTOS[idx].name);
  };

  const handleAddToCart = () => {
    onAddToCart({
      cartId: `custom-${selectedColor.id}-${Date.now()}`,
      productId: 'tassa-personalitzada',
      title: `Tassa ${petName || 'Mascota'} (${selectedColor.name[currentLang]})`,
      price: 15.90,
      interiorColor: selectedColor,
      petName: petName.trim() || 'Mascota',
      photoUrl: activePhoto,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const exampleLabel =
    currentLang === 'pt'
      ? 'Ou experimente com uma das nossas fotos de exemplo:'
      : currentLang === 'es'
        ? 'O prueba con una de nuestras fotos de ejemplo:'
        : 'O prova amb una de les nostres fotos d’exemple:';

  const uploadedLabel =
    currentLang === 'pt'
      ? 'Foto enviada (clique para trocar)'
      : currentLang === 'es'
        ? 'Foto cargada (haz clic para cambiar)'
        : 'Foto carregada (fes clic per canviar)';

  return (
    <section className="py-12 lg:py-20 bg-[#F7F9FC] min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#3B5B82] mb-2">
            {t.customizer.kicker}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E324B] tracking-tight mb-3 text-balance">
            {t.customizer.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            {t.customizer.subtitle}
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Photo */}
            <div className="bg-white p-6 rounded-3xl border border-[#C3D1E2] shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#1E324B] uppercase tracking-wider">
                {t.customizer.uploadTitle}
              </h2>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full flex items-center justify-center gap-2.5 py-4 px-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                  uploadedPhotoUrl
                    ? 'border-[#243B53] bg-[#EDF2F8] text-[#1E324B] font-bold'
                    : 'border-[#C3D1E2] hover:border-[#243B53] hover:bg-[#F7F9FC] text-slate-700 font-semibold'
                }`}
              >
                <Upload className="w-4 h-4 text-[#3B5B82]" />
                <span className="text-xs">
                  {uploadedPhotoUrl ? uploadedLabel : t.customizer.uploadBtn}
                </span>
              </button>

              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">
                  {exampleLabel}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_PET_PHOTOS.map((pet, idx) => {
                    const isSelected = !uploadedPhotoUrl && selectedPresetIndex === idx;
                    return (
                      <button
                        key={pet.name}
                        type="button"
                        onClick={() => handleSelectPreset(idx)}
                        className={`flex items-center gap-2 p-2 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#243B53] bg-[#EDF2F8] text-[#1E324B] font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img
                          src={pet.photo}
                          alt={pet.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs truncate">{pet.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2: Name */}
            <div className="bg-white p-6 rounded-3xl border border-[#C3D1E2] shadow-xs">
              <h2 className="text-sm font-bold text-[#1E324B] uppercase tracking-wider mb-3">
                {t.customizer.nameTitle}
              </h2>
              <input
                type="text"
                maxLength={20}
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder={t.customizer.namePlaceholder}
                className="w-full px-4 py-3 text-base rounded-2xl border border-[#C3D1E2] focus:outline-none focus:ring-2 focus:ring-[#243B53] font-bold text-[#1E324B] bg-[#F7F9FC]"
              />
            </div>

            {/* Step 3: Pastel Interior */}
            <div className="bg-white p-6 rounded-3xl border border-[#C3D1E2] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[#1E324B] uppercase tracking-wider">
                  {t.customizer.colorTitle}
                </h2>
                <span className="text-xs font-bold text-[#3B5B82]">
                  {selectedColor.name[currentLang]}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {PASTEL_COLORS.map((col) => {
                  const isSelected = selectedColor.id === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#243B53] bg-[#EDF2F8] text-[#1E324B] ring-1 ring-[#243B53]'
                          : 'border-slate-200 hover:border-[#C3D1E2] text-slate-700 bg-white'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name[currentLang]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Preview Stage (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-[#C3D1E2] shadow-lg shadow-[#C3D1E2]/30">
              <div className="text-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B5B82]">
                  {t.customizer.previewTitle}
                </span>
              </div>

              <MugVisualPreview
                photoUrl={activePhoto}
                petName={petName}
                interiorColor={selectedColor}
                colorLabel={selectedColor.name[currentLang]}
                size="lg"
              />

              {/* Digital Preview Guarantee Box */}
              <div className="mt-4 p-3 rounded-2xl bg-[#EDF2F8] border border-[#C3D1E2] flex items-start gap-2.5 text-[11px] text-[#1E324B] font-medium">
                <Eye className="w-4 h-4 text-[#3B5B82] shrink-0 mt-0.5" />
                <span>{t.customizer.guaranteeNote}</span>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {t.customizer.priceNotice}
                  </span>
                  <span className="text-lg font-extrabold text-[#1E324B] font-mono tabular-nums">
                    15,90 €
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#8E759E] hover:bg-[#7A5F8A] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>{t.catalog.addedToCart}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#C3D1E2]" />
                      <span>{t.customizer.addToCartBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side 5 Interior Color Visual Comparator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C3D1E2] shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#1E324B]">
              {t.customizer.compareTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              {t.customizer.compareSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {PASTEL_COLORS.map((col) => {
              const isSelected = selectedColor.id === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setSelectedColor(col)}
                  className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EDF2F8] border-[#243B53] ring-1 ring-[#243B53] shadow-xs'
                      : 'bg-[#F7F9FC] border-[#C3D1E2]/70 hover:bg-white'
                  }`}
                >
                  <MugVisualPreview
                    photoUrl={activePhoto}
                    petName={petName}
                    interiorColor={col}
                    colorLabel={col.name[currentLang]}
                    size="mini"
                  />
                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="text-xs font-bold text-[#1E324B]">
                      {col.name[currentLang]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
