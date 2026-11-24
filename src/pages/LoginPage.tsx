import React, { useState } from 'react';
import { User, Lock, Mail, CheckCircle2, ArrowRight, Heart, Package, Sparkles } from 'lucide-react';
import { Language, PageId, TrackedOrder } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface LoginPageProps {
  currentLang: Language;
  onNavigate: (page: PageId) => void;
  orders: TrackedOrder[];
}

const LOGIN_COPY = {
  ca: {
    kicker: 'Accés Client i Comunitat',
    titleLogin: 'Inicia sessió al teu compte Petozzy',
    titleRegister: 'Crea el teu compte Petozzy',
    subtitleLogin: 'Accedir et permet consultar les teves previsualitzacions digitals, comandes i tasses guardades.',
    subtitleRegister: 'Registra’t per rebre avantatges exclusius, seguiment ràpid i maquetes digitals prioritàries.',
    emailLabel: 'Correu electrònic',
    passwordLabel: 'Contrasenya',
    nameLabel: 'Nom complet',
    loginBtn: 'Entrar al meu compte',
    registerBtn: 'Crear compte nou',
    switchRegister: 'No tens compte? Registra’t aquí',
    switchLogin: 'Ja tens compte? Inicia sessió',
    welcomeBack: 'Benvingut de nou,',
    myOrders: 'Les meves comandes recents',
    savedMugs: 'Les meves tasses i mascotes guardades',
    logoutBtn: 'Tancar sessió',
    trackOrderPrompt: 'Consulta el seguiment en temps real',
  },
  pt: {
    kicker: 'Acesso do Cliente e Comunidade',
    titleLogin: 'Entre na sua conta Petozzy',
    titleRegister: 'Crie sua conta Petozzy',
    subtitleLogin: 'Acesse para consultar suas prévias digitais, pedidos e canecas salvas.',
    subtitleRegister: 'Cadastre-se para vantagens exclusivas, rastreamento rápido e prévias prioritárias.',
    emailLabel: 'E-mail',
    passwordLabel: 'Senha',
    nameLabel: 'Nome completo',
    loginBtn: 'Entrar na minha conta',
    registerBtn: 'Criar conta nova',
    switchRegister: 'Não tem conta? Cadastre-se aqui',
    switchLogin: 'Já tem conta? Faça login',
    welcomeBack: 'Bem-vindo de volta,',
    myOrders: 'Meus pedidos recentes',
    savedMugs: 'Minhas canecas e pets salvos',
    logoutBtn: 'Sair da conta',
    trackOrderPrompt: 'Acompanhe seu pedido em tempo real',
  },
  es: {
    kicker: 'Acceso de Clientes y Comunidad',
    titleLogin: 'Inicia sesión en tu cuenta Petozzy',
    titleRegister: 'Crea tu cuenta Petozzy',
    subtitleLogin: 'Acceder te permite consultar tus previsualizaciones digitales, pedidos y tazas guardadas.',
    subtitleRegister: 'Regístrate para recibir ventajas exclusivas, seguimiento rápido y maquetas digitales prioritarias.',
    emailLabel: 'Correo electrónico',
    passwordLabel: 'Contraseña',
    nameLabel: 'Nombre completo',
    loginBtn: 'Entrar a mi cuenta',
    registerBtn: 'Crear cuenta nueva',
    switchRegister: '¿No tienes cuenta? Regístrate aquí',
    switchLogin: '¿Ya tienes cuenta? Inicia sesión',
    welcomeBack: 'Bienvenido de nuevo,',
    myOrders: 'Mis pedidos recientes',
    savedMugs: 'Mis tazas y mascotas guardadas',
    logoutBtn: 'Cerrar sesión',
    trackOrderPrompt: 'Consulta el seguimiento en tiempo real',
  },
};

export const LoginPage: React.FC<LoginPageProps> = ({ currentLang, onNavigate, orders }) => {
  const c = LOGIN_COPY[currentLang];
  const t = TRANSLATIONS[currentLang];

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('laia@petozzy.intern');
  const [password, setPassword] = useState('********');
  const [name, setName] = useState('Laia Puigdomènech');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return (
      <section className="py-12 lg:py-20 bg-[#F7F9FC] min-h-[75vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* User Profile Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C3D1E2] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-[#243B53] text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
                {name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#3B5B82]">
                  {c.welcomeBack}
                </p>
                <h1 className="text-2xl font-extrabold text-[#1E324B]">{name}</h1>
                <p className="text-xs text-slate-500 font-medium">{email} · Vila-Seca, Tarragona</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLoggedIn(false)}
              className="px-5 py-2.5 bg-[#EDF2F8] hover:bg-[#C3D1E2]/70 text-[#1E324B] text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              {c.logoutBtn}
            </button>
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C3D1E2] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#1E324B] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#3B5B82]" />
                <span>{c.myOrders}</span>
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('seguiment')}
                className="text-xs font-bold text-[#243B53] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{c.trackOrderPrompt}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.slice(0, 2).map((order) => (
                <div
                  key={order.code}
                  className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#C3D1E2]/70 flex items-center gap-4"
                >
                  <img
                    src={order.photoUrl}
                    alt={order.petName}
                    className="w-14 h-14 rounded-xl object-cover border border-[#C3D1E2]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold font-mono text-[#1E324B]">
                        {order.code}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {order.total.toFixed(2)} €
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 truncate mt-0.5">
                      {order.mugTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{order.destination}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Mugs & Pets */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C3D1E2] shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-[#1E324B] flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              <span>{c.savedMugs}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#EDF2F8] border border-[#C3D1E2] flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white mb-2 shadow-xs">
                  <img
                    src="/src/assets/images/mug_buddy_golden_1794328863250.jpg"
                    alt="Buddy"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs font-bold text-[#1E324B]">Buddy · Golden Retriever</p>
                <p className="text-[11px] text-[#3B5B82] font-semibold mt-0.5">Blau Suau</p>
                <button
                  type="button"
                  onClick={() => onNavigate('personalitzador')}
                  className="mt-3 w-full py-1.5 px-3 bg-[#243B53] text-white text-[11px] font-bold rounded-full cursor-pointer"
                >
                  {t.catalog.customizeYours}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#EDF2F8] border border-[#C3D1E2] flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white mb-2 shadow-xs">
                  <img
                    src="/src/assets/images/mug_luna_kitten_1794328863214.jpg"
                    alt="Luna"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs font-bold text-[#1E324B]">Luna · Gateta Tabby</p>
                <p className="text-[11px] text-[#3B5B82] font-semibold mt-0.5">Verd Menta</p>
                <button
                  type="button"
                  onClick={() => onNavigate('personalitzador')}
                  className="mt-3 w-full py-1.5 px-3 bg-[#243B53] text-white text-[11px] font-bold rounded-full cursor-pointer"
                >
                  {t.catalog.customizeYours}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-[#C3D1E2] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#F7F9FC]"
                   onClick={() => onNavigate('personalitzador')}>
                <div className="w-10 h-10 rounded-full bg-[#EDF2F8] text-[#3B5B82] flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-[#1E324B]">Afegir nova mascota</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Dissenya una tassa nova</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-20 bg-[#F7F9FC] min-h-[75vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 border border-[#C3D1E2] shadow-lg shadow-[#C3D1E2]/35 space-y-6">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#3B5B82] mb-1">
              {c.kicker}
            </p>
            <h1 className="text-2xl font-extrabold text-[#1E324B] tracking-tight mb-2">
              {isRegister ? c.titleRegister : c.titleLogin}
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              {isRegister ? c.subtitleRegister : c.subtitleLogin}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {c.nameLabel}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Laia Puigdomènech"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#C3D1E2] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {c.emailLabel}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#C3D1E2] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {c.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#C3D1E2] focus:outline-none focus:ring-2 focus:ring-[#243B53]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-[#243B53] hover:bg-[#1E324B] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C3D1E2]" />
              <span>{isRegister ? c.registerBtn : c.loginBtn}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs font-bold text-[#3B5B82] hover:underline cursor-pointer"
            >
              {isRegister ? c.switchLogin : c.switchRegister}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
