import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLanguage = sessionStorage.getItem('language') || 'fr';

const resources = {
  en: {
    translation: {
      "login": "Login",
      "welcome_message": "Welcome to the SKEMA Application Alternance. Discover job opportunities that match your skills with the power of AI. Enhance your CV with personalized recommendations and create tailored cover letters for your desired positions. Start your journey towards the perfect job!",
      "input_mail": "Enter your SKEMA mail",
      "input_code": "Enter the code received via email",
      "time": "seconds remaining",
      "btn_confirm": "Confirm",
      "resend": "Resend code",
      "error_code": "Wrong code. Please try again!",
      "logout": "Logout",
      "error_no_cover_letter": "No cover letter available for this job.",
      "page_no_found": "404 - Page not found",
      "predict_title":  "Prediction Results",
      "!title": "No Title Available",
      "!company": "No Company Available",
      "btn_view_CL": "View Cover Letter",
      "btn_apply": "Apply",
      "title_MS": "Matching Skills:",
      "!skills": "Skills not specified",
      "title_!skills": "Missing Skills:",
      "!rsls": "No results available.",
      "title_CL": "Cover Letter:",
      "title_PR": "Primary Responsibilities:",
      "title_KRS": "Key Required Skills:",
      "title_MO": "Main Objectives:",
      "title_LJP": "Liked Job Posts :",
      "title_VJ": "View Job",
      "error_!LJ": "There are currently no posts available for display.<br />Please engage with posts in the manual matching section to enable viewing.",
      "title_source": "Source",
      "title_region": "Region",
      "input_search": "Enter a key information",
      "title_favoris": "Favoris",
      "btn_SM": "Smart Matching",
      "btn_MM": "Manual Matching",
      "warning_!Data": "Warning: No data available.",
      "title_company": "Company",
      "title_title": "Title",
      "title_location": "Location",
      "title_date": "Date",
      "title_MD": "More details:",
      "title_VA": "View Alternance",
      "title_LM": "Loading results...",
      "error_!MS": "No matching results found. Please try again or update your matching criteria.",
      "btn_B2M": "Back to Matching",
      "title_CV": "Upload Your Resume for Alternance Matches:",
      "description_CV": "By uploading your CV to our advanced matching platform, you unlock a powerful tool designed to thoroughly analyze your academic background, work experience, and unique skill set. This enables the platform to provide highly personalized job matches, helping you take a major step forward in your marketing career.",
      "input_file": "Upload and attach files",
      "btn_UpCV": "Click to upload or drag and drop",
      "btn_processing": "Processing...",
      "btn_viewRslts": "View CV Results",
      "btn_StartM": "Start Matching",
      "title_prompt": "Enter Your Marketing Role Preferences:",
      "description_prompt": "Looking for your next marketing role? Simply enter your desired criteria into our intelligent search system. Our AI-powered tool will match you with the best opportunities tailored to your preferences. Start your search now and discover roles that fit your skills and goals. Effortlessly find your perfect marketing job today!",
      "input_prompt": "Please provide a detailed description of the position you're seeking, including your desired job title, key skills, preferred responsibilities, and objectives for the role. The more specific and complete your input, the better we can match you with relevant alternance offers.",
      "btn_viewRsltsPr": "View Prompt Results",
      "job_title": "Job Title",
      "primary_responsibilities": "Primary Responsibilities",
      "key_skills": "Key Required Skills",
      "main_objectives": "Main Objectives",
      "no_more_details":"Click view alternance for more details!",
      "theme": "Change theme"
    }
  },
  fr: {
    translation: {
        "login": "Connexion",
        "welcome_message": "Bienvenue sur l'application Alternance de SKEMA. Découvrez des opportunités d'emploi qui correspondent à vos compétences grâce à la puissance de l'IA. Améliorez votre CV avec des recommandations personnalisées et créez des lettres de motivation adaptées aux postes que vous visez. Commencez votre parcours vers l'emploi idéal !",
        "input_mail": "Entrez votre adresse mail SKEMA",
        "input_code": "Entrez le code reçu par email",
        "time": "secondes restantes",
        "btn_confirm": "Confirmer",
        "resend": "Renvoyer le code",
        "error_code": "Code incorrect. Veuillez réessayer !",
        "logout": "Déconnexion",
        "error_no_cover_letter": "Aucune lettre de motivation disponible pour ce poste.",
        "page_no_found": "404 - Page non trouvée",
        "predict_title": "Résultats de la prédiction",
        "!title": "Pas de titre disponible",
        "!company": "Aucune entreprise disponible",
        "btn_view_CL": "Voir la lettre de motivation",
        "btn_apply": "Postuler",
        "title_MS": "Compétences correspondantes :",
        "!skills": "Compétences non spécifiées",
        "title_!skills": "Compétences manquantes :",
        "!rsls": "Aucun résultat disponible.",
        "title_CL": "Lettre de motivation :",
        "title_PR": "Responsabilités principales :",
        "title_KRS": "Compétences clés requises :",
        "title_MO": "Objectifs principaux :",
        "title_LJP": "Annonces aimées :",
        "title_VJ": "Voir le poste",
        "error_!LJ": "Il n'y a actuellement aucun post disponible à afficher.<br />Veuillez interagir avec des annonces dans la section de correspondance manuelle pour activer l'affichage.",
        "title_source": "Source",
        "title_region": "Région",
        "input_search": "Entrez une information clé",
        "title_favoris": "Favoris",
        "btn_SM": "Correspondance intelligente",
        "btn_MM": "Correspondance manuelle",
        "warning_!Data": "Attention : Aucune donnée disponible.",
        "title_company": "Entreprise",
        "title_title": "Titre",
        "title_location": "Localisation",
        "title_date": "Date",
        "title_MD": "Plus de détails :",
        "title_VA": "Voir l'alternance",
        "title_LM": "Chargement des résultats...",
        "error_!MS": "Aucun résultat correspondant trouvé. Veuillez réessayer ou mettre à jour vos critères de correspondance.",
        "btn_B2M": "Retour à la correspondance",
        "title_CV": "Téléchargez votre CV pour des correspondances d'alternance :",
        "description_CV": "En téléchargeant votre CV sur notre plateforme de correspondance avancée, vous débloquez un outil puissant conçu pour analyser en profondeur votre parcours académique, votre expérience professionnelle et vos compétences uniques. Cela permet à la plateforme de vous fournir des correspondances d'emploi très personnalisées, vous aidant à franchir une étape importante dans votre carrière en marketing.",
        "input_file": "Télécharger et joindre des fichiers",
        "btn_UpCV": "Cliquez pour télécharger ou glissez-déposez",
        "btn_processing": "Traitement en cours...",
        "btn_viewRslts": "Voir les résultats du CV",
        "btn_StartM": "Commencer la correspondance",
        "title_prompt": "Entrez vos préférences de poste en marketing :",
        "description_prompt": "Vous cherchez votre prochain rôle en marketing ? Entrez simplement vos critères souhaités dans notre système de recherche intelligent. Notre outil alimenté par l'IA vous associera aux meilleures opportunités adaptées à vos préférences. Commencez votre recherche dès maintenant et découvrez des rôles qui correspondent à vos compétences et objectifs. Trouvez facilement l'emploi marketing parfait dès aujourd'hui !",
        "input_prompt": "Veuillez fournir une description détaillée du poste que vous recherchez, y compris le titre de poste souhaité, les compétences clés, les responsabilités préférées et les objectifs pour le rôle. Plus votre saisie sera spécifique et complète, mieux nous pourrons vous correspondre avec des offres d'alternance pertinentes.",
        "btn_viewRsltsPr": "Voir les résultats de la saisie",
        "job_title": "Titre du Poste",
        "primary_responsibilities": "Responsabilités Principales",
        "key_skills": "Compétences Clés Requises",
        "main_objectives": "Objectifs Principaux",
        "no_more_details": "Cliquez sur voir l'alternance pour plus de détails !",
      "theme": "Changer le thème"
      }
      
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // Utilise la langue sauvegardée
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Écoute les changements de langue et met à jour sessionStorage
i18n.on('languageChanged', (lng) => {
  sessionStorage.setItem('language', lng); // Sauvegarde la langue actuelle
});

export default i18n;
