@isTest 
private class retrieveMCJourneySpecTest {
    static testMethod void validateSpecPull() {
       
       String test = retrieveMCJourneySpec.getSpec('');

       // Test that the trigger correctly updated the price
       System.assertNotEquals(null, test);
    }
}
