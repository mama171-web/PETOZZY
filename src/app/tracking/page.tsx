'use client';

import React, { useState } from 'react';
import { Search, Package, MapPin, Calendar, CheckCircle2, Truck, Warehouse, AlertCircle } from 'lucide-react';

interface SheetOrder {
  tracking_code?: string;
  code?: string;
  status?: string;
  estat?: string;
  origin?: string;
  origen?: string;
  destination?: string;
  desti?: string;
  eta?: string;
  data_prevista?: string;
  location?: string;
  ubicacio_actual?: string;
  customer_name?: string;
  client?: string;
}

export default function SheetTrackingPage() {
  const [trackingCode, setTrackingCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<SheetOrder | null>(null);
  const [notFoundError, setNotFoundError] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trackingCode.trim()) return;

    setLoading(true);
    setNotFoundError(false);
    setOrderData(null);

    try {
      const res = await fetch(
        `https://sheetdb.io/api/v1/03rtpfmua6lum/search?tracking_code=${encodeURIComponent(trackingCode.trim())}`
      );
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setOrderData(data[0]);
      } else {
        // Try searching with 'code' or general search if sheetdb search format varies
        const resAll = await fetch('https://sheetdb.io/api/v1/03rtpfmua6lum');
        const allData = await resAll.json();
        if (Array.isArray(allData)) {
          const found = allData.find(
            (item: any) =>
              (item.tracking_code && item.tracking_code.toLowerCase() === trackingCode.trim().toLowerCase()) ||
              (item.code && item.code.toLowerCase() === trackingCode.trim().toLowerCase())
          );
          if (found) {
            setOrderData(found);
          } else {
            setNotFoundError(true);
          }
        } else {
          setNotFoundError(true);
        }
      }
    } catch (err) {
      console.error('Error fetching tracking data:', err);
      setNotFoundError(true);
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine status and progress
  const rawStatus = (orderData?.status || orderData?.estat || 'En magatzem').toLowerCase();
  
  let progressPercentage = 10;
  let progressColor = 'bg-amber-500';
  let statusLabel = orderData?.status || orderData?.estat || 'En magatzem';
  let StatusIcon = Warehouse;

  if (rawStatus.includes('lliurat') || rawStatus.includes('delivered') || rawStatus.includes('entregue')) {
    progressPercentage = 100;
    progressColor = 'bg-emerald-600';
    statusLabel = 'Lliurat';
    StatusIcon = CheckCircle2;
  } else if (rawStatus.includes('trànsit') || rawStatus.includes('transit') || rawStatus.includes('enviament') || rawStatus.includes('shipped')) {
    progressPercentage = 50;
    progressColor = 'bg-blue-600';
    statusLabel = 'En trànsit';
    StatusIcon = Truck;
  } else if (rawStatus.includes('magatzem') || rawStatus.includes('warehouse') || rawStatus.includes('rebut') || rawStatus.includes('received')) {
    progressPercentage = 10;
    progressColor = 'bg-amber-500';
    statusLabel = 'En magatzem';
    StatusIcon = Warehouse;
  }

  const origin = orderData?.origin || orderData?.origen || 'Vila-Seca, Tarragona';
  const destination = orderData?.destination || orderData?.desti || 'Adreça del client';
  const eta = orderData?.eta || orderData?.data_prevista || '24-48 hores';
  const location = orderData?.location || orderData?.ubicacio_actual || 'Centre Logístic Peninsular';

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-12 px-4 sm:px-6 lg:px-8 text-[#1E324B] font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Search Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#C3D1E2] shadow-sm text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#EDF2F8] text-[#1E324B] flex items-center justify-center mx-auto border border-[#C3D1E2]">
            <Package className="w-7 h-7 text-[#3B5B82]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1E324B]">
              Localitza el teu enviament
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-lg mx-auto">
              Introdueix el teu codi de seguiment per consultar l'estat actualitzat de la teva tassa personalitzada Petozzy.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto pt-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Ex: PTZ-1042 o codi SheetDB..."
                className="w-full pl-11 pr-4 py-3.5 text-sm font-mono font-bold text-[#1E324B] rounded-2xl border border-[#C3D1E2] bg-[#F7F9FC] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-[#243B53] hover:bg-[#1E324B] disabled:bg-slate-400 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              {loading ? 'Cercant...' : 'Cercar'}
            </button>
          </form>

          {notFoundError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 max-w-md mx-auto animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Codi no trobat</span>
            </div>
          )}
        </div>

        {/* Results Card */}
        {orderData && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C3D1E2] shadow-md space-y-8 animate-fadeIn">
            
            {/* Top Status Badge & Code */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#C3D1E2]/60">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Codi de Seguiment
                </p>
                <p className="text-xl sm:text-2xl font-mono font-black text-[#1E324B]">
                  {orderData.tracking_code || orderData.code || trackingCode}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EDF2F8] border border-[#C3D1E2] text-xs font-bold text-[#1E324B]">
                <StatusIcon className="w-4 h-4 text-[#3B5B82]" />
                <span>{statusLabel}</span>
              </div>
            </div>

            {/* Visual Progress Bar (Timeline) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Estat del Progrés</span>
                <span className="font-mono text-[#1E324B]">{progressPercentage}%</span>
              </div>

              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-[#C3D1E2]/40">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-semibold text-slate-500 pt-1">
                <span>En magatzem (10%)</span>
                <span>En trànsit (50%)</span>
                <span>Lliurat (100%)</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#C3D1E2]/60 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white text-[#3B5B82] flex items-center justify-center border border-[#C3D1E2] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Origen</p>
                  <p className="text-sm font-bold text-[#1E324B] mt-0.5">{origin}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#C3D1E2]/60 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white text-[#3B5B82] flex items-center justify-center border border-[#C3D1E2] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Destí</p>
                  <p className="text-sm font-bold text-[#1E324B] mt-0.5">{destination}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#C3D1E2]/60 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white text-[#3B5B82] flex items-center justify-center border border-[#C3D1E2] shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Data prevista (ETA)</p>
                  <p className="text-sm font-bold text-[#1E324B] mt-0.5">{eta}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#C3D1E2]/60 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white text-[#3B5B82] flex items-center justify-center border border-[#C3D1E2] shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ubicació actual</p>
                  <p className="text-sm font-bold text-[#1E324B] mt-0.5">{location}</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
