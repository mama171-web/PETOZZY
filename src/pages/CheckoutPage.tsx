import React, { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Banknote,
  Landmark,
  Lock,
  ShieldCheck,
  Eye,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Language, CartItem, PageId, TrackedOrder } from '../types';
import { TRANSLATIONS, PASTEL_COLORS } from '../data/translations';

interface CheckoutPageProps {
  currentLang: Language;
  items: CartItem[];
  onNavigate: (page: PageId) => void;
  onOrderCreated: (order: TrackedOrder) => void;
  onClearCart: () => void;
}

type PaymentOption = 'visa_credit' | 'express_wallet' | 'bizum_pix' | 'contrarembols' | 'transferencia';

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  currentLang,
  items,
  onNavigate,
  onOrderCreated,
  onClearCart,
}) => {
  const t = TRANSLATIONS[currentLang];

  // Shipping form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [region, setRegion] = useState<'cat_es' | 'br'>('cat_es');
  const [address, setAddress] = useState('Vila-Seca, Tarragona');

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>('visa_credit');
  const [expressProvider, setExpressProvider] = useState<'Apple Pay' | 'Google Pay' | 'PayPal'>('Apple Pay');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bizumPhone, setBizumPhone] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrderCode, setConfirmedOrderCode] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 30;
  const shippingFee = subtotal > 0 ? (isFreeShipping ? 0 : 3.90) : 0;
  const total = subtotal + shippingFee;

  const paymentLabels: Record<PaymentOption, string> = {
    visa_credit: 'Visa / Mastercard',
    express_wallet: expressProvider,
    bizum_pix: region === 'br' ? 'Pix Instantâneo' : 'Bizum',
    contrarembols: 'Contrarembols',
    transferencia: 'Transferència Bancària',
  };

  const handleConfirmPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !address.trim()) return;

    setIsProcessing(true);
    const code = `PTZ-${Math.floor(4000 + Math.random() * 5000)}`;
    const firstItem = items[0];

    const newOrder: TrackedOrder = {
      code,
      customerName: customerName.trim(),
      petName: firstItem?.petName || 'Mascota',
      mugTitle: firstItem?.title || 'Tassa Personalitzada Petozzy',
      interiorColor: firstItem?.interiorColor || PASTEL_COLORS[0],
      photoUrl: firstItem?.photoUrl || '/src/assets/images/mug_buddy_golden_1794328863250.jpg',
      stage: 'preview_pending',
      destination: address.trim(),
      paymentMethod: paymentLabels[paymentMethod],
      orderDate: 'Avui',
      estimatedDelivery: region === 'br' ? '5-7 dies laborables' : '24-48h post-aprovació',
      previewApproved: false,
      total,
    };

    try {
      await fetch('https://sheetdb.io/api/v1/03rtpfmua6lum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            tracking_code: code,
            code: code,
            customer_name: customerName.trim(),
            client: customerName.trim(),
            status: 'En magatzem',
            estat: 'En magatzem',
            origin: 'Vila-Seca, Tarragona',
            destination: address.trim(),
            eta: region === 'br' ? '5-7 dies laborables' : '24-48h post-aprovació',
            location: 'Centre Logístic Peninsular',
            total: total.toFixed(2),
          },
        }),
      });
    } catch (err) {
      console.error('Error syncing order to SheetDB:', err);
    }

    onOrderCreated(newOrder);
    onClearCart();
    setIsProcessing(false);
    setConfirmedOrderCode(code);
  };

  if (confirmedOrderCode) {
    return (
      <section className="py-16 lg:py-24 bg-[#F7F9FC] min-h-[75vh]">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#C3D1E2] shadow-sm text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E324B]">
              {t.checkout.successTitle}
            </h1>

            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              {t.checkout.successSubtitle}
            </p>

            <div className="p-4 bg-[#EDF2F8] rounded-2xl border border-[#C3D1E2] font-mono text-lg font-extrabold text-[#1E324B]">
              {confirmedOrderCode}
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-left space-y-1.5 text-slate-600">
              <p><strong>Client:</strong> {customerName}</p>
              <p><strong>Destinació:</strong> {address}</p>
              <p><strong>Mètode:</strong> {paymentLabels[paymentMethod]}</p>
              <p><strong>Total:</strong> {total.toFixed(2)} €</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => onNavigate('seguiment')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#243B53] hover:bg-[#1E324B] text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer"
              >
                <span>{t.checkout.trackNowBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('inici')}
                className="px-6 py-3 bg-white hover:bg-[#EDF2F8] text-[#1E324B] text-xs font-bold rounded-full border border-[#C3D1E2] cursor-pointer"
              >
                {t.nav.home}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-20 bg-[#F7F9FC] min-h-[70vh]">
        <div className="max-w-lg mx-auto px-4 text-center space-y-4">
          <h1 className="text-2xl font-extrabold text-[#1E324B]">{t.cart.empty}</h1>
          <p className="text-sm text-slate-600">{t.cart.emptySub}</p>
          <button
            type="button"
            onClick={() => onNavigate('cataleg')}
            className="px-6 py-3 bg-[#243B53] text-white text-xs font-bold rounded-full cursor-pointer"
          >
            {t.cart.browseBtn}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-[#F7F9FC] min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Back Link */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => onNavigate('cataleg')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1E324B] bg-white px-4 py-2 rounded-full border border-[#C3D1E2] hover:bg-[#EDF2F8] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.checkout.backToCatalog}</span>
          </button>
        </div>

        {/* Title */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#3B5B82] mb-1">
            {t.checkout.kicker}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E324B]">
            {t.checkout.title}
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            {t.checkout.subtitle}
          </p>
        </div>

        <form onSubmit={handleConfirmPay} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Shipping & Payment Options (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Shipping Info */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#C3D1E2] shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#1E324B]">
                {t.checkout.stepShipping}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Maria Rovira"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-[#C3D1E2] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Correu per a la previsualització *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-[#C3D1E2] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telèfon *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="612 345 678"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-[#C3D1E2] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Regió d'enviament</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRegion('cat_es');
                        setAddress('Vila-Seca, Tarragona');
                      }}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border cursor-pointer ${
                        region === 'cat_es'
                          ? 'bg-[#EDF2F8] border-[#243B53] text-[#1E324B]'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Catalunya / ES
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRegion('br');
                        setAddress('São Paulo, Brasil');
                      }}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border cursor-pointer ${
                        region === 'br'
                          ? 'bg-[#EDF2F8] border-[#243B53] text-[#1E324B]'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Brasil
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adreça completa i Codi Postal *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-[#C3D1E2] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                />
              </div>
            </div>

            {/* Step 2: Flexible Payment Methods */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#C3D1E2] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#1E324B]">
                  {t.checkout.stepPayment}
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <Lock className="w-3.5 h-3.5" />
                  SSL 256-bit Segur
                </span>
              </div>

              <div className="space-y-3">
                {/* 1. Credit / Debit Card */}
                <label
                  className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'visa_credit'
                      ? 'bg-[#EDF2F8]/70 border-[#243B53] ring-1 ring-[#243B53]'
                      : 'bg-white border-slate-200 hover:border-[#C3D1E2]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payOpt"
                        checked={paymentMethod === 'visa_credit'}
                        onChange={() => setPaymentMethod('visa_credit')}
                      />
                      <CreditCard className="w-4 h-4 text-[#243B53]" />
                      <span className="text-xs font-bold text-[#1E324B]">
                        Targeta de Crèdit o Dèbit (Visa / Mastercard)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500">VISA · MC</span>
                  </div>

                  {paymentMethod === 'visa_credit' && (
                    <div className="mt-4 pt-3 border-t border-[#C3D1E2]/70 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4500 1234 5678 9010"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#C3D1E2] bg-white font-mono"
                        />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="px-3 py-2 text-xs rounded-xl border border-[#C3D1E2] bg-white font-mono"
                      />
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        className="px-3 py-2 text-xs rounded-xl border border-[#C3D1E2] bg-white font-mono"
                      />
                    </div>
                  )}
                </label>

                {/* 2. Express Wallets */}
                <label
                  className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'express_wallet'
                      ? 'bg-[#EDF2F8]/70 border-[#243B53] ring-1 ring-[#243B53]'
                      : 'bg-white border-slate-200 hover:border-[#C3D1E2]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payOpt"
                        checked={paymentMethod === 'express_wallet'}
                        onChange={() => setPaymentMethod('express_wallet')}
                      />
                      <Zap className="w-4 h-4 text-[#243B53]" />
                      <span className="text-xs font-bold text-[#1E324B]">
                        Passarel·les Ràpides (Apple Pay · Google Pay · PayPal)
                      </span>
                    </div>
                  </div>
                  {paymentMethod === 'express_wallet' && (
                    <div className="mt-3 pt-3 border-t border-[#C3D1E2]/70 flex flex-wrap gap-2">
                      {(['Apple Pay', 'Google Pay', 'PayPal'] as const).map((prov) => (
                        <button
                          key={prov}
                          type="button"
                          onClick={() => setExpressProvider(prov)}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-full border cursor-pointer ${
                            expressProvider === prov
                              ? 'bg-[#243B53] text-white border-[#243B53]'
                              : 'bg-white text-slate-700 border-[#C3D1E2]'
                          }`}
                        >
                          {prov}
                        </button>
                      ))}
                    </div>
                  )}
                </label>

                {/* 3. Bizum / Pix */}
                <label
                  className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'bizum_pix'
                      ? 'bg-[#EDF2F8]/70 border-[#243B53] ring-1 ring-[#243B53]'
                      : 'bg-white border-slate-200 hover:border-[#C3D1E2]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payOpt"
                        checked={paymentMethod === 'bizum_pix'}
                        onChange={() => setPaymentMethod('bizum_pix')}
                      />
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-[#1E324B]">
                        {region === 'br' ? 'Pix Instantâneo (Brasil)' : 'Bizum Instantani'}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700">Sense comissió</span>
                  </div>
                  {paymentMethod === 'bizum_pix' && (
                    <div className="mt-3 pt-3 border-t border-[#C3D1E2]/70">
                      <input
                        type="tel"
                        required
                        value={bizumPhone}
                        onChange={(e) => setBizumPhone(e.target.value)}
                        placeholder={region === 'br' ? 'Chave Pix (CPF / Celular)' : 'Telèfon Bizum (612 345 678)'}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#C3D1E2] bg-white font-mono"
                      />
                    </div>
                  )}
                </label>

                {/* 4. Contrarembolso */}
                <label
                  className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'contrarembols'
                      ? 'bg-[#EDF2F8]/70 border-[#243B53] ring-1 ring-[#243B53]'
                      : 'bg-white border-slate-200 hover:border-[#C3D1E2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payOpt"
                      checked={paymentMethod === 'contrarembols'}
                      onChange={() => setPaymentMethod('contrarembols')}
                    />
                    <Banknote className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="text-xs font-bold text-[#1E324B] block">
                        Contrarembols (Pagament en mà a l'entrega)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Paga al missatger en rebre la tassa a casa teva.
                      </span>
                    </div>
                  </div>
                </label>

                {/* 5. Bank Transfer */}
                <label
                  className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'transferencia'
                      ? 'bg-[#EDF2F8]/70 border-[#243B53] ring-1 ring-[#243B53]'
                      : 'bg-white border-slate-200 hover:border-[#C3D1E2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payOpt"
                      checked={paymentMethod === 'transferencia'}
                      onChange={() => setPaymentMethod('transferencia')}
                    />
                    <Landmark className="w-4 h-4 text-[#3B5B82]" />
                    <span className="text-xs font-bold text-[#1E324B]">
                      Transferència Bancària (CaixaBank Vila-Seca)
                    </span>
                  </div>
                  {paymentMethod === 'transferencia' && (
                    <div className="mt-3 pt-3 border-t border-[#C3D1E2]/70 text-[11px] text-slate-600 space-y-1">
                      <p>IBAN: <strong className="font-mono text-[#1E324B]">ES91 2100 0418 4502 0005 1234</strong></p>
                      <p>Envia el justificant a <strong>info@petozzy.intern</strong></p>
                    </div>
                  )}
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary, Security Seals & Digital Preview Guarantee (5 cols) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 border border-[#C3D1E2] shadow-sm space-y-5">
              <h2 className="text-base font-bold text-[#1E324B] pb-3 border-b border-slate-100">
                Resum de la Comanda
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartId} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.photoUrl || '/src/assets/images/mug_buddy_golden_1794328863250.jpg'}
                      alt={item.title}
                      className="w-12 h-12 rounded-xl object-cover border border-[#C3D1E2] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1E324B] truncate">{item.title}</p>
                      <p className="text-slate-500">
                        {item.quantity} × {item.price.toFixed(2)} € · {item.petName}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-[#1E324B]">
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-mono">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t.cart.shipping}</span>
                  <span className="font-mono">
                    {shippingFee === 0 ? t.cart.freeShipping : `${shippingFee.toFixed(2)} €`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#1E324B] pt-2 border-t border-slate-100">
                  <span>{t.cart.total}</span>
                  <span className="font-mono text-lg">{total.toFixed(2)} €</span>
                </div>
              </div>

              {/* Visual Guarantee Banner */}
              <div className="p-4 rounded-2xl bg-[#EDF2F8] border border-[#C3D1E2] flex items-start gap-3">
                <Eye className="w-5 h-5 text-[#243B53] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-[#1E324B]">{t.checkout.previewBadgeTitle}</p>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    {t.checkout.previewBadgeDesc}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-6 bg-[#8E759E] hover:bg-[#7A5F8A] disabled:bg-slate-400 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-[#C3D1E2]" />
                <span>{isProcessing ? t.checkout.processing : `${t.checkout.payBtn} (${total.toFixed(2)} €)`}</span>
              </button>

              {/* Trust Seals */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Xifratge SSL 256-bit
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3B5B82]" />
                  Garantia Zero Trencament
                </span>
              </div>
            </div>
          </div>

        </form>
      </div>
    </section>
  );
};
