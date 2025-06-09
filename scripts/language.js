const translations = {
  sv: {
    login_page_title: "Logga in – GhostGrid",
    login_title: "Logga in på GhostGrid",
    email: "E-postadress",
    email_placeholder: "Ange din e-post",
    password: "Lösenord",
    password_placeholder: "Ange ditt lösenord",
    login_button: "Logga in",
    forgot_password: "Glömt ditt lösenord?",
    create_account: "Skapa nytt konto",
    intro_title: "Välkommen till GhostGrid",
    intro_subline: "Din väg till digital frihet",
    flag_sv: "SV",
    flag_en: "EN"
  },
  en: {
    login_page_title: "Login – GhostGrid",
    login_title: "Log in to GhostGrid",
    email: "Email address",
    email_placeholder: "Enter your email",
    password: "Password",
    password_placeholder: "Enter your password",
    login_button: "Log in",
    forgot_password: "Forgot your password?",
    create_account: "Create account",
    intro_title: "Welcome to GhostGrid",
    intro_subline: "Your gateway to digital freedom",
    flag_sv: "SV",
    flag_en: "EN"
  }
};

function applyTranslations() {
  const lang = localStorage.getItem("lang") || "sv";
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    const translation = translations[lang][key];
    if (!translation) return;

    if (el.tagName === "INPUT") {
      if (el.hasAttribute("placeholder")) {
        el.placeholder = translations[lang][`${key}_placeholder`] || translation;
      }
    } else {
      el.textContent = translation;
    }
  });

  // Ändra sidtitel om relevant
  if (translations[lang]["login_page_title"]) {
    document.title = translations[lang]["login_page_title"];
  }
}

document.addEventListener("DOMContentLoaded", applyTranslations);