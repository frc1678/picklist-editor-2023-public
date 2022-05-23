# Setting up the development environment

This is a guide on how to setup the recommended local development environment for working on the Picklist Editor scripts. If the steps below are unclear or incorrect, please feel free to fix them.

## Steps

1. Clone this repository into a local directory with Git (you may want to clone a fork instead if you are planning to push changes):
   
   ```bash
   git clone https://github.com/frc1678/picklist-editor.git
   ```

2. Install [Node.js and npm](https://nodejs.org/en/download/) if you have not already. If running `npm -v` prints out a version number, then you have successfully installed these.

3. Find a suitable text editor or IDE that you can use to edit the code. The recommended is [Visual Studio Code](https://code.visualstudio.com/Download).

4. Install the necessary project libraries by running the following command inside your cloned project folder:
   
   ```bash
   npm install
   ```
   
   You can check if the project libraries have been installed by running `npm list`.

5. Install Clasp, the command line interface for publishing local scripts (this may require root/administrator privileges):
   
   ```bash
   npm install -g @google/clasp
   ```
   
   You can check if Clasp is installed by running `clasp -v`.

6. Login to Clasp with your Google account by running `clasp login` and following the given prompts.

7. Go to the [Apps Script settings](https://script.google.com/home/usersettings) for your Google account and make sure that API access is turned on.

8. Open the copy of the Picklist Editor spreadsheet you would like to work on, then navigate to the Apps Script dashboard by clicking on `Extensions > Apps Script`.

9. In the Apps Script dashboard for your spreadsheet, go to the Project Settings and find the project ID.

10. Run `setup-clasp-json.py` with Python. This is a helper Python script that will help you set up the Clasp project configuration. When you are prompted for the project ID, paste in the project ID from step 9.

11. Test to make sure that your local setup works by running `clasp push` inside of the cloned project folder.

12. In the Apps Script dashboard, go to the Triggers page and make sure there is a trigger to run the `onEdit` function when the spreadsheet is edited. If it is missing, add it and make sure that you select `On edit` and not `On change`.

13. The Picklist Editor should now be fully operational; you can test it by changing the numbers in the `Order` column in the Main Editor.

## Modifying the scripts

To make changes to the scripts, write the code using your chosen local editor. Then run `clasp push` in the project directory to push the changes to Google Drive. Do not run `clasp pull` as this may lead to unexpected results such as your local changes being deleted. Do not make your changes in the web-based editor as the changes will just be overwritten by the local copy of the scripts on the next push. When your changes are ready to be used, commit them to this GitHub repository. It is recommended to run a code formatter on your changes before committing; the built-in formatter in Visual Studio Code will do.
