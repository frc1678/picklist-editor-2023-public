/*
 * Created by Edwin Chang, Kathy Li, Sophia Palomares, and Carl Csaposs.
 * February 15th, 2020
 */

var ss = SpreadsheetApp.getActiveSpreadsheet();
var settings = ss.getSheetByName("Settings");
var images = ss.getSheetByName("Image Raw Data");
var teamRawData = ss.getSheetByName("Team Raw Data");

// ### Start sidebar functions ###

/**
 * Taken from Google App Script HtmlService documentation
 *
 * https://developers.google.com/apps-script/guides/html/best-practices#separate_html_css_and_javascript
 *
 * Called in sidebar.html, includes content from style.html
 */
function include(file) {
  return HtmlService.createHtmlOutputFromFile(file).getContent();
}

function getTeamImages(team) {
  // 'teamsRange' is the range containing team numbers (A1:A)
  var teamsRange = images.getRange(1, 1, images.getLastRow());
  var teamIndex = findTeam(team, teamsRange, 1);

  return images
    .getRange(teamIndex, 2, 1, images.getLastColumn())
    .getValues()[0];
}

function findTeam(team, range, firstRow) {
  // firstRow is the Google Sheets row # for the first item in the range, which will be the 0th index in "teams"
  var teams = range.getValues();

  for (var i = 0; i < teams.length; i++) {
    if (teams[i][0] == team) {
      // Adds 1 since Javascript arrays start at 0, while rows start at 1
      // Adds another (firstRow-1) since teams starts at B(firstRow), not B1
      return i + firstRow;
    }
  }
  return null;
}

function getTeamName(team) {
  var teamsRange = teamRawData.getRange(2, 1, teamRawData.getLastRow());
  var teamIndex = findTeam(team, teamsRange, 2);
  var teamNameColumn = 1;
  for (var i = 1; i <= teamRawData.getLastColumn(); i++) {
    if (teamRawData.getRange(1, i).getValue().toString() == "team_name") {
      teamNameColumn = i;
    }
  }
  return teamRawData.getRange(teamIndex, teamNameColumn).getValue();
}

function showSidebar(team_number) {
  var html = HtmlService.createTemplateFromFile("sidebar");
  html.team_number = team_number;
  html.team_name = getTeamName(team_number);
  html.images = JSON.stringify(getTeamImages(team_number));
  var ui = html
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle(team_number);
  SpreadsheetApp.getUi().showSidebar(ui);
}

// ### End sidebar functions ###

// ### Start autosort functions ###

/** Renumbers the draft order in the given range. */
function numberDraftOrder(range) {
  var array = [];
  for (var i = 1; i <= range.getNumRows(); i++) {
    // Arrays must be two-dimensional because sheets are two-dimensional
    array.push([i]);
  }
  // Values in draft order column are set to 1 to number of rows in column
  range.setValues(array);
}

/** Moves the selected team to DNP sheet. */
function moveToDnp(event_range, sheet) {
  // sheet is the sheet the team is being moved from
  // event_range is the cell in the team row that was edited
  var dnp = ss.getSheetByName("DNPs");
  var team_number = sheet.getRange(event_range.getRow(), 1).getValue();

  // Appends team number to "DNPs" sheet and deletes it from "Picklist" sheet
  dnp.appendRow([team_number]);
  sheet.deleteRow(event_range.getRow());

  // Add a checkbox next to the team number
  dnp.getRange(dnp.getLastRow(), 2).insertCheckboxes();
}

// ### End autosort functions ###

/**
 * Resets the order of the teams based on the pickability ratings.
 * The top 8 teams by first pickability are sorted by first pickability at the top.
 * The remaining teams are sorted by second pickability below the top 8 teams.
 * This works by sorting the raw data in place, then copying the teams into the main editor sheet.
 */
function resetOrder() {
  // Get the range of the entire teams list in Team Raw Data
  var range = teamRawData.getRange(
    2,
    1,
    teamRawData.getLastRow(),
    teamRawData.getLastColumn()
  );
  // Sort the range by first pickability
  var columnOfFirstPickability = 1;
  for (var i = 1; i <= teamRawData.getLastColumn(); i++) {
    if (
      teamRawData.getRange(1, i).getValue().toString() == "first_pickability"
    ) {
      columnOfFirstPickability = i;
      break;
    }
  }
  range.sort({ column: columnOfFirstPickability, ascending: false });
  // Get the new range of all of the teams except for the top 8
  var newRange = teamRawData.getRange(
    10,
    1,
    teamRawData.getLastRow(),
    teamRawData.getLastColumn()
  );
  // Sort the new range by second pickability
  var columnOfSecondPickability = 1;
  for (var i = 1; i <= teamRawData.getLastColumn(); i++) {
    if (
      teamRawData.getRange(1, i).getValue().toString() == "second_pickability"
    ) {
      columnOfSecondPickability = i;
      break;
    }
  }
  newRange.sort({ column: columnOfSecondPickability, ascending: false });
  var rangeToCopyTo = ss
    .getSheetByName("Main Editor")
    .getRange(4, 1, range.getNumRows(), 1);
  rangeToCopyTo.clearContent();
  // Copy the entire list of teams to the main editor
  teamRawData
    .getRange(2, 1, teamRawData.getLastRow(), 1)
    .copyTo(rangeToCopyTo, { contentsOnly: true });
  // Reset the order numbers, just in case
  numberDraftOrder(
    ss.getSheetByName("Main Editor").getRange(4, 2, range.getNumRows() - 1, 1)
  );
  // Clear the DNP list
  ss.getSheetByName("DNPs")
    .getRange(2, 1, ss.getSheetByName("DNPs").getLastRow(), 1)
    .clearContent();
  // Fix any missing formula cells in the main editor
  copyFormulasDown();
  // Delete the last row because an extra empty row is made for some reason I still can't figure out why
  ss.getSheetByName("Main Editor").deleteRow(
    ss.getSheetByName("Main Editor").getLastRow() + 1
  );
}

/**
 * Copies the formulas in the main editor down to any cells that are missing them.
 */
function copyFormulasDown() {
  var mainEditor = ss.getSheetByName("Main Editor");
  var initialRange = mainEditor.getRange(
    4,
    3,
    1,
    mainEditor.getLastColumn() - 2
  );
  var rangeToCopyTo = mainEditor.getRange(
    4,
    3,
    mainEditor.getLastRow() - 3,
    mainEditor.getLastColumn() - 2
  );
  initialRange.copyTo(rangeToCopyTo);
}

/**
 * Removes a team from the DNP list and puts them back into the main editor at the bottom.
 */
function unDnp(event_range) {
  var dnp = ss.getSheetByName("DNPs");
  var team_number = dnp.getRange(event_range.getRow(), 1).getValue();
  var mainEditor = ss.getSheetByName("Main Editor");
  // Add the team back to the main editor.
  mainEditor.appendRow([team_number]);
  // Delete the team from the DNP list.
  dnp.deleteRow(event_range.getRow());
  // Renumber the order of the teams in the main editor.
  numberDraftOrder(mainEditor.getRange(4, 2, mainEditor.getLastRow() - 3, 1));
  // Fix any missing formula cells in the main editor.
  copyFormulasDown();
}

function onEditAuth(event) {
  // Called on spreadsheet edit
  // Must set up trigger: Edit > Current project's triggers, select "On edit" event to run the "onEditAuth" function
  var event_range = event.range;
  var sheet = event_range.getSheet();
  var next_team = sheet.getRange(event_range.getRow() + 1, 1).getValue();

  // Checks sheet name
  if (
    sheet.getSheetName() != "Main Editor" &&
    sheet.getSheetName() != "Settings" &&
    sheet.getSheetName() != "DNPs"
  ) {
    return;
  }

  // Checks if the reset order button was clicked
  if (sheet.getSheetName() == "Settings") {
    if (event_range.getRow() == 2 && event_range.getColumn() == 4) {
      resetOrder();
    }
    // Reset the button's value to unchecked
    sheet.getRange("D2").setValue("FALSE");
    return;
  }

  // Checks if a team should be removed from DNP
  if (sheet.getSheetName() == "DNPs") {
    if (event_range.getColumn() == 2) {
      unDnp(event_range);
    }
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
    }
    showSidebar(team_number);
  }

  // Quick sidebar (cell in column A is edited)
  else if (event_range.getColumn() == 1 && event_range.getRow() > 3) {
    var team_number = event_range.getValue();
    // Set the value in A3 to the team number
    sheet.getRange("A3").setValue(team_number);
    showSidebar(team_number);
  }

  // Autosort (cell in column B is edited)
  else if (event_range.getColumn() == 2 && event_range.getRow() > 3) {
    // Killswitch in settings sheet to disable script
    if (settings.getRange("C2").getValue() != true) {
      return;
    }

    // DNP (do not pick) team
    // To mark a team as DNP (do not pick), replace draft order number with "D" or "d"
    if (event_range.getValue() == "d" || event_range.getValue() == "D") {
      // Move the team to the DNP list
      moveToDnp(event_range, sheet);
      // Renumber the draft order
      numberDraftOrder(
        sheet.getRange(4, event_range.getColumn(), sheet.getLastRow() - 3, 1)
      );
    } else {
      if (event_range.getColumn() == 2) {
        // Resort the teams
        sheet.getRange("A4:B").sort(event_range.getColumn());
        // Renumber the draft order
        numberDraftOrder(
          sheet.getRange(4, event_range.getColumn(), sheet.getLastRow() - 3, 1)
        );
      }
    }

    sheet.getRange("A3").setValue(next_team);
    // Shows sidebar of next team
    showSidebar(next_team);
  }
}
