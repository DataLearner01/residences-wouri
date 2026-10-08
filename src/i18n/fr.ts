// Textes de l'interface en français.
// {marque} est remplacé automatiquement par le nom défini dans src/config/site.ts.
// Les autres {variables} sont remplies par les pages.

const fr = {
  common: {
    skip: 'Aller au contenu',
    baseline: 'Bâtir à Douala, livrer avec confiance.',
    demoNotice: 'Site de démonstration. Toutes les données sont fictives.',
    from: 'À partir de',
    seeProgramme: 'Voir le programme',
    see: 'Voir',
    memberIntro: 'Je suis',
    allProgrammes: 'Tous les programmes',
    openMaps: 'Ouvrir dans Google Maps',
    mapNote: 'Plan schématique de Douala, non à l’échelle.',
    mapAlt: 'Plan schématique de Douala situant {lieu}',
    breadcrumb: 'Fil d’Ariane',
    visit: 'Demander une visite',
    logoAlt: '{marque}, retour à l’accueil',
  },

  nav: {
    label: 'Navigation principale',
    home: 'Accueil',
    programmes: 'Programmes',
    avancement: 'Avancement',
    realisations: 'Réalisations',
    about: 'À propos',
    news: 'Actualités',
    contact: 'Contact',
    open: 'Ouvrir le menu',
    close: 'Fermer le menu',
  },

  lang: {
    label: 'Langue',
    current: 'FR',
    other: 'EN',
    otherName: 'English',
    switchTo: 'Read this page in English',
  },

  wa: {
    header: 'Nous écrire sur WhatsApp',
    write: 'Écrire sur WhatsApp',
    floating: 'Écrire à {marque} sur WhatsApp',
    msg: {
      home: 'Bonjour, je découvre {marque} et je souhaite en savoir plus sur vos programmes à Douala.',
      programmes: 'Bonjour, je cherche un bien à Douala. Pouvez-vous me conseiller parmi vos programmes ?',
      programme: 'Bonjour, je suis intéressé(e) par le programme {nom}. Pouvez-vous m’envoyer plus d’informations ?',
      unit: 'Bonjour, je suis intéressé(e) par le programme {nom}, unité {ref}. Est-elle toujours disponible ?',
      avancement: 'Bonjour, je souhaite avoir des nouvelles de l’avancement de vos chantiers.',
      realisations: 'Bonjour, j’ai vu vos réalisations livrées. Avez-vous un programme similaire en cours ?',
      about: 'Bonjour, je souhaite échanger avec un conseiller {marque}.',
      news: 'Bonjour, j’ai lu vos conseils et j’ai une question sur l’achat immobilier à Douala.',
      article: 'Bonjour, j’ai lu votre article « {titre} » et j’ai une question.',
      contact: 'Bonjour, je souhaite être rappelé(e) ou prendre rendez-vous avec un conseiller.',
      visit: 'Bonjour, je souhaite visiter le programme {nom}. Quelles sont vos disponibilités ?',
      member: 'Bonjour {prenom}, je vous écris depuis le site {marque}.',
      form: 'Bonjour, je m’appelle {nom}. {message} Programme : {programme}. Téléphone : {tel}.',
    },
  },

  status: {
    commercialisation: 'En commercialisation',
    construction: 'En construction',
    livre: 'Livré',
  },

  types: {
    appartement: 'Appartement',
    villa: 'Villa',
    terrain: 'Terrain viabilisé',
  },

  unitStatus: {
    disponible: 'Disponible',
    reserve: 'Réservé',
    vendu: 'Vendu',
  },

  unitTypes: {
    studio: 'Studio',
    f2: 'F2 (1 chambre)',
    f3: 'F3 (2 chambres)',
    f4: 'F4 (3 chambres)',
    villa4: 'Villa 4 chambres',
    villa5: 'Villa 5 chambres',
    terrain: 'Terrain viabilisé',
  },

  floor: (n: number) => (n === 0 ? 'Rez-de-chaussée' : n === 1 ? '1er étage' : `${n}e étage`),
  floorShort: (n: number) => (n === 0 ? 'RDC' : n === 1 ? '1er' : `${n}e`),

  availability: (n: number, total: number) =>
    n === 0
      ? `Les ${total} unités sont vendues`
      : n === 1
        ? `1 unité disponible sur ${total}`
        : `${n} unités disponibles sur ${total}`,

  homes: (n: number, kind: 'logements' | 'villas' | 'lots') =>
    ({ logements: `${n} logements`, villas: `${n} villas`, lots: `${n} lots` })[kind],

  days: {
    Monday: 'lundi',
    Tuesday: 'mardi',
    Wednesday: 'mercredi',
    Thursday: 'jeudi',
    Friday: 'vendredi',
    Saturday: 'samedi',
    Sunday: 'dimanche',
  },
  hours: {
    range: 'Du {first} au {last}',
    single: 'Le {day}',
    closed: 'Fermé le dimanche',
  },

  home: {
    metaTitle: '{marque} | Promoteur immobilier à Douala',
    metaDescription:
      'Appartements, villas et terrains viabilisés à Douala. Titre foncier vérifié, chantiers suivis chaque mois, contact direct sur WhatsApp.',
    heroText:
      'Appartements, villas et terrains viabilisés. [Un titre foncier vérifié, un chantier suivi mois après mois.]',
    heroCta: 'Voir nos programmes',
    heroAlt: 'Derniers étages d’une résidence, avec un toit-terrasse planté, au-dessus des nuages',
    statsLabel: '{marque} en chiffres',
    stats: {
      years: 'ans d’activité',
      delivered: 'programmes livrés',
      families: 'familles logées',
      sites: 'chantiers en cours',
    },
    featuredTitle: '[Programmes] à la une',
    featuredText: 'Trois programmes ouverts à la réservation, dans trois quartiers de Douala.',
    manifestoTitle: 'Acheter sur plan, [c’est d’abord une affaire de confiance.]',
    manifestoText:
      'Vous voyez le titre foncier avant de signer. Vous suivez le chantier chaque mois. [Vous parlez à la même personne, de la première visite à la remise des clés.]',
    manifestoLink: 'Découvrir notre méthode',
    whyTitle: '[Pourquoi] nous choisir',
    whyText: 'Quatre engagements, écrits dans chaque contrat.',
    why: [
      {
        image: 'photo-a-remplacer-article-titre-foncier.jpg',
        title: 'Titre foncier sécurisé',
        text: 'Chaque programme est bâti sur un terrain titré. Vous consultez le titre foncier avant de signer.',
      },
      {
        image: 'photo-a-remplacer-chantier-palmiers-2026-08.jpg',
        title: 'Suivi du chantier transparent',
        text: 'Le pourcentage d’avancement et des photos datées sont publiés chaque mois sur ce site.',
      },
      {
        image: 'photo-a-remplacer-akwa-facade.jpg',
        title: 'Livraison dans les délais annoncés',
        text: 'La date de livraison figure au contrat. Tout décalage vous est expliqué par écrit.',
      },
      {
        image: 'photo-a-remplacer-palmiers-entree.jpg',
        title: 'Paiement échelonné possible',
        text: 'Un acompte à la réservation, puis des échéances calées sur l’avancement des travaux.',
      },
    ],
    progressTitle: '[Avancement] des chantiers',
    progressText: 'Mis à jour chaque mois, photos à l’appui.',
    progressLink: 'Voir le détail des chantiers',
    testimonialsTitle: '[Ils ont acheté] avec nous',
    testimonialsNote: 'Témoignages fictifs, rédigés pour la démonstration.',
    ctaTitle: 'Venez voir [sur place.]',
    ctaText:
      'Visitez un chantier ou un logement témoin avec un conseiller. Ou posez votre question sur WhatsApp : nous répondons du lundi au samedi.',
  },

  programmes: {
    metaTitle: 'Programmes immobiliers à Douala | {marque}',
    metaDescription:
      'Appartements à Bonamoussadi, villas à Bonapriso, terrains viabilisés à Yassa. Filtrez nos programmes par statut, quartier, type et budget.',
    title: '[Nos] programmes',
    intro: 'Appartements, villas et terrains viabilisés à Douala. Filtrez par statut, quartier, type de bien ou budget.',
    filters: {
      legend: 'Filtrer les programmes',
      status: 'Statut',
      district: 'Quartier',
      type: 'Type de bien',
      budget: 'Budget maximum',
      allStatus: 'Tous les statuts',
      allDistricts: 'Tous les quartiers',
      allTypes: 'Tous les types',
      noLimit: 'Sans limite',
      reset: 'Réinitialiser les filtres',
    },
    countOne: '{n} programme',
    countOther: '{n} programmes',
    emptyTitle: 'Aucun programme ne correspond à ces critères.',
    emptyText: 'Augmentez le budget ou retirez un filtre pour élargir la recherche.',
  },

  programme: {
    metaTitle: '{nom}, {quartier} | {marque}',
    galleryLabel: 'Photos du programme {nom}',
    prev: 'Photo précédente',
    next: 'Photo suivante',
    about: 'Le programme',
    features: 'Atouts',
    location: 'Localisation',
    nearby: 'À proximité',
    units: 'Unités et prix',
    unitsNote: 'Prix en francs CFA. L’équivalent en euros est indicatif (parité fixe : 1 € = 655,957 FCFA).',
    cols: {
      ref: 'Référence',
      type: 'Type',
      area: 'Surface',
      level: 'Étage ou lot',
      price: 'Prix',
      status: 'Statut',
      action: 'Contact',
    },
    onlyAvailable: 'Afficher seulement les unités disponibles',
    ask: 'Demander',
    askAria: 'Demander l’unité {ref} sur WhatsApp',
    payment: 'Modalités de paiement',
    paymentNote: 'Modalités indicatives. L’échéancier définitif figure au contrat de réservation.',
    plan: 'Plan de masse',
    planText: 'Chaque case correspond à une unité du tableau. La couleur indique sa disponibilité.',
    planAria: 'Plan de masse, {nom}',
    documents: 'Documents',
    brochure: 'Télécharger la brochure',
    brochureMeta: 'PDF, document de démonstration',
    titleDeed: 'Titre foncier vérifié',
    titleDeedText: 'Le titre foncier du terrain se consulte sur rendez-vous, à notre siège ou chez le notaire.',
    delivery: 'Livraison',
    deliveredIn: 'Livré en {annee}',
    expected: 'Prévue en {date}',
    available: 'Disponibilité',
    typology: 'Biens proposés',
    district: 'Quartier',
    followSite: 'Suivre le chantier',
    soldOut: 'Ce programme est livré et entièrement vendu. Il montre notre façon de construire.',
    others: 'Autres programmes',
  },

  avancement: {
    metaTitle: 'Avancement des chantiers | {marque}',
    metaDescription:
      'Pourcentage d’avancement, étapes franchies et photos datées de nos chantiers à Douala, mis à jour chaque mois.',
    title: '[Avancement] des chantiers',
    intro:
      'Acheter sur plan demande de la confiance. Nous publions chaque mois l’état réel de nos chantiers : pourcentage, étapes franchies et photos datées.',
    progressAria: '{n} % des travaux réalisés',
    done: 'des travaux réalisés',
    lastUpdate: 'Dernière mise à jour : {date}',
    timeline: 'Calendrier du chantier',
    steps: {
      fondations: 'Fondations',
      grosOeuvre: 'Gros œuvre',
      finitions: 'Finitions',
      livraison: 'Livraison prévue',
    },
    stepStatus: {
      fait: 'Terminé',
      enCours: 'En cours',
      aVenir: 'À venir',
    },
    stepDate: {
      fait: 'Terminé en {date}',
      enCours: 'En cours depuis {date}',
      aVenir: 'Prévu en {date}',
    },
    photos: 'Photos du chantier',
    promiseTitle: 'Vous voulez voir [par vous-même ?]',
    promiseText:
      'Les visites de chantier se font sur rendez-vous, casque fourni. Si vous vivez à l’étranger, un conseiller vous fait la visite en appel vidéo WhatsApp.',
  },

  realisations: {
    metaTitle: 'Réalisations livrées à Douala | {marque}',
    metaDescription:
      'Six programmes livrés depuis 2016, d’Akwa à Logbessou. Découvrez les résidences et les lotissements où vivent nos acheteurs.',
    title: '[Réalisations] livrées',
    intro: 'Six programmes livrés depuis 2016. Des familles y vivent aujourd’hui.',
    deliveredIn: 'Livré en {annee}',
    see: 'Voir cette réalisation',
    note: 'Programmes et témoignages fictifs, rédigés pour la démonstration.',
  },

  about: {
    metaTitle: 'À propos | {marque}, promoteur immobilier à Douala',
    metaDescription:
      'Depuis 2014, {marque} construit à Douala sur des terrains titrés et publie l’avancement de ses chantiers. Notre histoire, nos valeurs, notre équipe.',
    title: 'À propos',
    intro: 'Un promoteur de Douala, à taille humaine, qui montre ses documents et ses chantiers.',
    storyTitle: '[Notre] histoire',
    story: [
      '{marque} est née à Douala en 2014, d’un constat simple : trop d’acheteurs engagent leurs économies sans voir le titre foncier, ni savoir où en est leur chantier.',
      'Nous avons bâti notre méthode sur l’inverse. Le terrain est titré avant le premier coup de pelle. Le calendrier est écrit dans le contrat. L’avancement est publié chaque mois, photos à l’appui.',
      'Douze ans plus tard, six programmes sont livrés et 340 familles y habitent, d’Akwa à Kotto. L’équipe est restée à taille humaine : vous parlez à la même personne, de la première visite à la remise des clés.',
    ],
    storyAlt: 'Immeuble résidentiel livré par {marque} à Douala',
    valuesTitle: '[Nos] valeurs',
    values: [
      {
        title: 'Transparence',
        text: 'Vous voyez les documents et le chantier. Nous répondons aux questions, même les plus directes.',
      },
      {
        title: 'Rigueur',
        text: 'Un terrain titré, un permis de construire, un notaire. Aucune étape n’est sautée.',
      },
      {
        title: 'Proximité',
        text: 'Un conseiller attitré, joignable sur WhatsApp, y compris pour les acheteurs de la diaspora.',
      },
    ],
    teamTitle: 'L’équipe',
    teamText: 'Quatre interlocuteurs, chacun joignable directement.',
    writeTo: 'Écrire à {prenom}',
    partnersTitle: '[Nos] partenaires',
    partnersText: 'Chaque vente passe par des professionnels indépendants. Leurs noms sont masqués dans cette démonstration.',
    legalTitle: '[Mentions] et agréments',
    legalDemo: 'Données de démonstration',
    legalRows: {
      form: 'Forme juridique',
      capital: 'Capital social',
      rccm: 'RCCM',
      niu: 'NIU',
      seat: 'Siège social',
    },
  },

  news: {
    metaTitle: 'Actualités et conseils immobiliers à Douala | {marque}',
    metaDescription:
      'Vérifier un titre foncier, choisir un quartier, acheter depuis l’étranger : nos conseils pour acheter sereinement à Douala.',
    title: '[Actualités] et conseils',
    intro: 'Des repères clairs pour acheter sereinement à Douala.',
    read: 'Lire l’article',
    minutes: '{n} min de lecture',
    back: 'Tous les articles',
    endTitle: 'Une question sur cet article ?',
    endText: 'Un conseiller vous répond sur WhatsApp, du lundi au samedi.',
    others: 'À lire aussi',
    disclaimer:
      'Article rédigé pour la démonstration. Il donne des repères généraux et ne remplace pas le conseil d’un notaire.',
  },

  contact: {
    metaTitle: 'Contact et visites | {marque}',
    metaDescription:
      'Écrivez-nous sur WhatsApp, demandez une visite ou laissez un message. Notre équipe à Bonanjo, Douala, répond du lundi au samedi.',
    title: 'Contact',
    intro: 'Une question, une visite, un rappel : choisissez le moyen qui vous convient.',
    waTitle: 'Le plus rapide : WhatsApp',
    waText: 'Posez votre question ou demandez une visite. Nous répondons du lundi au samedi.',
    formTitle: 'Nous laisser un message',
    name: 'Nom complet',
    phone: 'Téléphone ou WhatsApp',
    phoneHint: 'Avec l’indicatif du pays, par exemple +237 ou +33.',
    email: 'E-mail',
    optional: 'facultatif',
    programme: 'Programme concerné',
    programmeNone: 'Pas encore décidé',
    wantsVisit: 'Je souhaite visiter ce programme',
    message: 'Message',
    submit: 'Envoyer le message',
    sending: 'Envoi en cours…',
    viaWhatsApp: 'Envoyer par WhatsApp',
    privacy: 'Vos coordonnées servent uniquement à vous répondre.',
    privacyLink: 'Politique de confidentialité',
    successTitle: 'Message envoyé',
    successText: 'Merci. Un conseiller vous rappelle sous 24 heures ouvrées.',
    demoText:
      'Mode démonstration : ce formulaire n’est relié à aucune boîte e-mail. Votre message n’a pas été transmis.',
    again: 'Envoyer un autre message',
    error: 'L’envoi a échoué. Vérifiez votre connexion, puis réessayez ou écrivez-nous sur WhatsApp.',
    infoTitle: 'Nous rendre visite',
    address: 'Adresse',
    addressNote: 'Adresse fictive',
    hoursTitle: 'Horaires',
    phoneLabel: 'Téléphone',
    whatsappLabel: 'WhatsApp',
    emailLabel: 'E-mail',
    visitSubject: 'Demande de visite',
  },

  legal: {
    metaTitle: 'Mentions légales | {marque}',
    metaDescription: 'Mentions légales du site de démonstration {marque}.',
    title: 'Mentions légales',
    sections: [
      {
        title: 'Site de démonstration',
        text: [
          'Ce site est une démonstration réalisée pour un portfolio. {marque} est une entreprise fictive : les programmes, les prix, les personnes, les témoignages et les coordonnées affichés n’existent pas.',
          'Aucun bien n’est réellement proposé à la vente sur ce site.',
        ],
      },
      {
        title: 'Éditeur',
        text: [
          '{marque} SARL, au capital de {capital}. Siège social : {adresse}.',
          'RCCM : {rccm}. NIU : {niu}. Ces identifiants sont des données de démonstration.',
          'Téléphone : {tel}. E-mail : {email}.',
        ],
      },
      {
        title: 'Hébergement',
        text: [
          'Le site est constitué de pages statiques, servies par un hébergeur cloud. Son nom et son adresse seront précisés ici lors de la mise en ligne pour un client réel.',
        ],
      },
      {
        title: 'Informations non contractuelles',
        text: [
          'Les prix, surfaces, plans, images et dates de livraison sont donnés à titre indicatif. Seuls le contrat de réservation et l’acte notarié engagent le vendeur.',
          'Les équivalents en euros sont calculés à la parité fixe de 655,957 FCFA pour 1 euro.',
        ],
      },
      {
        title: 'Propriété intellectuelle',
        text: [
          'Les textes, illustrations et éléments graphiques de ce site ont été créés pour cette démonstration. Toute reproduction demande l’accord de leur auteur.',
        ],
      },
    ],
  },

  privacy: {
    metaTitle: 'Politique de confidentialité | {marque}',
    metaDescription: 'Quelles données ce site collecte, pourquoi, et comment exercer vos droits.',
    title: 'Politique de confidentialité',
    sections: [
      {
        title: 'En bref',
        text: [
          'Ce site ne dépose aucun cookie de suivi et n’utilise aucun outil de mesure d’audience. Il ne collecte que les informations que vous saisissez dans le formulaire de contact.',
          'Ce site est une démonstration : dans sa version de démonstration, le formulaire n’envoie rien.',
        ],
      },
      {
        title: 'Données collectées',
        text: [
          'Le formulaire de contact recueille votre nom, votre numéro de téléphone ou WhatsApp, votre adresse e-mail si vous la donnez, le programme qui vous intéresse et votre message.',
        ],
      },
      {
        title: 'Utilisation',
        text: [
          'Ces informations servent uniquement à répondre à votre demande et à organiser une éventuelle visite. Elles ne sont ni vendues, ni cédées à des tiers.',
          'Elles sont transmises par un service d’envoi de formulaires, puis lues par l’équipe commerciale. Elles sont conservées douze mois au plus après le dernier échange.',
        ],
      },
      {
        title: 'WhatsApp et Google Maps',
        text: [
          'Les boutons WhatsApp et les liens Google Maps ouvrent des services externes. Dès que vous les utilisez, les règles de confidentialité de ces services s’appliquent.',
        ],
      },
      {
        title: 'Vos droits',
        text: [
          'Vous pouvez demander à consulter, corriger ou supprimer vos informations, conformément à la réglementation camerounaise sur la protection des données personnelles. Écrivez à {email}.',
        ],
      },
    ],
  },

  footer: {
    contact: 'Coordonnées',
    hours: 'Horaires',
    info: 'Informations',
    follow: 'Réseaux sociaux',
    socialDemo: '{reseau} (page de démonstration)',
    legal: 'Mentions légales',
    privacy: 'Politique de confidentialité',
    rights: '© {annee} {marque}',
  },

  notFound: {
    title: 'Page introuvable',
    text: 'Cette page n’existe pas ou a été déplacée.',
    home: 'Retour à l’accueil',
  },
};

export default fr;
