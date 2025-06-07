
document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("ghostgrid-lang") || "sv";
  applyTranslations(lang);
});

function applyTranslations(lang) {
  const t = {
    sv: {
      title_upload: "Ladda upp innehåll",
      post_placeholder: "Vad vill du dela med dig av?",
      upload_image: "Ladda upp en bild:",
      upload_audio: "Ladda upp ljudfil (valfritt):",
      temporary: "Gör detta till ett tillfälligt inlägg (försvinner om 24h)",
      mic_recording: "Mikrofoninspelning (valfritt):",
      start_recording: "🎤 Starta inspelning",
      stop_recording: "🛑 Stoppa",
      upload: "Ladda upp"
    },
    en: {
      title_upload: "Upload Content",
      post_placeholder: "What do you want to share?",
      upload_image: "Upload an image:",
      upload_audio: "Upload audio file (optional):",
      temporary: "Make this a temporary post (disappears in 24h)",
      mic_recording: "Microphone recording (optional):",
      start_recording: "🎤 Start Recording",
      stop_recording: "🛑 Stop",
      upload: "Upload"
    }
  };

  const strings = t[lang];
  for (const key in strings) {
    const el = document.querySelector(`[data-i18n='${key}']`);
    if (el) {
      if (el.placeholder !== undefined) el.placeholder = strings[key];
      else el.textContent = strings[key];
    }
  }
}
