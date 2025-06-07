<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title data-i18n="profile_page_title">Min Profil – GhostGrid</title>
  <link rel="stylesheet" href="style.css" />
  <script src="language.js"></script>
  <style>
    body {
      background-color: black;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 0;
      padding-top: 100px;
      min-height: 100vh;
    }

    .hidden { display: none !important; }

    nav.navbar {
      background-color: #000;
      border-bottom: 2px solid #00ffcc;
      padding: 12px 40px;
      position: fixed;
      width: 100%;
      top: 0;
      z-index: 1000;
      box-shadow: 0 0 20px #bb00ff;
      display: flex;
      justify-content: center;
    }

    .nav-content {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 25px;
      justify-content: center;
    }

    .nav-content a {
      color: white;
      text-decoration: none;
      font-size: 1.5em;
      padding: 6px 10px;
      border-radius: 4px;
      text-shadow: 0 0 8px #00ffcc, 0 0 6px #bb00ff;
      transition: 0.3s;
    }

    .nav-content a:hover {
      background-color: #00ffcc;
      color: #000;
      box-shadow: 0 0 10px #ffffff;
    }

    .search-container input {
      padding: 8px 14px;
      font-size: 1.4em;
      background-color: #111;
      border: 2px solid #00ffcc;
      border-radius: 10px;
      color: #ffffff;
    }

    .login-container {
      background: rgba(0, 0, 0, 0.7);
      padding: 40px;
      border: 2px solid #00ff00;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 0 15px #007700;
      max-width: 600px;
    }

    textarea, input[type="text"], input[type="file"] {
      width: 100%;
      padding: 10px;
      background-color: black;
      color: #00ff00;
      border: 1px solid #00ff00;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
    }

    button {
      margin-top: 20px;
      padding: 12px 25px;
      font-size: 1em;
      color: black;
      background-color: #00ff00;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    button:hover { background-color: #00cc00; }

    .info-box {
      margin-top: 20px;
      padding: 15px;
      background-color: #111;
      border: 1px solid #00ff00;
      color: #00ff00;
      border-radius: 8px;
      font-size: 0.9em;
      text-align: left;
      display: none;
    }

    #fullscreenPreview {
      position: fixed;
      inset: 0;
      background-color: black;
      z-index: 9999;
      color: white;
      overflow: auto;
      padding: 20px;
    }

    #exitPreviewBtn {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background-color: #00ff00;
      color: black;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    #exitPreviewBtn:hover {
      background-color: #00cc00;
    }

    #profile-img-preview {
      max-width: 150px;
      border-radius: 50%;
      margin-top: 10px;
      display: none;
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="nav-content">
      <a href="forum.html" data-i18n="nav_forum">Forum</a>
      <a href="store.html" data-i18n="nav_store">Store</a>
      <a href="wall.html" data-i18n="nav_wall">Väggen</a>
      <a href="upload.html" data-i18n="nav_upload">Ladda upp</a>
      <a href="profile.html" data-i18n="nav_profile">Profil</a>
      <a href="friends.html" data-i18n="nav_friends">Vänner</a>
      <div class="search-container">
        <input type="text" placeholder="Sök..." id="searchInput" />
      </div>
    </div>
  </nav>

  <div class="login-container" id="editSection">
    <h1 data-i18n="profile_heading">Min Profil</h1>
    <p id="profile-email">E-post:</p>
    <p id="profile-username">Användarnamn:</p>

    <label for="profile-pic" data-i18n="upload_picture">Ladda upp profilbild:</label>
    <input type="file" id="profile-pic" accept="image/*" />
    <img id="profile-img-preview" src="" alt="Profilbild" />

    <label for="custom-code" data-i18n="profile_code">Profilkod (HTML/CSS):</label>
    <textarea id="custom-code" rows="6" placeholder="<style>body { background: black; }</style>"></textarea>
    <button id="saveBtn" data-i18n="save">Spara kod</button>
    <button id="useTemplateBtn" data-i18n="use_template">Använd färdig kod</button>
    <button id="viewProfileBtn" data-i18n="view_profile">Visa profil</button>
    <button id="editProfileBtn" class="hidden" data-i18n="edit_profile">Redigera profil</button>
    <div id="saveNotice" style="display:none; margin-top:10px; color:#00ff00;" data-i18n="profile_saved">✅ Profil uppdaterad!</div>

    <button onclick="document.querySelector('.info-box').style.display='block'" data-i18n="how_to_code">Hur kodar jag min profil?</button>

    <div class="info-box">
      <h3 data-i18n="guide_title">Enkel guide:</h3>
      <ul>
        <li><strong>1.</strong> <span data-i18n="guide_step1">Använd "Använd färdig kod" för att börja snabbt</span></li>
        <li><strong>2.</strong> <span data-i18n="guide_step2">Ändra text direkt i rutan eller redigera koden om du kan HTML/CSS</span></li>
        <li><strong>3.</strong> <span data-i18n="guide_step3">Klicka "Spara kod" för att uppdatera din profil</span></li>
        <li><strong>Tips:</strong> <span data-i18n="guide_tip">Du kan lägga in profilbild, beskrivning och intressen</span></li>
      </ul>
    </div>

    <p style="margin-top: 20px;"><a href="#" id="logoutLink" data-i18n="logout">Logga ut</a></p>
  </div>

  <div id="fullscreenPreview" class="hidden">
    <button id="exitPreviewBtn" data-i18n="edit_profile">Redigera profil</button>
    <div id="profileContent"></div>
  </div>

  <script type="module" src="profile-script.js"></script>
</body>
</html>
