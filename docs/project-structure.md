# Project structure

Picklist Editor is written mainly in [TypeScript](./key-terms.md#TypeScript). The code behind Picklist Editor is split into multiple files loosely by category. Below is a list of the files and their purposes.

## [`main.ts`](../src/main.ts)

This file contains the main function that is called whenever the spreadsheet is edited. It also contains some convenience variables for the different sheets in the spreadsheet.

## [`autosort.ts`](../src/autosort.ts)

This file contains any functions used for sorting the teams in the main editor and renumbering the order numbers.

## [`dnps.ts`](../src/dnps.ts)

This file contains any functions related to the DNPs list. This includes sending teams from the main editor into the DNPs list and vice versa.

## [`sidebar.ts`](../src/sidebar.ts)

This file contains functions needed to show the sidebar for a team, get images for a team, and populate the content of the sidebar.

## [`sidebar_content.html`](../src/sidebar_content.html)

This file defines the content that will appear in the sidebar. There are [scriptlets](./key-terms.md#Scriptlets) used in this file, so don't worry if your editor is showing errors in the file because Apps Script syntax is not widely supported by editors. There is no known way to stop editors like Visual Studio Code from complaining about this without stopping all syntax checking.

## [`style.html`](../src/style.html)

This file defines the way that elements in the sidebar are styled. The reason that this is in HTML and not in CSS or a variant of it is because CSS files are not supported by Apps Script. However, it is still CSS, just wrapped in a `<style>` tag.

## [`reset.ts`](../src/reset.ts)

This file contains functions used to quickly reset the spreadsheet to its initial state based on the imported data.
