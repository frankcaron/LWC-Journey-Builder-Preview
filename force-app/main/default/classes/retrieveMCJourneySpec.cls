public with sharing class retrieveMCJourneySpec {
    
  public retrieveMCJourneySpec() {
  // Constructor for function
  }

  // Public method to retrieve the Journey JSON spec
  @AuraEnabled(cacheable=true)
  public static String getSpec(String guid) {
      
      // Set up strings
      String MARKETING_CLOUD_AUTH_URL = '';
      String MARKETING_CLOUD_REST_URL = '';
      String clientId = '';
      String clientSecret = '';
      String token = '';
      String spec = '';
      
      // Fetch the credentials for the API from the Custom Metadata Type
      Marketing_Cloud_Credentials__mdt[] credentials = [SELECT Client_ID__c, Client_Secret__c, REST_URL__c, AUTH_URL__c FROM Marketing_Cloud_Credentials__mdt];
      clientId = credentials[0].Client_ID__c;
      clientSecret = credentials[0].Client_Secret__c;
      MARKETING_CLOUD_AUTH_URL = credentials[0].AUTH_URL__c;
      MARKETING_CLOUD_REST_URL = credentials[0].REST_URL__c; 
      
      //Debug
      System.debug('DEBUG: Credentials nabbed. Value = ' + clientId + ' ' + clientSecret);
      
      //Get OAuth token 
      Http h = new Http();
      HttpRequest r = new HttpRequest();
      r.setTimeout(60000);
      r.setEndpoint(MARKETING_CLOUD_AUTH_URL);  
      r.setMethod('POST');
      r.setHeader('Content-Type','application/json');    
      r.setBody(JSON.serialize( new Map<String, String>{
                'grant_type' => 'client_credentials',
                'client_id' => clientId,
                'client_secret' => clientSecret
            }));
      HttpResponse res = h.send(r);
      token = ((Map<String, String>) JSON.deserialize(res.getBody(), Map<String, String>.class)).get( 'access_token' );
        
      //Debug
      System.debug('DEBUG: OAUTH API request response body = ' + res.getBody());
      System.debug('DEBUG: Access token granted. Value = ' + token); 
      
      //Grab spec for specific Journey
      HttpRequest p = new HttpRequest();
      p.setTimeout(60000);
      p.setEndpoint(MARKETING_CLOUD_REST_URL + guid);  
      p.setMethod('GET');
      p.setHeader('Content-Type','application/json'); 
      p.setHeader('Authorization','Bearer ' + token);
      HttpResponse res2 = h.send(p);      
      
      spec = res2.getBody();
    
      //Debug
      System.debug('DEBUG: REST API request response body = ' + res2.getBody());
      System.debug('DEBUG: Spec retrieved. Value = ' + spec);
      
      return spec;
  }
}