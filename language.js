document.addEventListener("DOMContentLoaded", () => { 
  const lang = localStorage.getItem("language") || "sv";

  const translations = {
    sv: {
      login_title: "Logga in på GhostGrid",
      email: "E-postadress",
      password: "Lösenord",
      login_button: "Logga in",
      forgot_password: "Glömt ditt lösenord?",
      no_account: "Har du inget konto?",
      create_account: "Skapa nytt konto",

      title_upload: "Ladda upp innehåll",
      post_label: "Skriv ett inlägg:",
      post_placeholder: "Vad vill du dela med dig av?",
      upload_image: "Ladda upp en bild:",
      upload_video: "Ladda upp ett klipp (valfritt):",
      upload_audio: "Ladda upp ljudfil (valfritt):",
      temporary: "Gör detta till ett tillfälligt inlägg (försvinner om 24h)",
      mic_recording: "Mikrofoninspelning (valfritt):",
      start_recording: "🎤 Starta inspelning",
      stop_recording: "🛑 Stoppa",
      upload: "Ladda upp",
      language_title: "Välj språk / Select Language",

      intro_title: "Välkommen till GhostGrid",
      intro_subline: "Din väg till digital frihet",
      flag_sv: "SV",
      flag_en: "EN",

      profile_page_title: "Min Profil – GhostGrid",
      profile_title: "Min Profil",
      profile_email: "E-post:",
      profile_username: "Användarnamn:",
      label_custom_code: "Profilkod (HTML/CSS):",
      placeholder_custom_code: "<style>body { background: black; }</style>",
      btn_save_code: "Spara kod",
      btn_use_template: "Använd färdig kod",
      link_logout: "Logga ut",
      template_about_me: "Om mig",
      template_about_me_text: "Skriv lite om dig själv här...",
      template_interests: "Intressen",
      template_interests_text: "Berätta om vad du gillar att göra!",

      forum_page_title: "Forum – GhostGrid",
      forum_title: "GhostGrid Forum",
      forum_description: "Här diskuterar vi allt från teknologi och AI till samhällsfrågor och personliga tankar. Välkommen till GhostGrid Forum!",
      create_thread_button: "➕ Skapa ny tråd",
      thread_title_placeholder: "Titel på ny tråd",
      thread_title_alert: "Du måste skriva en titel!",

      register_page_title: "Skapa konto – GhostGrid",
      register_title: "Skapa konto på GhostGrid",
      label_username: "Användarnamn",
      placeholder_username: "Ange användarnamn",
      label_email: "E-postadress",
      placeholder_email: "Ange din e-postadress",
      label_password: "Lösenord",
      placeholder_password: "Ange ditt lösenord",
      button_register: "Registrera",
      text_have_account: "Har du redan ett konto?",
      link_login: "Logga in här",

      thread_page_title: "Diskussionstråd – GhostGrid",
      thread_loading: "Laddar tråd...",
      comment_placeholder: "Skriv en kommentar...",
      comment_send_button: "Skicka kommentar"
    },
    en: {
      login_title: "Log in to GhostGrid",
      email: "Email Address",
      password: "Password",
      login_button: "Log In",
      forgot_password: "Forgot your password?",
      no_account: "Don't have an account?",
      create_account: "Create new account",

      title_upload: "Upload Content",
      post_label: "Write a post:",
      post_placeholder: "What would you like to share?",
      upload_image: "Upload an image:",
      upload_video: "Upload a video (optional):",
      upload_audio: "Upload audio (optional):",
      temporary: "Make this a temporary post (disappears in 24h)",
      mic_recording: "Microphone recording (optional):",
      start_recording: "🎤 Start recording",
      stop_recording: "🛑 Stop",
      upload: "Upload",
      language_title: "Choose Language",

      intro_title: "Welcome to GhostGrid",
      intro_subline: "Your gateway to digital freedom",
      flag_sv: "SV",
      flag_en: "EN",

      profile_page_title: "My Profile – GhostGrid",
      profile_title: "My Profile",
      profile_email: "Email:",
      profile_username: "Username:",
      label_custom_code: "Profile Code (HTML/CSS):",
      placeholder_custom_code: "<style>body { background: black; }</style>",
      btn_save_code: "Save Code",
      btn_use_template: "Use Template",
      link_logout: "Log out",
      template_about_me: "About Me",
      template_about_me_text: "Write a bit about yourself here...",
      template_interests: "Interests",
      template_interests_text: "Tell us what you like to do!",

      forum_page_title: "Forum – GhostGrid",
      forum_title: "GhostGrid Forum",
      forum_description: "Here we discuss everything from technology and AI to society and personal thoughts. Welcome to GhostGrid Forum!",
      create_thread_button: "➕ Create New Thread",
      thread_title_placeholder: "Title of new thread",
      thread_title_alert: "You must enter a title!",

      register_page_title: "Create Account – GhostGrid",
      register_title: "Create Account on GhostGrid",
      label_username: "Username",
      placeholder_username: "Enter username",
      label_email: "Email Address",
      placeholder_email: "Enter your email address",
      label_password: "Password",
      placeholder_password: "Enter your password",
      button_register: "Register",
      text_have_account: "Already have an account?",
      link_login: "Log in here",

      thread_page_title: "Discussion Thread – GhostGrid",
      thread_loading: "Loading thread...",
      comment_placeholder: "Write a comment...",
      comment_send_button: "Send Comment"
    }
  };

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const value = translations[lang]?.[key];
    if (value) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = value;
      } else {
        el.innerHTML = value;
      }
    }
  });
});