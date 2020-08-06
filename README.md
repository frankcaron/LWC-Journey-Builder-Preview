# LWC - Journey Builder Spec Preview
## Salesforce Lightning Web Component Cross-Cloud Magic

This Lightning Web Component is designed to be used with the core Salesforce Platform to visualize a Journey from Salesforce Marketing Cloud in the context of Sales, Service, or Community Cloud. 

This component ingests [a JSON spec of a Journey via the Marketing Cloud APIs](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/reference.htm).

## Preview
![](preview.png)

## Deployment
* Use SFDX to deploy the source to your desired org
* Add the `lwcJourneyBuilderPreview` component to your desired page

## To Do
* Swap out hard-coded stub with real JSON payload via MC APIs
* Wire up component properties to make this something that can be more easily reused.