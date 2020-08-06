public with sharing class retrieveMCJourneySpec {

    private static String MARKETING_CLOUD_AUTH_URL = 'https://mcs3shswdwvb120vyp-s6hm1ccq8.auth.marketingcloudapis.com/v2/token';
    private static String MARKETING_CLOUD_REST_URL = 'https://mcs3shswdwvb120vyp-s6hm1ccq8.rest.marketingcloudapis.com/';
    private static String ACCESS_TOKEN = 'accessToken';

    private String clientId = '';
    private String clientSecret = '';
    private String token = '';
    
    public retrieveMCJourneySpec() {
		//Constructor
    }

    public String getSpec() {
        this.token = getMarketingCloudOAuthToken(this.clientId, this.clientSecret);
        return this.token;
    }
    
    private static String getMarketingCloudOAuthToken(String clientId, String clientSecret){
        String responseBody = makeSimpleJSONPostCall(
            MARKETING_CLOUD_AUTH_URL,
            JSON.serialize( new Map<String, String>{
                'grant_type' => 'client_credentials',
                'clientId' => clientId,
                'clientSecret' => clientSecret
            } )
        );
        
        return ((Map<String, String>) JSON.deserialize(responseBody, Map<String, String>.class)).get( ACCESS_TOKEN ); 
    } 
    
    private static String makeSimpleJSONPostCall(String endPoint, String jsonBody){
        Http h = new Http();
        HttpRequest r = new HttpRequest();
        r.setTimeout(60000);
        r.setEndpoint(endPoint);  
        r.setMethod('POST');
        r.setHeader('Content-type','application/json');    
        r.setBody(jsonBody);    
        HttpResponse res = h.send(r);
        return res.getBody();
    }
}