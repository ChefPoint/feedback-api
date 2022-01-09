'use strict';

/* * * * * */
/* SPREADSHEET API */
/* * */

/* * */
/* IMPORTS */
const config = require('config');
const { GoogleSpreadsheet } = require('google-spreadsheet');

/* * */
/* THE DOCUMENT */
/* A global object that holds the Google Spreadsheet. */
let document = null;

/* * */
/* CONNECT TO DOCUMENT */
/* This function authenticates the Google Service Account against */
/* the provided document ID, if the connection is not already made.  */
const connectToDocument = async () => {
  //
  /* * Check if document is set
   * If document is falsy, then authenticate against Google.
   * If there is already a connection there is no point in re-authenticating.
   */
  if (document) return;

  /* * Create new document
   * If no connection is made, retrieve the document ID from settings
   * and create a new instance of Google Spreadsheet.
   */
  document = new GoogleSpreadsheet(config.get('google-spreadsheets.document-id'));

  /* * Authenticate
   * Perform the authentication with the Google Service Account credentials
   * found in settings.
   */
  await document.useServiceAccountAuth({
    client_email: config.get('google-spreadsheets.google-service-account-email'),
    private_key: config.get('google-spreadsheets.google-service-account-private-key').replace(/\\n/g, '\n'), // Fix for newline in Balena Dashboard Environment Variables
  });

  /* * Load Document
   * Finally load the document properties from the API.
   */
  await document.loadInfo();
};

/* * */
/* ADD NEW ROW */
/* Try connecting to the document, then retrieve */
/* the relevant sheet by it's title and append */
/* the provided row to the end. */
exports.addNewRow = async (sheetTitle, row) => {
  await connectToDocument();
  const sheet = document.sheetsByTitle[sheetTitle];
  await sheet.addRow(row);
};

/* * */
/* GET ROWS */
/* Try connecting to the document and then retrieve */
/* the relevant sheet by it's title. Call the getRows() function */
/* from the API and pass on the desired offset. If the startFromEnd flag */
/* is set to true, then get the total amount of rows in the sheet and subtract */
/* the desired offset. The API will retrieve the rows starting from the */
/* calculation result until the end. Return the rows to the parent caller. */
exports.getRows = async (sheetTitle, offset = 0, startFromEnd = false) => {
  await connectToDocument();
  const sheet = document.sheetsByTitle[sheetTitle];
  const rows = await sheet.getRows({ offset: startFromEnd ? sheet.rowCount - offset : offset });
  return rows;
};
