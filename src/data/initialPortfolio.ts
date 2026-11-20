import { MoodboardItem, PortfolioData, ProjectItem } from '../types/portfolio';

export const PROFILE_CARDS = [
  {
    id: 'creative',
    title: 'Créative',
    color: 'coral' as const,
    bg: 'rgba(231, 164, 155, 0.38)',
    border: 'rgba(231, 164, 155, 0.72)',
    accent: '#C94F7C',
    points: [
      'Ligne directrice des visuels & vidéos publicitaires',
      'Création de supports : visuels, flyers, présentations',
      'Maîtrise d’outils : Figma, Canva, Milanote',
    ],
  },
  {
    id: 'stratege',
    title: 'Stratège',
    color: 'lilac' as const,
    bg: 'rgba(205, 184, 240, 0.42)',
    border: 'rgba(205, 184, 240, 0.78)',
    accent: '#6F4FA6',
    points: [
      'Comprendre le produit ou service à vendre',
      'Identifier à qui le vendre (cibles) & comment',
      'Stratégie marketing, veille, benchmark & KPI',
    ],
  },
  {
    id: 'organisee',
    title: 'Organisée',
    color: 'sage' as const,
    bg: 'rgba(217, 225, 204, 0.56)',
    border: 'rgba(182, 198, 160, 0.8)',
    accent: '#4F6638',
    points: [
      'Suivi d’activité de 9 collaborateurs et coordination',
      'Organisation et animation de réunions',
      'Rigueur et logistique événementielle',
    ],
  },
  {
    id: 'relationnelle',
    title: 'Relationnelle',
    color: 'yellow' as const,
    bg: 'rgba(241, 209, 111, 0.44)',
    border: 'rgba(241, 209, 111, 0.85)',
    accent: '#8D690B',
    points: [
      'Médiation, écoute et recherche de solutions amiables',
      'Prospection et relation avec les entreprises',
      "Tenue d'un stand sur un salon professionnel",
    ],
  },
];

export const REPERES_ITEMS = [
  'Formation actuelle : Mastère Stratégie Marketing, Ascencia Business School',
  'Parcours : droit et management',
  'Outils : Figma, Canva, Milanote, Pack Office, CRM',
  'Langue : anglais B1',
];

export const TIMELINE_ITEMS = [
  {
    period: '2013–2017',
    label: 'Licence de droit',
    place: 'Université de Bordeaux',
    tag: 'Fondations analytiques',
    rotate: -1.4,
    tapeColor: '#E7A49B',
  },
  {
    period: 'oct. 2015 – avr. 2016',
    label: "Assistante bibliothécaire (contrat étudiant) : accueil, gestion des prêts et retours",
    place: "Bibliothèque universitaire d'Agen",
    tag: 'Accueil & organisation',
    rotate: 1.0,
    tapeColor: '#B7D8F2',
  },
  {
    period: '2017–2019',
    label: 'Mastère Droit des affaires puis Master Droit de la propriété intellectuelle',
    place: 'Université Toulouse 1 Capitole',
    tag: 'Création & droit des marques',
    rotate: 1.1,
    tapeColor: '#CDB8F0',
  },
  {
    period: 'août 2018',
    label: "Stagiaire : recherches documentaires et collecte d'informations institutionnelles",
    place: 'Cabinet de Maître Le Quéré, Villeneuve-sur-Lot',
    tag: 'Recherche & synthèse',
    rotate: -1.1,
    tapeColor: '#F6C9A3',
  },
  {
    period: 'mai – oct. 2019',
    label: "Juriste stagiaire à l'INPI : prospection d'entreprises, veille et notes de synthèse",
    place: 'Toulouse',
    tag: 'Veille & relation entreprises',
    rotate: -0.9,
    tapeColor: '#F1D16F',
  },
  {
    period: 'août 2020 – oct. 2024',
    label: 'Juriste protection juridique chez Covéa (CDI) : écoute, analyse, vulgarisation',
    place: 'Noisy-le-Grand',
    tag: 'Clarté & pédagogie',
    rotate: 1.5,
    tapeColor: '#D9E1CC',
  },
  {
    period: 'oct. 2022 – oct. 2023',
    label: 'Assistante communication bénévole pour Marie-Laure Nobs : contenus LinkedIn, veille, benchmark',
    place: 'À distance',
    tag: 'Déclic communication',
    rotate: -1.2,
    tapeColor: '#E7B6C5',
  },
  {
    period: 'oct. 2023 – oct. 2024',
    label: 'Manager de proximité chez MMA Assurances : suivi KPI (9 collaborateurs), réunions, communication interne',
    place: 'Chartres',
    tag: 'Pilotage & terrain',
    rotate: 0.9,
    tapeColor: '#B7D8F2',
  },
  {
    period: '2023',
    label: 'Certification Management & Leadership',
    place: 'Udemy',
    tag: 'Posture managériale',
    rotate: -1.6,
    tapeColor: '#F6C9A3',
  },
  {
    period: '2025',
    label: 'Formation en médiation de la consommation',
    place: 'IGPDE',
    tag: 'Écoute & dialogue',
    rotate: 1.2,
    tapeColor: '#D9E1CC',
  },
  {
    period: 'oct. 2025 – juin 2026',
    label: "Juriste chargée de médiation eau et assainissement à Médiation de l'Eau (CDI)",
    place: 'Paris',
    tag: 'Solutions amiables',
    rotate: -0.8,
    tapeColor: '#E7A49B',
  },
  {
    period: '2026–2028',
    label: 'Mastère Management & Stratégie Marketing, en alternance',
    place: 'Ascencia Business School',
    tag: 'Cap marketing & marque',
    url: 'https://www.ascencia-business-school.com/formations/marketing/mastere-management-strategie-marketing/',
    rotate: 1.3,
    tapeColor: '#C94F7C',
    highlight: true,
  },
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'mariage-papeterie',
    title: 'Thème Mariage — Papeterie & plans de table',
    category: 'Communication & Événements',
    context: 'Organisation d’événements & design éditorial',
    role: 'Conception de plans de table et du programme « Mr. & Mrs Wedding Day »',
    challenge:
      'Allier simplicité, élégance et repérage immédiat des invités tout en reflétant une atmosphère naturelle et lumineuse.',
    idea:
      'Décliner deux ambiances de plan de table (botanique émeraude/or et géométrique floral épuré) complétées par un carton programme horaire fleuri.',
    deliverables: ['Plan de table botanique', 'Plan de table géométrique', 'Programme Wedding Day'],
    accentColor: 'yellow',
    featured: false,
    visuals: [
      {
        id: 'vis-mariage-geo',
        url: '/assets/extracted/mood_56.png',
        alt: 'Plan de table mariage géométrique doré et floral',
        caption: 'Plan de table floral & doré',
        updatedAt: '2026-11-16T00:00:00.000Z',
      },
      {
        id: 'vis-mariage-botanique',
        url: '/assets/extracted/mood_51.png',
        alt: 'Plan de table mariage feuillage vert et texture or',
        caption: 'Plan de table botanique',
        updatedAt: '2026-11-16T00:00:00.000Z',
      },
      {
        id: 'vis-mariage-prog',
        url: '/assets/extracted/mood_54.png',
        alt: 'Programme Mr. & Mrs Wedding Day',
        caption: 'Programme Wedding Day',
        updatedAt: '2026-11-16T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'logos-minimalistes',
    title: 'Logos en vrac — Minimalisme, clarté & lisibilité',
    category: 'Créations visuelles',
    context: 'Identités visuelles & branding personnel',
    role: 'Création de logotypes et recherche d’équilibre géométrique',
    challenge:
      'Exprimer trois univers très différents (identité personnelle d’artiste, institut bien-être, convention tatouage) avec des lignes pures et lisibles.',
    idea:
      'Travailler la symétrie, les cadres fins or et noir, les contrastes typographiques et les motifs botaniques au trait pour des logos immédiatement identifiables.',
    deliverables: ['Logo CÉDRINE_ARTISTE', 'Logo Beauty Time Spa & Détente', 'Visuel Convention Tatoo Flash'],
    accentColor: 'sage',
    featured: true,
    visuals: [
      {
        id: 'vis-logo-cedrine',
        url: '/assets/extracted/mood_132.png',
        alt: 'Logo géométrique noir et or CÉDRINE_ARTISTE',
        caption: 'CÉDRINE_ARTISTE',
        updatedAt: '2026-11-16T00:00:00.000Z',
      },
      {
        id: 'vis-logo-spa',
        url: '/assets/extracted/mood_135.png',
        alt: 'Logo Beauty Time Spa & Détente sur fond marbre',
        caption: 'Beauty Time — Spa & Détente',
        updatedAt: '2026-11-16T00:00:00.000Z',
      },
      {
        id: 'vis-logo-tatoo',
        url: '/assets/extracted/mood_129.png',
        alt: 'Logo botanique noir et blanc Convention Tatoo Flash',
        caption: 'Convention Tatoo Flash',
        updatedAt: '2026-11-16T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'halloween-parcs',
    title: 'Parcs d’attractions Halloween — Du Labyrinthe au parc enfant',
    category: 'Créations visuelles',
    context: 'Moodboard & maquettes Figma / Canva',
    role: 'Direction artistique, conception d’affiche, logo et maquettes de site web',
    challenge:
      'Décliner un même thème saisonnier (Halloween) pour deux publics distincts : sensations fortes pour adultes vs univers ludique et rassurant pour enfants.',
    idea:
      'D’un côté, une affiche texturée sang et parchemin pour « Le Labyrinthe » (#9F1E1E) ; de l’autre, un site coloré pour « La vague enchantée » mêlant violet, orange et vert (#5E2BB7, #ED8014, #0DD173) autour de mascottes et du slogan « Une photo ou un sort ? ».',
    deliverables: ['Maquettes web Figma', 'Affiche Le Labyrinthe', 'Logo La vague enchantée', 'Palettes dédiées'],
    accentColor: 'lilac',
    featured: true,
    visuals: [
      {
        id: 'vis-halloween-labyrinthe',
        url: '/assets/extracted/mood_11.png',
        alt: 'Affiche Le Labyrinthe Halloween pour public adulte',
        caption: 'Le Labyrinthe — Public adulte',
        updatedAt: '2026-11-16T00:00:00.000Z',
      },
      {
        id: 'vis-halloween-web',
        url: '/assets/extracted/mood_17.png',
        alt: 'Maquettes de site web Halloween pour parc d’attractions enfant (Figma et Canva)',
        caption: 'Site Halloween — Figma & Canva',
        updatedAt: '2026-11-16T00:00:00.000Z',
      },
      {
        id: 'vis-halloween-logo',
        url: '/assets/extracted/mood_18.png',
        alt: 'Logo La vague enchantée',
        caption: 'Logo La vague enchantée',
        updatedAt: '2026-11-16T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'fete-du-raisin',
    title: 'Thème « Fête du raisin » — Affiches Canva & Figma',
    category: 'Créations visuelles',
    context: 'Inspiration « Pruneau Show » à Agen',
    role: 'Conception de piste créative, déclinaisons d’affiches et recherche chromatique',
    challenge:
      'Valoriser une fête de village conviviale autour d’un produit local et d’une programmation musicale de plus de 80 artistes.',
    idea:
      'Explorer deux écritures complémentaires : une affiche champêtre réalisée sur Canva et une composition graphique géométrique réalisée sur Figma autour des teintes Studio (#7641BA), Cruise (#BFEED7) et Golden Sand (#EED171).',
    deliverables: ['Affiche Canva', 'Affiche Figma', 'Planche d’inspiration & palette'],
    accentColor: 'coral',
    featured: false,
    visuals: [
      {
        id: 'vis-fete-raisin',
        url: '/assets/extracted/mood_3.png',
        alt: 'Planche Fête du raisin comparant les créations Canva et Figma avec palette de couleurs',
        caption: 'Canva & Figma — Fête du raisin',
        updatedAt: '2026-11-16T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'noel-jouets-gala',
    title: 'Noël ! Grand Gala & Magasin « Les Jouets en Bois »',
    category: 'Créations visuelles',
    context: 'Campagne fêtes de fin d’année (affiche, flyer & site)',
    role: 'Création d’affiches, identité visuelle du chalet et illustration chaleureuse',
    challenge:
      'Transmettre la chaleur d’un foyer et l’esprit artisanal de Noël tout en gardant des informations événementielles et horaires parfaitement lisibles.',
    idea:
      'Associer une affiche « Grand Gala de Noël » à l’effet peinture à la main (vert sapin, or et rouge carmin) et un support chaleureux pour « Les Jouets en Bois » centré sur une scène de cheminée et des tons doux (#E7AD83, #C9901B, #CF0303).',
    deliverables: ['Affiche Grand Gala', 'Flyer magasin de jouets', 'Logo & illustration'],
    accentColor: 'pink',
    featured: true,
    visuals: [
      {
        id: 'vis-noel-foyer',
        url: '/assets/extracted/mood_100.jpg',
        alt: 'Illustration chaleureuse de cheminée et salon de Noël',
        caption: 'Illustration chaleur du foyer',
        updatedAt: '2026-11-16T00:00:00.000Z',
      },
      {
        id: 'vis-noel-magasin',
        url: '/assets/extracted/mood_96.png',
        alt: 'Affiche Noël approche pour le magasin Les Jouets en Bois',
        caption: 'Noël approche — Les Jouets en Bois',
        updatedAt: '2026-11-16T00:00:00.000Z',
      },
      {
        id: 'vis-noel-gala',
        url: '/assets/extracted/mood_97.jpg',
        alt: 'Affiche Grand Gala de Noël façon peinture à la main',
        caption: 'Grand Gala de Noël — Effet peinture',
        updatedAt: '2026-11-16T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'bien-etre-permissions',
    title: 'Thème Bien-être — Affiche « Les 12 permissions »',
    category: 'Créations visuelles',
    context: 'Création éditoriale et direction bien-être (Word & Pixabay)',
    role: 'Mise en page, hiérarchisation typographique et recherche atmosphérique',
    challenge:
      'Rendre 12 principes de bien-être et d’affirmation de soi agréables à lire, apaisants et visuellement mémorables.',
    idea:
      'Composer une nuit étoilée bleu profond (#0F2779 vers #4234B9) portée par des constellations fines et un univers cosmique doux autour de mots-clés : Douceur, Évasion, Tranquillité, Amour de soi.',
    deliverables: ['Affiche Les 12 permissions', 'Palette cosmique', 'Univers sémantique'],
    accentColor: 'sky',
    featured: false,
    visuals: [
      {
        id: 'vis-bien-etre-12',
        url: '/assets/extracted/mood_333.png',
        alt: 'Affiche Les 12 permissions sur fond bleu nuit étoilé',
        caption: 'Les 12 permissions (Word)',
        updatedAt: '2026-11-16T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'lepifemme',
    title: 'Projet L’Épifemme — Concept, positionnement & univers de marque',
    category: 'Stratégie & KPI',
    context: 'Projet scolaire réalisé dans le cadre d’un exercice noté',
    role: 'Conception du concept, étude de marché, positionnement et construction d’univers',
    challenge:
      'Dans le cadre d’un exercice scolaire noté, imaginer un concept singulier et crédible en reliant dès l’origine réflexion stratégique, analyse du marché et manière de présenter l’offre au public.',
    idea:
      'Construire L’Épifemme comme un univers global et cohérent : définition du positionnement, étude de la cible et des codes du secteur, formulation du message et harmonisation entre les mots, les couleurs, les visuels et l’expérience proposée.',
    deliverables: [
      'Concept & proposition de valeur',
      'Étude de marché & positionnement',
      'Univers de marque cohérent',
      'Support de présentation',
    ],
    accentColor: 'pink',
    featured: false,
    externalUrl: 'https://l-pifemme.netlify.app',
    externalLabel: 'Visiter le site L’Épifemme',
    externalNote:
      'Exercice scolaire : les informations figurant sur ce site (produits, avis, coordonnées) sont entièrement fictives.',
    visuals: [],
  },
  {
    id: 'innovations-immersives',
    title: 'Innovations immersives — Analyses marketing & expérience de marque',
    category: 'Stratégie & KPI',
    context: 'Travaux de recherche, veille stratégique & marketing expérientiel',
    role: 'Recherche documentaire, analyse de marché, benchmark et mise en récit stratégique',
    challenge:
      'Comprendre comment les dispositifs immersifs créent de la valeur pour une marque au-delà de l’effet technologique, et structurer une présentation convaincante.',
    idea:
      'Mettre ma rigueur de recherche et de synthèse au service de l’analyse marketing : étude des usages, benchmark d’expériences immersives, réflexion sur le positionnement et scénarisation d’une présentation claire et orientée client.',
    deliverables: [
      'Analyse marketing & marché',
      'Veille sur les innovations immersives',
      'Positionnement & expérience proposée',
      'Synthèse & présentation orale',
    ],
    accentColor: 'lilac',
    featured: false,
    visuals: [],
  },
  {
    id: 'linkedin-contents',
    title: 'Stratégie & création de contenus LinkedIn',
    category: 'Contenus & Réseaux',
    context: 'Assistante communication bénévole pour Marie-Laure Nobs (oct. 2022 – oct. 2023)',
    role: 'Rédaction éditoriale, proposition de formats visuels et planification de diffusion',
    challenge:
      'Structurer une prise de parole régulière et lisible sur LinkedIn en variant les formats tout en s’adaptant au rythme des publics.',
    idea:
      'Alterner photos, carrousels pédagogiques et vidéos courtes, sélectionner des hashtags pertinents après veille et benchmark, et adapter les jours et horaires de diffusion aux habitudes de consultation des publics.',
    deliverables: ['Photos & carrousels', 'Vidéos courtes', 'Veille & benchmark', 'Sélection de hashtags'],
    accentColor: 'coral',
    featured: false,
    visuals: [],
  },
  {
    id: 'mma-kpi',
    title: 'Pilotage par les indicateurs (KPI) chez MMA',
    category: 'Stratégie & KPI',
    context: 'Manager de proximité, MMA Assurances — Chartres (oct. 2023 – oct. 2024)',
    role: 'Contribution à la définition des KPI, suivi en temps réel de 9 collaborateurs et accompagnement',
    challenge:
      'Donner de la visibilité sur l’activité quotidienne d’une équipe de 9 collaborateurs et transformer des données en repères concrets.',
    idea:
      'Clarifier les objectifs et données à relever, suivre l’activité en temps réel, conduire les entretiens et réunions d’équipe, et identifier des axes d’amélioration partagés.',
    deliverables: ['Définition des KPI', 'Suivi d’activité (9 collaborateurs)', 'Entretiens & réunions'],
    accentColor: 'lilac',
    featured: false,
    visuals: [],
  },
  {
    id: 'salon-prospection',
    title: 'Prospection B2B & salon professionnel',
    category: 'Communication & Événements',
    context: 'INPI Toulouse (mai – oct. 2019) & terrain événementiel',
    role: 'Tenue de stand, prospection d’entreprises et rédaction de notes de synthèse',
    challenge:
      'Capter l’attention sur un salon ou en rendez-vous B2B, qualifier les besoins des entreprises et adapter le discours aux enjeux de leur secteur.',
    idea:
      'Analyser en amont les portefeuilles de propriété intellectuelle des entreprises pour préparer des échanges ciblés et produire des notes de synthèse utiles pour toute l’équipe.',
    deliverables: ['Tenue de stand', 'Prospection B2B', 'Notes de synthèse'],
    accentColor: 'yellow',
    featured: false,
    visuals: [],
  },
];

export const INITIAL_MOODBOARD: MoodboardItem[] = [
  {
    id: 'mood-img-permissions',
    type: 'image',
    title: 'Thème Bien-être · Word',
    caption: 'Les 12 permissions — Douceur, étoiles & apaisement',
    imageUrl: '/assets/extracted/mood_333.png',
    imageAlt: 'Affiche Les 12 permissions créée par Cédrine',
    bgTone: 'sky',
    x: 3,
    y: 5,
    rotate: -2.2,
    zIndex: 2,
  },
  {
    id: 'mood-img-raisin',
    type: 'image',
    title: 'Fête du raisin · Canva & Figma',
    caption: 'Deux regards visuels autour d’un événement local',
    imageUrl: '/assets/extracted/mood_3.png',
    imageAlt: 'Planche Fête du raisin Canva et Figma',
    bgTone: 'lilac',
    x: 28,
    y: 4,
    rotate: 1.4,
    zIndex: 3,
  },
  {
    id: 'mood-img-halloween',
    type: 'image',
    title: 'Halloween Parc enfant · Figma',
    caption: 'Une photo ou un sort ? — Masques, mascottes & jeu',
    imageUrl: '/assets/extracted/mood_17.png',
    imageAlt: 'Maquette de site Halloween pour parc d’attractions enfant',
    bgTone: 'yellow',
    x: 56,
    y: 7,
    rotate: -1.6,
    zIndex: 4,
  },
  {
    id: 'mood-palette-moodboard',
    type: 'palette',
    title: 'Couleurs de mes planches',
    caption: 'Du bleu nuit (#0F2779) au violet Studio (#7641BA), Cruise (#BFEED7) & Tango (#ED8014)',
    colors: ['#0F2779', '#7641BA', '#BFEED7', '#EED171', '#ED8014', '#CF0303', '#E7AD83'],
    bgTone: 'cream',
    x: 74,
    y: 44,
    rotate: 2.1,
    zIndex: 5,
  },
  {
    id: 'mood-img-mariage',
    type: 'image',
    title: 'Thème Mariage',
    caption: 'Simplicité, luxe, amour, nature',
    imageUrl: '/assets/extracted/mood_56.png',
    imageAlt: 'Plan de table mariage géométrique doré et floral',
    bgTone: 'sage',
    x: 6,
    y: 50,
    rotate: 1.9,
    zIndex: 6,
  },
  {
    id: 'mood-img-noel',
    type: 'image',
    title: 'Noël ! · Les jouets en bois',
    caption: 'Chaleur d’un foyer, contes & artisanat',
    imageUrl: '/assets/extracted/mood_96.png',
    imageAlt: 'Flyer Noël approche pour Les Jouets en Bois',
    bgTone: 'coral',
    x: 32,
    y: 48,
    rotate: -1.8,
    zIndex: 7,
  },
  {
    id: 'mood-img-logo',
    type: 'image',
    title: 'Logos en vrac',
    caption: 'Minimalisme, simplicité, clarté et lisibilité',
    imageUrl: '/assets/extracted/mood_132.png',
    imageAlt: 'Logo CÉDRINE_ARTISTE noir et or',
    bgTone: 'pink',
    x: 56,
    y: 52,
    rotate: 1.5,
    zIndex: 8,
  },
  {
    id: 'mood-note-mantra',
    type: 'quote',
    title: 'Mantra créatif',
    caption: 'Create. Think. Grow. — Relier l’écoute stratégique au plaisir de composer.',
    bgTone: 'cream',
    x: 74,
    y: 10,
    rotate: -2.4,
    zIndex: 9,
  },
];

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
  portrait: {
    id: 'cedrine-cv-portrait',
    url: '/assets/extracted/cv_1.png',
    alt: 'Portrait naturel de Cédrine Pigeon-Schneider',
    caption: 'Cédrine Pigeon-Schneider',
    updatedAt: '2026-11-16T00:00:00.000Z',
  },
  artisticPhoto: {
    id: 'cedrine-secondary-portrait',
    url: '/assets/aistudio/Photo_de_CV_cda2f7ae.png',
    alt: 'Portrait souriant de Cédrine Pigeon-Schneider',
    caption: 'Stratégie & créativité',
    updatedAt: '2026-11-18T00:00:00.000Z',
  },
  projects: INITIAL_PROJECTS,
  moodboard: INITIAL_MOODBOARD,
  hasCustomCv: true,
  publishedAt: '2026-11-16T00:00:00.000Z',
};

export const APPRENTICESHIP_DETAILS = {
  formation: 'Mastère Management & Stratégie Marketing, Ascencia Business School',
  formationUrl:
    'https://www.ascencia-business-school.com/formations/marketing/mastere-management-strategie-marketing/',
  duration: '2 ans (2026–2028)',
  rhythm: '2 jours en formation / 3 jours en entreprise',
  location: 'Chessy (77700), Val d’Europe — Seine-et-Marne (77)',
  mobility: "Chessy, Serris, Montévrain, Marne-la-Vallée, Meaux et tout l’axe RER A jusqu'à Paris",
  startDate: 'Immédiatement',
  missions: [
    'Analyse du produit ou service à vendre et de sa valeur',
    'Étude des publics cibles : à qui vendre et comment',
    'Élaboration de la stratégie marketing et du positionnement',
    'Création de la ligne directrice des visuels & vidéos publicitaires',
    'Veille éditoriale, benchmark et suivi d’indicateurs (KPI)',
    'Coordination de projets, contenus LinkedIn et événementiel',
  ],
};

export const CONTACT_INFO = {
  email: 'pigeon-schneider@outlook.fr',
  linkedin: 'https://www.linkedin.com/in/cedrine-pigeon-schneider',
  cvFileName: 'CV_de_Cédrine_PIGEON-SCHNEIDER.pdf',
  city: 'Chessy (77700)',
};

export interface RecommendationLetter {
  id: string;
  author: string;
  role: string;
  organization: string;
  date: string;
  documentTitle: string;
  highlight: string;
  quote: string;
  pdfPath: string;
  downloadName: string;
  tapeColor: string;
  surface: string;
  darkSurface: string;
  accentColor: string;
  darkAccentColor: string;
  rotate: number;
}

export const RECOMMENDATIONS: RecommendationLetter[] = [
  {
    id: 'reco-poujade',
    author: 'Mme Hélène Poujade',
    role: 'Maître de Conférences (MCF) · Centre de Droit des Affaires',
    organization: 'Université Toulouse 1 – Capitole',
    date: '1er décembre 2017',
    documentTitle: 'Lettre de recommandation',
    highlight: 'Vivacité d’esprit, finesse d’analyse & prise de parole devant 400 étudiants',
    quote:
      '« Ces précieux échanges sont à mon sens révélateurs d’une grande capacité d’écoute, d’un esprit vif et synthétique ainsi que d’une grande motivation […] cette volonté, cette rigueur et cette curiosité intellectuelles sont tout aussi précieuses lorsqu’il s’agit d’examiner les qualités et compétences d’un étudiant. »',
    pdfPath: '/assets/aistudio/Mme_POUJADE_recommandation_1c52b927.pdf',
    downloadName: 'Lettre_de_recommandation_Helene_Poujade.pdf',
    tapeColor: '#CDB8F0',
    surface: 'rgba(205, 184, 240, 0.24)',
    darkSurface: 'rgba(205, 184, 240, 0.14)',
    accentColor: '#6F4FA6',
    darkAccentColor: '#D2BFF7',
    rotate: -1.1,
  },
  {
    id: 'reco-le-quere',
    author: 'Maître Yves Le Quéré',
    role: 'Notaire associé',
    organization: 'Office Notarial · Villeneuve-sur-Lot',
    date: '23 août 2018',
    documentTitle: 'Attestation de stage & recommandation',
    highlight: 'Facultés d’adaptation, travail d’équipe & rigueur professionnelle',
    quote:
      '« Cédrine a montré des facultés d’adaptation très développées pour s’intégrer parfaitement au travail de groupe, un excellent relationnel et a réalisé un important travail de très grande qualité. Son ouverture d’esprit, sa rigueur, et son envie de faire et de faire bien feront d’elle une excellente professionnelle. »',
    pdfPath: '/assets/aistudio/Lettre_de_recommandation_Mai_tre_LE_QUERE_68c06e7e.pdf',
    downloadName: 'Attestation_recommandation_Maitre_Le_Quere.pdf',
    tapeColor: '#E7A49B',
    surface: 'rgba(231, 164, 155, 0.24)',
    darkSurface: 'rgba(231, 164, 155, 0.14)',
    accentColor: '#C94F7C',
    darkAccentColor: '#F08AA8',
    rotate: 1.1,
  },
];

