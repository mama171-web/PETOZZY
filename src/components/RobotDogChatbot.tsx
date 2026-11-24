import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ArrowRight, Sparkles, Truck, Camera, CreditCard, Flame, Gift } from 'lucide-react';
import { Language, PageId, TrackedOrder, CartItem } from '../types';

interface RobotDogChatbotProps {
  currentLang: Language;
  orders: TrackedOrder[];
  cartItems: CartItem[];
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenTracking: (code: string) => void;
  onApplyCustomizerRecommendation?: (petName: string, colorId: string, scene: string) => void;
  customizerContext?: {
    petName?: string;
    colorId?: string;
    scene?: string;
  };
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface BotCopy {
  botName: string;
  botRole: string;
  greetingBubble: string;
  welcomeMessage: string;
  inputPlaceholder: string;
  sendAria: string;
  closeAria: string;
  openAria: string;
  quickTopics: {
    id: string;
    label: string;
    icon: 'ceramic' | 'tracking' | 'photo' | 'payment' | 'gift' | 'shipping';
  }[];
  actions: {
    goTracking: string;
    goCustomizer: string;
    goBlogCeramic: string;
    goCheckout: string;
    goCatalog: string;
    goContact: string;
  };
}

const COPY: Record<Language, BotCopy> = {
  ca: {
    botName: 'PetoBot IA',
    botRole: 'Assistent intel·ligent perrit robot Petozzy',
    greetingBubble: 'Pregunta’m el que vulguis!',
    welcomeMessage:
      'Bup-bup! Soc en PetoBot, conectat amb intel·ligència artificial Gemini de Google. Pregunta’m sobre races de mascotes, esmalts ceràmics a 800 °C, comandes o recomanacions de disseny!',
    inputPlaceholder: 'Pregunta qualsevol dubte a la IA...',
    sendAria: 'Enviar missatge',
    closeAria: 'Tancar assistent',
    openAria: 'Obrir assistent IA PetoBot',
    quickTopics: [
      { id: 'ceramic', label: 'Esmalts i rentaplats', icon: 'ceramic' },
      { id: 'tracking', label: 'Estat comanda (PTZ)', icon: 'tracking' },
      { id: 'photo', label: 'Retall automàtic foto', icon: 'photo' },
      { id: 'payment', label: 'Bizum, Pix i Targeta', icon: 'payment' },
      { id: 'gift', label: 'Regals i caixa kraft', icon: 'gift' },
      { id: 'shipping', label: 'Enviaments 24-48h', icon: 'shipping' },
    ],
    actions: {
      goTracking: 'Anar a Seguiment',
      goCustomizer: 'Obrir Personalitzador',
      goBlogCeramic: 'Llegir guia de ceràmica',
      goCheckout: 'Anar a Checkout',
      goCatalog: 'Veure Catàleg',
      goContact: 'Contactar amb el taller',
    },
  },
  pt: {
    botName: 'PetoBot IA',
    botRole: 'Assistente inteligente cão-robô Petozzy',
    greetingBubble: 'Pergunte o que quiser!',
    welcomeMessage:
      'Au-au! Sou o PetoBot, conectado com inteligência artificial Gemini. Pergunte sobre raças, esmaltes cerâmicos a 800 °C, pedidos ou dicas de personalização!',
    inputPlaceholder: 'Pergunte qualquer dúvida para a IA...',
    sendAria: 'Enviar mensagem',
    closeAria: 'Fechar assistente',
    openAria: 'Abrir assistente IA PetoBot',
    quickTopics: [
      { id: 'ceramic', label: 'Esmaltes e lava-louças', icon: 'ceramic' },
      { id: 'tracking', label: 'Rastrear pedido (PTZ)', icon: 'tracking' },
      { id: 'photo', label: 'Remoção de fundo', icon: 'photo' },
      { id: 'payment', label: 'Pix, Bizum e Cartão', icon: 'payment' },
      { id: 'gift', label: 'Caixa de presente', icon: 'gift' },
      { id: 'shipping', label: 'Frete e prazos', icon: 'shipping' },
    ],
    actions: {
      goTracking: 'Ir para Rastreamento',
      goCustomizer: 'Abrir Personalizador',
      goBlogCeramic: 'Ver guia de cerâmica',
      goCheckout: 'Ir para Pagamento',
      goCatalog: 'Ver Catálogo',
      goContact: 'Fale Conosco',
    },
  },
  es: {
    botName: 'PetoBot IA',
    botRole: 'Asistente inteligente perrito robot Petozzy',
    greetingBubble: '¡Pregúntame lo que quieras!',
    welcomeMessage:
      '¡Guau-guau! Soy PetoBot, conectado con inteligencia artificial Gemini. Pregúntame sobre razas, esmaltes cerámicos a 800 °C, pedidos o recomendaciones de diseño.',
    inputPlaceholder: 'Pregunta cualquier duda a la IA...',
    sendAria: 'Enviar mensaje',
    closeAria: 'Cerrar asistente',
    openAria: 'Abrir asistente IA PetoBot',
    quickTopics: [
      { id: 'ceramic', label: 'Esmaltes y lavavajillas', icon: 'ceramic' },
      { id: 'tracking', label: 'Seguimiento (PTZ)', icon: 'tracking' },
      { id: 'photo', label: 'Recorte automático foto', icon: 'photo' },
      { id: 'payment', label: 'Bizum, Pix y Tarjeta', icon: 'payment' },
      { id: 'gift', label: 'Caja regalo kraft', icon: 'gift' },
      { id: 'shipping', label: 'Envíos 24-48h', icon: 'shipping' },
    ],
    actions: {
      goTracking: 'Ir a Seguimiento',
      goCustomizer: 'Abrir Personalizador',
      goBlogCeramic: 'Ver guía de cerámica',
      goCheckout: 'Ir a Checkout',
      goCatalog: 'Ver Catálogo',
      goContact: 'Contactar con el taller',
    },
  },
};

const RobotDogSvg: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <line x1="32" y1="7" x2="32" y2="15" stroke="#243B53" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="6" r="3.5" fill="#9EB3CC" stroke="#243B53" strokeWidth="2" />
    <rect x="8" y="22" width="8" height="17" rx="4" fill="#9EB3CC" stroke="#243B53" strokeWidth="2.5" />
    <rect x="48" y="22" width="8" height="17" rx="4" fill="#9EB3CC" stroke="#243B53" strokeWidth="2.5" />
    <rect x="14" y="15" width="36" height="30" rx="11" fill="#EBF2FF" stroke="#243B53" strokeWidth="2.8" />
    <rect x="19" y="21" width="26" height="15" rx="6" fill="#1E324B" />
    <circle cx="26.5" cy="28.5" r="2.6" fill="#C3D1E2" />
    <circle cx="37.5" cy="28.5" r="2.6" fill="#C3D1E2" />
    <path d="M29.5 39.5 L34.5 39.5 L32 42 Z" fill="#243B53" />
    <path d="M28 42.5 Q32 45 36 42.5" stroke="#243B53" strokeWidth="2" strokeLinecap="round" fill="none" />
    <rect x="20" y="46" width="24" height="5" rx="2.5" fill="#3B5B82" />
    <circle cx="32" cy="52" r="3.2" fill="#C3D1E2" stroke="#243B53" strokeWidth="2" />
  </svg>
);

export const RobotDogChatbot: React.FC<RobotDogChatbotProps> = ({
  currentLang,
  orders,
  cartItems,
  activePage,
  onNavigate,
  onOpenTracking,
  onApplyCustomizerRecommendation,
  customizerContext,
}) => {
  const c = COPY[currentLang];
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: c.welcomeMessage,
    },
  ]);

  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [{ id: 'welcome', sender: 'bot', text: COPY[currentLang].welcomeMessage }];
      }
      return prev;
    });
  }, [currentLang]);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking]);

  const processMessageWithServerAI = async (textToSend: string) => {
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          lang: currentLang,
          history: historyPayload,
          orders,
          cartItems,
          customizerContext,
          activePage,
        }),
      });

      const data = await res.json();
      setIsThinking(false);

      if (data && data.reply) {
        let actionObj: ChatMessage['action'];
        const actionType = data.actionType;

        if (actionType === 'customizer') {
          actionObj = {
            label: c.actions.goCustomizer,
            onClick: () => {
              if (
                onApplyCustomizerRecommendation &&
                (data.recommendedColorId || data.recommendedPetName || data.recommendedScene)
              ) {
                onApplyCustomizerRecommendation(
                  data.recommendedPetName || 'Mascota',
                  data.recommendedColorId || 'blau-cel',
                  data.recommendedScene || 'oak'
                );
              }
              onNavigate('personalitzador');
              setIsOpen(false);
            },
          };
        } else if (actionType === 'tracking') {
          const targetCode = data.orderCode || orders[0]?.code || 'PTZ-1042';
          actionObj = {
            label: `${c.actions.goTracking} (${targetCode})`,
            onClick: () => {
              onOpenTracking(targetCode);
              setIsOpen(false);
            },
          };
        } else if (actionType === 'catalog') {
          actionObj = {
            label: c.actions.goCatalog,
            onClick: () => {
              onNavigate('cataleg');
              setIsOpen(false);
            },
          };
        } else if (actionType === 'checkout') {
          actionObj = {
            label: c.actions.goCheckout,
            onClick: () => {
              onNavigate('checkout');
              setIsOpen(false);
            },
          };
        } else if (actionType === 'contact') {
          actionObj = {
            label: c.actions.goContact,
            onClick: () => {
              onNavigate('contacte');
              setIsOpen(false);
            },
          };
        } else if (actionType === 'blog_ceramics') {
          actionObj = {
            label: c.actions.goBlogCeramic,
            onClick: () => {
              onNavigate('blog');
              setIsOpen(false);
            },
          };
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `b-${Date.now()}`,
            sender: 'bot',
            text: data.reply,
            action: actionObj,
          },
        ]);
      } else {
        throw new Error('Invalid response');
      }
    } catch {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text:
            currentLang === 'pt'
              ? 'Au! Tive um pequeno soluço de conexão com a IA, mas estou aqui. Como posso ajudar com sua caneca Petozzy?'
              : currentLang === 'es'
                ? '¡Guau! He tenido un pequeño despiste de conexión con la IA, pero sigo aquí. ¿Cómo puedo ayudarte con tu taza Petozzy?'
                : 'Bup! He tingut un petit despist de connexió amb la IA, però segueixo aquí. Com puc ajudar-te amb la teva tassa Petozzy?',
          action: {
            label: c.actions.goCustomizer,
            onClick: () => {
              onNavigate('personalitzador');
              setIsOpen(false);
            },
          },
        },
      ]);
    }
  };

  const handleTopicClick = (topicId: string) => {
    const topicLabel = c.quickTopics.find((t) => t.id === topicId)?.label || topicId;
    processMessageWithServerAI(topicLabel);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputValue.trim();
    if (!raw || isThinking) return;
    setInputValue('');
    processMessageWithServerAI(raw);
  };

  const renderTopicIcon = (icon: 'ceramic' | 'tracking' | 'photo' | 'payment' | 'gift' | 'shipping') => {
    if (icon === 'ceramic') return <Flame className="w-3 h-3 text-[#3B5B82] shrink-0" />;
    if (icon === 'tracking') return <Truck className="w-3 h-3 text-[#3B5B82] shrink-0" />;
    if (icon === 'photo') return <Camera className="w-3 h-3 text-[#3B5B82] shrink-0" />;
    if (icon === 'payment') return <CreditCard className="w-3 h-3 text-[#3B5B82] shrink-0" />;
    if (icon === 'gift') return <Gift className="w-3 h-3 text-[#3B5B82] shrink-0" />;
    return <Truck className="w-3 h-3 text-[#3B5B82] shrink-0" />;
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-40 flex flex-col items-start">
      {isOpen && (
        <div
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[390px] max-h-[78vh] flex flex-col bg-white rounded-3xl border border-[#C3D1E2] shadow-2xl shadow-[#1E324B]/20 overflow-hidden"
          role="dialog"
          aria-label={c.botName}
        >
          <div className="bg-[#C3D1E2]/70 px-4 py-3 border-b border-[#C3D1E2] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#C3D1E2] flex items-center justify-center shrink-0">
                <RobotDogSvg className="w-8 h-8" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-[#1E324B] leading-tight truncate flex items-center gap-1.5">
                  <span>{c.botName}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </p>
                <p className="text-[11px] font-semibold text-[#3B5B82] truncate">
                  {c.botRole}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full bg-white/80 hover:bg-white text-[#1E324B] transition-colors cursor-pointer shrink-0"
              aria-label={c.closeAria}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F9FC]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed font-medium ${
                    msg.sender === 'user'
                      ? 'bg-[#243B53] text-white rounded-br-xs'
                      : 'bg-white text-[#1E324B] border border-[#C3D1E2] rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.action && (
                  <button
                    type="button"
                    onClick={msg.action.onClick}
                    className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDF2F8] hover:bg-[#C3D1E2]/70 text-[#1E324B] border border-[#C3D1E2] text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    <span>{msg.action.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-[#C3D1E2] w-fit shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#3B5B82] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#3B5B82] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#3B5B82] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-500 font-bold ml-1">PetoBot IA pensant...</span>
              </div>
            )}
            <div ref={scrollEndRef} />
          </div>

          <div className="px-3 py-2.5 bg-white border-t border-[#C3D1E2]/60 flex flex-wrap gap-1.5">
            {c.quickTopics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                disabled={isThinking}
                onClick={() => handleTopicClick(topic.id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#EDF2F8] hover:bg-[#C3D1E2]/65 text-[#1E324B] text-[11px] font-bold border border-[#C3D1E2]/85 transition-colors cursor-pointer disabled:opacity-50"
              >
                {renderTopicIcon(topic.icon)}
                <span>{topic.label}</span>
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            className="p-2.5 bg-white border-t border-[#C3D1E2]/70 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              disabled={isThinking}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={c.inputPlaceholder}
              className="flex-1 px-3.5 py-2 text-xs rounded-full border border-[#C3D1E2] bg-[#F7F9FC] text-[#1E324B] focus:outline-none focus:ring-2 focus:ring-[#243B53] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isThinking || !inputValue.trim()}
              className="w-9 h-9 rounded-full bg-[#243B53] hover:bg-[#1E324B] disabled:bg-slate-400 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              aria-label={c.sendAria}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full bg-white hover:bg-[#EDF2F8] border-2 border-[#243B53] shadow-lg shadow-[#1E324B]/20 transition-transform hover:-translate-y-0.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#243B53]"
        aria-label={isOpen ? c.closeAria : c.openAria}
        aria-expanded={isOpen}
      >
        <span className="w-11 h-11 rounded-full bg-[#C3D1E2]/65 flex items-center justify-center shrink-0 motion-safe:animate-[bounce_3.5s_ease-in-out_infinite]">
          <RobotDogSvg className="w-9 h-9" />
        </span>
        <span className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-extrabold text-[#1E324B] leading-tight flex items-center gap-1">
            <span>{c.botName}</span>
            <Sparkles className="w-3 h-3 text-[#3B5B82]" />
          </span>
          <span className="text-[11px] font-semibold text-[#3B5B82] leading-tight">
            {c.greetingBubble}
          </span>
        </span>
      </button>
    </div>
  );
};
