global class parseEmail implements Messaging.InboundEmailHandler {
    
    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email, Messaging.InboundEnvelope envelope) {
        
        Messaging.InboundEmailResult result = new Messaging.InboundEmailresult();    
        
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
            webPageLinkURL = viewAsRegex.group(1);
            webPageGUID = viewAsRegex.group(2);
        	system.debug('|| Web Page Regex result: ' + webPageLinkURL);
            system.debug('|| Web Page Regex guid: ' + webPageGUID);
        }
        
        // Find the Approval Link
        
        Matcher reviewRegex = Pattern.compile('<a href="(.*[?][m][=](.*)[&].*[;][a][=].*[u][=](.*))" style.*>.*\\s*Review.*\\s*<\\/a>').matcher(contentBody);
        Boolean reviewFound = reviewRegex.find();
        String reviewURL = '';
        String reviewModel = '';
        String reviewsubURL = '';
        
        system.debug('|| Approval Regex result: ' + reviewFound);
        
        if (reviewFound == true) {
            reviewURL = reviewRegex.group(1);
            reviewModel = reviewRegex.group(2);
            reviewsubURL = reviewRegex.group(3);
            emailType = 'Approval';
        	system.debug('|| Approval Regex result: ' + reviewURL);
            system.debug('|| Approval Regex model: ' + reviewModel);
            system.debug('|| Approval Regex subURL: ' + reviewsubURL);
        }
        
        //Do the org magic
        
        if(emailType == 'Approval') {
            
            System.debug('|| Email is a preview email. Parsing accordingly.');
            
            //Find matching creative for the hard-coded Campaign record
            Creative__c creative = [SELECT Id, Name, Campaign__c, Marketing_Cloud_Ref_ID__c, Approval_Status__c from Creative__c WHERE Campaign__c = '7013t000001dHWKAA2' AND Marketing_Cloud_Ref_ID__c = 'NTIzMDA0MDA2OjE5OjA']; 
            
            //Update status
            creative.Approval_Status__c = 'Legal Approval';
            update creative;
            
            System.debug('|| Moved the record ' + creative.Name + ' to approved status automatically.');
        }
        
        
        Creative__c creative = new Creative__c();
        
        //Opportunity myOpportunity = new Opportunity();
        //
        //
        //
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