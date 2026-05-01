# Google Apps Script: Self-Healing Bulk Email Automator

A robust Google Apps Script designed to send automated outreach emails from a Google Sheet. This script was specifically engineered with a "self-healing" mechanism to bypass data formatting errors caused by aggressive Text-to-Columns splits.

## 🎣 Project Context
This script was built to manage a collegiate fishing outreach campaign (UW-Madison) to contact various tackle and gear companies. 

Because the raw data contained commas within company names (e.g., `10,000 Fish`) and within the email templates themselves, standard Google Sheets CSV parsing shattered the data across dozens of columns, burying the email addresses and breaking standard column-index scripts.

## ✨ Features
* **Regex Email Scanner:** Instead of relying on a specific column index (which can break if data shifts), the script converts the entire row into a string and uses Regular Expressions to hunt down and extract the destination email address.
* **Template Repair:** Automatically identifies shattered blocks of commas (`,,,,,,,,,`) and replaces them with clean paragraph breaks (`\n\n`) to reconstruct the email body.
* **Junk Trimming:** Detects the end of the email signature and chops off any trailing error codes or broken data fragments.
* **Daily Quota Management:** Automatically caps at 50 emails per run to ensure compliance with Google's daily sending limits and avoid spam flags.
* **Safe Status Tracking:** Writes "Sent" or "Error" in Column 50 (Column AX) to keep the tracking data safely away from the primary shattered text.

## 🚀 How to Use
1. Open your Google Sheet containing the target companies, emails, and templates.
2. Navigate to **Extensions > Apps Script**.
3. Delete any default code and paste the contents of `Code.gs`.
4. Save the project and click **Run**.
5. *Note: The first time you run this, Google will ask you to authorize the script to send emails on your behalf.*

## 🛠️ Configuration
If you need to adjust the script for a different campaign, modify the following variables at the top of the `sendOutreachEmailsSelfHealing()` function:
* `startRow`: The row where your data begins (default is `2` to skip headers).
* `maxEmailsPerRun`: Adjust the batch size (default is `50`).
* `statusColumnIndex`: The column number where the script will record "Sent" (default is `50` / Column AX).
* `subject`: Update the `MailApp.sendEmail` payload to change the email subject line.
