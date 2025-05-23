import type { Language } from "./types"

type TranslationKeys =
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
    sendMagicLink: "Send Magic Link",
    whatIsAMagicLink: "What is a magic link?",
    privacyPolicy: "privacy policy",
    joinTheNewsletter: "JOIN THE SPORTOGRAF RACELETTER",
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
  },
  de: {
    home: "STARTSEITE",
    login: "ANMELDEN",
    aboutUs: "ÜBER UNS",
    contact: "KONTAKT",
    legal: "RECHTLICHES",
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
    privacyPolicy: "politique de confidentialité",
    joinTheNewsletter: "REJOIGNEZ LA NEWSLETTER SPORTOGRAF",
    subscribe: "S'abonner",
    presaleEvent: "ÉVÉNEMENT DE PRÉVENTE",
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
    profileImage: "Photo de profil",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    submit: "Soumettre",
    loadMore: "Charger plus",
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
    faq: "PREGUNTAS FRECUENTES",
    searchPlaceholder: "Buscar eventos...",
    photographyForTheLoveOfSport: "FOTOGRAFÍA POR AMOR AL DEPORTE",
    showPhotos: "MOSTRAR FOTOS",
    signupLogin: "Registrarse / Iniciar sesión",
    enterYourEmail: "INGRESE SU EMAIL",
    sendMagicLink: "Enviar enlace mágico",
    whatIsAMagicLink: "¿Qué es un enlace mágico?",
    privacyPolicy: "política de privacidad",
    joinTheNewsletter: "ÚNETE AL BOLETÍN DE SPORTOGRAF",
    subscribe: "Suscribirse",
    presaleEvent: "EVENTO DE PREVENTA",
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
  },
}
