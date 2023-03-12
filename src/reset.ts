// Copyright (c) 2023 FRC 1678 Citrus Circuits

/**
 * Resets the order of the teams based on the first pickability ratings.
 * Also clears DNPs and fixes missing formulas.
 */
function resetOrder() {
    // Get the range of the entire teams list in Team Raw Data
    var range = teamRawDataSheet.getRange(2, 1, teamRawDataSheet.getLastRow(), 1);
    // Get the range to copy the teams into
    var rangeToCopyTo = mainEditorSheet.getRange(4, 1, range.getNumRows() - 3, 1);
    // Clear the outdated teams list
    rangeToCopyTo.clearContent();
    // Copy the new teams list
    range.copyTo(rangeToCopyTo, { contentsOnly: true });
    // Get the first pickability column, used to sort the teams
    var columnOfFirstPickability = 1;
    for (var i = 1; i <= mainEditorSheet.getLastColumn(); i++) {
        if (mainEditorSheet.getRange(2, i).getValue() == "first_pickability") {
            columnOfFirstPickability = i;
            break;
        }
    }
    var newRange = mainEditorSheet.getRange(
        4,
        1,
        mainEditorSheet.getLastRow() - 3,
        mainEditorSheet.getLastColumn()
    );
    // Sort the teams by first pickability
    newRange.sort({ column: columnOfFirstPickability, ascending: false });
    // Clear the DNP list
    if (dnpsSheet.getLastRow() != 1) dnpsSheet.deleteRows(2, dnpsSheet.getLastRow() - 1);
    // Fix any missing formula cells in the main editor
    fixFormulas();
    // Renumber the order numbers
    renumberOrder();
    // Delete the last row because an extra empty row is made for some reason I still can't figure out why
    mainEditorSheet.deleteRow(mainEditorSheet.getLastRow() + 1);
}

/**
 * Copies the formulas in the main editor down to any cells that are missing them.
 */
function fixFormulas() {
    var topLeftCorner = mainEditorSheet.getRange(4, 3, 1, 1);
    // Reset the formula in the cell in the top left corner
    topLeftCorner.setValue("=VLOOKUP($A4, 'Team Raw Data'!$A$1:$ZZ$99, C$1, FALSE)");
    var topRow = mainEditorSheet.getRange(4, 3, 1, mainEditorSheet.getLastColumn() - 2);
    // Copy the formulas to the right in the top row
    topLeftCorner.copyTo(topRow, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
    // Set the special formula for the second pickability column
    mainEditorSheet.getRange(4, 4, 1, 1).setValue("=IF(E4>F4,E4,F4)");
    var rangeToCopyTo = mainEditorSheet.getRange(
        4,
        3,
        mainEditorSheet.getLastRow() - 3,
        mainEditorSheet.getLastColumn() - 2
    );
    // Copy the formulas down to the rest of the sheet
    topRow.copyTo(rangeToCopyTo, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
    // Fix the conditional formatting rules that get messed up when copying formulas
    var rules = mainEditorSheet.getConditionalFormatRules();
    for (var i = 0; i < rules.length; i++) {
        if (rules[i].getRanges()[0].getA1Notation().startsWith("C")) {
            var newRule = rules[i].copy();
            newRule.setRanges([mainEditorSheet.getRange(4, 3, mainEditorSheet.getLastRow() - 3, 1)]);
            rules[i] = newRule;
            mainEditorSheet.setConditionalFormatRules(rules);
            break;
        }
    }
}
