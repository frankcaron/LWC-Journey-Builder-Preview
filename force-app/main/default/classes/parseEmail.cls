global class parseEmail implements Messaging.InboundEmailHandler {
    
    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email, Messaging.InboundEnvelope envelope) {
        
        Messaging.InboundEmailResult result = new Messaging.InboundEmailresult();    
        
        //Record Type for Creative
        //Id myRecordTypeID = Schema.SObjectType.Opportunity.getRecordTypeInfosByDeveloperName().get('Creative').getRecordTypeId();
        //
        //
        
        System.debug('=====Email Parser=====');
        
        String contentSubject = email.subject;
        String contentSender = email.fromAddress;
        String contentBody = email.htmlBody;
        
        System.debug('|| Email HTML Body Raw: ' + contentBody);
        System.debug('|| Email HTML Subject: ' + contentSubject);
        System.debug('|| Email HTML Sender: ' + contentSender);
        
        // Decide on email type
        String emailType = 'None'; // Approval, Preview
        
        // Find the Web Page View Link
        
        Matcher viewAsRegex = Pattern.compile('To view this email as a web page, go.*<a href=["](.*[?][q][s][=](.*).*)["].*target.*>.*<\\/a>').matcher(contentBody);
        Boolean foundWebPageLink = viewAsRegex.find();
        String webPageLinkURL = '';
        String webPageGUID = '';
        
        system.debug('|| Web Page Regex result: ' + foundWebPageLink);
        
        if (foundWebPageLink == true) {
            webPageLinkURL = viewAsRegex.group(0);
            webPageGUID = viewAsRegex.group(1);
        	system.debug('|| Web Page Regex result: ' + webPageLinkURL);
        }
        
        // Find the Approval Link
        
        Matcher reviewRegex = Pattern.compile('<a href="(.*[?][m][=](.*)[&].*[;][a][=].*[u][=](.*))" style.*>.*\\s*Review.*\\s*<\\/a>').matcher(contentBody);
        Boolean reviewFound = reviewRegex.find();
        String reviewURL = '';
        String reviewModel = '';
        String reviewsubURL = '';
        
        system.debug('|| Approval Regex result: ' + reviewFound);
        
        if (reviewFound == true) {
            reviewURL = reviewRegex.group(0);
            reviewModel = reviewRegex.group(1);
            reviewsubURL = reviewRegex.group(2);
            emailType = 'Preview';
        	system.debug('|| Approval Regex result: ' + reviewURL);
        }
        
        //Do the org magic
        
        if(emailType == 'Preview') {
            
             System.debug('|| Email is a preview email. Parsing accordingly.');
            //Do the stuff
        }
        
        //Opportunity myOpportunity = new Opportunity();
        //myOpportunity.Name = email.subject; // Name
        //myOpportunity.RecordTypeId = myRecordTypeID; // For specific record type
        //myOpportunity.StageName = 'Qualification'; // Qualification stage
        //myOpportunity.CloseDate = System.today().addDays(60); // 60 days out
        //myOpportunity.Description = email.plainTextBody; // Email body - could be in HTML but using default Opp plain text field
          
        /* Add attachment if it exists
        if (email.binaryAttachments != null && email.binaryAttachments.size() > 0) {
            for (integer i = 0 ; i < email.binaryAttachments.size() ; i++) {
                
                System.debug('|| Email attachment name: ' + email.binaryAttachments[i].filename);
                System.debug('|| Email attachment content: ' + email.binaryAttachments[i].body);
                
                //Attachment attachment = new Attachment();
                //attachment.ParentId = myOpportunity.Id;
                //attachment.Name = email.binaryAttachments[i].filename;
                //attachment.Body = email.binaryAttachments[i].body;                    
                //insert attachment;
            }
        }
		*/
                 
        //Return
        result.success = true;
        return result;
    }
    
}