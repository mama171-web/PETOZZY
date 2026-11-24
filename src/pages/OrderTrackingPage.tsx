import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Eye,
  Flame,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { Language, TrackedOrder, OrderStage, PageId } from '../types';
import { TRANSLATIONS, PASTEL_COLORS } from '../data/translations';

interface OrderTrackingPageProps {
  currentLang: Language;
  orders: TrackedOrder[];
  initialOrderCode?: string;
  onApprovePreview: (code: string) => void;
  onNavigate: (page: PageId) => void;
}

const STAGE_ORDER: OrderStage[] = [
  'received',
  'preview_pending',
  'production',
  'shipped',
  'delivered',
];

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  currentLang,
  orders,
  initialOrderCode,
  onApprovePreview,
  onNavigate,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [searchInput, setSearchInput] = useState<string>(initialOrderCode || orders[0]?.code || 'PTZ-1042');
  const [activeCode, setActiveCode] = useState<string>(initialOrderCode || orders[0]?.code || 'PTZ-1042');
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchedSheetOrder, setFetchedSheetOrder] = useState<TrackedOrder | null>(null);
  const [sheetTrackingCodes, setSheetTrackingCodes] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllSheetCodes = async () => {
      try {
        const res = await fetch('https://sheetdb.io/api/v1/03rtpfmua6lum');
        const data = await res.json();
        if (Array.isArray(data)) {
          const codes = data
            .map((item: any) => item.tracking_code || item.code)
            .filter(Boolean);
          setSheetTrackingCodes(Array.from(new Set(codes)));
        }
      } catch (err) {
        console.error('Error fetching sheet codes:', err);
      }
    };
    fetchAllSheetCodes();
  }, []);

  const localOrder = orders.find(
    (o) => o.code.toLowerCase() === activeCode.trim().toLowerCase()
  );

  const currentOrder = localOrder || fetchedSheetOrder;

  const fetchFromSheetDB = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setLoading(true);
    setFetchedSheetOrder(null);

    try {
      const res = await fetch(
        `https://sheetdb.io/api/v1/03rtpfmua6lum/search?tracking_code=${encodeURIComponent(codeToSearch.trim())}`
      );
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const rawStatus = (item.status || item.estat || 'En magatzem').toLowerCase();
        let stage: OrderStage = 'received';
        if (rawStatus.includes('lliurat') || rawStatus.includes('delivered') || rawStatus.includes('entregue')) {
          stage = 'delivered';
        } else if (rawStatus.includes('trànsit') || rawStatus.includes('transit') || rawStatus.includes('shipped')) {
          stage = 'shipped';
        } else if (rawStatus.includes('producció') || rawStatus.includes('production')) {
          stage = 'production';
        } else if (rawStatus.includes('previsualització') || rawStatus.includes('preview')) {
          stage = 'preview_pending';
        }

        const mapped: TrackedOrder = {
          code: item.tracking_code || item.code || codeToSearch,
          customerName: item.customer_name || 'Client Petozzy',
          petName: item.pet_name || 'Mascota',
          mugTitle: item.mug_title || 'Tassa Personalitzada Petozzy',
          interiorColor: PASTEL_COLORS[0],
          photoUrl: item.photo_url || '/src/assets/images/mug_buddy_golden_1794328863250.jpg',
          stage: stage,
          destination: item.destination || item.desti || 'Adreça del client',
          paymentMethod: item.payment_method || 'Targeta / Bizum',
          orderDate: 'Recents',
          estimatedDelivery: item.eta || item.data_prevista || '24-48h',
          previewApproved: stage !== 'preview_pending',
          total: parseFloat(item.total) || 15.90,
        };
        setFetchedSheetOrder(mapped);
      } else {
        // Fallback scan all
        const resAll = await fetch('https://sheetdb.io/api/v1/03rtpfmua6lum');
        const allData = await resAll.json();
        if (Array.isArray(allData)) {
          const found = allData.find(
            (it: any) =>
              (it.tracking_code && it.tracking_code.toLowerCase() === codeToSearch.toLowerCase()) ||
              (it.code && it.code.toLowerCase() === codeToSearch.toLowerCase())
          );
          if (found) {
            const rawStatus = (found.status || found.estat || 'En magatzem').toLowerCase();
            let stage: OrderStage = 'received';
            if (rawStatus.includes('lliurat') || rawStatus.includes('delivered') || rawStatus.includes('entregue')) {
              stage = 'delivered';
            } else if (rawStatus.includes('trànsit') || rawStatus.includes('transit') || rawStatus.includes('shipped')) {
              stage = 'shipped';
            } else if (rawStatus.includes('producció') || rawStatus.includes('production')) {
              stage = 'production';
            } else if (rawStatus.includes('previsualització') || rawStatus.includes('preview')) {
              stage = 'preview_pending';
            }
            const mapped: TrackedOrder = {
              code: found.tracking_code || found.code || codeToSearch,
              customerName: found.customer_name || 'Client Petozzy',
              petName: 'Mascota',
              mugTitle: 'Tassa Personalitzada Petozzy',
              interiorColor: PASTEL_COLORS[0],
              photoUrl: '/src/assets/images/mug_buddy_golden_1794328863250.jpg',
              stage: stage,
              destination: found.destination || found.desti || 'Adreça del client',
              paymentMethod: 'Targeta / Bizum',
              orderDate: 'Recents',
              estimatedDelivery: found.eta || found.data_prevista || '24-48h',
              previewApproved: stage !== 'preview_pending',
              total: parseFloat(found.total) || 15.90,
            };
            setFetchedSheetOrder(mapped);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching order from SheetDB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeCode && !localOrder) {
      fetchFromSheetDB(activeCode);
    }
  }, [activeCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const code = searchInput.trim().toUpperCase();
    if (!code) return;
    setActiveCode(code);
    const foundLocal = orders.find((o) => o.code.toLowerCase() === code.toLowerCase());
    if (!foundLocal) {
      fetchFromSheetDB(code);
    }
  };

  const handleQuickSelect = (code: string) => {
    setSearchInput(code);
    setActiveCode(code);
    setFetchedSheetOrder(null);
  };

  const currentStageIdx = currentOrder ? STAGE_ORDER.indexOf(currentOrder.stage) : -1;

  return (
    <section className="py-12 lg:py-20 bg-[#F7F9FC] min-h-[75vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#3B5B82] mb-2">
            {t.tracking.kicker}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E324B] tracking-tight mb-3 text-balance">
            {t.tracking.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            {t.tracking.subtitle}
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C3D1E2] shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="tracking-code" className="sr-only">
                {t.tracking.inputLabel}
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="tracking-code"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t.tracking.inputPlaceholder}
                  className="w-full pl-11 pr-4 py-3 text-sm font-mono font-bold text-[#1E324B] rounded-full border border-[#C3D1E2] bg-[#F7F9FC] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-7 py-3 bg-[#243B53] hover:bg-[#1E324B] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              {t.tracking.searchBtn}
            </button>
          </form>

          {/* Quick Demo Buttons / All Excel Orders */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Tots els codis (Excel + Web):</span>
            {Array.from(new Set([...orders.map(o => o.code), ...sheetTrackingCodes])).map((code) => {
              const localMatch = orders.find(o => o.code === code);
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleQuickSelect(code)}
                  className={`px-3 py-1 rounded-full font-mono font-bold transition-colors cursor-pointer ${
                    currentOrder?.code === code
                      ? 'bg-[#8E759E] text-white'
                      : 'bg-[#F3E8E8] text-[#17284E] hover:bg-[#D3C7DE]'
                  }`}
                >
                  {code} {localMatch ? `(${localMatch.petName})` : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Order Details & Live Timeline */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-[#C3D1E2] text-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#8E759E] animate-spin mx-auto" />
            <p className="text-sm font-bold text-[#17284E]">Cercant la comanda a SheetDB / Google Sheets...</p>
          </div>
        ) : !currentOrder ? (
          <div className="bg-white rounded-3xl p-8 border border-[#D3C7DE] text-center space-y-3">
            <Package className="w-10 h-10 text-[#8E759E] mx-auto" />
            <p className="text-sm font-bold text-[#17284E]">{t.tracking.notFound}</p>
            <p className="text-xs text-slate-500">Assegura't que el codi (ex: PTZ-XXXX) existeix al teu full de càlcul.</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Main Progress Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C3D1E2] shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
                <div>
                  <p className="text-xs font-mono font-bold text-[#3B5B82]">
                    {currentOrder.code} · {currentOrder.orderDate}
                  </p>
                  <h2 className="text-xl font-extrabold text-[#1E324B] mt-0.5">
                    {currentOrder.mugTitle}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Client: {currentOrder.customerName}
                  </p>
                </div>

                {/* Preview Status Indicator */}
                <div>
                  {currentOrder.previewApproved ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{t.tracking.approvedBadge}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>{t.tracking.awaitingBadge}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* 5-Step Progress Stepper */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {STAGE_ORDER.map((stageKey, idx) => {
                  const isCompleted = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;
                  const icons = [Package, Eye, Flame, Truck, CheckCircle2];
                  const IconComp = icons[idx];

                  return (
                    <div
                      key={stageKey}
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center ${
                        isCurrent
                          ? 'bg-[#EDF2F8] border-[#243B53] shadow-xs'
                          : isCompleted
                          ? 'bg-white border-[#C3D1E2]'
                          : 'bg-slate-50/70 border-slate-200 opacity-55'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 ${
                          isCurrent
                            ? 'bg-[#243B53] text-white'
                            : isCompleted
                            ? 'bg-[#C3D1E2] text-[#1E324B]'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-[#1E324B]">
                        {t.tracking.stages[stageKey]}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 mt-1">
                        {isCurrent ? 'Actual' : isCompleted ? 'Completat' : 'Pendent'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Digital Preview Approval Banner if pending */}
              {!currentOrder.previewApproved && (
                <div className="mt-8 p-5 rounded-2xl bg-[#EDF2F8] border border-[#C3D1E2] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={currentOrder.photoUrl}
                      alt={currentOrder.petName}
                      className="w-16 h-16 rounded-2xl object-cover border border-white shadow-xs shrink-0"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-[#1E324B] text-sm">
                        Maqueta digital llesta per a "{currentOrder.petName}"
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        Revisa el color interior ({currentOrder.interiorColor.name[currentLang]}) i el nom abans de començar la cocció ceràmica.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onApprovePreview(currentOrder.code)}
                    className="px-5 py-2.5 bg-[#243B53] hover:bg-[#1E324B] text-white text-xs font-bold rounded-full shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {t.tracking.approveBtn}
                  </button>
                </div>
              )}
            </div>

            {/* Order Info Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-[#C3D1E2] flex items-center gap-4">
                <img
                  src={currentOrder.photoUrl}
                  alt={currentOrder.mugTitle}
                  className="w-24 h-24 rounded-2xl object-cover border border-[#C3D1E2] shrink-0"
                />
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-[#1E324B] text-sm">{t.tracking.orderSummary}</p>
                  <p className="text-slate-600">
                    Mascota: <strong className="text-[#1E324B]">{currentOrder.petName}</strong>
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <span>Color interior:</span>
                    <span
                      className="w-3 h-3 rounded-full inline-block border border-black/10"
                      style={{ backgroundColor: currentOrder.interiorColor.hex }}
                    />
                    <strong className="text-[#1E324B]">
                      {currentOrder.interiorColor.name[currentLang]}
                    </strong>
                  </p>
                  <p className="font-mono font-extrabold text-[#243B53] text-sm pt-1">
                    Total: {currentOrder.total.toFixed(2)} €
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#C3D1E2] space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#3B5B82]" />
                    {t.tracking.destination}
                  </span>
                  <span className="font-bold text-[#1E324B]">{currentOrder.destination}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#3B5B82]" />
                    {t.tracking.payment}
                  </span>
                  <span className="font-bold text-[#1E324B]">{currentOrder.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#3B5B82]" />
                    {t.tracking.estimated}
                  </span>
                  <span className="font-bold text-emerald-700">{currentOrder.estimatedDelivery}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Dubtes? info@petozzy.intern
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('contacte')}
                    className="font-bold text-[#243B53] hover:underline cursor-pointer"
                  >
                    {t.nav.contact}
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};
