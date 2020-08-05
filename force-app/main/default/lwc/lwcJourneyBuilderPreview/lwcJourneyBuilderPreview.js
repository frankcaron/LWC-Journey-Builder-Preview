import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class LwcJourneyBuilderPreview extends NavigationMixin(LightningElement) {

    // Properties
    @api
    MarketingCloudOrg = '';

    // Internal Vars
    journeyId = '';
    journeyMid = '';
    journeyURL = '';
    
    renderedCallback() {

        //Set up variables
        let jsonSpec = this.getJsonSpec();

        //Set top level variables
        this.journeyId = jsonSpec.id;
        this.journeyMid = jsonSpec.key;
        this.journeyURL = this.getJourneyURL(jsonSpec.key);

        //---- Create HTML Canvas elements ----- 

        //Journey Header
        let journeyHeaderCard = '';
        journeyHeaderCard += `<div class="journey-header">`;
        journeyHeaderCard += `<div class="journey-title">${jsonSpec.name}</div>`;
        journeyHeaderCard += `<div class="journey-description">${jsonSpec.description}</div>`;
        journeyHeaderCard += `</div>`;

        //Journey Canvas
        let journeyCanvas = '<canvas class="journey-canvas"></canvas>';

        //Journey Footer
        let journeyFooterCard = '';
        journeyFooterCard += `<div class="journey-footer">`;
        journeyFooterCard += `<div class="journey-footer-content">Last updated ${jsonSpec.modifiedDate}</div>`;
        journeyFooterCard += `</div>`;

        //---- Modify DOM ----- 
        let journeyContainer = this.template.querySelectorAll(`[class*="journey-holder"]`)[0];
        journeyContainer.innerHTML = journeyHeaderCard;
        journeyContainer.innerHTML += journeyCanvas;
        journeyContainer.innerHTML += journeyFooterCard;

        // ---- Draw Journey ---
        let journeyCanvasObj = this.template.querySelectorAll(`[class*="journey-canvas"]`)[0];
        this.drawJourney(journeyCanvasObj, jsonSpec);

    }

    // Function to retrieve spec from Marketing Cloud API
    getJsonSpec(testMode = true) {
        let jsonToReturn = '';

        //If test mode is on, return the stub.
        if (testMode) {
            jsonToReturn = {
                "id": "unique-UUID-provided-by-SFMC",
                "key": "a-key-that-is-unique-for-MID",
                "version": 1,
                "name": "My first journey",
                "description": "This is a description of my journey.",
                "workflowApiVersion": 1.0,
                "createdDate": "2015-02-18T14:56:13.423",
                "modifiedDate": "2015-03-10T13:49:05.763",
                "triggers": [
                    {
                        "key": "event-key",
                        "name": "Starting point for the journey",
                        "type": "Event",
                        "eventDefinitionKey": "my-entry-event-key",
                        "arguments": {},
                        "configurationArguments": {},
                        "metaData": {}
                    }
                ],
                "defaults": {
                "email": [
                    "{{Event.event-key.EmailAddress}}",
                    "{{Contact.Default.Email}}"
                ]
                },
                "activities": [
                    {
                        "key": "call-web-service",
                        "name": "Call web service to get email",
                        "type": "Rest",
                        "metaData": {
                            "flowDisplayName": "CallWebService"
                        },
                        "outcomes": [
                            {
                                "key": "call-web-service-then-send-welcome-email",
                                "next": "send-welcome-email"
                            }
                        ],
                        "configurationArguments": {
                            "save": {
                                "url": "https://www.example.com/endpoint",
                                "useJwt": false,
                                "body": ""
                            },
                            "validate": {
                                "url": "https://www.example.com/endpoint",
                                "useJwt": false,
                                "body": ""
                            },
                            "publish": {
                                "url": "https://www.example.com/endpoint",
                                "useJwt": false,
                                "headers": "https://www.example.com/endpoint",
                                "body": ""
                            }
                        },
                        "arguments": {
                            "execute": {
                                "url": "https://www.example.com/endpoint",
                                "inArguments": [{
                                    "myArgument": ""
                                }],
                                "body": "",
                                "useJwt": false
                            }
                        }
                    },
                    {
                        "key": "send-welcome-email",
                        "name": "Welcome email",
                        "type": "EMAILV2",
                        "outcomes": [
                            {
                                "key": "sent-welcome-email-then-random-split",
                                "next": "random-split"
                            }
                        ],
                        "metaData":{},
                        "configurationArguments": {
                            "triggeredSend":{
                                "emailId":"12345678",
                                }
                    }
                    },
                    {
                        "key": "random-split",
                        "name": "Random split",
                        "type": "RandomSplit",
                        "outcomes": [
                            {
                                "key": "random-split-then-send-sms",
                                "next": "send-sms",
                                "arguments": {
                                    "percentage": 90
                                }
                            },
                            {
                                "key": "random-split-then-10-percent-end",
                                "next": "send-sms2",
                                "arguments": {
                                    "percentage": 10
                                }
                            }
                        ]
                    },
                    {
                        "key": "send-sms",
                        "name": "Send SMS",
                        "type": "SMS",
                        "arguments": {
                            "smsToSend": "ef47e4c0-5def-11e3-949a-0800200c9a66",
                            "phoneNumber": ""
                        }
                    },
                    {
                        "key": "send-sms2",
                        "name": "Send SMS 2",
                        "type": "SMS",
                        "arguments": {
                            "smsToSend": "ab47e4c0-5def-11e3-949a-0800200c9a66",
                            "phoneNumber": ""
                        }
                    }
                ],
                    "goals": [
                    {
                        "key": "goal-key",
                        "name": "Our success metric",
                        "description": "This goal determines the success of the journey",
                        "type": "Event",
                        "arguments": {
                            "criteria": "filterXML_or_JSON_String"
                        },
                        "metaData": {
                            "isExitCriteria": true,
                            "conversionUnit": "percentage",
                            "conversionValue": "50",
                            "eventDefinitionId": "unique-UUID-generated-by-SFMC",
                            "eventDefinitionKey": "Event-unique-key-generated-by-SFMC",
                            "configurationDescription": "PurchaseDate is on or after Today minus 1 day and SubTotal is not null ",
                            "chainType": "none"
                        }
                    }
                ]
            };
        } else {
            // Retrieve from API
            jsonToReturn = "Not a stub";
        }
            
        //Return 
        return jsonToReturn;

    }

    // Function to get Journey URL
    getJourneyURL(mid, testMode = true) {

        //If in test mode, return the hard-coded val
        if (testMode) {
         return "https://mc.s4.exacttarget.com/cloud/#app/Journey%20Builder/%23a7da3796-d2d7-497b-a89f-6e77754912e8/7";
        }

        //Otherwise, return the real one
        return "https://mc.s4.exacttarget.com/cloud/#app/Journey%20/Builder/" + mid + "/";
    }

    //Function to navigate on the edit button click
    navigateToMCJourneyPage() {
        this[NavigationMixin.Navigate]({
            "type": "standard__webPage",
            "attributes": {
                "url": this.journeyURL
            }
        });
    }

    //Function to draw Journey on Cnavs
    drawJourney(canvas, jsonSpec){

        //----------------------
        //Initialize canvas
        //----------------------

        var ctx = canvas.getContext("2d");
        canvas.style.width='100%';
        canvas.style.height='100%';
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        //----------------------
        //Grab spec and start parsing it
        //----------------------

        //Entry Events
        let journeyEntry = jsonSpec.triggers[0];

        //Activities
        let journeyActivities = jsonSpec.activities;
        let activitySet = new Set();
        for (const activity of journeyActivities) {
            activitySet.add(activity);
        }

        //Exits
        let journeyEndPoints = new Set();
        for (let activity of activitySet) {
            if (!activity.outcomes) {
                journeyEndPoints.add(activity);
            }
        }

        //----------------------
        //Start Drawing
        //----------------------

        //Find Starting Point
        let top = 0;
        let left = 0;
        let shapeSize = 20;

        //Draw Entry Event
        ctx.beginPath();
        ctx.arc(left + shapeSize, top +shapeSize, shapeSize / 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#97cf66';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        
        //ctx.moveTo(0, 0);
        //ctx.lineTo(canvas.width * 2, canvas.height / 2);
        //ctx.stroke();


      }

}