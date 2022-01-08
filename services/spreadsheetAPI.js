/* * * * * */
/* SPREADSHEET API */
/* * */

/* * */
/* IMPORTS */
const config = require('config');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const connectToDocument = async () => {
  console.log('Waiting for Google Sheets...');
  await new Promise((resolve) => setTimeout(resolve, config.get('google-spreadsheets.safety-delay')));
  // -------------------
  // Retrieve the Document ID from settings
  const doc = new GoogleSpreadsheet(config.get('google-spreadsheets.document-id'));
  await doc.useServiceAccountAuth({
    client_email: config.get('google-spreadsheets.google-service-account-email'),
    private_key: config.get('google-spreadsheets.google-service-account-private-key').replace(/\\n/g, '\n'), // Fix for newline in Balena Dashboard Environment Variables
  });
  await doc.loadInfo();
  return doc;
};

exports.addNewRow = async (sheetTitle, row) => {
  const doc = await connectToDocument();
  const sheet = doc.sheetsByTitle[sheetTitle];
  await sheet.addRow(row);
};

exports.getRows = async (sheetTitle) => {
  const doc = await connectToDocument();
  const sheet = doc.sheetsByTitle[sheetTitle];
  const rows = await sheet.getRows();
  return rows;
};
