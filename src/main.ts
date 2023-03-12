// Copyright (c) 2023 FRC 1678 Citrus Circuits

var ss = SpreadsheetApp.getActiveSpreadsheet();
var mainEditorSheet = ss.getSheetByName("Main Editor");
var dnpsSheet = ss.getSheetByName("DNPs");
var settingsSheet = ss.getSheetByName("Settings");
var imagesSheet = ss.getSheetByName("Image Raw Data");
var teamRawDataSheet = ss.getSheetByName("Team Raw Data");

/**
 * Called when the spreadsheet is edited.
 * Determines what functionality should run depending on what part was edited.
 */
function main(event: any) {
    var eventRange: GoogleAppsScript.Spreadsheet.Range = event.range;
    var sheet = eventRange.getSheet();
    var nextTeam: string | number = sheet.getRange(eventRange.getRow() + 1, 1).getValue();

    switch (sheet.getSheetName()) {
        // Something in the Main Editor was edited
        case "Main Editor":
            // Make sure only one cell was edited
            if (eventRange.getNumColumns() != 1 || eventRange.getNumRows() != 1) {
                break;
            }
            // A team has been entered into the top left corner, so show the sidebar
            if (eventRange.getA1Notation() == "A3") {
                var teamNumber: string | number = eventRange.getValue();
                showSidebar(teamNumber);
                return;
            }
            // Quick sidebar (cell in column A is edited)
            else if (eventRange.getColumn() == 1 && eventRange.getRow() > 3) {
                var teamNumber: string | number = eventRange.getValue();
                // Set the value in A3 to the team number
                sheet.getRange("A3").setValue(teamNumber);
                showSidebar(teamNumber);
                return;
            }
            // Quick renumber without resorting (cell B3 is edited)
            else if (eventRange.getA1Notation() == "B3") {
                renumberOrder();
            }
            // Autosort (cell in column B is edited)
            else if (eventRange.getColumn() == 2 && eventRange.getRow() > 3) {
                // Killswitch in settings sheet to disable script
                if (settingsSheet.getRange("C2").getValue() != true) {
                    return;
                }

                // If the order number is changed to 'd', 'dnp', or something similar, move the team to the DNP list
                if (/d(?:np)?/i.test(eventRange.getValue())) {
                    // Move the team to the DNP list
                    moveToDnp(eventRange, sheet);
                    // Renumber the draft order
                    renumberOrder();
                } else {
                    if (eventRange.getColumn() == 2) {
                        // Resort the teams
                        sheet.getRange("A4:B").sort(eventRange.getColumn());
                        // Renumber the draft order
                        renumberOrder();
                    }
                }
            } else {
                return;
            }
            break;

        // Something in the Settings was edited
        case "Settings":
            // The reset order button was clicked
            if (eventRange.getA1Notation() == "D2") {
                resetOrder();
            }
            settingsSheet.getRange("D2").setValue("FALSE");
            return;

        // Something in the DNPs was edited
        case "DNPs":
            // One of the teams is being removed from DNP
            if (eventRange.getColumn() == 2) {
                unDnp(eventRange);
            }
            return;

        // There is nothing to be done for the edited sheet
        default:
            return;
    }

    sheet.getRange("A3").setValue(nextTeam);
    // Shows sidebar of next team
    showSidebar(nextTeam);
}
