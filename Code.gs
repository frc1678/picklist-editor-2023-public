function numberDraftOrder(range) {
  var array = [];
  for (var i = 1; i <= range.getNumRows(); i++) {
    array.push([i]);
  }
  range.setValues(array);
}

function moveRow(sheet, eventRange, eventRow, eventRangeValue) {
  var cellBeforeEdit = sheet.getCurrentCell();
  var cellValue = cellBeforeEdit.getValue();
  
  if (cellValue > eventRangeValue){
      var newRow = eventRangeValue + 4;
  } else {
      var newRow = eventRangeValue + 5;
  }
  
  var eventRowRange = ("B" + eventRow);
  var rowSpec = sheet.getRange(eventRowRange);
  
  sheet.moveRows(rowSpec, newRow);
} 

function moveToDnp(eventRange, sheet) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dnp = ss.getSheetByName("DNPs");
  var teamNumber = sheet.getRange(eventRange.getRow(), 1).getValue();
  
  dnp.appendRow([teamNumber]);
  sheet.deleteRow(eventRange.getRow());
}

function onEditAuth (event) {
  var sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getSheetName() == "First Pick" || sheet.getSheetName() == "Second Pick") {
    var eventRange = event.range;
    var eventRow = eventRange.getRow();
    var eventRangeValue = eventRange.getValue();
    
    //var nextRow = sheet.getRange(sheet.getLastRow()+1, sheet.unhideRow(row));
    var draftOrderRange = sheet.getRange(5, 2, sheet.getLastRow()-5, 1);
    var columnToSortBy = 2;
    
    if (eventRange.getColumn() == columnToSortBy) {
    
      if (eventRange.getValue() == 'd' || eventRange.getValue() == 'D') {
        moveToDnp(eventRange, sheet);
        numberDraftOrder(draftOrderRange);
        sheet.unhideRow(sheet.getLastRow()+1);

      } else {
        var range = draftOrderRange;
        range.sort(2);
        moveRow(sheet,eventRange,eventRow,eventRangeValue);
        numberDraftOrder(draftOrderRange);
        sheet.unhideRow(sheet.getLastRow()+1);
        
      }
    }
  } else {
    return;
  }
}
