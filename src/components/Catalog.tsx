import React, { useState } from 'react';
import { ShoppingBag, Check, Wand2, Eye, Palette, X } from 'lucide-react';
import { Language, PastelColor, CartItem, PetMugProduct } from '../types';
import { TRANSLATIONS, PASTEL_COLORS, PET_MUG_PRODUCTS } from '../data/translations';
import { MugVisualPreview } from './MugVisualPreview';

interface CatalogProps {
  currentLang: Language;
  onAddToCart: (item: CartItem) => void;
  onSelectForCustomizer: (petName: string, colorId: string, photoUrl: string) => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  currentLang,
  onAddToCart,
  onSelectForCustomizer,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [selectedColors, setSelectedColors] = useState<Record<string, PastelColor>>({
    'tassa-buddy': PASTEL_COLORS[0],
    'tassa-luna': PASTEL_COLORS[1],
    'tassa-rocky': PASTEL_COLORS[4],
    'tassa-daisy': PASTEL_COLORS[3],
  });

  // Toggle between studio mug photo and live interior glaze preview per card
  const [interiorViewMap, setInteriorViewMap] = useState<Record<string, boolean>>({});
  // Active product inside the 5-color visual comparator modal
  const [comparingProduct, setComparingProduct] = useState<PetMugProduct | null>(null);
  const [addedItemKey, setAddedItemKey] = useState<string | null>(null);

  const handleColorChange = (productId: string, color: PastelColor) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
    // Switch card automatically to live interior preview so customer immediately sees the glaze change
    setInteriorViewMap((prev) => ({ ...prev, [productId]: true }));
  };

  const toggleCardView = (productId: string) => {
    setInteriorViewMap((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleAddProductToCart = (prod: PetMugProduct, overrideColor?: PastelColor) => {
    const currentColor = overrideColor || selectedColors[prod.id] || PASTEL_COLORS[0];
    onAddToCart({
      cartId: `${prod.id}-${currentColor.id}-${Date.now()}`,
      productId: prod.id,
      title: `${prod.title[currentLang]} (${currentColor.name[currentLang]})`,
      price: prod.price,
      interiorColor: currentColor,
      petName: prod.petName,
      photoUrl: prod.image,
      quantity: 1,
    });

    setAddedItemKey(prod.id);
    setTimeout(() => {
      setAddedItemKey(null);
    }, 1800);
  };

  const studioPhotoLabel =
    currentLang === 'pt'
      ? 'Ver foto real'
      : currentLang === 'es'
        ? 'Ver foto real'
        : 'Veure foto real';

  return (
    <section className="py-12 lg:py-20 bg-[#F7F9FC] min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-[#3B5B82] mb-2">
            {t.catalog.kicker}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E324B] tracking-tight mb-4 text-balance">
            {t.catalog.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            {t.catalog.subtitle}
          </p>
        </div>

        {/* Visual Preview Guarantee Reminder */}
        <div className="max-w-3xl mx-auto mb-12 p-4 rounded-2xl bg-[#EDF2F8] border border-[#C3D1E2] flex items-center justify-center gap-3 text-xs font-semibold text-[#1E324B]">
          <Eye className="w-4 h-4 text-[#3B5B82] shrink-0" />
          <span>{t.customizer.guaranteeNote}</span>
        </div>

        {/* 4 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PET_MUG_PRODUCTS.map((prod) => {
            const currentColor = selectedColors[prod.id] || PASTEL_COLORS[0];
            const isAdded = addedItemKey === prod.id;
            const showInteriorView = !!interiorViewMap[prod.id];

            return (
              <div
                key={prod.id}
                className="flex flex-col bg-white rounded-3xl border border-[#D3C7DE] p-4 shadow-xs hover:shadow-lg hover:shadow-[#D3C7DE]/40 transition-all duration-200 group"
              >
                {/* Interactive Image / Live Glaze Preview Switcher */}
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-[#F3E8E8]/50 mb-3 flex items-center justify-center">
                  {showInteriorView ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#F3E8E8]/40 to-white p-2">
                      <MugVisualPreview
                        photoUrl={prod.image}
                        petName={prod.petName}
                        interiorColor={currentColor}
                        colorLabel={currentColor.name[currentLang]}
                        size="md"
                      />
                    </div>
                  ) : (
                    <img
                      src={prod.image}
                      alt={prod.title[currentLang]}
                      className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>

                {/* Toggle Photo vs Interactive Interior Preview */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => toggleCardView(prod.id)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8E759E] hover:text-[#17284E] cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>
                      {showInteriorView ? studioPhotoLabel : t.catalog.interiorPreviewLabel}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setComparingProduct(prod)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#17284E] bg-[#F3E8E8]/60 hover:bg-[#F3E8E8] px-2.5 py-1 rounded-full border border-[#D3C7DE] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Palette className="w-3 h-3 text-[#8E759E]" />
                    <span>5 colors</span>
                  </button>
                </div>

                <div className="flex-1 flex flex-col">
                  {/* Unboxed quiet metadata */}
                  <p className="text-[11px] font-semibold text-[#8E759E] mb-1">
                    {prod.tag[currentLang]} · {prod.breed[currentLang]}
                  </p>

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-base font-bold text-[#17284E]">
                      Tassa {prod.petName}
                    </h2>
                    <span className="text-base font-extrabold text-[#8E759E] font-mono tabular-nums">
                      {prod.price.toFixed(2)} €
                    </span>
                  </div>

                  <p className="text-xs text-[#17284E]/80 line-clamp-2 mb-4 font-medium">
                    {prod.subtitle[currentLang]}
                  </p>

                  {/* Pastel Color Selector */}
                  <div className="mb-4 p-3 bg-[#F3E8E8]/30 rounded-2xl border border-[#D3C7DE]/60">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-[#17284E]/80">{t.catalog.interiorColor}</span>
                      <span className="font-bold text-[#17284E] text-[11px]">{currentColor.name[currentLang]}</span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      {PASTEL_COLORS.map((col) => {
                        const isSelected = currentColor.id === col.id;
                        return (
                          <button
                            key={col.id}
                            type="button"
                            onClick={() => handleColorChange(prod.id, col)}
                            className={`w-6 h-6 rounded-full transition-all cursor-pointer border border-black/10 ${
                              isSelected
                                ? 'scale-120 ring-2 ring-offset-2 ring-[#8E759E]'
                                : 'hover:scale-110 opacity-90'
                            }`}
                            style={{ backgroundColor: col.hex }}
                            title={col.name[currentLang]}
                            aria-label={col.name[currentLang]}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto space-y-2">
                    <button
                      type="button"
                      onClick={() => handleAddProductToCart(prod)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#8E759E] hover:bg-[#7A5F8A] text-white text-xs font-bold rounded-full shadow-xs transition-all cursor-pointer"
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>{t.catalog.addedToCart}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-[#C3D1E2]" />
                          <span>{t.catalog.addToCart}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setComparingProduct(prod)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-bold text-[#1E324B] bg-white hover:bg-[#EDF2F8] rounded-full border border-[#C3D1E2] transition-colors cursor-pointer"
                    >
                      <Palette className="w-3 h-3 text-[#3B5B82]" />
                      <span>{t.catalog.compareColorsBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectForCustomizer(prod.petName, currentColor.id, prod.image)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-bold text-[#1E324B] bg-[#EDF2F8] hover:bg-[#C3D1E2]/70 rounded-full transition-colors cursor-pointer"
                    >
                      <Wand2 className="w-3 h-3 text-[#3B5B82]" />
                      <span>{t.catalog.customizeYours}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive 5-Color Interior Visual Comparator Modal */}
      {comparingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E324B]/55 backdrop-blur-xs">
          <div className="w-full max-w-4xl bg-white rounded-3xl border border-[#C3D1E2] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#C3D1E2]/70 mb-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#3B5B82] mb-1">
                  {t.catalog.compareTitle}
                </p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E324B]">
                  Tassa {comparingProduct.petName} · {comparingProduct.breed[currentLang]}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                  {t.catalog.compareSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setComparingProduct(null)}
                className="p-2 rounded-full bg-[#EDF2F8] hover:bg-[#C3D1E2] text-[#1E324B] transition-colors cursor-pointer"
                aria-label="Tancar comparador"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {PASTEL_COLORS.map((col) => {
                const isSelected = selectedColors[comparingProduct.id]?.id === col.id;
                return (
                  <div
                    key={col.id}
                    className={`rounded-2xl p-3 border flex flex-col items-center text-center transition-all ${
                      isSelected
                        ? 'bg-[#EDF2F8] border-[#243B53] ring-1 ring-[#243B53]'
                        : 'bg-[#F7F9FC] border-[#C3D1E2]/80 hover:bg-white'
                    }`}
                  >
                    <MugVisualPreview
                      photoUrl={comparingProduct.image}
                      petName={comparingProduct.petName}
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

                    <button
                      type="button"
                      onClick={() => {
                        handleColorChange(comparingProduct.id, col);
                        handleAddProductToCart(comparingProduct, col);
                        setComparingProduct(null);
                      }}
                      className="mt-3 w-full py-2 px-2.5 text-[11px] font-bold rounded-full bg-[#243B53] hover:bg-[#1E324B] text-white transition-colors cursor-pointer"
                    >
                      {t.catalog.selectThisColor}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
