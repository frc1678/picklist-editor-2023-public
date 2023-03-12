// Copyright (c) 2023 FRC 1678 Citrus Circuits

/**
 * Taken from Google App Script HtmlService documentation
 *
 * https://developers.google.com/apps-script/guides/html/best-practices#separate_html_css_and_javascript
 *
 * Called in sidebar_content.html, includes content from style.html
 */
function include(file: string) {
    return HtmlService.createHtmlOutputFromFile(file).getContent();
}

function getTeamImages(team: string | number): string[] | null {
    // 'teamsRange' is the range containing team numbers (A1:A)
    var teamsRange = imagesSheet.getRange(1, 1, imagesSheet.getLastRow());
    var teamIndex = findTeam(team, teamsRange, 1);
    if (teamIndex === null) {
        return null;
    }
    return imagesSheet.getRange(teamIndex, 2, 1, imagesSheet.getLastColumn()).getValues()[0];
}

function findTeam(
    team: string | number,
    range: GoogleAppsScript.Spreadsheet.Range,
    firstRow: number
): number | null {
    // firstRow is the Google Sheets row # for the first item in the range, which will be the 0th index in "teams"
    var teams = range.getValues();

    for (var i = 0; i < teams.length; i++) {
        if (teams[i][0] == team) {
            // Adds 1 since JavaScript arrays start at 0, while rows start at 1
            // Adds another (firstRow-1) since teams starts at B(firstRow), not B1
            return i + firstRow;
        }
    }
    return null;
}

function getTeamName(team: string | number): string {
    var teamsRange = teamRawDataSheet.getRange(2, 1, teamRawDataSheet.getLastRow());
    var teamIndex = findTeam(team, teamsRange, 2);
    if (teamIndex == null) {
        return "";
    }
    var teamNameColumn = 1;
    for (var i = 1; i <= teamRawDataSheet.getLastColumn(); i++) {
        if (teamRawDataSheet.getRange(1, i).getValue().toString() == "team_name") {
            teamNameColumn = i;
        }
    }
    return teamRawDataSheet.getRange(teamIndex, teamNameColumn).getValue().toString();
}

function showSidebar(teamNumber: string | number) {
    // Check if sidebar is disabled in settings
    if (settingsSheet.getRange("B2").getValue() != true) {
        return;
    }
    var teamImages = getTeamImages(teamNumber);
    if (teamImages === null) {
        return;
    }
    var html = HtmlService.createTemplateFromFile("sidebar_content");
    html.team_number = teamNumber;
    html.team_name = getTeamName(teamNumber);
    html.images = JSON.stringify(teamImages);
    var ui = html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle(teamNumber.toString());
    SpreadsheetApp.getUi().showSidebar(ui);
}
