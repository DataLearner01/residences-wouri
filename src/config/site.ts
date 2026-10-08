// Configuration centrale du site.
// Pour adapter la démo à un vrai client, commencez par ce fichier :
// nom, numéro WhatsApp, coordonnées, horaires, mentions légales.

export const site = {
  name: 'Résidences Wouri',
  legalName: 'Résidences Wouri SARL',
  foundedYear: 2014,

  // Numéro WhatsApp de démonstration. `number` : format international,
  // chiffres uniquement (sans « + » ni espaces). C'est le seul endroit à modifier.
  whatsapp: {
    number: '237600000000',
    display: '+237 6XX XX XX XX',
  },
  phone: '+237 2XX XX XX XX',
  email: 'contact@residences-wouri.example',

  // Adresse fictive.
  address: {
    street: 'Immeuble Latérite, 2ᵉ étage',
    district: 'Bonanjo',
    city: 'Douala',
    region: 'Littoral',
    country: 'CM',
  },
  geo: { lat: 4.0435, lng: 9.6915 },
  mapsQuery: 'Bonanjo, Douala, Cameroun',

  // Horaires : jours selon schema.org, heures au format 24 h.
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:30' },
    { days: ['Saturday'], opens: '09:00', closes: '13:00' },
  ],

  // Mentions de démonstration : ces identifiants n'existent pas.
  legal: {
    form: 'SARL',
    capital: 10_000_000,
    rccm: 'RC/DLA/0000/B/0000',
    niu: 'M000000000000X',
  },

  // Liens vers des pages de démonstration (example.com est un domaine réservé).
  socials: [
    { key: 'facebook', label: 'Facebook', url: 'https://example.com/residences-wouri/facebook' },
    { key: 'instagram', label: 'Instagram', url: 'https://example.com/residences-wouri/instagram' },
    { key: 'linkedin', label: 'LinkedIn', url: 'https://example.com/residences-wouri/linkedin' },
  ],

  // Chiffres de confiance affichés sur l'accueil (fictifs).
  stats: { years: 12, delivered: 6, families: 340, sites: 2 },

  // Parité fixe du franc CFA (XAF) avec l'euro.
  eurRate: 655.957,

  // Formulaire de contact : URL du formulaire (Formspree ou équivalent),
  // fournie par la variable d'environnement PUBLIC_FORM_ENDPOINT.
  formEndpoint: (import.meta.env.PUBLIC_FORM_ENDPOINT ?? '').trim(),
} as const;
