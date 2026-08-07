/**
 * AquaTerra Systems 2.1 — API de demandes commerciales
 * 1) Remplacez SPREADSHEET_ID.
 * 2) Exécutez setup() une fois.
 * 3) Déployez comme application web : exécuter en tant que vous, accès "Toute personne".
 */
const SETTINGS = Object.freeze({
  SPREADSHEET_ID: 'COLLEZ_ICI_ID_GOOGLE_SHEET',
  SHEET_NAME: 'Demandes',
  ADMIN_EMAIL: 'aquaterrasystems10@gmail.com',
  TIMEZONE: 'America/Port-au-Prince'
});

const HEADERS = [
  'Date de réception','Numéro de dossier','Statut','Langue','Nom complet',
  'Organisation','Email','Téléphone','Pays','Secteur','Services demandés',
  'Nombre utilisateurs','Délai souhaité','Budget indicatif','Maintenance',
  'Estimation préliminaire','Description','Consentement','Source','User agent'
];

function doGet() {
  return json_({ ok: true, service: 'AquaTerra Systems 2.1 API', timestamp: new Date().toISOString() });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const p = (e && e.parameter) || {};
    if (p.website) return json_({ ok: true }); // honeypot
    validate_(p);

    const sheet = getSheet_();
    const requestId = clean_(p.requestId) || createRequestId_();
    const receivedAt = new Date();
    const row = [
      receivedAt, requestId, 'Nouvelle', clean_(p.language), clean_(p.contactName),
      clean_(p.organization), clean_(p.email), clean_(p.phone), clean_(p.country),
      clean_(p.sector), clean_(p.services), clean_(p.users), clean_(p.deadline),
      clean_(p.budget), clean_(p.maintenance), clean_(p.estimate), clean_(p.details),
      clean_(p.consent), 'Site web AquaTerra 2.1', clean_(p.userAgent)
    ];
    sheet.appendRow(row.map(safeCell_));
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    sendEmails_(p, requestId, receivedAt);

    return json_({ ok: true, requestId });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function setup() {
  const sheet = getSheet_();
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  const header = sheet.getRange(1, 1, 1, HEADERS.length);
  header.setFontWeight('bold').setBackground('#0b2436').setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
  sheet.getRange('C2:C').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Nouvelle','En analyse','Proposition envoyée','Acceptée','Clôturée'], true)
      .build()
  );
}

function getSheet_() {
  if (!SETTINGS.SPREADSHEET_ID || SETTINGS.SPREADSHEET_ID.includes('COLLEZ_ICI')) {
    throw new Error('Configurez SETTINGS.SPREADSHEET_ID dans Code.gs.');
  }
  const ss = SpreadsheetApp.openById(SETTINGS.SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SETTINGS.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SETTINGS.SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function validate_(p) {
  const required = ['contactName','organization','email','country','sector','services','details','consent'];
  required.forEach(k => { if (!clean_(p[k])) throw new Error('Champ obligatoire manquant : ' + k); });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean_(p.email))) throw new Error('Adresse email invalide.');
}

function sendEmails_(p, requestId, receivedAt) {
  const dateTxt = Utilities.formatDate(receivedAt, SETTINGS.TIMEZONE, 'yyyy-MM-dd HH:mm');
  const subjectClient = `AquaTerra Systems — demande reçue ${requestId}`;
  const clientBody = [
    `Bonjour ${clean_(p.contactName)},`, '',
    'Votre demande a été reçue et enregistrée.',
    `Numéro de dossier : ${requestId}`,
    `Date : ${dateTxt}`,
    `Services : ${clean_(p.services)}`,
    `Estimation indicative : ${clean_(p.estimate)}`,'',
    'Notre équipe analysera les informations transmises.', '',
    'AquaTerra Systems', SETTINGS.ADMIN_EMAIL
  ].join('\n');
  MailApp.sendEmail(clean_(p.email), subjectClient, clientBody);

  const adminSubject = `Nouvelle demande ${requestId} — ${clean_(p.organization)}`;
  const adminBody = [
    `Dossier : ${requestId}`,
    `Nom : ${clean_(p.contactName)}`,
    `Organisation : ${clean_(p.organization)}`,
    `Email : ${clean_(p.email)}`,
    `Téléphone : ${clean_(p.phone)}`,
    `Pays : ${clean_(p.country)}`,
    `Secteur : ${clean_(p.sector)}`,
    `Services : ${clean_(p.services)}`,
    `Utilisateurs : ${clean_(p.users)}`,
    `Délai : ${clean_(p.deadline)}`,
    `Budget : ${clean_(p.budget)}`,
    `Estimation : ${clean_(p.estimate)}`,'',
    `Description :\n${clean_(p.details)}`
  ].join('\n');
  MailApp.sendEmail(SETTINGS.ADMIN_EMAIL, adminSubject, adminBody);
}

function createRequestId_() {
  const date = Utilities.formatDate(new Date(), SETTINGS.TIMEZONE, 'yyyyMMdd');
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ATS-${date}-${random}`;
}

function clean_(value) { return String(value == null ? '' : value).trim().slice(0, 5000); }
function safeCell_(value) {
  if (value instanceof Date) return value;
  const text = clean_(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
