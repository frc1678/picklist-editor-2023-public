// Copyright (c) 2022 FRC 1678 Citrus Circuits

/**
 * Moves the selected team to the DNP sheet.
 */
function moveToDnp(
    eventRange: GoogleAppsScript.Spreadsheet.Range,
    sheet: GoogleAppsScript.Spreadsheet.Sheet
) {
    // sheet is the sheet the team is being moved from
    // eventRange is the cell in the team row that was edited
    var teamNumber: string | number = sheet
        .getRange(eventRange.getRow(), 1)
        .getValue();

    // Appends team number to "DNPs" sheet and deletes it from "Picklist" sheet
    dnpsSheet.appendRow([teamNumber]);
    sheet.deleteRow(eventRange.getRow());

    // Add a checkbox next to the team number
    dnpsSheet.getRange(dnpsSheet.getLastRow(), 2).insertCheckboxes();
}

/**
 * Removes a team from the DNP list and puts it back into the main editor at the bottom.
 */
function unDnp(eventRange: GoogleAppsScript.Spreadsheet.Range) {
    var teamNumber = dnpsSheet.getRange(eventRange.getRow(), 1).getValue();
    // Add the team back to the main editor.
    mainEditorSheet.appendRow([teamNumber]);
    // Delete the team from the DNP list.
    dnpsSheet.deleteRow(eventRange.getRow());
    // Renumber the order of the teams in the main editor.
    renumberOrder();
    // Fix any missing formula cells in the main editor.
    fixFormulas();
}
