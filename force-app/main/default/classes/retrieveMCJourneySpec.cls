public with sharing class retrieveMCJourneySpec {

    private static String MARKETING_CLOUD_AUTH_URL = 'https://auth.exacttargetapis.com/v1/reaquestToken';
    private static String ACCESS_TOKEN = 'accessToken';
    
    public retrieveMCJourneySpec() {
        //
    }

    private static String getMarketingCloudOAuthToken(String clientId, String clientSecret){
        String responseBody = makeSimpleJSONPostCall(
            MARKETING_CLOUD_AUTH_URL,
            JSON.serialize( new Map<String, String>{
                'clientId' => clientId,
                'clientSecret' => clientSecret
            } )
        );
        return ((Map<String, String>) JSON.deserialize(responseBody, Map<String, String>.class)).get( ACCESS_TOKEN ); 
    }   
}
