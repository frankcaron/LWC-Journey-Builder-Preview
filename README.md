# LWC - Journey Builder Spec Preview
## Salesforce Lightning Web Component Cross-Cloud Magic

This Lightning Web Component is designed to be used with the core Salesforce Platform to visualize a Journey from Salesforce Marketing Cloud in the context of Sales, Service, or Community Cloud. 

This component ingests [a JSON spec of a Journey via the Marketing Cloud APIs](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/reference.htm).

## Preview
![](preview.png)

## Prereqs
* A valid Marketing Cloud org with a server-to-server integration set up
    * The `client_id` and `client_secret` for the above
* A core Salesforce org to deploy your component in
* Knowledge of custom metadata types

## Deployment
### Marketing Cloud Setup
* In MC setup, go to Installed Packages and create a New Package
* Add Component and select `API Integration`, and `Server to Server`
* Enable `Read` access to Journeys

### Force.com Setup
* Use SFDX to deploy the source to your desired org
* Change the Remote Site Settings for `MarketingCloudRESTURL` and `MarketingCloudAuthURL` to whitelist the `auth` and `rest` endpoints for your instance of Marketing Cloud
* Add to the `Marketing Cloud Credentials` custom metadata type a record (API) named `MCCConfig` with the following attributes populated based on your MC app details:
    * `Client_ID__c`
    * `Client_Secret__c`
    * `AUTH_URL__c`
    * `REST_URL__c`
* Add the `lwcJourneyBuilderPreview` component to your desired page
* Configure the component's attributes to feed in the Journey ID and URLs for your Marketing Cloud instance
   * The GUID is in the journey's URL after '/Journey%20Builder/%23' 
     ![](GUID.png)

## To Do
* Fix up the drawing to accomodate more variations of how specs generate in the real world
