import { LightningElement, api } from 'lwc';

export default class LwcJourneyBuilderPreview extends LightningElement {

    renderedCallback() {

        //Set up variables
        let jsonSpecStub = {
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
        
        //Debug 
        console.log(jsonSpecStub);
        console.log(jsonSpecStub.name);

        //---- Create HTML elements ----- 

        //Journey Header
        let journeyHeaderCard = '';
        journeyHeaderCard += `<div class="journey-header">`;
        journeyHeaderCard += `<div class="journey-title">${jsonSpecStub.name}</div>`;
        journeyHeaderCard += `<div class="journey-description">${jsonSpecStub.description}</div>`;
        journeyHeaderCard += `</div>`;

        let journeyFooterCard = '';
        journeyFooterCard += `<div class="journey-footer">`;
        journeyFooterCard += `<div class="journey-footer-content">Last updated ${jsonSpecStub.modifiedDate}</div>`;
        journeyFooterCard += `</div>`;

        //---- Modify DOM ----- 
        let journeyContainer = this.template.querySelectorAll(`[class*="journey-holder"]`);
        journeyContainer[0].innerHTML += journeyHeaderCard;
        journeyContainer[0].innerHTML += journeyFooterCard;

    }


}