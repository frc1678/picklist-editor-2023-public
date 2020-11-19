// Created by Kathy Li, Sophia Palomares, and Carl Csaposs.
// February 15th, 2020

var ss = SpreadsheetApp.getActiveSpreadsheet();
var settings = ss.getSheetByName("Settings");
var images = ss.getSheetByName("Image Raw Data");

// Sidebar functions

// Taken from Google App Script HtmlService documentation
// https://developers.google.com/apps-script/guides/html/best-practices#separate_html_css_and_javascript
// Called in sidebar.html, includes content from style.html
function include(file) {
  return HtmlService.createHtmlOutputFromFile(file).getContent();
}

function getTeamImages(team) {
  // 'teamsRange' is the range containing team numbers (A2:A)
  var teamsRange = images.getRange(2, 1, images.getLastRow()-1);
  var teamIndex = findTeam(team, teamsRange, 2);
  
  return images.getRange(teamIndex, 3, 1, images.getLastColumn()).getValues()[0];
}

function findTeam(team, range, firstRow) {
  // firstRow is the Google Sheets row # for the first item in the range, which will be the 0th index in "teams"
  var teams = range.getValues();

  for (var i = 0; i < teams.length; i++) {
    if (teams[i][0] == team) {
      // Adds 1 since Javascript arrays start at 0, while rows start at 1
      // Adds another (firstRow-1) since teams starts at B(firstRow), not B1
      return i+firstRow;
    }
  }
  return null;
}

function getTeamName(team) {
  // 'teamsRange' is the range containing team numbers (A2:A)
  var teamsRange = images.getRange(2, 1, images.getLastRow()-1);
  var teamIndex = findTeam(team, teamsRange, 2);
  return images.getRange(teamIndex, 2).getValue();
}

function showSidebar(team_number) {
  var html = HtmlService.createTemplateFromFile('sidebar');
  html.team_number = team_number;
  html.team_name = getTeamName(team_number);
  html.images = JSON.stringify(getTeamImages(team_number));
  var ui = html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle(team_number);
  SpreadsheetApp.getUi().showSidebar(ui);
}

// End sidebar functions


// Autosort functions

// Renumbers draft order
function numberDraftOrder(range) {
  var array = [];
  for (var i = 1; i <= range.getNumRows(); i++) {
    // Arrays must be two-dimensional because sheets are two-dimensional
    array.push([i]);
  }
  // Values in draft order column are set to 1 to number of rows in column
  range.setValues(array);
}

// Moves selected team to DNP sheet
function moveToDnp(event_range, sheet) {
  // sheet is the sheet the team is being moved from
  // event_range is the cell in the team row that was edited
  var dnp = ss.getSheetByName("DNPs");
  var team_number = sheet.getRange(event_range.getRow(), 1).getValue();
  
  // Appends team number to "DNPs" sheet and deletes it from "Picklist" sheet
  dnp.appendRow([team_number]);
  sheet.deleteRow(event_range.getRow());
}

// End autosort functions

function onEditAuth (event) {
  // Called on spreadsheet edit
  // Must set up trigger: Edit > Current project's triggers, select "On edit" event to run the "onEditAuth" function
  var event_range = event.range;
  var sheet = event_range.getSheet();
  var next_team = sheet.getRange(event_range.getRow()+1, 1).getValue();

  // Checks sheet name
  if (!(sheet.getSheetName() == "Picklist")) {
    return;
  }
  
  // Checks that only one cell was edited
  if (event_range.getNumColumns() != 1 || event_range.getNumRows() != 1) {
    return;
  }
  
  // Sidebar (cell A3 is edited)
  if (event_range.getA1Notation() == "A3") {
    var team_number = event_range.getValue();
    // Killswitch in settings sheet to disable script
    if (settings.getRange("B2").getValue() != true) {
      return;
    } else { 
      showSidebar(team_number);
    }
  }
  
  // Autosort (cell in B4:B is edited)
  if (event_range.getColumn() == 2 && event_range.getRow() > 3) {
    // Killswitch in settings sheet to disable script
    if (settings.getRange("C2").getValue() != true) {
      return;
    }
    
    // DNP (do not pick) team
    // To mark a team as DNP (do not pick), replace draft order number with "D" or "d"
    else if (event_range.getValue() == "d" || event_range.getValue() == "D") {
      if (sheet.getSheetName() == "Picklist") {
        moveToDnp(event_range, sheet);
      } else {
        return;
      }
    }
    
    // Sort teams
    else {
      sheet.getRange("A4:B").sort(2); // 2 = sort by column B
    }
    // Renumbers draft order
    numberDraftOrder(sheet.getRange(4, 2, sheet.getLastRow()-3, 1));
    sheet.getRange("A3").setValue(next_team);
    // Shows sidebar of next team
    // Killswitch in settings sheet to disable script
    if (settings.getRange("B2").getValue() != true) {
      return;
    }
    showSidebar(next_team);
  }
}
