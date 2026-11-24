import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ChatOrderSummary {
  code: string;
  customerName: string;
  petName: string;
  mugTitle: string;
  stage: string;
  destination: string;
  paymentMethod: string;
  estimatedDelivery: string;
  previewApproved: boolean;
  total: number;
}

interface ChatHistoryTurn {
  sender: 'bot' | 'user';
  text: string;
}

const VALID_ACTIONS = [
  'none',
  'customizer',
  'catalog',
  'tracking',
  'checkout',
  'contact',
  'blog_ceramics',
  'blog_welfare',
  'about',
] as const;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '6mb' }));

  app.post('/api/segment-pet', async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ detected: false, contour: [] });
    }

    try {
      const { imageBase64, mimeType = 'image/jpeg' } = req.body as {
        imageBase64?: string;
        mimeType?: string;
      };

      if (!imageBase64 || imageBase64.length < 32) {
        return res.status(400).json({ detected: false, contour: [] });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: [
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
          {
            text: 'Locate the main pet (dog or cat) in this photo for printing cleanly onto a white ceramic mug with the background completely removed. Return a tight bounding box and a clockwise 14-point outer polygon contour following the pet head, ears, cheeks, and upper chest/shoulders, excluding all background (wall, sofa, grass, floor, furniture). All coordinates must be integers normalized to 0..1000.',
          },
        ],
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detected: { type: Type.BOOLEAN },
              bbox: {
                type: Type.OBJECT,
                properties: {
                  ymin: { type: Type.INTEGER },
                  xmin: { type: Type.INTEGER },
                  ymax: { type: Type.INTEGER },
                  xmax: { type: Type.INTEGER },
                },
                required: ['ymin', 'xmin', 'ymax', 'xmax'],
              },
              contour: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    x: { type: Type.INTEGER },
                    y: { type: Type.INTEGER },
                  },
                  required: ['x', 'y'],
                },
              },
            },
            required: ['detected', 'contour'],
          },
        },
      });

      const raw = (response.text ?? '{}').trim();
      const parsed = JSON.parse(raw) as {
        detected?: boolean;
        bbox?: { ymin: number; xmin: number; ymax: number; xmax: number };
        contour?: Array<{ x: number; y: number }>;
      };

      const validContour = Array.isArray(parsed.contour)
        ? parsed.contour
            .filter(
              (pt) =>
                typeof pt?.x === 'number' &&
                typeof pt?.y === 'number' &&
                Number.isFinite(pt.x) &&
                Number.isFinite(pt.y)
            )
            .map((pt) => ({
              x: Math.max(0, Math.min(1000, pt.x)),
              y: Math.max(0, Math.min(1000, pt.y)),
            }))
        : [];

      return res.json({
        detected: Boolean(parsed.detected && validContour.length >= 5),
        bbox: parsed.bbox || null,
        contour: validContour,
      });
    } catch {
      return res.json({ detected: false, contour: [] });
    }
  });

  app.post('/api/chat', async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'MISSING_API_KEY',
        message: 'La clave API del asistente no está configurada en el servidor (Settings > Secrets).',
      });
    }

    try {
      const {
        message,
        lang = 'ca',
        history = [],
        orders = [],
        cartItems = [],
        customizerContext,
        activePage = 'inici',
      } = req.body as {
        message?: string;
        lang?: 'ca' | 'pt' | 'es';
        history?: ChatHistoryTurn[];
        orders?: ChatOrderSummary[];
        cartItems?: Array<{
          title: string;
          petName: string;
          colorName: string;
          quantity: number;
          price: number;
        }>;
        customizerContext?: {
          petName?: string;
          colorId?: string;
          scene?: string;
        };
        activePage?: string;
      };

      if (!message || !message.trim()) {
        return res.status(400).json({ error: 'EMPTY_MESSAGE', message: 'Empty message' });
      }

      const langName =
        lang === 'pt'
          ? 'Brazilian Portuguese (pt-BR)'
          : lang === 'es'
            ? 'Spanish (es)'
            : 'Catalan (ca)';

      const ordersText =
        orders.length > 0
          ? orders
              .map(
                (o) =>
                  `- ${o.code}: cliente=${o.customerName}, mascota=${o.petName}, taza="${o.mugTitle}", etapa=${o.stage}, previewApproved=${o.previewApproved}, destino="${o.destination}", pago="${o.paymentMethod}", entrega="${o.estimatedDelivery}", total=${o.total.toFixed(2)}€`
              )
              .join('\n')
          : 'No active orders provided.';

      const cartTotalQty = cartItems.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
      const cartSubtotal = cartItems.reduce(
        (acc, it) => acc + (Number(it.price) || 15.9) * (Number(it.quantity) || 1),
        0
      );
      const freeShippingGap = Math.max(0, 30 - cartSubtotal);
      const cartSummaryText =
        cartItems.length > 0
          ? `${cartTotalQty} taza(s), subtotal ${cartSubtotal.toFixed(2)} € (${
              freeShippingGap === 0
                ? 'ENVÍO GRATIS YA DESBLOQUEADO'
                : `faltan ${freeShippingGap.toFixed(2)} € (1 taza más) para envío 100% gratis`
            }). Detalle: ${cartItems
              .map((it) => `${it.quantity}x "${it.petName}" (${it.colorName})`)
              .join(', ')}`
          : 'Carrito vacío (envío gratis a partir de 30,00 €, es decir, con 2 tazas).';

      const recentHistoryText = history
        .slice(-10)
        .map((h) => `${h.sender === 'user' ? 'Client' : 'PetoBot'}: ${h.text}`)
        .join('\n');

      const systemInstruction = `Eres PetoBot, el asistente inteligente experto y perrito robot del taller artesanal Petozzy en Vila-Seca (Tarragona).
Idioma activo de la interfaz: ${langName}. Responde siempre en el idioma que use el cliente en su mensaje (o en ${langName} si no está claro). En portugués usa siempre portugués de Brasil (pt-BR).

Conocimiento completo y verificado de Petozzy:
- Producto: Tazas de porcelana vitrificada AAA+ personalizadas con la foto real de la mascota, recorte automático inteligente del fondo (la foto se aísla limpia sin fondo sobre la cerámica), nombre debajo y esmalte interior pastel a elegir (15,90 €).
- 5 colores pastel de interior (ID exacto -> nombre):
  * "blau-cel" -> Azul Suave / Blau Suau
  * "verd-menta" -> Verde Menta / Verd Menta
  * "rosa-pastel" -> Rosa Pastel
  * "groc-mantega" -> Amarillo Mantequilla / Groc Mantega / Amarelo Manteiga
  * "lila" -> Lila Suave / Lilás Suave
- 4 escenarios de vista previa realista en mesita de salón (ID exacto):
  * "oak" (Mesita de roble cálida - ideal pelajes dorados/canela como Buddy)
  * "scandi" (Salón nórdico con plantas - ideal atigrados/naturales como Luna)
  * "walnut" (Salón de nogal con posavasos pizarra - ideal pelajes oscuros/carácter como Rocky)
  * "marble" (Mesa mármol junto a ventana y sillón azul pastel - ideal pelajes blancos/crema como Daisy)
- Materiales y durabilidad: Porcelana de alta densidad cocida a >800 °C con esmaltes minerales 0% plomo ni cadmio (UE 1935/2004). Aptas para microondas y lavavajillas diario.
- Eliminación automática de fondo + Vista previa 24h: Al subir cualquier foto del móvil, el sistema quita automáticamente el fondo para integrar solo al animal sobre la taza en la vista previa, y además enviamos maqueta digital gratuita en <24h para aprobación antes de hornear.
- Envíos y garantías: 3,90 € (100% GRATIS en pedidos > 30 €, es decir desde 2 tazas = 31,80 €). Entrega 24-48h Península tras aprobar maqueta; 5-7 días laborables Brasil. Reposición gratuita inmediata ante cualquier rotura en transporte.
- Pagos seguros SSL 256-bit: Visa/Mastercard, Bizum (ES), Pix (Brasil), Apple Pay, Google Pay, PayPal, Contrareembolso y Transferencia (CaixaBank Vila-Seca).
- Compromiso Agenda 2030: Artesanía local en Vila-Seca sin sobrestock (ODS 8 y 12), apoyo a protectoras y bienestar animal (ODS 10 y 15), producción sostenible sin plásticos de un solo uso (ODS 12 y 13).
- Blog "El Rincón de Petozzy" / "El Racó de Petozzy" / "O Cantinho da Petozzy": Guías sobre el proceso cerámico a 800 °C y enriquecimiento ambiental/bienestar de perros y gatos.

Estado actual del cliente en tiempo real:
- Página actual: ${activePage}
- Carrito actual: ${cartSummaryText}
- Personalizador actual: ${
        customizerContext?.petName
          ? `Mascota="${customizerContext.petName}", color="${customizerContext.colorId || 'blau-cel'}", escenario="${customizerContext.scene || 'oak'}"`
          : 'Sin edición activa'
      }
- Pedidos consultables:
${ordersText}

Reglas de inteligencia avanzada:
1. Analiza la intención real: responde con precisión, cercanía y utilidad práctica en 2-4 frases claras (usa cifras reales del carrito si pregunta por envíos, precios o totales). Nunca muestres códigos hexadecimales como #C3D1E2.
2. Asesoramiento de diseño personalizado: Si menciona raza, color de pelo o nombre de su mascota (ej: "tengo una gata negra llamada Kira", "un teckel marrón"), recomiéndale el mejor "recommendedColorId", el "recommendedScene" más favorecedor y pon su nombre en "recommendedPetName", y elige actionType="customizer" para que pueda aplicarlo con 1 clic.
3. Si menciona un código PTZ o pregunta por su pedido, consulta la lista en tiempo real, explica la etapa exacta y si está en "preview_pending" (previewApproved=false) recuérdale que puede aprobar la maqueta digital con un clic en Seguimiento (actionType="tracking" + orderCode).
4. Genera siempre 2 o 3 "followUpChips" muy breves (máx 36 caracteres cada uno) y naturales en el idioma del usuario que continúen la conversación de forma inteligente.`;

      const promptWithContext = recentHistoryText
        ? `Historial reciente:\n${recentHistoryText}\n\nNuevo mensaje del cliente: ${message}`
        : `Mensaje del cliente: ${message}`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: promptWithContext,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: 'Helpful, accurate, warm response in the customer language.',
              },
              actionType: {
                type: Type.STRING,
                description:
                  'One of: none, customizer, catalog, tracking, checkout, contact, blog_ceramics, blog_welfare, about',
              },
              orderCode: {
                type: Type.STRING,
                description: 'Matching order code if asking about an order, else empty string.',
              },
              recommendedColorId: {
                type: Type.STRING,
                description:
                  'Optional pastel color ID to apply in customizer: blau-cel, verd-menta, rosa-pastel, groc-mantega, lila, or empty string.',
              },
              recommendedPetName: {
                type: Type.STRING,
                description: 'Optional pet name mentioned by user to prefill customizer, else empty string.',
              },
              recommendedScene: {
                type: Type.STRING,
                description: 'Optional room scene ID (oak, scandi, walnut, marble) or empty string.',
              },
              followUpChips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2-3 concise smart follow-up user prompts under 36 chars.',
              },
            },
            required: ['reply', 'actionType', 'followUpChips'],
          },
        },
      });

      const rawText = (response.text ?? '{}').trim();
      let parsed: {
        reply?: string;
        actionType?: string;
        orderCode?: string;
        recommendedColorId?: string;
        recommendedPetName?: string;
        recommendedScene?: string;
        followUpChips?: string[];
      } = {};
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = { reply: rawText || '...', actionType: 'none', followUpChips: [] };
      }

      const safeAction = VALID_ACTIONS.includes(parsed.actionType as (typeof VALID_ACTIONS)[number])
        ? parsed.actionType
        : 'none';

      const validColorIds = ['blau-cel', 'verd-menta', 'rosa-pastel', 'groc-mantega', 'lila'];
      const validScenes = ['oak', 'scandi', 'walnut', 'marble'];

      return res.json({
        reply: parsed.reply || '',
        actionType: safeAction,
        orderCode: parsed.orderCode?.trim() || '',
        recommendedColorId: validColorIds.includes(parsed.recommendedColorId || '')
          ? parsed.recommendedColorId
          : '',
        recommendedPetName: (parsed.recommendedPetName || '').trim().slice(0, 18),
        recommendedScene: validScenes.includes(parsed.recommendedScene || '')
          ? parsed.recommendedScene
          : '',
        followUpChips: Array.isArray(parsed.followUpChips)
          ? parsed.followUpChips.filter((s) => typeof s === 'string' && s.trim().length > 0).slice(0, 3)
          : [],
      });
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      const status = typeof e?.status === 'number' && e.status >= 400 ? e.status : 500;
      return res.status(status).json({
        error: 'CHAT_REQUEST_FAILED',
        message: e?.message || 'Error communicating with AI assistant.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Petozzy server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
