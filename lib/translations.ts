import type { Language } from "./types"

type TranslationKeys =
  | "imageUploadedSuccessfully"
  | "home"
  | "login"
  | "aboutUs"
  | "contact"
  | "legal"
  | "privacy"
  | "termsAndConditions"
  | "newsletter"
  | "faq"
  | "searchPlaceholder"
  | "photographyForTheLoveOfSport"
  | "showPhotos"
  | "signupLogin"
  | "enterYourEmail"
  | "sendMagicLink"
  | "whatIsAMagicLink"
  | "privacyPolicy"
  | "joinTheNewsletter"
  | "subscribe"
  | "presaleEvent"
  | "yourPrivacyMatters"
  | "offer"
  | "otherProducts"
  | "adminDashboard"
  | "events"
  | "photographers"
  | "profile"
  | "createEvent"
  | "editEvent"
  | "deleteEvent"
  | "createPhotographer"
  | "editPhotographer"
  | "deletePhotographer"
  | "title"
  | "description"
  | "date"
  | "time"
  | "location"
  | "image"
  | "bestOfImage"
  | "assignPhotographers"
  | "save"
  | "cancel"
  | "name"
  | "email"
  | "bio"
  | "profileImage"
  | "password"
  | "confirmPassword"
  | "submit"
  | "loadMore"
  | "sportografRaceletter"
  | "joinSportografRaceletter"
  | "newsletterDescription"
  | "enterYourEmailPlaceholder"
  | "newsletterAgreement"
  | "whyJoinNewsletter"
  | "eventAlerts"
  | "eventAlertsDescription"
  | "specialOffers"
  | "specialOffersDescription"
  | "photographyTips"
  | "photographyTipsDescription"
  | "athleteStories"
  | "athleteStoriesDescription"
  | "getUpdatesOnEvents"
  | "insightsFromSportWorld"
  | "specialOffersFromPartners"
  | "readyToDiveIn"
  | "howToContactUs"
  | "contactForm"
  | "subject"
  | "message"
  | "sendMessage"
  | "required"
  | "legalNotice"
  | "managingDirectors"
  | "privacyPolicyTitle"
  | "informationWeCollect"
  | "personalData"
  | "nonPersonalData"
  | "howWeUseInformation"
  | "howWeProtectInformation"
  | "sharingPersonalInformation"
  | "thirdPartyWebsites"
  | "changesToPrivacyPolicy"
  | "acceptanceOfTerms"
  | "contactingUs"
  | "lastUpdated"
  | "termsAndConditionsTitle"
  | "scope"
  | "offerAndContract"
  | "prices"
  | "deliveryAndPayment"
  | "rightOfCancellation"
  | "blog"
  | "jobs"
  | "cookies"
  | "toContactSupport"
  | "useContactForm"
  | "companyAddress"
  | "germany"
  | "localCourt"
  | "salesTaxId"
  | "onlineDisputeResolution"
  | "consumerDisputes"
  | "eventDate"
  | "eventTime"
  | "eventLocation"
  | "website"
  | "visitWebsite"
  | "bestPhotos"
  | "tags"
  | "weAreOnIt"
  | "photosNotOnlineYet"
  | "getNotificationWhenReady"
  | "notifyMe"
  | "paymentMethods"
  | "securePayments"
  | "logout"
  | "howCanWeHelpYou"
  | "enterSearchTerm"
  | "newSupportTicket"
  | "knowledgeBase"
  | "submitNewFAQ"
  | "faqTitle"
  | "faqQuestion"
  | "faqCategory"
  | "yourQuestion"
  | "questionDetails"
  | "submitQuestion"
  | "thankYouForSubmission"
  | "questionSubmittedSuccessfully"
  | "manageFAQs"
  | "pendingApproval"
  | "approved"
  | "rejected"
  | "approve"
  | "reject"
  | "answer"
  | "provideAnswer"
  | "saveAnswer"
  | "status"
  | "actions"
  | "noFAQsFound"
  | "createFirstFAQ"
  | "viewAll"
  | "viewLess"
  | "relatedArticles"
  | "didYouFindItHelpful"
  | "yes"
  | "no"
  | "authoredBy"
  | "support"
  | "articleNotFound"
  | "backToFAQ"
  | "solutionHome"
  // FAQ Categories
  | "categoryGettingStarted"
  | "categoryLogin"
  | "categoryFindYourPhotos"
  | "categoryOrder"
  | "categoryPayment"
  | "categoryDownload"
  | "categoryFAQ"
  | "categoryPhotosRights"
  | "categoryPress"
  | "categoryJoinTeam"
  | "categoryPhotographer"
  | "categoryRecognition"
  // Hero Quotes
  | "heroQuote"
  | "heroQuoteAuthor"
  // Events Page
  | "eventsFound"
  | "eventFound"
  | "noEventsFound"
  | "clearSearch"
  | "forSearchTerm"
  // Profile Page
  | "editProfile"
  | "chooseImage"
  | "emailCannotBeChanged"
  | "tellUsAboutYourself"
  | "saveChanges"
  | "saving"
  | "uploading"
  | "profileUpdatedSuccessfully"
  | "selectedFile"
  | "imageSizeError"
  | "imageTypeError"
  | "uploadError"
  | "updateError"
  | "imageUploadError"
  | "profileUpdateError"
  | "magicLinkSent"
  | "checkEmailToComplete"
  | "magicLinkSentTo"
  | "sending"
  | "completingSignIn"
  | "verifyingLogin"
  | "loginSuccessful"
  | "redirecting"
  | "returnToLogin"
  | "emailRequired"
  | "invalidMagicLink"
  | "expiredMagicLink"
  | "failedToSendMagicLink"
  | "failedToCompleteSignIn"
  | "dataProtectionInfo"
  // Newsletter Subscription
  | "subscribeToNewsletter"
  | "unsubscribeFromNewsletter"
  | "subscriptionSuccessful"
  | "unsubscriptionSuccessful"
  | "alreadySubscribed"
  | "notSubscribed"
  | "subscriptionError"
  | "unsubscriptionError"
  | "manageSubscription"
  | "subscriptionStatus"
  | "subscribed"
  | "unsubscribed"
  | "subscribing"
  | "unsubscribing"
  | "newEventNotification"
  | "nameRequired"
  | "newEventAvailable"
  | "checkOutEvent"
  | "unsubscribeLink"
  | "magicLinkExplanation"
  | "magicLinkBenefits"
  | "noPasswordNeeded"
  | "secureLogin"
  | "oneClickAccess"
  // About Us Page
  | "aboutSportograf"
  | "aboutSportografDescription"
  | "ourStory"
  | "ourStoryDescription"
  | "eventsWorldwide"
  | "freelancePhotographers"
  | "photographedAthletes"
  | "imagesPerYear"
  | "aboutUsCommitment"
  | "whatMakesUsDifferent"
  | "professionalQuality"
  | "professionalQualityDescription"
  | "completeCoverage"
  | "completeCoverageDescription"
  | "advancedTechnology"
  | "advancedTechnologyDescription"
  // Date Range
  | "to"

type Translations = {
  [key in Language]: {
    [key in TranslationKeys]: string
  }
}

export const translations: Translations = {
  en: {
    home: "HOME",
    login: "LOGIN",
    aboutUs: "ABOUT US",
    contact: "CONTACT",
    legal: "LEGAL",
    privacy: "PRIVACY",
    termsAndConditions: "TERMS AND CONDITIONS",
    newsletter: "NEWSLETTER",
    faq: "FAQ",
    searchPlaceholder: "Search for events...",
    photographyForTheLoveOfSport: "PHOTOGRAPHY FOR THE LOVE OF SPORT",
    showPhotos: "SHOW PHOTOS",
    signupLogin: "Signup / Login",
    enterYourEmail: "ENTER YOUR EMAIL",
    nameRequired: "Name is required",
    sendMagicLink: "Send Magic Link",
    whatIsAMagicLink: "What is a magic link?",
    privacyPolicy: "privacy policy",
    joinTheNewsletter: "JOIN THE SPORTOGRAF RACELETTER",
    imageUploadedSuccessfully: "Image uploaded successfully",
    subscribe: "Subscribe",
    presaleEvent: "PRESALE EVENT",
    yourPrivacyMatters: "YOUR PRIVACY MATTERS",
    offer: "OFFER",
    otherProducts: "OTHER PRODUCTS",
    adminDashboard: "Admin Dashboard",
    events: "Events",
    photographers: "Photographers",
    profile: "Profile",
    createEvent: "Create Event",
    editEvent: "Edit Event",
    deleteEvent: "Delete Event",
    createPhotographer: "Create Photographer",
    editPhotographer: "Edit Photographer",
    deletePhotographer: "Delete Photographer",
    title: "Title",
    description: "Description",
    date: "Date",
    time: "Time",
    location: "Location",
    image: "Image",
    bestOfImage: "Best of Image",
    assignPhotographers: "Assign Photographers",
    save: "Save",
    cancel: "Cancel",
    name: "Name",
    email: "Email",
    bio: "Bio",
    profileImage: "Profile Image",
    password: "Password",
    confirmPassword: "Confirm Password",
    submit: "Submit",
    loadMore: "Load more",
    sportografRaceletter: "RACELETTER",
    joinSportografRaceletter: "JOIN THE SPORTOGRAF RACELETTER",
    newsletterDescription: "Get updates on exciting events, insights from the world of sport, and special offers from our partners. Ready to dive in?",
    enterYourEmailPlaceholder: "Enter your email",
    newsletterAgreement: "I agree to receive occasional emails from Sportograf. I can unsubscribe at any time by sending an email to support@sportograf.com.",
    whyJoinNewsletter: "Why Join Our Newsletter?",
    eventAlerts: "Event Alerts",
    eventAlertsDescription: "Be the first to know about upcoming events where Sportograf will be capturing your moments.",
    specialOffers: "Special Offers",
    specialOffersDescription: "Get exclusive discounts and promotions only available to our newsletter subscribers.",
    photographyTips: "Photography Tips",
    photographyTipsDescription: "Learn how to look your best in action photos and make the most of your sporting moments.",
    athleteStories: "Athlete Stories",
    athleteStoriesDescription: "Read inspiring stories from athletes around the world and their journey in sports.",
    getUpdatesOnEvents: "Get updates on exciting events",
    insightsFromSportWorld: "insights from the world of sport",
    specialOffersFromPartners: "and special offers from our partners",
    readyToDiveIn: "Ready to dive in?",
    howToContactUs: "HOW TO CONTACT US",
    contactForm: "Contact Form",
    subject: "Subject",
    message: "Message",
    sendMessage: "Send Message",
    required: "*",
    legalNotice: "Legal notice",
    managingDirectors: "Managing Directors:",
    privacyPolicyTitle: "Privacy Policy for Sportograf.com",
    informationWeCollect: "1. Information We Collect",
    personalData: "1.1 Personal Data",
    nonPersonalData: "1.2 Non-Personal Data",
    howWeUseInformation: "2. How We Use Collected Information",
    howWeProtectInformation: "3. How We Protect Your Information",
    sharingPersonalInformation: "4. Sharing Your Personal Information",
    thirdPartyWebsites: "5. Third Party Websites",
    changesToPrivacyPolicy: "6. Changes to This Privacy Policy",
    acceptanceOfTerms: "7. Your Acceptance of These Terms",
    contactingUs: "8. Contacting Us",
    lastUpdated: "Last updated:",
    termsAndConditionsTitle: "Our Terms and Conditions",
    scope: "1. Scope",
    offerAndContract: "2. Offer and Conclusion of Contract",
    prices: "3. Prices",
    deliveryAndPayment: "4. Delivery and payment",
    rightOfCancellation: "5. Right of cancellation",
    blog: "Blog",
    jobs: "Jobs",
    cookies: "Cookies",
    toContactSupport: "To contact our support, please",
    useContactForm: "use our contact form",
    companyAddress: "Sportograf Digital Solutions GmbH",
    germany: "Germany",
    localCourt: "Local Court Aachen, HRB 24642",
    salesTaxId: "Sales tax identification number: DE341002439",
    onlineDisputeResolution: "On the basis of Regulation (EU) No 524/2013 on online dispute resolution for consumer disputes, the European Commission expectedly launches a platform for online dispute resolution on 02/15/2016 under the URL http://ec.europa.eu/odr.",
    consumerDisputes: "Consumers then have the opportunity to use this platform for the settlement of disputes regarding our online offer.",
    eventDate: "Date",
    eventTime: "Time",
    eventLocation: "Location",
    website: "Website",
    visitWebsite: "Visit Website",
    bestPhotos: "Best Photos",
    tags: "Tags",
    weAreOnIt: "WE ARE ON IT!",
    photosNotOnlineYet: "The photos are not online yet.",
    getNotificationWhenReady: "Get a notification as soon as your pictures are online.",
    notifyMe: "Notify me",
    paymentMethods: "Payment Methods",
    securePayments: "Secure Payments",
    logout: "Logout",
    howCanWeHelpYou: "How can we help you today?",
    enterSearchTerm: "Enter your search term here...",
    newSupportTicket: "New Support Ticket",
    knowledgeBase: "Knowledge base",
    submitNewFAQ: "Submit New FAQ",
    faqTitle: "FAQ Title",
    faqQuestion: "Your Question",
    faqCategory: "Category",
    yourQuestion: "Your Question",
    questionDetails: "Please provide details about your question",
    submitQuestion: "Submit Question",
    thankYouForSubmission: "Thank you for your submission!",
    questionSubmittedSuccessfully: "Your question has been submitted successfully and is pending review.",
    manageFAQs: "Manage FAQs",
    pendingApproval: "Pending Approval",
    approved: "Approved",
    rejected: "Rejected",
    approve: "Approve",
    reject: "Reject",
    answer: "Answer",
    provideAnswer: "Provide Answer",
    saveAnswer: "Save Answer",
    status: "Status",
    actions: "Actions",
    noFAQsFound: "No FAQs found.",
    createFirstFAQ: "Create your first FAQ",
    viewAll: "View all",
    viewLess: "View less",
    relatedArticles: "Related Articles",
    didYouFindItHelpful: "Did you find it helpful?",
    yes: "Yes",
    no: "No",
    authoredBy: "is the author of this solution article.",
    support: "Support",
    articleNotFound: "Article not found",
    backToFAQ: "Back to FAQ",
    solutionHome: "Solution home",
    categoryGettingStarted: "Getting started",
    categoryLogin: "Login",
    categoryFindYourPhotos: "Find your own photos",
    categoryOrder: "Order",
    categoryPayment: "Payment",
    categoryDownload: "Download",
    categoryFAQ: "FAQ",
    categoryPhotosRights: "Photos Rights",
    categoryPress: "Press",
    categoryJoinTeam: "Join the team",
    categoryPhotographer: "Photographer",
    categoryRecognition: "Recognition",
    heroQuote: "Every moment in sport tells a story. We capture yours.",
    heroQuoteAuthor: "Sportograf Team",
    eventsFound: "Events found",
    eventFound: "Event found",
    noEventsFound: "No events found",
    clearSearch: "Clear search",
    forSearchTerm: "For search term",
    editProfile: "Edit Profile",
    chooseImage: "Choose Image",
    emailCannotBeChanged: "Email cannot be changed",
    tellUsAboutYourself: "Tell us about yourself",
    saveChanges: "Save Changes",
    saving: "Saving",
    uploading: "Uploading",
    profileUpdatedSuccessfully: "Profile updated successfully",
    selectedFile: "Selected File",
    imageSizeError: "Image size error",
    imageTypeError: "Image type error",
    uploadError: "Upload error",
    updateError: "Update error",
    imageUploadError: "Failed to upload profile image. Please try again.",
    profileUpdateError: "Failed to update profile",
    magicLinkSent: "Magic link sent!",
    checkEmailToComplete: "Check your email to complete login.",
    magicLinkSentTo: "We've sent a login link to",
    sending: "Sending...",
    completingSignIn: "Completing Sign In",
    verifyingLogin: "Verifying your login...",
    loginSuccessful: "Login successful! Redirecting...",
    redirecting: "Redirecting...",
    returnToLogin: "Return to login",
    emailRequired: "Email is required to complete sign in",
    invalidMagicLink: "Invalid magic link. Please ensure you're using the link from your email.",
    expiredMagicLink: "This login link has expired or already been used. Please request a new one.",
    failedToSendMagicLink: "Failed to send magic link. Please try again.",
    failedToCompleteSignIn: "Failed to complete sign in. Please try requesting a new login link.",
    dataProtectionInfo: "For more information on data protection, please see our",
    subscribeToNewsletter: "Subscribe to Newsletter",
    unsubscribeFromNewsletter: "Unsubscribe from Newsletter",
    subscriptionSuccessful: "Successfully subscribed to newsletter!",
    unsubscriptionSuccessful: "Successfully unsubscribed from newsletter.",
    alreadySubscribed: "You are already subscribed to our newsletter.",
    notSubscribed: "You are not subscribed to our newsletter.",
    subscriptionError: "Failed to subscribe. Please try again.",
    unsubscriptionError: "Failed to unsubscribe. Please try again.",
    manageSubscription: "Manage Subscription",
    subscriptionStatus: "Subscription Status",
    subscribed: "Subscribed",
    unsubscribed: "Unsubscribed",
    subscribing: "Subscribing...",
    unsubscribing: "Unsubscribing...",
    newEventNotification: "New Event Notification",
    newEventAvailable: "A new event is now available!",
    checkOutEvent: "Check out the event",
    unsubscribeLink: "Unsubscribe from these notifications",
    magicLinkExplanation: "What is a Magic Link?",
    magicLinkBenefits: "Magic links provide a secure, password-free way to access your account:",
    noPasswordNeeded: "No password needed",
    secureLogin: "Secure and encrypted",
    oneClickAccess: "One-click access from your email",
    aboutSportograf: "About Sportograf",
    aboutSportografDescription: "Sportograf: Our name says everything about us. We are sports enthusiasts who love to take the best possible photos for each participant.",
    ourStory: "Our Story",
    ourStoryDescription: "Our story began when Tom Janas and Guido Holz - frustrated by photos they were supposed to order as paper prints at a high price during bike races - had the idea to create the world's first purely digital photo service. Said, done. In December 2005 they programmed the first version of the website during their exchange semester in Spain and Italy. The first photo sale was euphorically toasted with a beer and so things took their course.",
    eventsWorldwide: "events worldwide",
    freelancePhotographers: "freelance photographers",
    photographedAthletes: "mio. photographed athletes",
    imagesPerYear: "mio. images per year",
    aboutUsCommitment: "In order to take the best possible photos, we get up at 4 o'clock in the morning and arrive at the event site on time for the sunrise, we lie in the mud during an obstacle course race, or stand on a mountain pass road in the Alps in the pouring rain and freezing snow. We are sports(wo)men ourselves and know both perspectives. We know which photos an athlete desires!",
    whatMakesUsDifferent: "What Makes Us Different",
    professionalQuality: "Professional Quality",
    professionalQualityDescription: "Our photographers are professionals with years of experience in sports photography, ensuring the highest quality images for every participant.",
    completeCoverage: "Complete Coverage",
    completeCoverageDescription: "We position photographers at strategic locations throughout the course to capture multiple shots of each participant.",
    advancedTechnology: "Advanced Technology",
    advancedTechnologyDescription: "Our advanced facial recognition technology makes it easy for participants to find their photos quickly after the event.",
    to: "to",
  },
  de: {
    home: "STARTSEITE",
    login: "ANMELDEN",
    aboutUs: "ÜBER UNS",
    contact: "KONTAKT",
    legal: "RECHTLICHES",
    nameRequired: "Name ist erforderlich",
    privacy: "DATENSCHUTZ",
    termsAndConditions: "AGB",
    newsletter: "NEWSLETTER",
    faq: "FAQ",
    searchPlaceholder: "Nach Veranstaltungen suchen...",
    photographyForTheLoveOfSport: "FOTOGRAFIE AUS LIEBE ZUM SPORT",
    showPhotos: "FOTOS ANZEIGEN",
    signupLogin: "Registrieren / Anmelden",
    enterYourEmail: "E-MAIL EINGEBEN",
    sendMagicLink: "Magic Link Senden",
    whatIsAMagicLink: "Was ist ein Magic Link?",
    privacyPolicy: "Datenschutzrichtlinie",
    joinTheNewsletter: "ABONNIERE DEN SPORTOGRAF RACELETTER",
    subscribe: "Abonnieren",
    presaleEvent: "VORVERKAUF",
    yourPrivacyMatters: "DEINE PRIVATSPHÄRE IST WICHTIG",
    offer: "ANGEBOT",
    otherProducts: "ANDERE PRODUKTE",
    adminDashboard: "Admin Dashboard",
    events: "Veranstaltungen",
    photographers: "Fotografen",
    profile: "Profil",
    createEvent: "Veranstaltung erstellen",
    editEvent: "Veranstaltung bearbeiten",
    deleteEvent: "Veranstaltung löschen",
    createPhotographer: "Fotograf erstellen",
    editPhotographer: "Fotograf bearbeiten",
    deletePhotographer: "Fotograf löschen",
    imageUploadedSuccessfully: "Bild hochgeladen erfolgreich",
    title: "Titel",
    description: "Beschreibung",
    date: "Datum",
    time: "Zeit",
    location: "Ort",
    image: "Bild",
    bestOfImage: "Best-of Bild",
    assignPhotographers: "Fotografen zuweisen",
    save: "Speichern",
    cancel: "Abbrechen",
    name: "Name",
    email: "E-Mail",
    bio: "Bio",
    profileImage: "Profilbild",
    password: "Passwort",
    confirmPassword: "Passwort bestätigen",
    submit: "Absenden",
    loadMore: "Mehr laden",
    sportografRaceletter: "RACELETTER",
    joinSportografRaceletter: "ABONNIERE DEN SPORTOGRAF RACELETTER",
    newsletterDescription: "Erhalte Updates zu spannenden Events, Einblicke aus der Sportwelt und Sonderangebote unserer Partner. Bereit einzutauchen?",
    enterYourEmailPlaceholder: "E-Mail eingeben",
    newsletterAgreement: "Ich stimme zu, gelegentlich E-Mails von Sportograf zu erhalten. Ich kann mich jederzeit abmelden, indem ich eine E-Mail an support@sportograf.com sende.",
    whyJoinNewsletter: "Warum unseren Newsletter abonnieren?",
    eventAlerts: "Event-Benachrichtigungen",
    eventAlertsDescription: "Sei der Erste, der über kommende Events erfährt, bei denen Sportograf deine Momente einfängt.",
    specialOffers: "Sonderangebote",
    specialOffersDescription: "Erhalte exklusive Rabatte und Aktionen, die nur für unsere Newsletter-Abonnenten verfügbar sind.",
    photographyTips: "Fotografie-Tipps",
    photographyTipsDescription: "Lerne, wie du auf Action-Fotos am besten aussiehst und das Beste aus deinen sportlichen Momenten machst.",
    athleteStories: "Athletengeschichten",
    athleteStoriesDescription: "Lies inspirierende Geschichten von Athleten aus aller Welt und ihrer Reise im Sport.",
    getUpdatesOnEvents: "Erhalte Updates zu spannenden Events",
    insightsFromSportWorld: "Einblicke aus der Sportwelt",
    specialOffersFromPartners: "und Sonderangebote unserer Partner",
    readyToDiveIn: "Bereit einzutauchen?",
    howToContactUs: "SO KONTAKTIEREN SIE UNS",
    contactForm: "Kontaktformular",
    subject: "Betreff",
    message: "Nachricht",
    sendMessage: "Nachricht senden",
    required: "*",
    legalNotice: "Impressum",
    managingDirectors: "Geschäftsführer:",
    privacyPolicyTitle: "Datenschutzerklärung für Sportograf.com",
    informationWeCollect: "1. Informationen, die wir sammeln",
    personalData: "1.1 Personenbezogene Daten",
    nonPersonalData: "1.2 Nicht-personenbezogene Daten",
    howWeUseInformation: "2. Wie wir gesammelte Informationen verwenden",
    howWeProtectInformation: "3. Wie wir Ihre Informationen schützen",
    sharingPersonalInformation: "4. Weitergabe persönlicher Informationen",
    thirdPartyWebsites: "5. Websites Dritter",
    changesToPrivacyPolicy: "6. Änderungen dieser Datenschutzerklärung",
    acceptanceOfTerms: "7. Ihre Zustimmung zu diesen Bedingungen",
    contactingUs: "8. Kontakt",
    lastUpdated: "Zuletzt aktualisiert:",
    termsAndConditionsTitle: "Unsere Allgemeinen Geschäftsbedingungen",
    scope: "1. Geltungsbereich",
    offerAndContract: "2. Angebot und Vertragsschluss",
    prices: "3. Preise",
    deliveryAndPayment: "4. Lieferung und Zahlung",
    rightOfCancellation: "5. Widerrufsrecht",
    blog: "Blog",
    jobs: "Jobs",
    cookies: "Cookies",
    toContactSupport: "Um unseren Support zu kontaktieren, bitte",
    useContactForm: "nutzen Sie unser Kontaktformular",
    companyAddress: "Sportograf Digital Solutions GmbH",
    germany: "Deutschland",
    localCourt: "Amtsgericht Aachen, HRB 24642",
    salesTaxId: "Umsatzsteuer-Identifikationsnummer: DE341002439",
    onlineDisputeResolution: "Auf Grundlage der Verordnung (EU) Nr. 524/2013 über die Online-Beilegung verbraucherrechtlicher Streitigkeiten, die Europäische Kommission startet voraussichtlich am 15.02.2016 eine Plattform zur Online-Streitbeilegung unter der URL http://ec.europa.eu/odr.",
    consumerDisputes: "Verbraucher haben dann die Möglichkeit, diese Plattform für die Beilegung von Streitigkeiten bezüglich unseres Online-Angebots zu nutzen.",
    eventDate: "Datum",
    eventTime: "Zeit",
    eventLocation: "Ort",
    website: "Website",
    visitWebsite: "Website besuchen",
    bestPhotos: "Beste Fotos",
    tags: "Tags",
    weAreOnIt: "WIR SIND DRAN!",
    photosNotOnlineYet: "Die Fotos sind noch nicht online.",
    getNotificationWhenReady: "Erhalten Sie eine Benachrichtigung, sobald Ihre Bilder online sind.",
    notifyMe: "Benachrichtigen",
    paymentMethods: "Zahlungsmethoden",
    securePayments: "Sichere Zahlungen",
    logout: "Abmelden",
    howCanWeHelpYou: "Wie können wir Ihnen heute helfen?",
    enterSearchTerm: "Geben Sie hier Ihren Suchbegriff ein...",
    newSupportTicket: "Neues Support-Ticket",
    knowledgeBase: "Wissensdatenbank",
    submitNewFAQ: "Neue FAQ einreichen",
    faqTitle: "FAQ-Titel",
    faqQuestion: "Ihre Frage",
    faqCategory: "Kategorie",
    yourQuestion: "Ihre Frage",
    questionDetails: "Bitte geben Sie Details zu Ihrer Frage an",
    submitQuestion: "Frage einreichen",
    thankYouForSubmission: "Vielen Dank für Ihre Einreichung!",
    questionSubmittedSuccessfully: "Ihre Frage wurde erfolgreich eingereicht und wartet auf Überprüfung.",
    manageFAQs: "FAQs verwalten",
    pendingApproval: "Genehmigung ausstehend",
    approved: "Genehmigt",
    rejected: "Abgelehnt",
    approve: "Genehmigen",
    reject: "Ablehnen",
    answer: "Antwort",
    provideAnswer: "Antwort geben",
    saveAnswer: "Antwort speichern",
    status: "Status",
    actions: "Aktionen",
    noFAQsFound: "Keine FAQs gefunden.",
    createFirstFAQ: "Erstellen Sie Ihre erste FAQ",
    viewAll: "Alle anzeigen",
    viewLess: "Weniger anzeigen",
    relatedArticles: "Verwandte Artikel",
    didYouFindItHelpful: "War das hilfreich?",
    yes: "Ja",
    no: "Nein",
    authoredBy: "ist der Autor dieses Lösungsartikels.",
    support: "Support",
    articleNotFound: "Artikel nicht gefunden",
    backToFAQ: "Zurück zu FAQ",
    solutionHome: "Lösungs-Startseite",
    categoryGettingStarted: "Erste Schritte",
    categoryLogin: "Anmeldung",
    categoryFindYourPhotos: "Finden Sie Ihre eigenen Fotos",
    categoryOrder: "Bestellung",
    categoryPayment: "Zahlung",
    categoryDownload: "Download",
    categoryFAQ: "FAQ",
    categoryPhotosRights: "Nutzung der Fotos, Urheberrecht, Presse",
    categoryPress: "Presse",
    categoryJoinTeam: "Dem Team beitreten",
    categoryPhotographer: "Fotograf",
    categoryRecognition: "Nummer- und Gesichtserkennung",
    heroQuote: "Jeder Moment im Sport erzählt eine Geschichte. Wir halten deine fest.",
    heroQuoteAuthor: "Sportograf Team",
    eventsFound: "Events gefunden",
    eventFound: "Event gefunden",
    noEventsFound: "Keine Events gefunden",
    clearSearch: "Suche löschen",
    forSearchTerm: "Für Suchbegriff",
    editProfile: "Profil bearbeiten",
    chooseImage: "Bild auswählen",
    emailCannotBeChanged: "E-Mail kann nicht geändert werden",
    tellUsAboutYourself: "Erzählen Sie uns von Ihrem Leben",
    saveChanges: "Änderungen speichern",
    saving: "Speichern",
    uploading: "Hochladen",
    profileUpdatedSuccessfully: "Profil erfolgreich aktualisiert",
    selectedFile: "Ausgewähltes Datei",
    imageSizeError: "Bildgrößenfehler",
    imageTypeError: "Bildtypfehler",
    uploadError: "Hochladefehler",
    updateError: "Aktualisierungsfehler",
    imageUploadError: "Fehler beim Hochladen des Profilbildes. Bitte versuchen Sie es erneut.",
    profileUpdateError: "Fehler beim Aktualisieren des Profils",
    magicLinkSent: "Magic Link gesendet!",
    checkEmailToComplete: "Überprüfen Sie Ihre E-Mail, um die Anmeldung abzuschließen.",
    magicLinkSentTo: "Wir haben einen Anmelde-Link an",
    sending: "Senden...",
    completingSignIn: "Anmeldung wird abgeschlossen",
    verifyingLogin: "Anmeldung wird überprüft...",
    loginSuccessful: "Anmeldung erfolgreich! Weiterleitung...",
    redirecting: "Weiterleitung...",
    returnToLogin: "Zurück zur Anmeldung",
    emailRequired: "E-Mail ist erforderlich, um die Anmeldung abzuschließen",
    invalidMagicLink: "Ungültiger Magic Link. Stellen Sie sicher, dass Sie den Link aus Ihrer E-Mail verwenden.",
    expiredMagicLink: "Dieser Anmelde-Link ist abgelaufen oder wurde bereits verwendet. Bitte fordern Sie einen neuen an.",
    failedToSendMagicLink: "Fehler beim Senden des Magic Links. Bitte versuchen Sie es erneut.",
    failedToCompleteSignIn: "Fehler beim Abschließen der Anmeldung. Bitte versuchen Sie, einen neuen Anmelde-Link anzufordern.",
    dataProtectionInfo: "Weitere Informationen zum Datenschutz finden Sie in unserer",
    subscribeToNewsletter: "Newsletter abonnieren",
    unsubscribeFromNewsletter: "Newsletter abbestellen",
    subscriptionSuccessful: "Newsletter erfolgreich abonniert!",
    unsubscriptionSuccessful: "Newsletter erfolgreich abbestellt!",
    alreadySubscribed: "Sie haben unseren Newsletter bereits abonniert.",
    notSubscribed: "Sie haben unseren Newsletter nicht abonniert.",
    subscriptionError: "Abonnement fehlgeschlagen. Bitte versuchen Sie es erneut.",
    unsubscriptionError: "Abbestellung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    manageSubscription: "Abonnement verwalten",
    subscriptionStatus: "Abonnement-Status",
    subscribed: "Abonniert",
    unsubscribed: "Abbestellt",
    subscribing: "Abonnieren...",
    unsubscribing: "Abbestellen...",
    newEventNotification: "Neue Veranstaltungsbenachrichtigung",
    newEventAvailable: "Eine neue Veranstaltung ist jetzt verfügbar!",
    checkOutEvent: "Veranstaltung ansehen",
    unsubscribeLink: "Diese Benachrichtigungen abbestellen",
    magicLinkExplanation: "Was ist ein Magic Link?",
    magicLinkBenefits: "Magic Links bieten sicheren und passwortlosen Zugang zu Ihrem Konto:",
    noPasswordNeeded: "Kein Passwort erforderlich",
    secureLogin: "Sicher und verschlüsselt",
    oneClickAccess: "Ein-Klick-Zugang von Ihrer E-Mail",
    aboutSportograf: "Über Sportograf",
    aboutSportografDescription: "Sportograf: Unser Name sagt alles über uns aus. Wir sind Sportbegeisterte, die es lieben, die bestmöglichen Fotos für jeden Teilnehmer zu machen.",
    ourStory: "Unsere Geschichte",
    ourStoryDescription: "Unsere Geschichte begann, als Tom Janas und Guido Holz - frustriert über die Fotos, die sie als teure Papierabzüge bei Radrennen bestellen mussten - die Idee hatten, den weltweit ersten rein digitalen Fotoservice zu schaffen. Gesagt, getan. Im Dezember 2005 programmierten sie während ihres Auslandssemesters in Spanien und Italien die erste Version der Website. Der erste Fotoverkauf wurde euphorisch mit einem Bier gefeiert und so nahmen die Dinge ihren Lauf.",
    eventsWorldwide: "Veranstaltungen weltweit",
    freelancePhotographers: "freiberufliche Fotografen",
    photographedAthletes: "Millionen fotografierte Athleten",
    imagesPerYear: "Millionen Bilder pro Jahr",
    aboutUsCommitment: "Um die bestmöglichen Fotos zu machen, stehen wir um 4 Uhr morgens auf und sind rechtzeitig zum Sonnenaufgang am Veranstaltungsort, legen uns bei einem Hindernislauf in den Schlamm oder stehen auf einer Bergstraße in den Alpen bei strömendem Regen und eisigem Schnee. Wir sind selbst Sportler und kennen beide Perspektiven. Wir wissen, welche Fotos sich ein Athlet wünscht!",
    whatMakesUsDifferent: "Was uns unterscheidet",
    professionalQuality: "Professionelle Qualität",
    professionalQualityDescription: "Unsere Fotografen sind Profis mit jahrelanger Erfahrung in der Sportfotografie und garantieren Bilder höchster Qualität für jeden Teilnehmer.",
    completeCoverage: "Vollständige Abdeckung",
    completeCoverageDescription: "Nous positionnons des photographes à des endroits stratégiques le long du parcours pour capturer plusieurs prises de chaque participant.",
    advancedTechnology: "Fortschrittliche Technologie",
    advancedTechnologyDescription: "Unsere fortschrittliche Gesichtserkennungstechnologie macht es für Teilnehmer einfach, ihre Fotos nach der Veranstaltung schnell zu finden.",
    to: "bis",
  },
  fr: {
    home: "ACCUEIL",
    login: "CONNEXION",
    aboutUs: "À PROPOS",
    contact: "CONTACT",
    legal: "MENTIONS LÉGALES",
    privacy: "CONFIDENTIALITÉ",
    termsAndConditions: "CONDITIONS GÉNÉRALES",
    newsletter: "NEWSLETTER",
    faq: "FAQ",
    searchPlaceholder: "Rechercher des événements...",
    photographyForTheLoveOfSport: "PHOTOGRAPHIE PAR AMOUR DU SPORT",
    showPhotos: "VOIR LES PHOTOS",
    signupLogin: "Inscription / Connexion",
    enterYourEmail: "ENTREZ VOTRE EMAIL",
    sendMagicLink: "Envoyer un lien magique",
    whatIsAMagicLink: "Qu'est-ce qu'un lien magique?",
    nameRequired: "Le nom est requis",
    privacyPolicy: "politique de confidentialité",
    joinTheNewsletter: "REJOIGNEZ LA NEWSLETTER SPORTOGRAF",
    subscribe: "S'abonner",
    presaleEvent: "ÉVÉNEMENT DE PRÉVENTA",
    yourPrivacyMatters: "VOTRE VIE PRIVÉE EST IMPORTANTE",
    offer: "OFFRE",
    otherProducts: "AUTRES PRODUITS",
    adminDashboard: "Tableau de bord admin",
    events: "Événements",
    photographers: "Photographes",
    profile: "Profil",
    createEvent: "Créer un événement",
    editEvent: "Modifier l'événement",
    deleteEvent: "Supprimer l'événement",
    createPhotographer: "Créer un photographe",
    editPhotographer: "Modifier le photographe",
    deletePhotographer: "Supprimer le photographe",
    title: "Titre",
    description: "Description",
    date: "Date",
    time: "Heure",
    location: "Lieu",
    image: "Image",
    bestOfImage: "Meilleure image",
    assignPhotographers: "Assigner des photographes",
    save: "Enregistrer",
    cancel: "Annuler",
    name: "Nom",
    email: "Email",
    bio: "Bio",
    imageUploadedSuccessfully: "Image téléchargée avec succès",
    profileImage: "Photo de profil",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    submit: "Soumettre",
    loadMore: "Charger plus",
    sportografRaceletter: "RACELETTER",
    joinSportografRaceletter: "REJOIGNEZ LA NEWSLETTER SPORTOGRAF",
    newsletterDescription: "Recevez des mises à jour sur les événements passionnants, des aperçus du monde du sport et des offres spéciales de nos partenaires. Prêt à plonger?",
    enterYourEmailPlaceholder: "Entrez votre email",
    newsletterAgreement: "J'accepte de recevoir occasionnellement des emails de Sportograf. Je peux me désabonner à tout moment en envoyant un email à support@sportograf.com.",
    whyJoinNewsletter: "Pourquoi rejoindre notre newsletter?",
    eventAlerts: "Alertes d'événements",
    eventAlertsDescription: "Soyez le premier à connaître les événements à venir où Sportograf capturera vos moments.",
    specialOffers: "Offres spéciales",
    specialOffersDescription: "Obtenez des réductions exclusives et des promotions disponibles uniquement pour nos abonnés à la newsletter.",
    photographyTips: "Conseils de photographie",
    photographyTipsDescription: "Apprenez à paraître sous votre meilleur jour sur les photos d'action et à tirer le meilleur parti de vos moments sportifs.",
    athleteStories: "Histoires d'athlètes",
    athleteStoriesDescription: "Lisez des histoires inspirantes d'athlètes du monde entier et leur parcours dans le sport.",
    getUpdatesOnEvents: "Recevez des mises à jour sur les événements passionnants",
    insightsFromSportWorld: "des aperçus du monde du sport",
    specialOffersFromPartners: "et des offres spéciales de nos partenaires",
    readyToDiveIn: "Prêt à plonger?",
    howToContactUs: "COMMENT NOUS CONTACTER",
    contactForm: "Formulaire de contact",
    subject: "Sujet",
    message: "Message",
    sendMessage: "Envoyer le message",
    required: "*",
    legalNotice: "Mentions légales",
    managingDirectors: "Directeurs généraux:",
    privacyPolicyTitle: "Politique de confidentialité pour Sportograf.com",
    informationWeCollect: "1. Informations que nous collectons",
    personalData: "1.1 Données personnelles",
    nonPersonalData: "1.2 Données non personnelles",
    howWeUseInformation: "2. Comment nous utilisons les informations collectées",
    howWeProtectInformation: "3. Comment nous protégeons vos informations",
    sharingPersonalInformation: "4. Partage d'informations personnelles",
    thirdPartyWebsites: "5. Sites web tiers",
    changesToPrivacyPolicy: "6. Modifications de cette politique de confidentialité",
    acceptanceOfTerms: "7. Votre acceptation de ces conditions",
    contactingUs: "8. Nous contacter",
    lastUpdated: "Dernière mise à jour:",
    termsAndConditionsTitle: "Nos conditions générales",
    scope: "1. Portée",
    offerAndContract: "2. Offre et conclusion du contrat",
    prices: "3. Preise",
    deliveryAndPayment: "4. Livraison et paiement",
    rightOfCancellation: "5. Droit d'annulation",
    blog: "Blog",
    jobs: "Emplois",
    cookies: "Cookies",
    toContactSupport: "Pour contacter notre support, veuillez",
    useContactForm: "utiliser notre formulaire de contact",
    companyAddress: "Sportograf Digital Solutions GmbH",
    germany: "Allemagne",
    localCourt: "Tribunal local d'Aix-la-Chapelle, HRB 24642",
    salesTaxId: "Numéro d'identification TVA: DE341002439",
    onlineDisputeResolution: "Sur la base du règlement (UE) n° 524/2013 sur le règlement en ligne des litiges de consommation, la Comisión Europea lanza una plataforma para resolución de disputas en línea el 15/02/2016 bajo la URL http://ec.europa.eu/odr.",
    consumerDisputes: "Los consumidores tienen entonces la oportunidad de usar esta plataforma para la resolución de disputas con respecto a nuestra oferta en línea.",
    eventDate: "Date",
    eventTime: "Heure",
    eventLocation: "Lieu",
    website: "Sitio web",
    visitWebsite: "Visitar sitio web",
    bestPhotos: "Mejores fotos",
    tags: "Etiquetas",
    weAreOnIt: "¡ESTAMOS EN ELLO!",
    photosNotOnlineYet: "Las fotos aún no están en línea.",
    getNotificationWhenReady: "Recibe una notificación tan pronto como tus fotos estén en línea.",
    notifyMe: "Notificarme",
    paymentMethods: "Métodos de pago",
    securePayments: "Pagos seguros",
    logout: "Cerrar sesión",
    howCanWeHelpYou: "¿Cómo podemos ayudarte hoy?",
    enterSearchTerm: "Ingresa tu término de búsqueda aquí...",
    newSupportTicket: "Nuevo ticket de soporte",
    knowledgeBase: "Base de conocimientos",
    submitNewFAQ: "Enviar nueva FAQ",
    faqTitle: "Título FAQ",
    faqQuestion: "Tu pregunta",
    faqCategory: "Categoría",
    yourQuestion: "Tu pregunta",
    questionDetails: "Por favor proporciona detalles sobre tu pregunta",
    submitQuestion: "Enviar pregunta",
    thankYouForSubmission: "¡Gracias por tu envío!",
    questionSubmittedSuccessfully: "Tu pregunta ha sido enviada exitosamente y está pendiente de revisión.",
    manageFAQs: "Gestionar FAQs",
    pendingApproval: "Pendiente de aprobación",
    approved: "Aprobado",
    rejected: "Rechazado",
    approve: "Aprobar",
    reject: "Rechazar",
    answer: "Respuesta",
    provideAnswer: "Proporcionar respuesta",
    saveAnswer: "Guardar respuesta",
    status: "Estado",
    actions: "Acciones",
    noFAQsFound: "No se encontraron FAQs.",
    createFirstFAQ: "Crea tu primera FAQ",
    viewAll: "Ver todo",
    viewLess: "Ver menos",
    relatedArticles: "Artículos relacionados",
    didYouFindItHelpful: "¿Te resultó útil?",
    yes: "Sí",
    no: "No",
    authoredBy: "es el autor de este artículo de solución.",
    support: "Soporte",
    articleNotFound: "Artículo no encontrado",
    backToFAQ: "Volver a FAQ",
    solutionHome: "Inicio de soluciones",
    categoryGettingStarted: "Primeros pasos",
    categoryLogin: "Iniciar sesión",
    categoryFindYourPhotos: "Encuentra tus propias fotos",
    categoryOrder: "Pedido",
    categoryPayment: "Pago",
    categoryDownload: "Descarga",
    categoryFAQ: "FAQ",
    categoryPhotosRights: "Uso de las fotos, derechos de autor, prensa",
    categoryPress: "Prensa",
    categoryJoinTeam: "Únete al equipo",
    categoryPhotographer: "Fotógrafo",
    categoryRecognition: "Reconocimiento de número y rostro",
    heroQuote: "Cada momento en el deporte cuenta una historia. Capturamos la tuya.",
    heroQuoteAuthor: "Equipo Sportograf",
    eventsFound: "Eventos encontrados",
    eventFound: "Evento encontrado",
    noEventsFound: "No se encontraron eventos",
    clearSearch: "Limpiar búsqueda",
    forSearchTerm: "Para el término de búsqueda",
    editProfile: "Editar perfil",
    chooseImage: "Elegir imagen",
    emailCannotBeChanged: "El correo electrónico no se puede cambiar",
    tellUsAboutYourself: "Cuéntanos de tu vida",
    saveChanges: "Guardar cambios",
    saving: "Guardando",
    uploading: "Cargando",
    profileUpdatedSuccessfully: "Perfil actualizado exitosamente",
    selectedFile: "Archivo seleccionado",
    imageSizeError: "Error de tamaño de imagen",
    imageTypeError: "Error de tipo de imagen",
    uploadError: "Error de carga",
    updateError: "Error de actualización",
    imageUploadError: "Error al cargar la imagen de perfil. Por favor, inténtalo de nuevo.",
    profileUpdateError: "Error al actualizar el perfil",
    magicLinkSent: "¡Enlace mágico enviado!",
    checkEmailToComplete: "Revisa tu email para completar el inicio de sesión.",
    magicLinkSentTo: "Hemos enviado un enlace de inicio de sesión a",
    sending: "Enviando...",
    completingSignIn: "Completando inicio de sesión",
    verifyingLogin: "Verificando inicio de sesión...",
    loginSuccessful: "¡Inicio de sesión exitoso! Redirigiendo...",
    redirecting: "Redirigiendo...",
    returnToLogin: "Volver al inicio de sesión",
    emailRequired: "Se requiere email para completar el inicio de sesión",
    invalidMagicLink: "Enlace mágico inválido. Asegúrate de usar el enlace de tu email.",
    expiredMagicLink: "Este enlace de inicio de sesión ha expirado o ya ha sido usado. Por favor solicita uno nuevo.",
    failedToSendMagicLink: "Error al enviar el enlace mágico. Por favor inténtalo de nuevo.",
    failedToCompleteSignIn: "Error al completar el inicio de sesión. Por favor intenta solicitar un nuevo enlace de inicio de sesión.",
    dataProtectionInfo: "Para más información sobre protección de datos, consulta nuestra",
    subscribeToNewsletter: "Suscribirse al boletín",
    unsubscribeFromNewsletter: "Cancelar suscripción al boletín",
    subscriptionSuccessful: "¡Suscripción al boletín exitosa!",
    unsubscriptionSuccessful: "¡Cancelación de suscripción exitosa!",
    alreadySubscribed: "Ya estás suscrito a nuestro boletín.",
    notSubscribed: "No estás suscrito a nuestro boletín.",
    subscriptionError: "Suscripción fallida. Por favor inténtalo de nuevo.",
    unsubscriptionError: "Cancelación de suscripción fallida. Por favor inténtalo de nuevo.",
    manageSubscription: "Gestionar suscripción",
    subscriptionStatus: "Estado de suscripción",
    subscribed: "Suscrito",
    unsubscribed: "No suscrito",
    subscribing: "Suscribiendo...",
    unsubscribing: "Cancelando suscripción...",
    newEventNotification: "Notificación de nuevo evento",
    newEventAvailable: "¡Un nuevo evento está ahora disponible!",
    checkOutEvent: "Ver evento",
    unsubscribeLink: "Cancelar suscripción a estas notificaciones",
    magicLinkExplanation: "¿Qué es un enlace mágico?",
    magicLinkBenefits: "Los enlaces mágicos ofrecen acceso seguro y sin contraseña a tu cuenta:",
    noPasswordNeeded: "No se necesita contraseña",
    secureLogin: "Seguro y encriptado",
    oneClickAccess: "Acceso de un clic desde tu email",
    aboutSportograf: "Acerca de Sportograf",
    aboutSportografDescription: "Sportograf: Nuestro nombre lo dice todo sobre nosotros. Somos entusiastas del deporte que nos encanta tomar las mejores fotos posibles para cada participante.",
    ourStory: "Nuestra Historia",
    ourStoryDescription: "Nuestra historia comenzó cuando Tom Janas y Guido Holz - frustrados por las fotos que debían pedir como impresiones en papel a alto precio durante las carreras de bicicleta - tuvieron la idea de crear el primer servicio de fotos puramente digital del mundo. Ni una ni dos. En diciembre de 2005 programaron la primera versión del sitio web durante su semestre de intercambio en España e Italia. La primera venta de fotos se celebró eufóricamente con una cerveza y así las cosas siguieron su curso.",
    eventsWorldwide: "eventos en todo el mundo",
    freelancePhotographers: "fotógrafos independientes",
    photographedAthletes: "millones de atletas fotografiados",
    imagesPerYear: "millones de imágenes por año",
    aboutUsCommitment: "Para tomar las mejores fotos posibles, nos levantamos a las 4 de la mañana y llegamos al sitio del evento a tiempo para el amanecer, nos acostamos en el barro durante una carrera de obstáculos, o nos paramos en una carretera de paso de montaña en los Alpes bajo lluvia torrencial y nieve helada. Somos deportistas nosotros mismos y conocemos ambas perspectivas. ¡Sabemos qué fotos desea un atleta!",
    whatMakesUsDifferent: "Lo que nos hace diferentes",
    professionalQuality: "Calidad profesional",
    professionalQualityDescription: "Nuestros fotógrafos son profesionales con años de experiencia en fotografía deportiva, garantizando imágenes de la más alta calidad para cada participante.",
    completeCoverage: "Cobertura completa",
    completeCoverageDescription: "Nous positionnons des photographes à des endroits stratégiques le long du parcours pour capturer plusieurs prises de chaque participant.",
    advancedTechnology: "Tecnología avanzada",
    advancedTechnologyDescription: "Notre technologie avancée de reconnaissance faciale permet aux participants de trouver facilement leurs photos rapidement après l'événement.",
    to: "à",
  },
  es: {
    home: "INICIO",
    login: "INICIAR SESIÓN",
    aboutUs: "SOBRE NOSOTROS",
    contact: "CONTACTO",
    legal: "LEGAL",
    privacy: "PRIVACIDAD",
    termsAndConditions: "TÉRMINOS Y CONDICIONES",
    newsletter: "BOLETÍN",
    nameRequired: "Nombre es requerido",
    faq: "PREGUNTAS FRECUENTES",
    searchPlaceholder: "Buscar eventos...",
    photographyForTheLoveOfSport: "FOTOGRAFÍA POR AMOR AL DEPORTE",
    showPhotos: "MOSTRAR FOTOS",
    signupLogin: "Registrarse / Iniciar sesión",
    imageUploadedSuccessfully: "Imagen subida con éxito",
    enterYourEmail: "INGRESE SU EMAIL",
    sendMagicLink: "Enviar enlace mágico",
    whatIsAMagicLink: "¿Qué es un enlace mágico?",
    privacyPolicy: "política de privacidad",
    joinTheNewsletter: "ÚNETE AL BOLETÍN DE SPORTOGRAF",
    subscribe: "Suscribirse",
    presaleEvent: "EVENTO DE PRÉVENTA",
    yourPrivacyMatters: "TU PRIVACIDAD IMPORTA",
    offer: "OFERTA",
    otherProducts: "OTROS PRODUCTOS",
    adminDashboard: "Panel de administración",
    events: "Eventos",
    photographers: "Fotógrafos",
    profile: "Perfil",
    createEvent: "Crear evento",
    editEvent: "Editar evento",
    deleteEvent: "Eliminar evento",
    createPhotographer: "Crear fotógrafo",
    editPhotographer: "Editar fotógrafo",
    deletePhotographer: "Eliminar fotógrafo",
    title: "Título",
    description: "Descripción",
    date: "Fecha",
    time: "Hora",
    location: "Ubicación",
    image: "Imagen",
    bestOfImage: "Mejor imagen",
    assignPhotographers: "Asignar fotógrafos",
    save: "Guardar",
    cancel: "Cancelar",
    name: "Nombre",
    email: "Email",
    bio: "Biografía",
    profileImage: "Imagen de perfil",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    submit: "Enviar",
    loadMore: "Cargar más",
    sportografRaceletter: "RACELETTER",
    joinSportografRaceletter: "ÚNETE AL BOLETÍN DE SPORTOGRAF",
    newsletterDescription: "Recibe actualizaciones sobre eventos emocionantes, perspectivas del mundo del deporte y ofertas especiales de nuestros socios. ¿Listo para sumergirte?",
    enterYourEmailPlaceholder: "Ingresa tu email",
    newsletterAgreement: "Acepto recibir emails ocasionales de Sportograf. Puedo cancelar la suscripción en cualquier momento enviando un email a support@sportograf.com.",
    whyJoinNewsletter: "¿Por qué unirse a nuestro boletín?",
    eventAlerts: "Alertas de eventos",
    eventAlertsDescription: "Sé el primero en conocer los próximos eventos donde Sportograf capturará tus momentos.",
    specialOffers: "Ofertas especiales",
    specialOffersDescription: "Obtén descuentos exclusivos y promociones disponibles solo para nuestros suscriptores del boletín.",
    photographyTips: "Consejos de fotografía",
    photographyTipsDescription: "Aprende cómo lucir mejor en las fotos de acción y aprovechar al máximo tus momentos deportivos.",
    athleteStories: "Historias de atletas",
    athleteStoriesDescription: "Lee historias inspiradoras de atletas de todo el mundo y su viaje en el deporte.",
    getUpdatesOnEvents: "Recibe actualizaciones sobre eventos emocionantes",
    insightsFromSportWorld: "perspectivas del mundo del deporte",
    specialOffersFromPartners: "y ofertas especiales de nuestros socios",
    readyToDiveIn: "¿Listo para sumergirte?",
    howToContactUs: "CÓMO CONTACTARNOS",
    contactForm: "Formulario de contacto",
    subject: "Asunto",
    message: "Mensaje",
    sendMessage: "Enviar mensaje",
    required: "*",
    legalNotice: "Aviso legal",
    managingDirectors: "Directores gerentes:",
    privacyPolicyTitle: "Política de privacidad para Sportograf.com",
    informationWeCollect: "1. Información que recopilamos",
    personalData: "1.1 Datos personales",
    nonPersonalData: "1.2 Datos no personales",
    howWeUseInformation: "2. Cómo usamos la información recopilada",
    howWeProtectInformation: "3. Cómo protegemos su información",
    sharingPersonalInformation: "4. Compartir información personal",
    thirdPartyWebsites: "5. Sitios web de terceros",
    changesToPrivacyPolicy: "6. Cambios a esta política de privacidad",
    acceptanceOfTerms: "7. Su aceptación de estos términos",
    contactingUs: "8. Contactándonos",
    lastUpdated: "Última actualización:",
    termsAndConditionsTitle: "Nuestros términos y condiciones",
    scope: "1. Alcance",
    offerAndContract: "2. Oferta y conclusión del contrato",
    prices: "3. Precios",
    deliveryAndPayment: "4. Entrega y pago",
    rightOfCancellation: "5. Derecho de cancelación",
    blog: "Blog",
    jobs: "Trabajos",
    cookies: "Cookies",
    toContactSupport: "Para contactar nuestro soporte, por favor",
    useContactForm: "use nuestro formulario de contacto",
    companyAddress: "Sportograf Digital Solutions GmbH",
    germany: "Alemania",
    localCourt: "Tribunal Local de Aquisgrán, HRB 24642",
    salesTaxId: "Número de identificación fiscal: DE341002439",
    onlineDisputeResolution: "Sobre la base del Reglamento (UE) No 524/2013 sobre resolución de disputas en línea para disputas de consumidores, la Comisión Europea lanza una plataforma para resolución de disputas en línea el 15/02/2016 bajo la URL http://ec.europa.eu/odr.",
    consumerDisputes: "Los consumidores tienen entonces la oportunidad de usar esta plataforma para la resolución de disputas con respecto a nuestra oferta en línea.",
    eventDate: "Fecha",
    eventTime: "Hora",
    eventLocation: "Ubicación",
    website: "Sitio web",
    visitWebsite: "Visitar sitio web",
    bestPhotos: "Mejores fotos",
    tags: "Etiquetas",
    weAreOnIt: "¡ESTAMOS EN ELLO!",
    photosNotOnlineYet: "Las fotos aún no están en línea.",
    getNotificationWhenReady: "Recibe una notificación tan pronto como tus fotos estén en línea.",
    notifyMe: "Notificarme",
    paymentMethods: "Métodos de pago",
    securePayments: "Pagos seguros",
    logout: "Cerrar sesión",
    howCanWeHelpYou: "¿Cómo podemos ayudarte hoy?",
    enterSearchTerm: "Ingresa tu término de búsqueda aquí...",
    newSupportTicket: "Nuevo ticket de soporte",
    knowledgeBase: "Base de conocimientos",
    submitNewFAQ: "Enviar nueva FAQ",
    faqTitle: "Título FAQ",
    faqQuestion: "Tu pregunta",
    faqCategory: "Categoría",
    yourQuestion: "Tu pregunta",
    questionDetails: "Por favor proporciona detalles sobre tu pregunta",
    submitQuestion: "Enviar pregunta",
    thankYouForSubmission: "¡Gracias por tu envío!",
    questionSubmittedSuccessfully: "Tu pregunta ha sido enviada exitosamente y está pendiente de revisión.",
    manageFAQs: "Gestionar FAQs",
    pendingApproval: "Pendiente de aprobación",
    approved: "Aprobado",
    rejected: "Rechazado",
    approve: "Aprobar",
    reject: "Rechazar",
    answer: "Respuesta",
    provideAnswer: "Proporcionar respuesta",
    saveAnswer: "Guardar respuesta",
    status: "Estado",
    actions: "Acciones",
    noFAQsFound: "No se encontraron FAQs.",
    createFirstFAQ: "Crea tu primera FAQ",
    viewAll: "Ver todo",
    viewLess: "Ver menos",
    relatedArticles: "Artículos relacionados",
    didYouFindItHelpful: "¿Te resultó útil?",
    yes: "Sí",
    no: "No",
    authoredBy: "es el autor de este artículo de solución.",
    support: "Soporte",
    articleNotFound: "Artículo no encontrado",
    backToFAQ: "Volver a FAQ",
    solutionHome: "Inicio de soluciones",
    categoryGettingStarted: "Primeros pasos",
    categoryLogin: "Iniciar sesión",
    categoryFindYourPhotos: "Encuentra tus propias fotos",
    categoryOrder: "Pedido",
    categoryPayment: "Pago",
    categoryDownload: "Descarga",
    categoryFAQ: "FAQ",
    categoryPhotosRights: "Uso de las fotos, derechos de autor, prensa",
    categoryPress: "Prensa",
    categoryJoinTeam: "Únete al equipo",
    categoryPhotographer: "Fotógrafo",
    categoryRecognition: "Reconocimiento de número y rostro",
    heroQuote: "Cada momento en el deporte cuenta una historia. Capturamos la tuya.",
    heroQuoteAuthor: "Equipo Sportograf",
    eventsFound: "Eventos encontrados",
    eventFound: "Evento encontrado",
    noEventsFound: "No se encontraron eventos",
    clearSearch: "Limpiar búsqueda",
    forSearchTerm: "Para el término de búsqueda",
    editProfile: "Editar perfil",
    chooseImage: "Elegir imagen",
    emailCannotBeChanged: "El correo electrónico no se puede cambiar",
    tellUsAboutYourself: "Cuéntanos de tu vida",
    saveChanges: "Guardar cambios",
    saving: "Guardando",
    uploading: "Cargando",
    profileUpdatedSuccessfully: "Perfil actualizado exitosamente",
    selectedFile: "Archivo seleccionado",
    imageSizeError: "Error de tamaño de imagen",
    imageTypeError: "Error de tipo de imagen",
    uploadError: "Error de carga",
    updateError: "Error de actualización",
    imageUploadError: "Error al cargar la imagen de perfil. Por favor, inténtalo de nuevo.",
    profileUpdateError: "Error al actualizar el perfil",
    magicLinkSent: "¡Enlace mágico enviado!",
    checkEmailToComplete: "Revisa tu email para completar el inicio de sesión.",
    magicLinkSentTo: "Hemos enviado un enlace de inicio de sesión a",
    sending: "Enviando...",
    completingSignIn: "Completando inicio de sesión",
    verifyingLogin: "Verificando inicio de sesión...",
    loginSuccessful: "¡Inicio de sesión exitoso! Redirigiendo...",
    redirecting: "Redirigiendo...",
    returnToLogin: "Volver al inicio de sesión",
    emailRequired: "Se requiere email para completar el inicio de sesión",
    invalidMagicLink: "Enlace mágico inválido. Asegúrate de usar el enlace de tu email.",
    expiredMagicLink: "Este enlace de inicio de sesión ha expirado o ya ha sido usado. Por favor solicita uno nuevo.",
    failedToSendMagicLink: "Error al enviar el enlace mágico. Por favor inténtalo de nuevo.",
    failedToCompleteSignIn: "Error al completar el inicio de sesión. Por favor intenta solicitar un nuevo enlace de inicio de sesión.",
    dataProtectionInfo: "Para más información sobre protección de datos, consulta nuestra",
    subscribeToNewsletter: "Suscribirse al boletín",
    unsubscribeFromNewsletter: "Cancelar suscripción al boletín",
    subscriptionSuccessful: "¡Suscripción al boletín exitosa!",
    unsubscriptionSuccessful: "¡Cancelación de suscripción exitosa!",
    alreadySubscribed: "Ya estás suscrito a nuestro boletín.",
    notSubscribed: "No estás suscrito a nuestro boletín.",
    subscriptionError: "Suscripción fallida. Por favor inténtalo de nuevo.",
    unsubscriptionError: "Cancelación de suscripción fallida. Por favor inténtalo de nuevo.",
    manageSubscription: "Gestionar suscripción",
    subscriptionStatus: "Estado de suscripción",
    subscribed: "Suscrito",
    unsubscribed: "No suscrito",
    subscribing: "Suscribiendo...",
    unsubscribing: "Cancelando suscripción...",
    newEventNotification: "Notificación de nuevo evento",
    newEventAvailable: "¡Un nuevo evento está ahora disponible!",
    checkOutEvent: "Ver evento",
    unsubscribeLink: "Cancelar suscripción a estas notificaciones",
    magicLinkExplanation: "¿Qué es un enlace mágico?",
    magicLinkBenefits: "Los enlaces mágicos ofrecen acceso seguro y sin contraseña a tu cuenta:",
    noPasswordNeeded: "No se necesita contraseña",
    secureLogin: "Seguro y encriptado",
    oneClickAccess: "Acceso de un clic desde tu email",
    aboutSportograf: "Acerca de Sportograf",
    aboutSportografDescription: "Sportograf: Nuestro nombre lo dice todo sobre nosotros. Somos entusiastas del deporte que nos encanta tomar las mejores fotos posibles para cada participante.",
    ourStory: "Nuestra Historia",
    ourStoryDescription: "Nuestra historia comenzó cuando Tom Janas y Guido Holz - frustrados por las fotos que debían pedir como impresiones en papel a alto precio durante las carreras de bicicleta - tuvieron la idea de crear el primer servicio de fotos puramente digital del mundo. Dicho y hecho. En diciembre de 2005 programaron la primera versión del sitio web durante su semestre de intercambio en España e Italia. La primera venta de fotos se celebró eufóricamente con una cerveza y así las cosas siguieron su curso.",
    eventsWorldwide: "eventos en todo el mundo",
    freelancePhotographers: "fotógrafos independientes",
    photographedAthletes: "millones de atletas fotografiados",
    imagesPerYear: "millones de imágenes por año",
    aboutUsCommitment: "Para tomar las mejores fotos posibles, nos levantamos a las 4 de la mañana y llegamos al sitio del evento a tiempo para el amanecer, nos acostamos en el barro durante una carrera de obstáculos, o nos paramos en una carretera de paso de montaña en los Alpes bajo lluvia torrencial y nieve helada. Somos deportistas nosotros mismos y conocemos ambas perspectivas. ¡Sabemos qué fotos desea un atleta!",
    whatMakesUsDifferent: "Lo que nos hace diferentes",
    professionalQuality: "Calidad profesional",
    professionalQualityDescription: "Nuestros fotógrafos son profesionales con años de experiencia en fotografía deportiva, garantizando imágenes de la más alta calidad para cada participante.",
    completeCoverage: "Cobertura completa",
    completeCoverageDescription: "Nous positionnons des photographes à des endroits stratégiques le long du parcours pour capturer plusieurs prises de chaque participant.",
    advancedTechnology: "Tecnología avanzada",
    advancedTechnologyDescription: "Nuestra tecnología avanzada de reconocimiento facial hace que sea fácil para los participantes encontrar sus fotos rápidamente después del evento.",
    to: "hasta",
  },
}
