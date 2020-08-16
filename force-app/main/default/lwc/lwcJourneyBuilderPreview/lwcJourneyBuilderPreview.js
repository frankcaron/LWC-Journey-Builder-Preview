import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getSpec from '@salesforce/apex/retrieveMCJourneySpec.getSpec';

export default class LwcJourneyBuilderPreview extends NavigationMixin(LightningElement) {

    // Component Properties
    @api
    journeyGuid = '';

    @api
    journeyGuidTypeName = '';

    @api
    journeyGuid2 = '';

    @api
    journeyGuid2TypeName = '';

    @api
    journeyGuid3 = '';

    @api
    journeyGuid3TypeName = '';

    @track
    creatingJourney = false;

    @track
    journeyType = '';

    @track
    journeyGuidToLoad = '';

    // Internal Vars
    journeyId = '';
    journeyMid = '';
    journeyURL = ''
    jsonSpec = '';
    
    renderedCallback() {
        //Retrieve the JSON spec and go
        //this.getJsonSpec();
    }

    // Draw the componentry once the spec is loaded
    drawComponent() {

        console.log("Checking spec before render");
        console.log(this.jsonSpec);

        //Set top level variables
        this.journeyId = this.jsonSpec.id;
        this.journeyMid = this.jsonSpec.key;
        this.journeyURL = this.getJourneyURL(this.journeyGuidToLoad, false);

        //---- Create HTML Canvas elements ----- 

        //Journey Header
        let journeyHeaderCard = '';
        journeyHeaderCard += `<div class="journey-header">`;
        journeyHeaderCard += `<div class="journey-title">${this.jsonSpec.name}</div>`;
        journeyHeaderCard += `<div class="journey-description">${this.jsonSpec.description}</div>`;
        journeyHeaderCard += `</div>`;

        //Journey Canvas
        let journeyCanvas = '<canvas class="journey-canvas"></canvas>';

        //Journey Footer
        let journeyFooterCard = '';
        journeyFooterCard += `<div class="journey-footer">`;
        journeyFooterCard += `<div class="journey-footer-content">Last updated ${this.jsonSpec.modifiedDate}</div>`;
        journeyFooterCard += `</div>`;

        //---- Modify DOM ----- 
        let journeyContainer = this.template.querySelectorAll(`[class*="journey-holder"]`)[0];
        journeyContainer.innerHTML = journeyHeaderCard;
        journeyContainer.innerHTML += journeyCanvas;
        journeyContainer.innerHTML += journeyFooterCard;

        // ---- Draw Journey ---
        let journeyCanvasObj = this.template.querySelectorAll(`[class*="journey-canvas"]`)[0];
        this.drawJourney(journeyCanvasObj);
    }

    // Function to retrieve spec from Marketing Cloud API
    getJsonSpec() {

        //Debug
        //console.log('SPEC RETRIEVAL || Retrieve Journey Spec...');
        //console.log('SPEC RETRIEVAL || Type ask is ' + this.journeyType);
        //console.log("SPEC RETRIEVAL || JourneyGuid set to " + this.journeyGuidToLoad);

        // If we have a legit guid, load it, otherwise, load the fallback
        if (this.journeyGuidToLoad != '') {
            getSpec({ guid: this.journeyGuidToLoad })
                .then(result => {

                    let parsedResult = JSON.parse(result);
                    //console.log("parsedResult set to " + parsedResult);

                    if (parsedResult.errorcode == undefined && parsedResult != undefined) { 
                        this.jsonSpec = parsedResult;
                    }     

                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    this.drawComponent();
                });
        } else {

            // Load fallback demo stub

            this.jsonSpec = {
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

            this.drawComponent();
        }
    }

    // Function to get Journey URL
    getJourneyURL(guid, testMode = false) {

        //If in test mode, return the hard-coded val
        if (testMode) {
         return "https://www.google.com";
        }

        //Otherwise, return the real one
        if (guid) {
            return 'https://mc.s4.exacttarget.com/cloud/#app/Journey%20Builder/%23' + guid + '/v';
        }

        return 'https://mc.s4.exacttarget.com/cloud/#app/Journey%20Builder/';
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
    drawJourney(canvas){

        //----------------------
        //Set variables
        //----------------------
        let numShapes = 0;
        let numPaths = 0;
        let numEndPoints = 0;
        let eventList = new Map();
        let drawPaths = [];
        let drawnPathItems = new Map();

        //----------------------
        //Initialize canvas
        //----------------------
        let canvasWidth = 2560;
        let canvasHeight = 1440;
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
        let journeyEntry = "";
        if (this.jsonSpec.triggers[0] != undefined) {
            journeyEntry = this.jsonSpec.triggers[0];
        }

        //All Activities
        let journeyActivities = this.jsonSpec.activities;
        let activitySet = new Set();
        for (const activity of journeyActivities) {
            activitySet.add(activity);
            eventList.set(activity.key, {"x": 0, "y": 0});
        }
        numShapes = eventList.size;

        //Only Non-Exits
        let journeyActivityPoints = new Set();
        for (let activity of activitySet) {
            if (activity.outcomes) {
                journeyActivityPoints.add(activity);
            }
        }

        //Only Decisions
        let journeyDecisionPoints = new Set();
        for (let activity of activitySet) {
            if (activity.type.includes("Split") || activity.type.includes("Decision")) {
                journeyDecisionPoints.add(activity);
                numPaths += activity.outcomes.length
            }
        }

        //Only Exits
        let journeyEndPoints = new Set();
        for (let activity of activitySet) {
            console.log(activity.outcomes);
            if (!activity.outcomes || !activity.outcomes[0].next) {
                journeyEndPoints.add(activity);
            }
        }
        numEndPoints = journeyEndPoints.size;

        //Debug
        console.log("Number of total distinct paths: " + numPaths);
        console.log("Number of total distinct ends: " + numEndPoints);
        console.log("Number of distinct events: " + numShapes);

        //Use Exits to work back to fill paths
        for (let exit of journeyEndPoints) {

            let pathArray = [];
            let previousEventKey = exit.key;
            let activityArray = Array.from(journeyActivityPoints); 

            //Find next event in chain by going through outcomes
            for (let i = 0; i < activityArray.length; i++) {
                let outcomes = activityArray[i].outcomes;
                for (let outcome of outcomes) {
                    if (outcome.next == previousEventKey) {
                        pathArray.push(activityArray[i]);
                        previousEventKey = activityArray[i].key;
                        i = 0;
                    }
                }
            }

            //Reverse Array
            pathArray.reverse();

            //Add entry and exit activity to the end
            pathArray.unshift(journeyEntry);
            pathArray.push(exit);

            //Add entire array to the path
            drawPaths.push(pathArray);
        }

        //Debug
        console.log(drawPaths);

        //----------------------
        //Start Drawing
        //----------------------

        //Set constants
        const top = 0;
        const left = 0;
        const shapeSize = 100;
        const shapeSpacing = 200;
        const shapeRounding = 20;
        const shapePadding = 5;

        const fontMarginTop = 10;
        const fontHeader = 'bold 17px Arial'
        const fontBody = '15px Arial'
        const fontColor = '#000';

        const connectorColor = "#666";
        const connectorWidth = 5;
        const connectorRadius = 12;

        const eventEntryColor = '#97cf66';
        const activityEntryColor = '#52c7bc';
        const activityColor = '#52c7bc';
        const decisionColor = '#ec8b23';
        const splitColor = '#97a4b1';

        const descriptionWidth = 150;
        const descriptionHeight = 150;
        const descriptionPadding = 5;
        const descriptionLineHeight = 20;
        const descriptionFillColor = '#FFF'
        const descriptionBorderColor = '#BBB'

        //----------------------
        //Draw Entry Event
        //----------------------
        
        //Draw Entry Event
        if (journeyEntry != '') { 
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

            //Add to list
            eventList.set(journeyEntry.key, {"x": entryEventX, "y": entryEventY});
        }

        //----------------------
        // Draw All Other Activities
        //----------------------

        //Set up Branch
        let branchRightCounter = 0;
        let branchDownCounter = 0;

        // For each path defined by a unique end point...
        for (let currentPath of drawPaths) { 

            //Debug 
            //console.log("Current Path is ");
            //console.log(currentPath);

            //Iterate through each step
            for (let pathStep = 1; pathStep < currentPath.length; pathStep++) {

                // Count for right steps as we go
                branchRightCounter = pathStep;
                
                // Determine the current activity type
                let currentActivity = currentPath[pathStep];
                let currentActivityType = currentActivity.type;

                //Ensure we're not duplicating efforts, and if we are, move onto the next node
                if (drawnPathItems.has(currentActivity.key)) { 
                    //console.log("Repeating a drawn activity, so skipping");
                    continue; 
                }

                // Debug
                //console.log("Current on branch down  " + branchDownCounter);
                //console.log("Evaluating activity at step " + pathStep + " and type " + currentActivityType);
                
                if (currentActivityType.includes("Decision") || currentActivityType.includes("Split")) {

                    // Debug
                    //console.log("Drawing decision activity for " + currentActivity.name);
                    
                    // Draw Decisions
                    let nextEventX = left + shapeSize + (shapeSpacing * branchRightCounter) + shapeSpacing / 4;
                    let nextEventY = (top + shapeSize) / 2 + (shapeSpacing + descriptionHeight) * branchDownCounter;  

                    canvasContext.beginPath();
                    canvasContext.moveTo(nextEventX, nextEventY);
                    canvasContext.lineTo(nextEventX + shapeSize / 2, nextEventY + shapeSize / 2);
                    canvasContext.lineTo(nextEventX, nextEventY + shapeSize);
                    canvasContext.lineTo(nextEventX - shapeSize / 2, nextEventY + shapeSize / 2);
                    canvasContext.closePath();

                    canvasContext.fillStyle = currentActivityType.includes("Split") ? splitColor : decisionColor;
                    canvasContext.fill();
                    canvasContext.font = fontHeader;
                    canvasContext.fillStyle = fontColor;
                    canvasContext.textAlign = "center";
                    canvasContext.fillText(currentActivityType.includes("Split") ? "Split" : "Decision", nextEventX, nextEventY + shapeSize / 2 + fontMarginTop / 1.5);

                    //Draw Decision Box
                    let decisionEventDescriptionX = nextEventX - descriptionWidth / 2;
                    let decisionEventDescriptionY = nextEventY + descriptionHeight / 1.2 + descriptionPadding;

                    canvasContext.beginPath();
                    canvasContext.rect(decisionEventDescriptionX, decisionEventDescriptionY, descriptionWidth, descriptionHeight);
                    canvasContext.closePath();
                    canvasContext.fillStyle = descriptionFillColor;
                    canvasContext.fill();
                    canvasContext.lineWidth = 1;
                    canvasContext.strokeStyle = descriptionBorderColor;
                    canvasContext.stroke();

                    //Draw Entry Event Text
                    let decisionEventDescriptionTextX = nextEventX;
                    let decisionEventDescrtipionTextY = nextEventY + descriptionLineHeight + shapeSize + descriptionPadding * 6;

                    canvasContext.fillStyle = fontColor;
                    canvasContext.textAlign = "center";
                    canvasContext.font = fontHeader;
                    canvasContext.fillText("Name:", decisionEventDescriptionTextX, decisionEventDescrtipionTextY);
                    canvasContext.font = fontBody;
                    this.wrapText(canvasContext, currentActivity.key, decisionEventDescriptionTextX, decisionEventDescrtipionTextY + descriptionLineHeight, descriptionWidth, descriptionLineHeight);
                    canvasContext.font = fontHeader;
                    canvasContext.fillText("Description:", decisionEventDescriptionTextX, decisionEventDescrtipionTextY + descriptionLineHeight * 3);
                    canvasContext.font = fontBody;
                    this.wrapText(canvasContext, currentActivity.name, decisionEventDescriptionTextX, decisionEventDescrtipionTextY + descriptionLineHeight * 4, descriptionWidth, descriptionLineHeight);

                    //Add to list
                    eventList.set(currentActivity.key, {"x": nextEventX, "y": nextEventY});

                    //Iterate
                    branchRightCounter++;

                } else {

                    // Debug
                    //console.log("Drawing normal activity for " + currentActivity.name);

                    // Draw Activity
                    let nextEventX = left + shapeSize + (shapeSpacing * branchRightCounter) ;
                    let nextEventY = (top + shapeSize) / 2 + (shapeSpacing + descriptionHeight) * branchDownCounter;  

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
                    this.wrapText(canvasContext, currentActivity.key, endpointEventDescriptionTextX, endpointEventDescrtipionTextY + descriptionLineHeight, descriptionWidth, descriptionLineHeight);
                    canvasContext.font = fontHeader;
                    canvasContext.fillText("Description:", endpointEventDescriptionTextX, endpointEventDescrtipionTextY + descriptionLineHeight * 3);
                    canvasContext.font = fontBody;
                    this.wrapText(canvasContext, currentActivity.name, endpointEventDescriptionTextX, endpointEventDescrtipionTextY + descriptionLineHeight * 4, descriptionWidth, descriptionLineHeight);

                    //Add to list
                    eventList.set(currentActivity.key, {"x": nextEventX, "y": nextEventY});

                    //Iterate
                    branchRightCounter++;

                }

                // Mark down that this activity has been drawn
                drawnPathItems.set(currentActivity.key, currentActivity);
            }

            //Iterate
            branchDownCounter++;
        }

        //----------------------
        // Draw All Connectors
        //----------------------

        //Connector type
        let connectorType = "straight";
        let currentBranchDown = 0;

        //Clear Drawn items
        drawnPathItems.clear();

        //For each path...
        for (let currentPath of drawPaths) { 

            //And each step in each path...
            for (let pathStep = 1; pathStep < currentPath.length; pathStep++) {

                // Grab current and previous activity keys
                let currentActivityKey = currentPath[pathStep].key;
                let currentActivityX = eventList.get(currentActivityKey).x;
                let currentyActivityY = eventList.get(currentActivityKey).y;

                let previousActivityKey = currentPath[pathStep - 1].key;
                let previousActivityX = eventList.get(previousActivityKey).x;
                let previousActivityY = eventList.get(previousActivityKey).y;

                let previousActivityType = currentPath[pathStep - 1].type;

                console.log(drawnPathItems);

                //Ensure we're not duplicating efforts, and if we are, move onto the next node
                if (drawnPathItems.has(currentActivityKey)) { 
                    console.log("Repeating a drawn activity, so skipping");
                    continue; 
                } else {
                    drawnPathItems.set(currentActivityKey, currentPath[pathStep]);
                }

                //Debug
                console.log ("Current Activity: " + currentActivityKey + " Previous Activity: " + previousActivityKey);

                if (previousActivityType == "Event") {
                    // Draw Elbow Connector between the two
                    connectorType = "straight";
                    let start = { "x": currentActivityX + shapeSize / 2 + shapePadding, "y": currentyActivityY + shapeSize / 2 };
                    let end = { "x": previousActivityX, "y": previousActivityY };
                    this.drawElbow(canvasContext, connectorType, start, end, connectorRadius, connectorColor, connectorWidth );
                    continue;
                } else if (previousActivityType == "Audience") {

                    //Debug
                    console.log("Drawing connector back to the Audience Trigger Event...");

                    // Draw Elbow Connector between the two
                    connectorType = "straight";
                    let start = { "x": currentActivityX + shapeSize / 2 + shapePadding, "y": currentyActivityY + shapeSize / 2 };
                    let end = { "x": previousActivityX, "y": previousActivityY };
                    this.drawElbow(canvasContext, connectorType, start, end, connectorRadius, connectorColor, connectorWidth );
                    continue;
                }

                if (currentBranchDown >= 1) {
                    // Draw Elbow Connector between the two
                    connectorType = "bottomLeft";
                    let start = { "x": currentActivityX + shapeSize / 2 + shapePadding, "y": currentyActivityY + shapeSize / 2 };
                    let end = { "x": previousActivityX, "y": previousActivityY + shapeSize / 2 };
                    this.drawElbow(canvasContext, connectorType, start, end, connectorRadius, connectorColor, connectorWidth );
                } else {
                    // Draw Elbow Connector between the two
                    connectorType = "straight";
                    let start = { "x": currentActivityX + shapeSize / 2, "y": currentyActivityY + shapeSize / 2};
                    let end = { "x": previousActivityX, "y": previousActivityY + shapeSize / 2 };
                    this.drawElbow(canvasContext, connectorType, start, end, connectorRadius, connectorColor, connectorWidth );
                }

                
            }
            currentBranchDown++;
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
            case "straight":
                ctx.lineTo(start.x, start.y);
                break;
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

    // Combobox for journey creation
    get options() {
        return [
            { label: this.journeyGuidTypeName, value: '1' },
            { label: this.journeyGuid2TypeName, value: '2' },
            { label: this.journeyGuid3TypeName, value: '3' },
        ];
    }

    // Combobox change event
    handleChange(event) {

        //Store Journey Type
        this.journeyType = event.detail.value;

        //Debug
        //console.log("Journey Type is " + this.journeyType);

        //Set GUID appropriately
        switch(Number(this.journeyType)) {
            case 1:
                this.journeyGuidToLoad = this.journeyGuid;
                //console.log("Journey Guid is set to " + this.journeyGuid);
                break;
            case 2:
                this.journeyGuidToLoad = this.journeyGuid2;
                //console.log("Journey Guid is set to " + this.journeyGuid2);
                break;
            case 3:
                this.journeyGuidToLoad = this.journeyGuid3;
                //console.log("Journey Guid is set to " + this.journeyGuid3);
                break;
        }

        //Debug
        //console.log('journeyGuidToLoad is set to ' + this.journeyGuidToLoad);
    }


    // Open the journey creation modal
    startCreateJourney() {
        this.creatingJourney = true;
    }

    // Close the journey creation modal
    stopCreateJourney() {
        this.creatingJourney = false;
    }

    // Create the desired journey
    createJourney() {
                
        //Draw the journey
        this.getJsonSpec();

        //Close Modal
        this.creatingJourney = false;

    }

    // Create the desired journey
    refreshJourney() {
            
        //Draw the journey
        this.getJsonSpec();

    }

}