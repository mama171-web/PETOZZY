import React, { useState, useEffect } from 'react';
import { Shield, Lock, Cookie, Scale, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Language, PageId } from '../types';

export type LegalTabId = 'avis' | 'privacitat' | 'cookies' | 'garantia';

interface LegalPageProps {
  currentLang: Language;
  initialTab?: LegalTabId;
  onNavigate: (page: PageId) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({
  currentLang,
  initialTab = 'avis',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTabId>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const titles = {
    ca: {
      kicker: 'Marc Legal i Protecció del Consumidor',
      mainTitle: 'Informació Legal, Privacitat i Resolució d’Incidències',
      subtitle:
        'A Petozzy creiem en la màxima transparència. Aquí expliquem detalladament cadascun dels aspectes legals, com protegim les teves dades i com resolem qualsevol situació.',
      backHome: 'Tornar a l’Inici',
      tabAvis: 'Avís Legal',
      tabPrivacitat: 'Com Resolem la Privacitat (RGPD)',
      tabCookies: 'Com Resolem les Cookies',
      tabGarantia: 'Garantia i Resolució d’Enviaments',
    },
    pt: {
      kicker: 'Marco Legal e Proteção ao Consumidor',
      mainTitle: 'Informações Legais, Privacidade e Resolução de Problemas',
      subtitle:
        'Na Petozzy valorizamos a transparência total. Aqui detalhamos todos os aspectos jurídicos, proteção dos seus dados e como cuidamos de cada etapa.',
      backHome: 'Voltar ao Início',
      tabAvis: 'Aviso Legal',
      tabPrivacitat: 'Como Cuidamos da Privacidade (LGPD/RGPD)',
      tabCookies: 'Como Cuidamos dos Cookies',
      tabGarantia: 'Garantia e Solução de Envios',
    },
    es: {
      kicker: 'Marco Legal y Protección del Consumidor',
      mainTitle: 'Información Legal, Privacidad y Resolución de Incidencias',
      subtitle:
        'En Petozzy apostamos por la máxima claridad y confianza. Aquí explicamos con detalle cada apartado legal, cómo protegemos tus datos y cómo resolvemos cualquier situación.',
      backHome: 'Volver al Inicio',
      tabAvis: 'Aviso Legal',
      tabPrivacitat: 'Cómo Resolvemos la Privacidad (RGPD)',
      tabCookies: 'Cómo Resolvemos las Cookies',
      tabGarantia: 'Garantía y Resolución de Envíos',
    },
  }[currentLang];

  return (
    <div className="py-12 lg:py-20 bg-[#F7F9FC] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Back button */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => onNavigate('inici')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1E324B] hover:text-[#3B5B82] bg-white px-4 py-2 rounded-full border border-[#C3D1E2] shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{titles.backHome}</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8EFF7] text-[#1E324B] border border-[#C3D1E2] text-xs font-bold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5 text-[#3B5B82]" />
            <span>{titles.kicker}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E324B] tracking-tight mb-4 text-balance">
            {titles.mainTitle}
          </h1>
          <p className="text-base text-slate-600 font-medium leading-relaxed">
            {titles.subtitle}
          </p>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 bg-white p-2 rounded-3xl border border-[#C3D1E2] shadow-xs max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('avis')}
            className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              activeTab === 'avis'
                ? 'bg-[#1E324B] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#1E324B] hover:bg-[#EDF2F8]'
            }`}
          >
            {titles.tabAvis}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacitat')}
            className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              activeTab === 'privacitat'
                ? 'bg-[#1E324B] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#1E324B] hover:bg-[#EDF2F8]'
            }`}
          >
            {titles.tabPrivacitat}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cookies')}
            className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              activeTab === 'cookies'
                ? 'bg-[#1E324B] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#1E324B] hover:bg-[#EDF2F8]'
            }`}
          >
            {titles.tabCookies}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('garantia')}
            className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              activeTab === 'garantia'
                ? 'bg-[#1E324B] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#1E324B] hover:bg-[#EDF2F8]'
            }`}
          >
            {titles.tabGarantia}
          </button>
        </div>

        {/* TAB 1: AVÍS LEGAL */}
        {activeTab === 'avis' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C3D1E2] shadow-sm space-y-6 text-slate-700 text-sm leading-relaxed">
            <div className="flex items-center gap-3 pb-4 border-b border-[#C3D1E2]/60">
              <div className="w-10 h-10 rounded-2xl bg-[#E8EFF7] text-[#1E324B] flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E324B]">
                  Avís Legal i Condicions d’Ús
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  En compliment de la Llei 34/2002 de serveis de la societat de la informació (LSSI-CE)
                </p>
              </div>
            </div>

            {/* Academic Notice Highlight Box */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Finalitat estrictament acadèmica i formativa</span>
              </div>
              <p>
                Aquest lloc web (Petozzy) és una plataforma de demostració creada en el marc acadèmic d'estudis de disseny d'interfícies i comerç electrònic. Tots els serveis, pagaments i transaccions es troben en entorn de simulació didàctica.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#1E324B]">1. Dades del Titular</h3>
              <p>
                En compliment de l'article 10 de la Llei 34/2002, es fan públiques les dades identificatives del titular del projecte:
              </p>
              <ul className="list-disc list-inside space-y-1 bg-[#F7F9FC] p-4 rounded-2xl border border-[#C3D1E2]/50 text-xs font-medium text-slate-700">
                <li><strong>Denominació:</strong> Petozzy Ceràmica (Projecte Acadèmic)</li>
                <li><strong>Ubicació:</strong> Vila-Seca, Tarragona (Catalunya)</li>
                <li>
                  <strong>Correu electrònic oficial de contacte:</strong>{' '}
                  <a href="mailto:info@petozzy.intern" className="text-[#3B5B82] font-bold hover:underline">
                    info@petozzy.intern
                  </a>
                </li>
                <li><strong>Activitat:</strong> Disseny i personalització artesanal de tasses de cafè i te per a mascotes.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#1E324B]">2. Propietat Intel·lectual del Logotip</h3>
              <p>
                El disseny del logotip de Petozzy (tassa il·lustrada a mà amb línies negres de tinta, petjades ascendents de gos i gat, platet i tipografia pròpia) ha estat creat expressament com a emblema central de la marca i n'és el símbol distintiu protegit.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#1E324B]">3. Ús del Lloc Web</h3>
              <p>
                L'accés a la web és lliure i gratuït. L'usuari es compromet a fer un ús correcte i lícit dels seus continguts i a no introduir dades personals de tercers sense el seu consentiment explícit.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: PRIVACITAT (COM LA RESOLEM) */}
        {activeTab === 'privacitat' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C3D1E2] shadow-sm space-y-6 text-slate-700 text-sm leading-relaxed">
            <div className="flex items-center gap-3 pb-4 border-b border-[#C3D1E2]/60">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E324B]">
                  Com Resolem la Privacitat i la Protecció de Dades (RGPD / LGPD)
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Principis de minimització, seguretat i resolució ràpida de drets
                </p>
              </div>
            </div>

            {/* How we solve it summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 font-bold text-[#1E324B] text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Principi de Minimització</span>
                </div>
                <p className="text-xs text-slate-600">
                  Només demanem el nom del client, l'adreça de lliurament a Vila-Seca o destí i la foto de la mascota per estampar la tassa. Mai sol·licitem dades innecessàries.
                </p>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 font-bold text-[#1E324B] text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Cessió a Tercers</span>
                </div>
                <p className="text-xs text-slate-600">
                  Les fotografies dels teus gossos o gats no es venen, ni s'utilitzen per a entrenaments d'intel·ligència artificial aliena, ni es comparteixen amb publicitaris.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#1E324B]">1. Responsable del Tractament</h3>
              <p>
                El responsable del tractament de les dades és l'equip Petozzy amb domicili a <strong>Vila-Seca, Tarragona</strong> i correu electrònic de contacte directe:{' '}
                <a href="mailto:info@petozzy.intern" className="text-[#3B5B82] font-bold hover:underline">
                  info@petozzy.intern
                </a>.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#1E324B]">2. Finalitat i Temps de Conservació</h3>
              <p>
                La finalitat és exclusivament gestionar la comanda de la tassa, generar la previsualització digital prèvia i coordinar l'enviament. Un cop lliurada la peça ceràmica, les imatges de prova s'eliminen automàticament de la memòria temporal.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#1E324B]">3. Com Resolem els Teus Drets (ARCO / RGPD / LGPD)</h3>
              <p>
                Qualsevol usuari pot sol·licitar l'accés, rectificació o eliminació immediata de les seves dades simplement enviant un correu a{' '}
                <strong className="text-[#1E324B]">info@petozzy.intern</strong> amb l'assumpte "Drets de Privacitat". Responem i donem de baixa qualsevol registre en un termini màxim de 24 hores laborables sense cap cost ni trava burocràtica.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: COOKIES (COM LES RESOLEM) */}
        {activeTab === 'cookies' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C3D1E2] shadow-sm space-y-6 text-slate-700 text-sm leading-relaxed">
            <div className="flex items-center gap-3 pb-4 border-b border-[#C3D1E2]/60">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E324B]">
                  Com Resolem la Política de Cookies
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Compromís de navegació neta: 0 cookies de rastreig publicitari
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#EDF2F8] rounded-2xl border border-[#C3D1E2] text-xs text-[#1E324B]">
              <p className="font-bold mb-1">Com ho resolem a Petozzy?</p>
              <p className="text-slate-700">
                A diferència de les grans cadenes comercials que instal·len desenes de píxels de seguiment publicitari, a Petozzy{' '}
                <strong>resolem les cookies no utilitzant cap galeta de seguiment ni publicitat de tercers</strong>. Només fem servir emmagatzematge d'estat tècnic essencial per recordar quina tassa has dissenyat i quin idioma prefereixes.
              </p>
            </div>

            {/* Transparent Table */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#1E324B]">Taula Transparent de Galetes Tècniques</h3>
              <div className="overflow-x-auto border border-[#C3D1E2] rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EDF2F8] text-[#1E324B] font-bold border-b border-[#C3D1E2]">
                    <tr>
                      <th className="p-3">Nom</th>
                      <th className="p-3">Tipologia</th>
                      <th className="p-3">Finalitat</th>
                      <th className="p-3">Caducitat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#3B5B82]">petozzy_lang</td>
                      <td className="p-3">Tècnica essencial</td>
                      <td className="p-3">Recordar l'idioma seleccionat (Català, Português do Brasil o Español)</td>
                      <td className="p-3">Sessió / 30 dies</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#3B5B82]">petozzy_cart</td>
                      <td className="p-3">Tècnica essencial</td>
                      <td className="p-3">Mantenir els articles del teu carret mentre navegues per la botiga</td>
                      <td className="p-3">Sessió</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#1E324B]">Com Desactivar o Netejar les Cookies al teu Navegador</h3>
              <p>
                Pots bloquejar o esborrar les cookies del teu dispositiu en qualsevol moment mitjançant la configuració del teu navegador web (Chrome, Firefox, Safari o Edge):
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 bg-[#F7F9FC] p-4 rounded-2xl border border-[#C3D1E2]/50">
                <li><strong>Google Chrome:</strong> Configuració → Privacitat i seguretat → Cookies i altres dades de llocs.</li>
                <li><strong>Mozilla Firefox:</strong> Opcions → Privadesa i seguretat → Netejar dades.</li>
                <li><strong>Safari (Apple):</strong> Preferències → Privacitat → Gestionar dades de llocs web.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: GARANTIA I RESOLUCIÓ DE CONFLICTES */}
        {activeTab === 'garantia' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C3D1E2] shadow-sm space-y-6 text-slate-700 text-sm leading-relaxed">
            <div className="flex items-center gap-3 pb-4 border-b border-[#C3D1E2]/60">
              <div className="w-10 h-10 rounded-2xl bg-[#E8EFF7] text-[#1E324B] flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E324B]">
                  Com Resolem les Incidències, Trencament i Devolucions
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Garantia directa sense lletra petita per a la màxima tranquil·litat del client
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-[#EDF2F8] rounded-2xl border border-[#C3D1E2] space-y-2">
                <h3 className="font-bold text-[#1E324B] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1E324B] text-white flex items-center justify-center text-xs">1</span>
                  Garantia "Zero Trencament" en el Transport
                </h3>
                <p className="text-xs text-slate-600">
                  La ceràmica viatja en caixes especialment amortides. Si per qualsevol incidència durant el transport la tassa arriba amb danys o esquerdada, <strong>com ho resolem?</strong>
                </p>
                <div className="p-3 bg-white rounded-xl border border-[#C3D1E2] text-xs font-medium text-[#1E324B]">
                  N'hi ha prou amb enviar una foto del paquet a <strong className="text-[#3B5B82]">info@petozzy.intern</strong>. Sense fer-te retornar la peça trencada, en fabriquem una de nova i te l'enviem de franc en 24-48 hores.
                </div>
              </div>

              <div className="p-5 bg-[#EDF2F8] rounded-2xl border border-[#C3D1E2] space-y-2">
                <h3 className="font-bold text-[#1E324B] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1E324B] text-white flex items-center justify-center text-xs">2</span>
                  Garantia de Previsualització Digital i Desistiment (14 dies)
                </h3>
                <p className="text-xs text-slate-600">
                  Mai produïm una tassa sense que abans hagis aprovat la maqueta digital des del teu apartat de seguiment o correu. A més, d'acord amb la Directiva Europea 2011/83/UE sobre drets dels consumidors, per a productes amb defectes o discrepàncies disposes de 14 dies naturals per sol·licitar el reemborsament complet o la substitució.
                </p>
              </div>

              <div className="p-5 bg-[#EDF2F8] rounded-2xl border border-[#C3D1E2] space-y-2">
                <h3 className="font-bold text-[#1E324B] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1E324B] text-white flex items-center justify-center text-xs">3</span>
                  Plataforma de Resolució de Litigis en Línia (ODR de la UE)
                </h3>
                <p className="text-xs text-slate-600">
                  La Comissió Europea facilita una plataforma de resolució de litigis en línia disponible a:{' '}
                  <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="text-[#3B5B82] font-bold hover:underline">
                    https://ec.europa.eu/consumers/odr
                  </a>. Davant de qualsevol consulta operativa, el nostre canal directe és sempre{' '}
                  <a href="mailto:info@petozzy.intern" className="text-[#3B5B82] font-bold hover:underline">
                    info@petozzy.intern
                  </a>{' '}
                  o des de la nostra seu a Vila-Seca, Tarragona.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
