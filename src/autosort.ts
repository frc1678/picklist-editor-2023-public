// Copyright (c) 2022 FRC 1678 Citrus Circuits

/**
 * Renumbers the team order placements in the main editor.
 */
function renumberOrder() {
    var range = mainEditorSheet.getRange(4, 2, mainEditorSheet.getLastRow() - 3, 1)
    var array = [];
    for (var i = 1; i <= range.getNumRows(); i++) {
        // Arrays must be two-dimensional because sheets are two-dimensional
        array.push([i]);
    }
    // Values in order column are set to 1 to number of rows in column
    range.setValues(array);
}
