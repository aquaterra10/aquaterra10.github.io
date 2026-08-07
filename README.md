# AquaTerra Systems 2.1

Version professionnelle avec formulaire natif connecté à Google Sheets.

## Configuration obligatoire

### 1. Google Sheets

1. Créez un classeur Google Sheets.
2. Copiez son identifiant dans l’URL entre `/d/` et `/edit`.
3. Ouvrez `backend/Code.gs` et remplacez `COLLEZ_ICI_ID_GOOGLE_SHEET`.

### 2. Google Apps Script

1. Ouvrez `script.google.com` et créez un projet autonome.
2. Remplacez `Code.gs` et `appsscript.json` par les fichiers du dossier `backend`.
3. Exécutez `setup()` une fois et accordez les autorisations.
4. Cliquez sur **Déployer > Nouveau déploiement > Application web**.
5. Exécuter en tant que : **Moi**.
6. Accès : **Toute personne**.
7. Copiez l’URL se terminant par `/exec`.

### 3. Site web

Ouvrez `assets/js/config.js` et remplacez :

```js
apiUrl: 'COLLEZ_ICI_URL_WEB_APP_APPS_SCRIPT'
```

par l’URL `/exec` du déploiement Apps Script.

Téléversez ensuite les fichiers du site sur GitHub Pages.

## Résultat

- demandes enregistrées dans l’onglet `Demandes` ;
- numéro de dossier `ATS-YYYYMMDD-XXXXXX` ;
- email automatique au client ;
- notification à AquaTerra Systems ;
- estimation multi-services ;
- validation, consentement et protection antispam.
