// Created by Carl Csaposs
// April 7th, 2019

// Global variables
var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var settings = spreadsheet.getSheetByName('Settings');

// Taken from Google App Script HtmlService documentation
// https://developers.google.com/apps-script/guides/html/best-practices#separate_html_css_and_javascript
function include(file) {
  return HtmlService.createHtmlOutputFromFile(file).getContent();
}

function showSidebar(sheet, team) {
  var html = HtmlService.createTemplateFromFile('sidebar');
  html.teamNumber = team;
  var ui = html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle(team);
  SpreadsheetApp.getUi().showSidebar(ui);
}

function onEditAuth(event) {
  // Kill-switch for script
  if (settings.getRange('B2').getValue() != true) {
    return;
  }
  var editedRange = event.range;
  // Checks if only 1 cell was edited
  if (editedRange.getNumColumns() == 1 && editedRange.getNumRows() == 1) {
    var sheet = editedRange.getSheet();
    // Checks sheet name
    if (sheet.getSheetName() == 'Second Pick' || sheet.getSheetName() == 'First Pick') {
      // Checks cell location
      if (editedRange.getA1Notation() == 'A4') {
        showSidebar(sheet, editedRange.getValue());
      }
    }
  }
}

