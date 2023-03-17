/**\
 * Sends current rankings and dnp list to grosbeak to be updated
 */
function updateGrosbeak(mainSheet: GoogleAppsScript.Spreadsheet.Sheet, dnpSheet: GoogleAppsScript.Spreadsheet.Sheet) {
    // Get the picklist order and the dnp list
    const picklistOrder = mainSheet.getRange("A4:A").getValues().map(v => String(v[0]))
    const dnps = dnpSheet.getRange("A2:A").getValues().map(v => String(v[0]))
    // Get the sheet id used for authentication
    const sheetId = SpreadsheetApp.getActiveSpreadsheet().getId()
    // Construct request body
    const data = { ranking: picklistOrder, dnp: dnps }
    Logger.log(JSON.stringify(data))
    // Send the network request
    try {
        UrlFetchApp.fetch("https://grosbeak.citruscircuits.org/picklist/rest/sheet", {
            method: "put", 
            headers: { Authorization: sheetId, "Content-Type": "application/json" },
            payload: JSON.stringify(data)
        })
    } catch (error) {
        Logger.log("Failed sending network request:")
        Logger.log(error)
    }
}