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
        let canvasWidth = 1280;
        let canvasHeight = 720;
        canvas.style.width = canvasWidth + "px";
        canvas.style.height = canvasHeight + "px";  

        let scale = window.devicePixelRatio;
        canvas.width = canvasWidth * scale;
        canvas.height = canvasHeight * scale;

        // Normalize coordinate system to use css pixels.
        var canvasContext = canvas.getContext("2d");
        canvasContext.scale(scale, scale);

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

        //Set constants
        const top = 0;
        const left = 0;
        const shapeSize = 100;
        const shapeSpacing = 200;
        const shapeRounding = 20;

        const fontMarginTop = 10;
        const fontHeader = 'bold 17px Arial'
        const fontBody = '15px Arial'
        const fontColor = '#000';

        const connectorColor = "#666";
        const connectorWidth = 5;

        const eventEntryColor = '#97cf66';
        const activityEntryColor = '#52c7bc';

        const descriptionWidth = 150;
        const descriptionHeight = 150;
        const descriptionPadding = 5;
        const descriptionLineHeight = 20;
        const descriptionFillColor = '#FFF'
        const descriptionBorderColor = '#BBB'

        //Set counters
        let numShapes = 0;

        //----------------------
        //Draw Entry Event
        //----------------------
        
        //Draw Entry Event
        let entryEventX = left + shapeSize;
        let entryEventY = top + shapeSize;

        canvasContext.beginPath();
        canvasContext.arc(entryEventX, entryEventY, shapeSize / 2, 0, 2 * Math.PI, false);
        canvasContext.closePath();
        canvasContext.fillStyle = eventEntryColor;
        canvasContext.fill();
        canvasContext.font = fontHeader;
        canvasContext.fillStyle = fontColor;
        canvasContext.textAlign = "center";
        canvasContext.fillText("Entry", entryEventX, entryEventY + fontMarginTop);

        //Draw Entry Event Box
        let entryEventDescriptionX = entryEventX - descriptionWidth / 2;
        let entryEventDescriptionY = entryEventY + descriptionHeight / 2 + descriptionPadding;

        canvasContext.beginPath();
        canvasContext.rect(entryEventDescriptionX, entryEventDescriptionY, descriptionWidth, descriptionHeight);
        canvasContext.closePath();
        canvasContext.fillStyle = descriptionFillColor;
        canvasContext.fill();
        canvasContext.lineWidth = 1;
        canvasContext.strokeStyle = descriptionBorderColor;
        canvasContext.stroke();

        //Draw Entry Event Text
        let entryEventDescriptionTextX = entryEventDescriptionX + descriptionWidth / 1.9;
        let entryEventDescrtipionTextY = entryEventDescriptionY + descriptionLineHeight;

        canvasContext.fillStyle = fontColor;
        canvasContext.textAlign = "center";
        canvasContext.font = fontHeader;
        canvasContext.fillText("Name:", entryEventDescriptionTextX, entryEventDescrtipionTextY);
        canvasContext.font = fontBody;
        this.wrapText(canvasContext, journeyEntry.key, entryEventDescriptionTextX, entryEventDescrtipionTextY + descriptionLineHeight, descriptionWidth, descriptionLineHeight);
        canvasContext.font = fontHeader;
        canvasContext.fillText("Description:", entryEventDescriptionTextX, entryEventDescrtipionTextY + descriptionLineHeight * 3);
        canvasContext.font = fontBody;
        this.wrapText(canvasContext, journeyEntry.name, entryEventDescriptionTextX, entryEventDescrtipionTextY + descriptionLineHeight * 4, descriptionWidth, descriptionLineHeight);
           
        //Increment
        numShapes++;

        //----------------------
        // Draw Exit Events
        //----------------------

        for (const exit of journeyEndPoints) {

            let nextEventX = left + shapeSize + (shapeSpacing * numShapes) ;
            let nextEventY = (top + shapeSize) / 2;  

            this.roundRect(canvasContext, nextEventX, nextEventY, shapeSize, shapeSize, shapeRounding);
            canvasContext.fillStyle = activityEntryColor;
            canvasContext.fill();
            canvasContext.font = fontHeader;
            canvasContext.fillStyle = fontColor;
            canvasContext.textAlign = "center";
            canvasContext.fillText("Activity", nextEventX + shapeSize / 2, nextEventY + shapeSize / 2 + fontMarginTop);


            //Draw Entry Event Box
            let endpointEventDescriptionX = nextEventX - descriptionWidth / 5;
            let endpointEventDescriptionY = nextEventY + descriptionHeight / 1.2 + descriptionPadding;

            canvasContext.beginPath();
            canvasContext.rect(endpointEventDescriptionX, endpointEventDescriptionY, descriptionWidth, descriptionHeight);
            canvasContext.closePath();
            canvasContext.fillStyle = descriptionFillColor;
            canvasContext.fill();
            canvasContext.lineWidth = 1;
            canvasContext.strokeStyle = descriptionBorderColor;
            canvasContext.stroke();

            //Draw Entry Event Text
            let endpointEventDescriptionTextX = nextEventX + descriptionWidth / 3;
            let endpointEventDescrtipionTextY = nextEventY + descriptionLineHeight + shapeSize + descriptionPadding * 6;

            canvasContext.fillStyle = fontColor;
            canvasContext.textAlign = "center";
            canvasContext.font = fontHeader;
            canvasContext.fillText("Name:", endpointEventDescriptionTextX, endpointEventDescrtipionTextY);
            canvasContext.font = fontBody;
            this.wrapText(canvasContext, exit.key, endpointEventDescriptionTextX, endpointEventDescrtipionTextY + descriptionLineHeight, descriptionWidth, descriptionLineHeight);
            canvasContext.font = fontHeader;
            canvasContext.fillText("Description:", endpointEventDescriptionTextX, endpointEventDescrtipionTextY + descriptionLineHeight * 3);
            canvasContext.font = fontBody;
            this.wrapText(canvasContext, exit.name, endpointEventDescriptionTextX, endpointEventDescrtipionTextY + descriptionLineHeight * 4, descriptionWidth, descriptionLineHeight);

            //Increment
            numShapes++;

            //Draw Connector
            let start = { "x": nextEventX + shapeSize / 2, "y": nextEventY + shapeSize / 2 };
            let end = { "x": entryEventX, "y": entryEventY };
            this.drawElbow(canvasContext, "bottomLeft", start, end, 12, connectorColor, connectorWidth )
        }

      }

      // Function to wrap text in a box
      wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
      }

     // Function to create a rounded rectangle
     roundRect(ctx, x, y, width, height, radius) {
        if (typeof radius == 'number') {
          radius = {tl: radius, tr: radius, br: radius, bl: radius};
          console.log(radius);
        } else {
          var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
          for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
          }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
      
      }

      //Function to draw elbow connectors
      drawElbow(ctx, type, start, end, cornerRadius, color, linewidth) {

        //Draw behind shapes
        ctx.globalCompositeOperation = 'destination-over';

        // starting elbow
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
    
        // middle elbow
        switch (type) {
            case "topLeft":
                ctx.lineTo(start.x, end.y + cornerRadius);
                ctx.quadraticCurveTo(
                start.x, end.y,
                start.x + cornerRadius, end.y);
                break;
            case "topRight":
                ctx.lineTo(end.x - cornerRadius, start.y);
                ctx.quadraticCurveTo(
                end.x, start.y,
                end.x, start.y + cornerRadius);
                break;
            case "bottomRight":
                ctx.lineTo(start.x, end.y - cornerRadius);
                ctx.quadraticCurveTo(
                start.x, end.y,
                start.x - cornerRadius, end.y);
                break;
            case "bottomLeft":
                ctx.lineTo(end.x + cornerRadius, start.y);
                ctx.quadraticCurveTo(
                end.x, start.y,
                end.x, start.y - cornerRadius);
                break;
        }
    
        // ending elbow
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = linewidth;
        ctx.stroke();

        //Return to normal
        ctx.globalCompositeOperation = 'source-over';
    }

}