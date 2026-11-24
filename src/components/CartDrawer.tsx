import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Eye } from 'lucide-react';
import { Language, CartItem, PageId } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  items: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onNavigate: (page: PageId) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  currentLang,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
}) => {
  const t = TRANSLATIONS[currentLang];

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 30;
  const shippingFee = subtotal > 0 ? (isFreeShipping ? 0 : 3.90) : 0;
  const total = subtotal + shippingFee;

  const handleGoToCheckout = () => {
    onClose();
    onNavigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col rounded-l-3xl overflow-hidden">
          
          {/* Header */}
          <div className="p-5 border-b border-[#C3D1E2]/70 flex items-center justify-between bg-[#EDF2F8]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-[#1E324B] flex items-center justify-center border border-[#C3D1E2]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#1E324B]">{t.cart.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-[#1E324B] rounded-full hover:bg-white transition-colors cursor-pointer"
              aria-label="Tancar carret"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-14 h-14 bg-[#EDF2F8] text-[#3B5B82] rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#1E324B]">{t.cart.empty}</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
                  {t.cart.emptySub}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate('cataleg');
                  }}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#243B53] hover:bg-[#1E324B] rounded-full transition-colors cursor-pointer"
                >
                  {t.cart.browseBtn}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartId}
                  className="p-3.5 rounded-2xl border border-[#C3D1E2]/80 bg-[#F7F9FC] flex gap-3 relative"
                >
                  <div className="w-16 h-16 rounded-xl bg-white border border-[#C3D1E2] overflow-hidden shrink-0">
                    <img
                      src={item.photoUrl || '/src/assets/images/mug_buddy_golden_1794328863250.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="text-xs font-bold text-[#1E324B] truncate">{item.title}</h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block border border-black/10 shrink-0"
                        style={{ backgroundColor: item.interiorColor.hex }}
                      />
                      <span className="font-medium">{item.interiorColor.name[currentLang]}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-[#243B53] truncate">{item.petName}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#C3D1E2] rounded-full bg-white text-xs">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartId, -1)}
                          className="p-1.5 text-slate-500 hover:text-[#1E324B] cursor-pointer"
                          aria-label="Restar"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono font-bold tabular-nums text-[#1E324B]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartId, 1)}
                          className="p-1.5 text-slate-500 hover:text-[#1E324B] cursor-pointer"
                          aria-label="Sumar"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-[#1E324B] font-mono tabular-nums">
                        {(item.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.cartId)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Sticky Footer inside Cart Drawer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#C3D1E2]/70 bg-[#F7F9FC] space-y-3">
              <div className="p-3 rounded-2xl bg-[#EDF2F8] border border-[#C3D1E2] flex items-center gap-2.5 text-[11px] font-semibold text-[#1E324B]">
                <Eye className="w-4 h-4 text-[#3B5B82] shrink-0" />
                <span>Inclou previsualització digital gratuïta abans de fabricar.</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-mono tabular-nums">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t.cart.shipping}</span>
                  <span className="font-mono tabular-nums">
                    {shippingFee === 0 ? t.cart.freeShipping : `${shippingFee.toFixed(2)} €`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#1E324B] pt-2 border-t border-[#C3D1E2]/60">
                  <span>{t.cart.total}</span>
                  <span className="font-mono text-base tabular-nums">{total.toFixed(2)} €</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-[#243B53] hover:bg-[#1E324B] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer"
              >
                <span>{t.cart.goToCheckout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
