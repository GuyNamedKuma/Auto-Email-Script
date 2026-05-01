function sendOutreachEmailsSelfHealing() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var startRow = 2; 
  var numRows = sheet.getLastRow() - 1; 
  var dataRange = sheet.getRange(startRow, 1, numRows, sheet.getLastColumn());
  var data = dataRange.getValues();
  
  var emailsSentThisRun = 0;
  var maxEmailsPerRun = 50; 
  
  // We will write "Sent" in Column 50 (Column AX) so it stays far away from your shattered text
  var statusColumnIndex = 50; 
  
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    
    // Sweep up all the broken cells and FORCE it to be a string
    var fullRowText = String(row.join(","));
    
    if (emailsSentThisRun >= maxEmailsPerRun) {
      Logger.log("Reached limit of 50 emails. Stopping for today.");
      break; 
    }
    
    // SCANNERS: Hunt for the email address and the start of your message
    var emailMatch = fullRowText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    var emailAddress = emailMatch ? String(emailMatch) : "";
    var bodyStartIndex = fullRowText.indexOf("Hi ");
    
    // Only proceed if we found an email address and the email message
    if (emailAddress !== "" && bodyStartIndex !== -1) {
      
      var status = String(sheet.getRange(startRow + i, statusColumnIndex).getValue());
      
      if (status !== "Sent") {
        try {
          var rawBody = String(fullRowText.substring(bodyStartIndex));
          
          // REPAIR THE TEXT: Replace blocks of empty commas with clean paragraph breaks
          var cleanBody = rawBody.replace(/,{2,}/g, "\n\n");
          
          // CHOP OFF THE JUNK: Cut off the error codes that got stuck to the end of your rows
          if (cleanBody.indexOf("414-308-4733") !== -1) {
            cleanBody = String(cleanBody.split("414-308-4733")) + "414-308-4733";
          }
          
          // Safely grab the company name
          var companyNameStr = String(fullRowText.split("http"));
          var companyName = companyNameStr.replace(/,/g, "").replace(/"/g, "").trim();
          
          // Send the perfectly formatted email
          MailApp.sendEmail({
            to: emailAddress,
            subject: "Collegiate Fishing Inquiry - UW-Madison",
            body: cleanBody
          });
          
          // Mark as "Sent"
          sheet.getRange(startRow + i, statusColumnIndex).setValue("Sent");
          emailsSentThisRun++;
          Logger.log("SUCCESS: Sent email #" + emailsSentThisRun + " to " + companyName + " (" + emailAddress + ")");
          
        } catch (e) {
          sheet.getRange(startRow + i, statusColumnIndex).setValue("Error");
          Logger.log("FAILED to send to " + emailAddress + " - Error: " + e.message);
        }
      }
    }
  }
  Logger.log("Batch complete! Total emails sent this run: " + emailsSentThisRun);
}
