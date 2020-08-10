global class parseEmail implements Messaging.InboundEmailHandler {
    
    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email, Messaging.InboundEnvelope envelope) {
        
        Messaging.InboundEmailResult result = new Messaging.InboundEmailresult();    
        
        //Record Type for Creative
        Id myRecordTypeID = Schema.SObjectType.Opportunity.getRecordTypeInfosByDeveloperName().get('Creative').getRecordTypeId();

        //Create new Creative
        Opportunity myOpportunity = new Opportunity();
        myOpportunity.Name = email.subject; // Name
        myOpportunity.RecordTypeId = myRecordTypeID; // For specific record type
        myOpportunity.StageName = 'Qualification'; // Qualification stage
        myOpportunity.CloseDate = System.today().addDays(60); // 60 days out
        myOpportunity.Description = email.plainTextBody; // Email body - could be in HTML but using default Opp plain text field
          
        //Add attachment if it exists
        if (email.binaryAttachments != null && email.binaryAttachments.size() > 0) {
            for (integer i = 0 ; i < email.binaryAttachments.size() ; i++) {
                Attachment attachment = new Attachment();
                attachment.ParentId = myOpportunity.Id;
                attachment.Name = email.binaryAttachments[i].filename;
                attachment.Body = email.binaryAttachments[i].body;                    
                insert attachment;
            }
        }
                 
        //Return
        result.success = true;
        return result;
    }
    
}