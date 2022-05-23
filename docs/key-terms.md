# Key terms

This is a list of terms that will be helpful to know about when working on Picklist Editor. This can somewhat be considered a tutorial to how Apps Script works.

## Google Sheets

Google Sheets is a web-based spreadsheet editor for spreadsheets hosted in Google Drive. It can be considered the Google Drive alternative to Microsoft Excel.

## Spreadsheet

In the context of Google Sheets, a spreadsheet contains one or more sheet of 2D data. Each spreadsheet appears as a single file in Google Drive.

## Sheet

In Google Sheets, a sheet is a 2D array of cells, each of which can contain a value. The different sheets within a spreadsheet are shown at the bottom of the screen, and usually each sheet has a distinct purpose. Note the difference between a 'sheet' and a 'spreadsheet'.

## Formula

In Google Sheets, a formula is a special type of data that can be put into a cell. A formula always starts with an equals sign, and can use Google Sheets' built-in functions to display values based on other parts of the spreadsheet. By default, a cell with a formula in it will display as whatever its formula evaluates to. The formulas will be reevaluated live, which makes it easy to quickly view the results of operations on datasets.

## Apps Script

Apps Script is the language used to automate tasks throughout Google Drive. The language is almost entirely based on JavaScript. Functions written in Apps Script can be set to run when a file is modified, on a certain time interval, or based on other conditions. Apps Script makes Google Sheets a somewhat viable platform for creating apps such as Picklist Editor. Apps Script files have the `.gs` extension.

## JavaScript

JavaScript is the language originally made for web development. In a website, it can work in combination with HTML and CSS to show and update content on the screen. The syntax in Apps Script is the same as the syntax in JavaScript. JavaScript files have the `.js` extension. A decent JavaScript tutorial can be found [here](https://www.w3schools.com/js/).

## TypeScript

TypeScript, created by Microsoft, is a superset of JavaScript that transpiles to plain JavaScript. TypeScript provides extra features such as static typing and editor intelligence. While JavaScript is good for making websites and short scripts, TypeScript is more suitable for larger scale projects, which is why Picklist Editor uses it. TypeScript files have the `.ts` extension. TypeScript documentation and tutorials can be found [here](https://www.typescriptlang.org/docs/).

## Node.js

Node.js is a program that allows for running JavaScript/TypeScript locally, not just in a website. It comes with npm, a powerful package manager that you can easily install programs such as Clasp with.

## Clasp

Clasp is the command line tool created by Google to manage Apps Script projects. Clasp allows developers to clone and edit projects locally rather than having to use the web editor, and it provides built-in functionality for transpiling TypeScript. Clasp is used in Picklist Editor to transpile and push locally edited scripts to Google Drive.

## HTML

HTML, or HyperText Markup Language, allows websites to define what objects are displayed on the screen. The syntax is essentially the same as XML. Picklist Editor uses HTML to define the sidebar content.

## Scriptlets

Apps Script provides special syntax inside of HTML called scriptlets. These can define Apps Script code to be executed when the HTML is being loaded. If any part of the HTML is surrounded by `<?!= .. ?>` or something similar, it is most likely a scriptlet. Scriptlets are probably the easiest way to pass information between the Apps Script and the HTML, and more information can be found [here](https://developers.google.com/apps-script/guides/html/templates).

## Conditional formatting

In the main editor sheet of the Picklist Editor, a type of formatting is used called conditional formatting. This allows cells to be formatted differently based on certain conditions. The most used type of conditional formatting in Picklist Editor is Color Scale, which colors cells slightly different shades based on how high or low their values are. This allows viewers to get an idea of what the data looks like without having to read every number. To access the conditional formatting rules, go to `Formatting > Conditional formatting`. The conditional formatting rules that are affecting the current cell will be shown in the sidebar to the right.
