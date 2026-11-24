import { LegalBlogArticle, FaqItem, TestimonialItem, TrackedOrder } from '../types';
import { PASTEL_COLORS } from './translations';

export const INITIAL_TRACKED_ORDERS: TrackedOrder[] = [
  {
    code: 'PTZ-1042',
    customerName: 'Laia Puigdomènech',
    petName: 'Buddy',
    mugTitle: 'Tassa Buddy · Interior Blau Suau',
    interiorColor: PASTEL_COLORS[0],
    photoUrl: '/src/assets/images/mug_buddy_golden_1794328863250.jpg',
    stage: 'shipped',
    destination: 'Vila-Seca, Tarragona',
    paymentMethod: 'Visa / Crèdit',
    orderDate: '14 Nov 2026',
    estimatedDelivery: '17 Nov 2026 (24-48h)',
    previewApproved: true,
    total: 19.80,
  },
  {
    code: 'PTZ-2089',
    customerName: 'Rafael Oliveira',
    petName: 'Luna',
    mugTitle: 'Caneca Luna · Interior Verde Menta',
    interiorColor: PASTEL_COLORS[1],
    photoUrl: '/src/assets/images/mug_luna_kitten_1794328863214.jpg',
    stage: 'preview_pending',
    destination: 'São Paulo, Brasil',
    paymentMethod: 'Apple Pay / Express',
    orderDate: '16 Nov 2026',
    estimatedDelivery: 'Pendent d’aprovació digital',
    previewApproved: false,
    total: 19.80,
  },
  {
    code: 'PTZ-3150',
    customerName: 'Carlos Mendoza',
    petName: 'Rocky',
    mugTitle: 'Taza Rocky · Interior Lila Suave',
    interiorColor: PASTEL_COLORS[4],
    photoUrl: '/src/assets/images/mug_rocky_frenchie_1794328864159.jpg',
    stage: 'production',
    destination: 'Barcelona, Catalunya',
    paymentMethod: 'Bizum',
    orderDate: '15 Nov 2026',
    estimatedDelivery: '18 Nov 2026',
    previewApproved: true,
    total: 15.90,
  },
];

export const LEGAL_BLOG_ARTICLES: LegalBlogArticle[] = [
  {
    id: 'proces-ceramica-artesanal',
    categoryKey: 'ceramica',
    categoryLabel: {
      ca: 'Art i Procés Ceràmic',
      pt: 'Arte e Processo Cerâmico',
      es: 'Arte y Proceso Cerámico',
    },
    date: '14 Nov 2026',
    readTime: '5 min',
    title: {
      ca: 'Del forn a la teva taula: Com elaborem tasses ceràmiques segures i fetes per durar tota la vida',
      pt: 'Do forno para a sua mesa: Como criamos canecas cerâmicas seguras e feitas para durar',
      es: 'Del horno a tu mesa: Cómo elaboramos tazas cerámicas seguras y hechas para durar toda la vida',
    },
    summary: {
      ca: 'Descobreix pas a pas com seleccionem el gres porcellànic, per què fem servir esmalts pastel sense plom ni cadmi i com la cocció a alta temperatura protegeix la foto del teu pelut.',
      pt: 'Descubra passo a passo como escolhemos a porcelana, por que usamos esmaltes pastel livres de chumbo e cádmio e como a queima de alta temperatura protege a foto do seu pet.',
      es: 'Descubre paso a paso cómo seleccionamos la porcelana, por qué usamos esmaltes pastel libres de plomo y cadmio y cómo la cocción de alta temperatura protege el retrato de tu mascota.',
    },
    keyPoints: {
      ca: [
        'Porcellana d’alta densitat que conserva l’escalfor del cafè sense cremar l’ansa.',
        'Esmalts vitrificats d’ús alimentari certificats (0% plom, 0% cadmi).',
        'Cocció a més de 800 °C perquè els colors i el nom no s’esborrin mai al rentaplats.',
        'Control manual peça a peça després de l’aprovació de la maqueta digital.',
      ],
      pt: [
        'Porcelana de alta densidade que mantém o café quentinho sem aquecer demais a alça.',
        'Esmaltes vitrificados de grau alimentício certificados (0% chumbo, 0% cádmio).',
        'Queima acima de 800 °C para que as cores e o nome do pet nunca desbotem na lava-louças.',
        'Revisão manual peça por peça após a aprovação da prévia digital.',
      ],
      es: [
        'Porcelana de alta densidad que conserva el calor del café sin quemar el asa.',
        'Esmaltes vitrificados de uso alimentario certificados (0% plomo, 0% cadmio).',
        'Cocción a más de 800 °C para que los colores y el nombre no se borren en el lavavajillas.',
        'Control manual pieza por pieza tras aprobar tu previsualización digital.',
      ],
    },
    content: {
      ca: [
        'Quan agafes una tassa Petozzy cada matí, sostens molt més que un recipient: hi ha darrere un ofici ceràmic cuidat al mil·límetre. Tot comença amb cossos de porcellana ceràmica fina d’alta vitrificació, escollits per la seva resistència als xocs tèrmics i la seva suavitat al tacte.',
        'Els nostres interiors en blau suau, verd menta, rosa pastel, groc mantega i lila s’apliquen amb esmalts minerals segurs per al contacte alimentari diari. No utilitzem vernissos sintètics ni recobriments plàstics barats que s’esquarteren amb l’aigua calenta.',
        'Un cop aproves la vista prèvia digital del teu gos o gat, integrem la imatge mitjançant fusió tèrmica dins la mateixa capa d’esmalt vitrificat. Això garanteix un acabat llis, brillant i resistent al microones i al rentaplats durant anys.'
      ],
      pt: [
        'Quando você segura uma caneca Petozzy todas as manhãs, tem nas mãos muito mais do que uma xícara: há um trabalho cerâmico cuidadoso em cada detalhe. Tudo começa com corpos de porcelana de alta vitrificação, escolhidos pela resistência térmica e toque macio.',
        'Nossos interiores em azul suave, verde menta, rosa pastel, amarelo manteiga e lilás recebem esmaltes minerais atóxicos certificados para contato diário com bebidas quentes — sem vernizes plásticos frágeis.',
        'Depois que você aprova a prévia digital com a foto e o nome do seu cão ou gato, fundimos a arte na própria camada vitrificada do esmalte. Isso garante brilho permanente e resistência real ao micro-ondas e à lava-louças.'
      ],
      es: [
        'Cuando sujetas una taza Petozzy cada mañana, sostienes mucho más que un recipiente: hay un oficio cerámico cuidado al detalle. Todo empieza con porcelana cerámica de alta vitrificación elegida por su resistencia térmica y suavidad al tacto.',
        'Nuestros interiores en azul suave, verde menta, rosa pastel, amarillo mantequilla y lila se esmaltan con pigmentos minerales seguros certificados para uso alimentario diario, sin barnices sintéticos ni plásticos que se agrieten.',
        'Una vez apruebas la previsualización digital de tu mascota, fundimos la imagen en la propia capa vítrea del esmalte. Así garantizamos un acabado suave, duradero y apto para microondas y lavavajillas.'
      ],
    },
  },
  {
    id: 'artesanal-vs-industrial',
    categoryKey: 'ceramica',
    categoryLabel: {
      ca: 'Art i Procés Ceràmic',
      pt: 'Arte e Processo Cerâmico',
      es: 'Arte y Proceso Cerámico',
    },
    date: '09 Nov 2026',
    readTime: '4 min',
    title: {
      ca: 'Ceràmica sota comanda vs. producció industrial massiva: Per què produir amb calma cuida el planeta',
      pt: 'Cerâmica sob demanda vs. produção em massa: Por que produzir com calma cuida do planeta',
      es: 'Cerámica artesanal frente a producción industrial masiva: Por qué fabricar sin excedentes cuida el planeta',
    },
    summary: {
      ca: 'Analitzem l’impacte ecològic i social de la ceràmica d’ofici enfront dels grans magatzems impersonals: zero sobrestoc, treball digne i peces amb ànima.',
      pt: 'Entenda a diferença ecológica e humana entre a cerâmica artesanal sob demanda e a fabricação industrial em larga escala: zero desperdício e trabalho justo.',
      es: 'Analizamos la diferencia ecológica y humana entre el taller bajo demanda y la fabricación masiva impersonal: cero sobrestock, trabajo digno y piezas con historia.',
    },
    keyPoints: {
      ca: [
        'Fabricació sota comanda: no emmagatzemem milers de peces destinades a ser destruïdes.',
        'Previsualització prèvia: redueix gairebé a zero les devolucions i transports innecessaris.',
        'Economia local i justa des del nostre taller a Vila-Seca sense intermediaris abusius.',
      ],
      pt: [
        'Produção sob demanda: evitamos estoques gigantes que acabam descartados.',
        'Prévia digital gratuita: reduz quase a zero devoluções e fretes desnecessários.',
        'Valorização do trabalho artesanal digno e comércio justo sem intermediários abusivos.',
      ],
      es: [
        'Fabricación bajo demanda: evitamos excedentes destinados a vertederos.',
        'Previsualización digital previa: reduce casi a cero devoluciones y transportes innecesarios.',
        'Economía local y condiciones laborales justas en nuestro taller de Vila-Seca.',
      ],
    },
    content: {
      ca: [
        'La indústria del regal promocional fabrica milions de tasses en sèrie sense ànima, sovint amb sous precaris i un enorme malbaratament d’energia i estocs no venuts. A Petozzy apostem pel camí contrari: produir només allò que algú estima.',
        'Cada comanda passa per mans reals que revisen el retall de la foto, equilibren la llum i preparen una maqueta digital perquè estiguis 100% convençut abans de gastar un sol watt d’energia al forn.',
        'Aquesta filosofia lenta i transparent redueix residus, respecta la feina artesanal i converteix cada tassa en un record irremplaçable que acompanya les famílies durant molts anys.'
      ],
      pt: [
        'A indústria de brindes em massa produz milhões de peças padronizadas com grande desperdício energético e condições de trabalho muitas vezes precárias. Na Petozzy escolhemos o caminho oposto: criar apenas o que carrega afeto real.',
        'Cada pedido passa por olhar humano atento para equilibrar a iluminação da foto e enviar a prévia digital antes mesmo de ligar o forno cerâmico.',
        'Essa abordagem consciente reduz resíduos, valoriza o comércio justo e transforma cada caneca em uma lembrança duradoura feita com respeito.'
      ],
      es: [
        'La gran industria de objetos promocionales produce millones de piezas en serie con enorme gasto energético, excedentes sin vender y cadenas laborales precarias. En Petozzy apostamos por fabricar solo piezas con verdadero valor afectivo.',
        'Cada encargo pasa por manos artesanas que ajustan el encuadre de tu perro o gato y te muestran la maqueta digital antes de consumir un solo vatio de horno.',
        'Esta forma de trabajar bajo demanda reduce residuos, protege el trabajo digno y da sentido a cada desayuno.'
      ],
    },
  },
  {
    id: 'enriquiment-ambiental-mascotes',
    categoryKey: 'bienestar',
    categoryLabel: {
      ca: 'Benestar Animal',
      pt: 'Bem-Estar Animal',
      es: 'Bienestar Animal',
    },
    date: '04 Nov 2026',
    readTime: '5 min',
    title: {
      ca: 'Enriquiment ambiental a casa: Idees senzilles perquè gossos i gats visquin més feliços i tranquils',
      pt: 'Enriquecimento ambiental em casa: Ideias simples para cães e gatos mais felizes e calmos',
      es: 'Enriquecimiento ambiental en casa: Ideas sencillas para perros y gatos más felices y serenos',
    },
    summary: {
      ca: 'Jocs d’olfacte, alçades segures per a gats i zones de descans respectades: petites adaptacions quotidianes que redueixen l’estrès i l’avorriment.',
      pt: 'Brincadeiras de farejar, prateleiras para gatos e cantinhos de descanso tranquilos: pequenas mudanças que reduzem o estresse e o tédio no dia a dia.',
      es: 'Juegos de olfato, alturas seguras para gatos y zonas de descanso respetadas: pequeños cambios diarios que reducen el estrés y el aburrimiento.',
    },
    keyPoints: {
      ca: [
        '15 minuts de joc d’olfacte cansen mentalment un gos tant com un llarg passeig.',
        'Els gats necessiten espais verticals (prestatges o grimpaires) per observar el seu territori amb seguretat.',
        'Respectar el seu lloc de descans sense interrupcions enforteix la confiança mútua.',
      ],
      pt: [
        '15 minutos de brincadeiras de faro cansam mentalmente o cão tanto quanto um passeio longo.',
        'Gatos precisam de rotas verticais (prateleiras e arranhadores) para se sentirem seguros.',
        'Respeitar o momento de sono sem interrupções fortalece o vínculo e reduz a ansiedade.',
      ],
      es: [
        '15 minutos de juegos de olfato estimulan la mente del perro tanto como una larga caminata.',
        'Los gatos necesitan circuitos verticales y escondites elevados para sentirse seguros.',
        'Respetar su zona de descanso sin interrupciones fortalece la confianza y la calma.',
      ],
    },
    content: {
      ca: [
        'Cuidar el benestar d’un animal de companyia va molt més enllà de donar-li aliment i passejos. Tant els gossos com els gats tenen necessitats cognitives i sensorials que podem satisfer fàcilment dins de casa.',
        'Per als gossos, amagar petits premis entre mantes enrotllades o catifes d’olfacte desperta el seu instint natural d’exploració i rebaixa el nerviosisme. Per als gats, habilitar finestres segures amb xarxa protectora i zones altes on descansar tranquils marca una diferència enorme.',
        'Quan respectem els seus ritmes naturals, la convivència a la llar es torna molt més serena, alegre i afectuosa.'
      ],
      pt: [
        'Cuidar do bem-estar de um pet vai muito além de ração e passeios rápidos. Cães e gatos têm necessidades mentais e sensoriais que podemos atender com carinho dentro de casa.',
        'Para os cães, esconder petiscos em paninhos enrolados ou tapetes de faro estimula o instinto natural e traz relaxamento. Para os gatos, janelas teladas e prateleiras elevadas garantem segurança e diversão.',
        'Quando respeitamos a natureza de cada espécie, a convivência fica ainda mais leve e afetuosa.'
      ],
      es: [
        'Cuidar el bienestar de un animal de compañía va mucho más allá del alimento y los paseos. Perros y gatos tienen necesidades cognitivas y sensoriales fáciles de atender dentro del hogar.',
        'Con los perros, esconder premios en mantas enrolladas o alfombras olfativas activa su mente y reduce el nerviosismo. Con los gatos, habilitar ventanas protegidas y repisas en altura les aporta serenidad y control de su entorno.',
        'Cuando respetamos sus ritmos naturales, la convivencia diaria se vuelve mucho más armónica.'
      ],
    },
  },
  {
    id: 'vincle-emocional-salut',
    categoryKey: 'bienestar',
    categoryLabel: {
      ca: 'Benestar Animal',
      pt: 'Bem-Estar Animal',
      es: 'Bienestar Animal',
    },
    date: '27 Oct 2026',
    readTime: '4 min',
    title: {
      ca: 'Benestar emocional i rutines de calma: Aprendre a llegir el llenguatge del teu company de quatre potes',
      pt: 'Bem-estar emocional e rotinas de calma: Aprenda a ler os sinais do seu companheiro',
      es: 'Bienestar emocional y rutinas de calma: Aprende a leer el lenguaje de tu compañero',
    },
    summary: {
      ca: 'Com reconèixer els senyals de calma, prevenir l’ansietat per separació i fomentar l’educació amable basada en el respecte.',
      pt: 'Como reconhecer sinais de tranquilidade ou desconforto, prevenir a ansiedade e educar com respeito e reforço positivo.',
      es: 'Cómo reconocer las señales de calma, prevenir la ansiedad por separación y apostar por una educación amable basada en el respeto.',
    },
    keyPoints: {
      ca: [
        'Els badalls suaus, girar el cap o llepar-se el musell són senyals de calma que cal escoltar.',
        'L’educació en positiu sense càstigs ni crits construeix un vincle sòlid sense por.',
        'Les rutines previsibles d’horaris i descans aporten seguretat emocional diària.',
      ],
      pt: [
        'Bocejos suaves, desviar o olhar ou lamber o focinho são sinais de apaziguamento que merecem atenção.',
        'Educação com reforço positivo e sem punições constrói confiança verdadeira sem medo.',
        'Rotinas previsíveis de alimentação, passeio e descanso trazem segurança emocional.',
      ],
      es: [
        'Bostezos suaves, girar la cabeza o lamerse el hocico son señales de calma que conviene escuchar.',
        'La educación amable con refuerzo positivo sin castigos construye un vínculo libre de miedo.',
        'Las rutinas estables de horarios y descanso ofrecen seguridad emocional diaria.',
      ],
    },
    content: {
      ca: [
        'Els nostres gossos i gats ens parlen constantment amb la postura de les orelles, el moviment de la cua i la mirada. Aprendre a interpretar aquests petits gestos evita situacions d’estrès innecessari.',
        'Avui la ciència etològica confirma que els mètodes d’educació respectuosa basats en el reforç positiu, la paciència i l’empatia són molt més eficaços i saludables que qualsevol càstig.',
        'A Petozzy estimem aquestes petites històries quotidianes de connexió, perquè sabem que darrere de cada nom imprès en una tassa hi ha anys de companyonia lleial.'
      ],
      pt: [
        'Nossos cães e gatos se comunicam o tempo todo pelo movimento das orelhas, da cauda e pelo olhar. Aprender a ler esses gestos evita estresse e melhora o diálogo diário.',
        'Estudos de comportamento animal confirmam que o ensino baseado em paciência, carinho e reforço positivo gera vínculos muito mais saudáveis do que qualquer punição.',
        'Na Petozzy celebramos esses laços cotidianos, sabendo que por trás de cada nome estampado em uma caneca existe uma história única de amizade.'
      ],
      es: [
        'Nuestros perros y gatos se comunican constantemente mediante las orejas, la mirada y la postura corporal. Aprender a interpretar esas señales evita situaciones de estrés innecesario.',
        'La etología actual demuestra que la educación amable basada en refuerzo positivo, paciencia y empatía resulta mucho más saludable y eficaz que el castigo.',
        'En Petozzy celebramos esos vínculos cotidianos, sabiendo que detrás de cada nombre impreso en una taza hay una historia real de afecto compartido.'
      ],
    },
  },
];

export const FAQS_LIST: FaqItem[] = [
  {
    id: 'faq-preview',
    question: {
      ca: 'Com funciona la previsualització digital abans de fabricar la tassa?',
      pt: 'Como funciona a prévia digital antes de fabricar a caneca?',
      es: '¿Cómo funciona la previsualización digital antes de fabricar la taza?',
    },
    answer: {
      ca: 'Un cop fas la comanda, el nostre equip de disseny prepara una maqueta digital amb la foto de la teva mascota retallada i optimitzada, el nom a sota i el color interior escollit. Te l’enviem per correu electrònic en menys de 24h i no passem la tassa al forn fins que ens dones el vistiplau.',
      pt: 'Assim que você faz o pedido, nossa equipe prepara uma arte digital com a foto do seu pet otimizada, o nome dele e a cor pastel escolhida. Enviamos por e-mail em menos de 24h e só produzimos após você aprovar!',
      es: 'Una vez realizas el pedido, nuestro equipo prepara una maqueta digital con la foto optimizada de tu mascota, su nombre debajo y el color pastel elegido. Te la enviamos en menos de 24h y no horneamos la taza hasta que nos das el visto bueno.',
    },
  },
  {
    id: 'faq-photo',
    question: {
      ca: 'Quina qualitat ha de tenir la fotografia del meu gos o gat?',
      pt: 'Qual qualidade precisa ter a foto do meu cachorro ou gato?',
      es: '¿Qué calidad debe tener la fotografía de mi perro o gato?',
    },
    answer: {
      ca: 'Qualsevol foto nítida feta amb un telèfon mòbil actual serveix perfectament! L’únic important és que estigui ben il·luminada i no surti moguda. Si veiem que la resolució és baixa, t’avisarem gratuïtament durant la fase de previsualització per triar-ne una altra.',
      pt: 'Qualquer foto nítida tirada com um celular atual funciona super bem! O importante é ter boa iluminação e mostrar o rostinho do pet. Se a imagem estiver com baixa resolução, avisamos você na hora da prévia digital.',
      es: '¡Cualquier foto nítida hecha con un teléfono móvil actual sirve perfectamente! Solo recomendamos buena iluminación y que no esté borrosa. Si notamos poca resolución, te avisaremos antes de imprimir para cambiarla sin coste.',
    },
  },
  {
    id: 'faq-dishwasher',
    question: {
      ca: 'Les tasses es poden posar al rentaplats i al microones?',
      pt: 'As canecas podem ir ao micro-ondas e à lava-louças?',
      es: '¿Las tazas son aptas para lavavajillas y microondas?',
    },
    answer: {
      ca: 'Sí! Utilitzem porcellana ceràmica AAA+ amb cocció d’alta temperatura i esmalts interiors segurs (lliures de plom i cadmi). La impressió queda integrada dins l’esmalt i resisteix perfectament l’ús diari al microones i al rentaplats.',
      pt: 'Sim! Usamos porcelana cerâmica AAA+ com queima de alta temperatura e esmaltes atóxicos. A estampa fica fundida no esmalte e resiste tranquilamente ao uso diário no micro-ondas e lava-louças.',
      es: '¡Sí! Empleamos cerámica AAA+ horneada a alta temperatura con esmaltes seguros sin plomo ni cadmio. La impresión se funde en el esmalte y resiste perfectamente el microondas y el lavavajillas diario.',
    },
  },
  {
    id: 'faq-shipping',
    question: {
      ca: 'Quant triga a arribar la meva tassa i què passa si arriba trencada?',
      pt: 'Quanto tempo demora para chegar e o que acontece se quebrar no caminho?',
      es: '¿Cuánto tarda en llegar mi taza y qué ocurre si sufre algún golpe?',
    },
    answer: {
      ca: 'Un cop aproves la maqueta digital, la produïm en 24h i l’enviem des de Vila-Seca (Tarragona) amb entrega en 24-48h a la Península (i 5-7 dies laborables per a enviaments al Brasil). Totes les caixes porten protecció anti-impacte, però si mai arriba amb un desperfecte te’n fabriquem una de nova de franc immediatament.',
      pt: 'Depois que você aprova a prévia digital, produzimos em 24h e enviamos com embalagem anti-impacto. Se por qualquer motivo chegar danificada, enviamos uma caneca novinha sem nenhum custo extra.',
      es: 'Una vez apruebas la maqueta digital, la fabricamos en 24h y la enviamos desde Vila-Seca (Tarragona) con entrega en 24-48h en Península. Todas viajan en cajas anti-impacto, y ante cualquier rotura te enviamos una nueva gratis al instante.',
    },
  },
];

export const TESTIMONIALS_LIST: TestimonialItem[] = [
  {
    id: 'test-1',
    customerName: 'Marta Soler',
    petName: 'Buddy',
    city: 'Vila-Seca, Tarragona',
    rating: 5,
    image: '/src/assets/images/gallery_customer_happy_mug_1794854514770.jpg',
    quote: {
      ca: 'Em feia por que la foto del mòbil no quedés nítida, però quan em van enviar la previsualització digital vaig quedar tranquil·líssima. L’interior en blau suau és preciós!',
      pt: 'Tinha receio de a foto do celular não ficar nítida, mas quando recebi a prévia digital fiquei encantada. O interior azul suave é lindo demais!',
      es: 'Me daba respeto que la foto del móvil no quedara nítida, pero al recibir la previsualización digital me quedé tranquilísima. ¡El interior azul suave es precioso!',
    },
    outcome: {
      ca: 'Previsualització aprovada en 12h · Lliurada en 48h',
      pt: 'Prévia aprovada em 12h · Entregue em 48h',
      es: 'Previsualización aprobada en 12h · Entregada en 48h',
    },
  },
  {
    id: 'test-2',
    customerName: 'Lucas & Camila Ferreira',
    petName: 'Luna & Oliver',
    city: 'Porto Alegre, Brasil',
    rating: 5,
    image: '/src/assets/images/gallery_gift_box_pastel_1794854514834.jpg',
    quote: {
      ca: 'Vam demanar dues tasses per regalar amb la caixa kraft i el llaç blau suau. Poder seguir el paquet pas a pas des del mòbil ens va donar moltíssima confiança.',
      pt: 'Pedimos duas canecas para presente com a caixinha kraft e laço azul suave. Poder acompanhar cada etapa do rastreamento deu muita tranquilidade!',
      es: 'Pedimos dos tazas para regalo con la caja kraft y el lazo azul suave. Poder seguir el paquete paso a paso en la web nos dio muchísima confianza.',
    },
    outcome: {
      ca: 'Pack Duo Regal · Seguiment verificat',
      pt: 'Pack Presente Duo · Rastreamento verificado',
      es: 'Pack Regalo Dúo · Seguimiento verificado',
    },
  },
  {
    id: 'test-3',
    customerName: 'Jordi Casals',
    petName: 'Rocky',
    city: 'Barcelona, Catalunya',
    rating: 5,
    image: '/src/assets/images/mug_rocky_frenchie_1794328864159.jpg',
    quote: {
      ca: 'La tassa del Rocky amb el nom escrit a sota i el fons lila s’ha convertit en la meva preferida de l’oficina. La ceràmica és molt robusta i el color no perd intensitat.',
      pt: 'A caneca do Rocky com o nome embaixo e o interior lilás virou minha favorita no trabalho. A cerâmica é super resistente e o acabamento impecável.',
      es: 'La taza de Rocky con su nombre debajo y el interior lila se ha convertido en mi favorita de la oficina. La cerámica es muy robusta y el color impecable.',
    },
    outcome: {
      ca: 'Ús diari en rentaplats · Client recurrent',
      pt: 'Uso diário na lava-louças · Cliente recorrente',
      es: 'Uso diario en lavavajillas · Cliente recurrente',
    },
  },
];
