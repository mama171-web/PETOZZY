import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send, Bot, User, ArrowRight } from 'lucide-react';
import { Language, PageId } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ChatbotWidgetProps {
  currentLang: Language;
  onNavigate: (page: PageId) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: { label: string; action: () => void }[];
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ currentLang, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];

  const getWelcomeText = () => {
    if (currentLang === 'pt') {
      return 'Olá! Sou o assistente virtual da Petozzy. Como posso ajudar você hoje com as nossas canecas personalizadas? Escolha uma opção abaixo:';
    } else if (currentLang === 'es') {
      return '¡Hola! Soy el asistente virtual de Petozzy. ¿En qué puedo ayudarte hoy con tus tazas personalizadas? Elige una opción:';
    }
    return 'Hola! Suc de l’assistent virtual de Petozzy. En què et puc ajudar avui amb les nostres tasses personalitzades? Tria una opció:';
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize welcome message when opened or language changes
  const handleOpen = () => {
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: getWelcomeText(),
          options: getDefaultOptions(),
        },
      ]);
    }
    setIsOpen(!isOpen);
  };

  const getDefaultOptions = () => {
    const opts = [
      {
        label:
          currentLang === 'pt'
            ? '📦 Como rastrear meu pedido?'
            : currentLang === 'es'
              ? '📦 ¿Cómo rastrear mi pedido?'
              : '📦 Com seguir el meu enviament?',
        action: () => handleSelectOption('tracking'),
      },
      {
        label:
          currentLang === 'pt'
            ? '🎨 Como funciona a prévia digital?'
            : currentLang === 'es'
              ? '🎨 ¿Cómo funciona la previsualización?'
              : '🎨 Com funciona la previsualització?',
        action: () => handleSelectOption('preview'),
      },
      {
        label:
          currentLang === 'pt'
            ? '☕ Vão ao micro-ondas e lava-louças?'
            : currentLang === 'es'
              ? '☕ ¿Aptas para microondas y lavavajillas?'
              : '☕ Són aptes per a microones i rentaplats?',
        action: () => handleSelectOption('microwave'),
      },
      {
        label:
          currentLang === 'pt'
            ? '🌱 Compromisso sustentável e ODS'
            : currentLang === 'es'
              ? '🌱 Compromiso sostenible y ODS'
              : '🌱 Compromís sostenible i ODS',
        action: () => handleSelectOption('ods'),
      },
      {
        label:
          currentLang === 'pt'
            ? '💬 Falar com o ateliê (Contato)'
            : currentLang === 'es'
              ? '💬 Hablar con el taller (Contacto)'
              : '💬 Parlar amb el taller (Contacte)',
        action: () => handleSelectOption('contact'),
      },
    ];
    return opts;
  };

  const handleSelectOption = (type: string) => {
    let userText = '';
    let botReply = '';
    let followUpAction: (() => void) | undefined = undefined;

    if (type === 'tracking') {
      userText =
        currentLang === 'pt'
          ? 'Como rastrear meu pedido?'
          : currentLang === 'es'
            ? '¿Cómo rastrear mi pedido?'
            : 'Com seguir el meu enviament?';
      botReply =
        currentLang === 'pt'
          ? 'Você pode usar a nossa aba de Rastreamento (ou a ferramenta SheetDB com API externa) inserindo o seu código PTZ para ver a linha do tempo em tempo real!'
          : currentLang === 'es'
            ? 'Puedes usar nuestra pestaña de Seguimiento o el buscador SheetDB integrado introduciendo tu código PTZ para ver el estado y la barra de progreso al instante.'
            : 'Pots utilitzar la nostra pestanya de Seguiment o el cercador SheetDB introduint el teu codi PTZ per veure l’estat i la barra de progrés a l’instant.';
      followUpAction = () => {
        onNavigate('seguiment');
        setIsOpen(false);
      };
    } else if (type === 'preview') {
      userText =
        currentLang === 'pt'
          ? 'Como funciona a prévia digital?'
          : currentLang === 'es'
            ? '¿Cómo funciona la previsualización?'
            : 'Com funciona la previsualització?';
      botReply =
        currentLang === 'pt'
          ? 'Enviamos uma arte digital gratuita em até 24h após o pedido. A caneca só vai para o forno após a sua aprovação total!'
          : currentLang === 'es'
            ? 'Enviamos una maqueta digital gratuita en menos de 24h. La taza solo entra en el horno cuando nos das el visto bueno.'
            : 'Enviem una maqueta digital gratuïta en menys de 24h. La tassa només entra al forn quan ens dones el vistiplau.';
      followUpAction = () => {
        onNavigate('personalitzador');
        setIsOpen(false);
      };
    } else if (type === 'microwave') {
      userText =
        currentLang === 'pt'
          ? 'Canecas vão ao micro-ondas e lava-louças?'
          : currentLang === 'es'
            ? '¿Aptas para microondas y lavavajillas?'
            : 'Són aptes per a microones i rentaplats?';
      botReply =
        currentLang === 'pt'
          ? 'Sim! Utilizamos porcelana AAA+ com esmaltes atóxicos sem chumbo. A estampa é fundida no esmalte a mais de 800°C.'
          : currentLang === 'es'
            ? '¡Sí! Usamos porcelana AAA+ con esmaltes seguros sin plomo ni cadmio. La impresión se funde en el esmalte a alta temperatura.'
            : 'Sí! Utilitzem porcellana AAA+ amb esmalts segurs sense plom ni cadmi. La impressió es fon a l’esmalt a alta temperatura.';
    } else if (type === 'ods') {
      userText =
        currentLang === 'pt'
          ? 'Qual é o compromisso sustentável e ODS?'
          : currentLang === 'es'
            ? '¿Cuál es el compromiso sostenible y ODS?'
            : 'Quin és el compromís sostenible i ODS?';
      botReply =
        currentLang === 'pt'
          ? 'Estamos alinhados com a Agenda 2030 (ODS 12 de economia circular, ODS 8/10 de comércio justo em Vila-Seca, ODS 15 de proteção animal e ODS 13 de ação climática).'
          : currentLang === 'es'
            ? 'Estamos alineados con la Agenda 2030 (ODS 12 de economía circular, ODS 8/10 de comercio justo, ODS 15 de protección animal y ODS 13).'
            : 'Estem alineats amb l’Agenda 2030 (ODS 12 d’economia circular, ODS 8/10 de comerç just a Vila-Seca, ODS 15 de protecció animal i ODS 13).';
      followUpAction = () => {
        onNavigate('qui-som');
        setIsOpen(false);
      };
    } else if (type === 'contact') {
      userText =
        currentLang === 'pt'
          ? 'Falar com o ateliê'
          : currentLang === 'es'
            ? 'Hablar con el taller'
            : 'Parlar amb el taller';
      botReply =
        currentLang === 'pt'
          ? 'Nosso ateliê fica em Vila-Seca (Tarragona). Você pode nos mandar uma mensagem pelo formulário de contato!'
          : currentLang === 'es'
            ? 'Nuestro taller está en Vila-Seca (Tarragona). Puedes escribirnos directamente desde el formulario de contacto.'
            : 'El nostre taller és a Vila-Seca (Tarragona). Ens pots escriure directament des del formulari de contacte.';
      followUpAction = () => {
        onNavigate('contacte');
        setIsOpen(false);
      };
    }

    const newUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
    };

    const newBotMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: botReply,
      options: followUpAction
        ? [
            {
              label:
                currentLang === 'pt'
                  ? '➡️ Ir para a página'
                  : currentLang === 'es'
                    ? '➡️ Ir a la página'
                    : '➡️ Anar a la pàgina',
              action: followUpAction,
            },
            {
              label:
                currentLang === 'pt'
                  ? '🔄 Fazer outra pergunta'
                  : currentLang === 'es'
                    ? '🔄 Hacer otra pregunta'
                    : '🔄 Fer una altra pregunta',
              action: () => resetChat(),
            },
          ]
        : getDefaultOptions(),
    };

    setMessages((prev) => [...prev, newUserMsg, newBotMsg]);
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: getWelcomeText(),
        options: getDefaultOptions(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          type="button"
          onClick={handleOpen}
          className="flex items-center gap-2.5 px-4.5 py-3.5 bg-[#243B53] hover:bg-[#1E324B] text-white rounded-full shadow-lg border border-[#C3D1E2] transition-transform hover:scale-105 cursor-pointer"
          aria-label="Obrir assistent virtual"
        >
          <div className="w-7 h-7 rounded-full bg-[#EBF2FF] text-[#1E324B] flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-[#3B5B82]" />
          </div>
          <span className="text-xs font-bold tracking-wide">
            {currentLang === 'pt' ? 'Assistente Petozzy' : currentLang === 'es' ? 'Asistente Petozzy' : 'Assistent Petozzy'}
          </span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </button>
      ) : (
        <div className="w-[340px] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-[#C3D1E2] overflow-hidden flex flex-col max-h-[560px] animate-fadeIn">
          {/* Header */}
          <div className="bg-[#243B53] text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#EBF2FF] text-[#1E324B] flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#3B5B82]" />
              </div>
              <div>
                <p className="text-sm font-bold">Petozzy Assistant</p>
                <p className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Online · Resposta instantània
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              aria-label="Tancar xat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F7F9FC] text-xs font-medium max-h-[360px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#243B53] text-white rounded-br-xs'
                      : 'bg-white text-[#1E324B] border border-[#C3D1E2] rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Render Options Buttons if present */}
                {msg.options && msg.options.length > 0 && (
                  <div className="mt-2.5 space-y-1.5 w-full">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={opt.action}
                        className="w-full text-left px-3.5 py-2 rounded-xl bg-white hover:bg-[#EDF2F8] text-[#1E324B] border border-[#C3D1E2]/80 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-between group"
                      >
                        <span>{opt.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#3B5B82] group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer branding */}
          <div className="p-3 bg-white border-t border-[#C3D1E2]/60 text-center text-[10px] text-slate-400 font-semibold">
            Petozzy · Tasses artesanals amb previsualització digital
          </div>
        </div>
      )}
    </div>
  );
};
