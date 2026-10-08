// Interface copy in English.
// {marque} is replaced automatically with the name set in src/config/site.ts.
// Other {variables} are filled in by the pages.

import type fr from './fr';

const en: typeof fr = {
  common: {
    skip: 'Skip to content',
    baseline: 'Building Douala, delivering with trust.',
    demoNotice: 'Demonstration website. All data is fictional.',
    from: 'From',
    seeProgramme: 'View development',
    see: 'View',
    memberIntro: 'I’m',
    allProgrammes: 'All developments',
    openMaps: 'Open in Google Maps',
    mapNote: 'Schematic map of Douala, not to scale.',
    mapAlt: 'Schematic map of Douala showing {lieu}',
    breadcrumb: 'Breadcrumb',
    visit: 'Book a viewing',
    logoAlt: '{marque}, back to home',
  },

  nav: {
    label: 'Main navigation',
    home: 'Home',
    programmes: 'Developments',
    avancement: 'Progress',
    realisations: 'Completed',
    about: 'About',
    news: 'News',
    contact: 'Contact',
    open: 'Open menu',
    close: 'Close menu',
  },

  lang: {
    label: 'Language',
    current: 'EN',
    other: 'FR',
    otherName: 'Français',
    switchTo: 'Lire cette page en français',
  },

  wa: {
    header: 'Message us on WhatsApp',
    write: 'Message us on WhatsApp',
    floating: 'Message {marque} on WhatsApp',
    msg: {
      home: 'Hello, I came across {marque} and would like to know more about your developments in Douala.',
      programmes: 'Hello, I am looking for a property in Douala. Could you advise me on your developments?',
      programme: 'Hello, I am interested in {nom}. Could you send me more information?',
      unit: 'Hello, I am interested in {nom}, unit {ref}. Is it still available?',
      avancement: 'Hello, I would like an update on your construction sites.',
      realisations: 'Hello, I have seen your completed projects. Do you have a similar development under way?',
      about: 'Hello, I would like to speak with a {marque} adviser.',
      news: 'Hello, I have read your guides and have a question about buying property in Douala.',
      article: 'Hello, I have read your article “{titre}” and have a question.',
      contact: 'Hello, I would like a call back or an appointment with an adviser.',
      visit: 'Hello, I would like to view {nom}. When are you available?',
      member: 'Hello {prenom}, I am contacting you from the {marque} website.',
      form: 'Hello, my name is {nom}. {message} Development: {programme}. Phone: {tel}.',
    },
  },

  status: {
    commercialisation: 'Now selling',
    construction: 'Under construction',
    livre: 'Completed',
  },

  types: {
    appartement: 'Apartment',
    villa: 'Villa',
    terrain: 'Serviced plot',
  },

  unitStatus: {
    disponible: 'Available',
    reserve: 'Reserved',
    vendu: 'Sold',
  },

  unitTypes: {
    studio: 'Studio',
    f2: '1-bedroom apartment',
    f3: '2-bedroom apartment',
    f4: '3-bedroom apartment',
    villa4: '4-bedroom villa',
    villa5: '5-bedroom villa',
    terrain: 'Serviced plot',
  },

  floor: (n: number) => {
    if (n === 0) return 'Ground floor';
    const suffix = n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';
    return `${n}${suffix} floor`;
  },
  floorShort: (n: number) => (n === 0 ? 'G' : String(n)),

  availability: (n: number, total: number) =>
    n === 0
      ? `All ${total} units are sold`
      : n === 1
        ? `1 unit available out of ${total}`
        : `${n} units available out of ${total}`,

  homes: (n: number, kind: 'logements' | 'villas' | 'lots') =>
    ({ logements: `${n} homes`, villas: `${n} villas`, lots: `${n} plots` })[kind],

  days: {
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',
    Sunday: 'Sunday',
  },
  hours: {
    range: '{first} to {last}',
    single: '{day}',
    closed: 'Closed on Sunday',
  },

  home: {
    metaTitle: '{marque} | Property developer in Douala',
    metaDescription:
      'Apartments, villas and serviced plots in Douala. Verified land titles, construction updates every month, direct contact on WhatsApp.',
    heroText:
      'Apartments, villas and serviced plots. [A verified land title, and a site you follow month by month.]',
    heroCta: 'View our developments',
    heroAlt: 'Top floors of a residence with a planted roof terrace, rising above the clouds',
    statsLabel: '{marque} in figures',
    stats: {
      years: 'years in business',
      delivered: 'developments completed',
      families: 'families housed',
      sites: 'sites under way',
    },
    featuredTitle: '[Featured] developments',
    featuredText: 'Three developments open for reservation, in three Douala neighbourhoods.',
    manifestoTitle: 'Buying off-plan [is first of all a matter of trust.]',
    manifestoText:
      'You see the land title before you sign. You follow the site every month. [You speak to the same person, from the first viewing to the day you get the keys.]',
    manifestoLink: 'See how we work',
    whyTitle: '[Why] choose us',
    whyText: 'Four commitments, written into every contract.',
    why: [
      {
        image: 'photo-a-remplacer-article-titre-foncier.jpg',
        title: 'A secure land title',
        text: 'Every development stands on titled land. You see the land title before you sign.',
      },
      {
        image: 'photo-a-remplacer-chantier-palmiers-2026-08.jpg',
        title: 'Transparent site updates',
        text: 'The completion rate and dated photos are published on this website every month.',
      },
      {
        image: 'photo-a-remplacer-akwa-facade.jpg',
        title: 'Handover on the announced date',
        text: 'The handover date is written into the contract. Any change is explained to you in writing.',
      },
      {
        image: 'photo-a-remplacer-palmiers-entree.jpg',
        title: 'Payment in instalments',
        text: 'A deposit on reservation, then instalments that follow the progress of the works.',
      },
    ],
    progressTitle: '[Construction] progress',
    progressText: 'Updated every month, with photos.',
    progressLink: 'See full site updates',
    testimonialsTitle: '[They bought] with us',
    testimonialsNote: 'Fictional testimonials, written for this demonstration.',
    ctaTitle: 'Come and see [for yourself.]',
    ctaText:
      'Tour a building site or a show home with an adviser. Or ask your question on WhatsApp: we reply Monday to Saturday.',
  },

  programmes: {
    metaTitle: 'Property developments in Douala | {marque}',
    metaDescription:
      'Apartments in Bonamoussadi, villas in Bonapriso, serviced plots in Yassa. Filter our developments by status, neighbourhood, type and budget.',
    title: '[Our] developments',
    intro: 'Apartments, villas and serviced plots in Douala. Filter by status, neighbourhood, property type or budget.',
    filters: {
      legend: 'Filter developments',
      status: 'Status',
      district: 'Neighbourhood',
      type: 'Property type',
      budget: 'Maximum budget',
      allStatus: 'Any status',
      allDistricts: 'Any neighbourhood',
      allTypes: 'Any type',
      noLimit: 'No limit',
      reset: 'Reset filters',
    },
    countOne: '{n} development',
    countOther: '{n} developments',
    emptyTitle: 'No development matches these criteria.',
    emptyText: 'Raise the budget or remove a filter to widen your search.',
  },

  programme: {
    metaTitle: '{nom}, {quartier} | {marque}',
    galleryLabel: 'Photos of {nom}',
    prev: 'Previous photo',
    next: 'Next photo',
    about: 'The development',
    features: 'Key features',
    location: 'Location',
    nearby: 'Nearby',
    units: 'Units and prices',
    unitsNote: 'Prices in CFA francs. The euro equivalent is indicative (fixed rate: €1 = 655.957 FCFA).',
    cols: {
      ref: 'Reference',
      type: 'Type',
      area: 'Area',
      level: 'Floor or plot',
      price: 'Price',
      status: 'Status',
      action: 'Contact',
    },
    onlyAvailable: 'Show available units only',
    ask: 'Enquire',
    askAria: 'Enquire about unit {ref} on WhatsApp',
    payment: 'Payment terms',
    paymentNote: 'Indicative terms. The final schedule is set out in the reservation contract.',
    plan: 'Site plan',
    planText: 'Each box matches a unit in the table. Its colour shows availability.',
    planAria: 'Site plan, {nom}',
    documents: 'Documents',
    brochure: 'Download the brochure',
    brochureMeta: 'PDF, demonstration document',
    titleDeed: 'Verified land title',
    titleDeedText: 'The land title can be consulted by appointment, at our office or at the notary’s.',
    delivery: 'Handover',
    deliveredIn: 'Completed in {annee}',
    expected: 'Expected in {date}',
    available: 'Availability',
    typology: 'Properties',
    district: 'Neighbourhood',
    followSite: 'Follow the build',
    soldOut: 'This development is completed and fully sold. It shows how we build.',
    others: 'Other developments',
  },

  avancement: {
    metaTitle: 'Construction progress | {marque}',
    metaDescription:
      'Completion rates, milestones and dated photos from our building sites in Douala, updated every month.',
    title: '[Construction] progress',
    intro:
      'Buying off-plan takes trust. Every month we publish the real state of our sites: completion rate, milestones reached and dated photos.',
    progressAria: '{n}% of the works completed',
    done: 'of the works completed',
    lastUpdate: 'Last updated: {date}',
    timeline: 'Site schedule',
    steps: {
      fondations: 'Foundations',
      grosOeuvre: 'Structural works',
      finitions: 'Finishes',
      livraison: 'Expected handover',
    },
    stepStatus: {
      fait: 'Done',
      enCours: 'In progress',
      aVenir: 'Upcoming',
    },
    stepDate: {
      fait: 'Completed in {date}',
      enCours: 'In progress since {date}',
      aVenir: 'Planned for {date}',
    },
    photos: 'Site photos',
    promiseTitle: 'Want to see [for yourself?]',
    promiseText:
      'Site visits are by appointment, hard hat provided. If you live abroad, an adviser will walk you round on a WhatsApp video call.',
  },

  realisations: {
    metaTitle: 'Completed developments in Douala | {marque}',
    metaDescription:
      'Six developments completed since 2016, from Akwa to Logbessou. See the residences and estates where our buyers live today.',
    title: '[Completed] developments',
    intro: 'Six developments completed since 2016. Families live there today.',
    deliveredIn: 'Completed in {annee}',
    see: 'View this project',
    note: 'Fictional developments and testimonials, written for this demonstration.',
  },

  about: {
    metaTitle: 'About | {marque}, property developer in Douala',
    metaDescription:
      'Since 2014, {marque} has built in Douala on titled land and published the progress of its sites. Our story, our values, our team.',
    title: 'About us',
    intro: 'A Douala developer on a human scale, open about its paperwork and its building sites.',
    storyTitle: '[Our] story',
    story: [
      '{marque} was founded in Douala in 2014, after a simple observation: too many buyers commit their savings without ever seeing the land title, or knowing how far their build has got.',
      'We built our method the other way round. The land is titled before the first spade goes in. The schedule is written into the contract. Progress is published every month, with photos.',
      'Twelve years on, six developments are complete and 340 families live in them, from Akwa to Kotto. The team has stayed small: you deal with the same person from the first viewing to the day you get your keys.',
    ],
    storyAlt: 'Residential building completed by {marque} in Douala',
    valuesTitle: '[Our] values',
    values: [
      {
        title: 'Transparency',
        text: 'You see the documents and the site. We answer questions, including the blunt ones.',
      },
      {
        title: 'Rigour',
        text: 'Titled land, a building permit, a notary. No step is skipped.',
      },
      {
        title: 'Closeness',
        text: 'A dedicated adviser you can reach on WhatsApp, including for buyers in the diaspora.',
      },
    ],
    teamTitle: '[The] team',
    teamText: 'Four people, each of whom you can reach directly.',
    writeTo: 'Message {prenom}',
    partnersTitle: '[Our] partners',
    partnersText: 'Every sale goes through independent professionals. Their names are withheld in this demonstration.',
    legalTitle: '[Company] details',
    legalDemo: 'Demonstration data',
    legalRows: {
      form: 'Legal form',
      capital: 'Share capital',
      rccm: 'Trade register (RCCM)',
      niu: 'Taxpayer number (NIU)',
      seat: 'Registered office',
    },
  },

  news: {
    metaTitle: 'Property news and guides for Douala | {marque}',
    metaDescription:
      'Checking a land title, choosing a neighbourhood, buying from abroad: our guides to buying property in Douala with confidence.',
    title: '[News] and guides',
    intro: 'Clear guidance for buying property in Douala with confidence.',
    read: 'Read the article',
    minutes: '{n} min read',
    back: 'All articles',
    endTitle: 'A question about this article?',
    endText: 'An adviser will reply on WhatsApp, Monday to Saturday.',
    others: 'Read next',
    disclaimer:
      'Article written for this demonstration. It offers general guidance and is no substitute for advice from a notary.',
  },

  contact: {
    metaTitle: 'Contact and viewings | {marque}',
    metaDescription:
      'Message us on WhatsApp, book a viewing or leave a message. Our team in Bonanjo, Douala, replies Monday to Saturday.',
    title: 'Contact',
    intro: 'A question, a viewing, a call back: pick whichever suits you.',
    waTitle: 'The quickest way: WhatsApp',
    waText: 'Ask your question or book a viewing. We reply Monday to Saturday.',
    formTitle: 'Leave us a message',
    name: 'Full name',
    phone: 'Phone or WhatsApp',
    phoneHint: 'Include the country code, for example +237 or +44.',
    email: 'Email',
    optional: 'optional',
    programme: 'Development',
    programmeNone: 'Not decided yet',
    wantsVisit: 'I would like to view this development',
    message: 'Message',
    submit: 'Send message',
    sending: 'Sending…',
    viaWhatsApp: 'Send via WhatsApp',
    privacy: 'Your details are used only to reply to you.',
    privacyLink: 'Privacy policy',
    successTitle: 'Message sent',
    successText: 'Thank you. An adviser will call you back within one working day.',
    demoText: 'Demonstration mode: this form is not connected to any mailbox. Your message was not sent.',
    again: 'Send another message',
    error: 'Your message could not be sent. Check your connection, then try again or message us on WhatsApp.',
    infoTitle: 'Visit us',
    address: 'Address',
    addressNote: 'Fictional address',
    hoursTitle: 'Opening hours',
    phoneLabel: 'Phone',
    whatsappLabel: 'WhatsApp',
    emailLabel: 'Email',
    visitSubject: 'Viewing request',
  },

  legal: {
    metaTitle: 'Legal notice | {marque}',
    metaDescription: 'Legal notice for the {marque} demonstration website.',
    title: 'Legal notice',
    sections: [
      {
        title: 'Demonstration website',
        text: [
          'This website is a demonstration built for a portfolio. {marque} is a fictional company: the developments, prices, people, testimonials and contact details shown here do not exist.',
          'No property is actually offered for sale on this website.',
        ],
      },
      {
        title: 'Publisher',
        text: [
          '{marque} SARL, with share capital of {capital}. Registered office: {adresse}.',
          'RCCM: {rccm}. NIU: {niu}. These identifiers are demonstration data.',
          'Phone: {tel}. Email: {email}.',
        ],
      },
      {
        title: 'Hosting',
        text: [
          'The website is made of static pages served by a cloud hosting provider. Its name and address will be stated here when the site goes live for a real client.',
        ],
      },
      {
        title: 'Non-contractual information',
        text: [
          'Prices, floor areas, plans, images and handover dates are given for guidance only. Only the reservation contract and the notarial deed are binding on the seller.',
          'Euro equivalents are calculated at the fixed rate of 655.957 FCFA to 1 euro.',
        ],
      },
      {
        title: 'Intellectual property',
        text: [
          'The copy, illustrations and graphic elements on this website were created for this demonstration. Any reproduction requires their author’s consent.',
        ],
      },
    ],
  },

  privacy: {
    metaTitle: 'Privacy policy | {marque}',
    metaDescription: 'What data this website collects, why, and how to exercise your rights.',
    title: 'Privacy policy',
    sections: [
      {
        title: 'In short',
        text: [
          'This website sets no tracking cookies and uses no analytics. It only collects what you type into the contact form.',
          'This website is a demonstration: in its demonstration version, the form sends nothing.',
        ],
      },
      {
        title: 'Data collected',
        text: [
          'The contact form collects your name, your phone or WhatsApp number, your email address if you give it, the development you are interested in and your message.',
        ],
      },
      {
        title: 'How it is used',
        text: [
          'This information is used only to answer your enquiry and to arrange a viewing if you ask for one. It is never sold or passed on to third parties.',
          'It is delivered by a form-handling service, then read by the sales team. It is kept for no more than twelve months after our last exchange.',
        ],
      },
      {
        title: 'WhatsApp and Google Maps',
        text: [
          'The WhatsApp buttons and Google Maps links open external services. Once you use them, the privacy rules of those services apply.',
        ],
      },
      {
        title: 'Your rights',
        text: [
          'You may ask to see, correct or delete your information, in line with Cameroonian personal data protection rules. Write to {email}.',
        ],
      },
    ],
  },

  footer: {
    contact: 'Contact details',
    hours: 'Opening hours',
    info: 'Information',
    follow: 'Social media',
    socialDemo: '{reseau} (demonstration page)',
    legal: 'Legal notice',
    privacy: 'Privacy policy',
    rights: '© {annee} {marque}',
  },

  notFound: {
    title: 'Page not found',
    text: 'This page does not exist or has been moved.',
    home: 'Back to home',
  },
};

export default en;
