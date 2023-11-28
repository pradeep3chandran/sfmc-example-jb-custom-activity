define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;
    var steps = [ // initialize to the same value as what's set in config.json for consistency
        { "label": "Marketing Cloud Connection Setup", "key": "step2" },
        { "label": "SMS Connection Setup", "key": "step1" },
        { "label": "Personalize Message", "key": "step3" }
    ];
    var currentStep = steps[0].key;
    var schema = [];
    var eventData = {};
    var templateData = [];
    var fieldText = '';
    var templateId = '';

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);
    connection.on('requestedTriggerEventDefinition', function (data) {
        console.log('event def', data);
        eventData = data;
    })
    connection.on('requestedSchema', function (data) {
        schema = data.schema;
        for (let i = 0; i < schema.length; i++) {

            let name = schema[i].name;
            let key = schema[i].key;

            fieldText += `<option value="${name}"> ${name}</option>`;

            if (schema[i].type == 'Phone') {
                $('#toNumber').append(`<option value="${key}"> 
                                       ${name} 
                                  </option>`);
            }
            /*let val = $('#message').val();
            val = val.includes(schema[i].key) ? val.replace(schema[i].key, schema[i].name) : val;
            $('#message').val(val);*/
        }
        console.log('*** Schema1 ***', schema);
    });


    function onRender() {


        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestSchema');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestTriggerEventDefinition');

        $('#dataattributes').change(function () {
            var value = $('#dataattributes').find('option:selected').attr('value');
            console.log('value: ', value);
            var messageBody = $('#message').val();
            console.log('message2: ', messageBody);
            $('#message').val(messageBody + '{{' + value + '}}');
            var messageBody1 = $('#message').val();
            console.log('message3: ', messageBody1);
            //$('#message').html(message);
        });

        $('#templateId').change(function () {
            templateId = $('#templateId').find('option:selected').attr('value');
            console.log('templateIdchange1: ', templateId);
            templateUpdate();
        });

        $('#done').click(save);

        // Toggle step 4 active/inactive
        // If inactive, wizard hides it and skips over it during navigation
        $('#toggleLastStep').click(function () {
            lastStepEnabled = !lastStepEnabled; // toggle status
            steps[3].active = !steps[3].active; // toggle active

            connection.trigger('updateSteps', steps);
        });

    }

    function templateUpdate() {
        console.log('templateIdchange: ', templateId);
        let indx = templateData.findIndex(obj => obj.templateid == templateId);

        let template = templateData[indx];
        console.log('template ', template);
        let bodyIndex = template.whatsappcomponents.findIndex(obj => obj.type == 'BODY');
        let bodyText = template.whatsappcomponents[bodyIndex].text;
        console.log('bodyText ', bodyText);

        let searchtext = bodyText.split('{{');
        console.log('searchtext: ', searchtext);
        let fieldsBody = '';
        $('#bodyContainer').html('');
        if (searchtext.length > 1) {
            for (let i = 0; i < searchtext.length - 1; i++) {
                console.log('fieldText ', fieldText);
                fieldsBody += '<br /><br /><label for="dataattributes">Field ' + (i + 1) + '</label><br /><select name="dataattributes" class="bodyfield" id="bodyfield' + (i + 1) + '"><option value="" selected>Select to add Merge fields...</option>' + fieldText + '</select>';
            }
        }

        $('#bodyContainer').append('<br /><br /><label for="message">Body Message</label><br /><textarea id="message" readonly disabled>' + bodyText + '</textarea>' + fieldsBody);

        let headerIndex = template.whatsappcomponents.findIndex(obj => obj.type == 'HEADER');
        $('#headerContainer').html('');
        if (headerIndex != -1) {
            let format = template.whatsappcomponents[headerIndex].format;
            if (format == 'TEXT') {
                let headertext = template.whatsappcomponents[headerIndex].text;
                let headerSearchtext = headertext.split('{{');
                let hedFieldsBody = '';
                if (headerSearchtext.length > 1) {
                    for (let i = 0; i < headerSearchtext.length - 1; i++) {
                        hedFieldsBody += '<br /><br /><label for="dataattributes">Header Field ' + (i + 1) + '</label><br /><select class="headerfield" name="dataattributes" id="headerfield' + (i + 1) + '"><option value="" selected>Select to add Merge fields...</option>' + fieldText + '</select>';
                    }
                }
                $('#headerContainer').append('<br /><br /><label for="message">Header Message</label><br /><textarea id="message" readonly disabled>' + headertext + '</textarea>' + hedFieldsBody);
            } else {
                $('#headerContainer').append('<br /><br /><label for="message">' + format + ' URL</label><br /><input type="text" id="headerDocURL" />');
            }
        }

        let footerIndex = template.whatsappcomponents.findIndex(obj => obj.type == 'FOOTER');
        $('#footerContainer').html('');
        if (footerIndex != -1) {

            let footertext = template.whatsappcomponents[footerIndex].text;
            let footerSearchtext = footertext.split('{{');
            let footFieldsBody = '';
            if (footerSearchtext.length > 1) {
                for (let i = 0; i < footerSearchtext.length - 1; i++) {
                    footFieldsBody += '<br /><br /><label for="dataattributes">Footer Field ' + (i + 1) + '</label><br /><select name="dataattributes" id="dataattributes"><option value="" selected>Select to add Merge fields...</option>' + fieldText + '</select>';
                }
            }
            $('#footerContainer').append('<br /><br /><label for="message">Footer Message</label><br /><textarea id="message" readonly disabled>' + footertext + '</textarea>' + footFieldsBody);
        }

        let buttonIndex = template.whatsappcomponents.findIndex(obj => obj.type == 'BUTTONS');
        $('#buttonContainer').html('');
        console.log(buttonIndex);
        if (buttonIndex != -1) {

            let buttons = template.whatsappcomponents[buttonIndex].buttons;
            console.log('buttons ', buttons);
            let buttonHtmlBody = '';
            for (let i = 0; i < buttons.length; i++) {
                console.log('buttons ', buttons[i]);
                buttonHtmlBody += '<br /><br /><div style="font-size: 18px;font-weight: BOLD;">Button ' + (i + 1) + ' Info </div><br /><label for="message">Button Type</label><br /><input type="text" id="buttonType" value="' + buttons[i].type + '" readonly disabled />';
                buttonHtmlBody += '<br /><div style="padding-top:10px;"><label for="message">Button Label</label><br /><input type="text" id="buttonType" value="' + buttons[i].text + '" readonly disabled /></div>';
                if (buttons[i].type != 'QUICK_REPLY') {
                    let value = buttons[i][buttons[i].type.toLowerCase()];
                    buttonHtmlBody += '<div style="padding-top:10px;"><label for="message">Button Value</label><br /><input type="text" id="buttonType" value="' + value + '" readonly disabled /></div>';

                    let buttonSearchText = value.split('{{');
                    let buttonFldBody = '';
                    if (buttonSearchText.length > 1) {
                        for (let i = 0; i < buttonSearchText.length - 1; i++) {
                            buttonFldBody += '<br /><label for="dataattributes">Button Field ' + (i + 1) + '</label><br /><select name="dataattributes" id="dataattributes"><option value="" selected>Select to add Merge fields...</option>' + fieldText + '</select>';
                        }
                    }
                    buttonHtmlBody += buttonFldBody;
                }
            }
            $('#buttonContainer').append(buttonHtmlBody);
        }
    }

    function initialize(data) {

        if (data) {
            payload = data;
        }

        var message;
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        console.log('payload ', JSON.parse(JSON.stringify(payload)));

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {

                console.log('inArgument ', key, val);
                console.log('inputarg ', $('#' + key));
                $('#' + key).val(val);
                if (key == 'templateId') {
                    templateId = val;
                }
            });
        });

        fetch('gettemplates/', { method: 'GET' }).then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })
            ).then(res => {
                console.log('data', res.data);
                let resdata = res.data;
                console.log('resdata ', resdata);
                templateData = resdata.templatedata.data;
                console.log('templateData ', templateData);
                for (let i = 0; i < templateData.length; i++) {

                    let name = templateData[i].templatename;
                    let key = templateData[i].templateid;

                    $('#templateId').append(`<option value="${key}"> 
                                               ${name} 
                                          </option>`);
                }
                $('#templateId').val(templateId);
                templateUpdate();
            }));

        // If there is no message selected, disable the next button
    }

    function onGetTokens(tokens) {
        //Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        console.log(tokens);
    }

    function onGetEndpoints(endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log(endpoints);
    }

    function onClickedNext() {
        if
            (currentStep.key === 'step1'
        ) {
            save();
        } else {
            connection.trigger('nextStep');
        }
    }

    function onClickedBack() {
        connection.trigger('prevStep');
    }

    function onGotoStep(step) {
        showStep(step);
        connection.trigger('ready');
    }

    function showStep(step, stepIndex) {
        if (stepIndex && !step) {
            step = steps[stepIndex - 1];
        }

        currentStep = step;

        $('.step').hide();

        switch (currentStep.key) {
            /*case 'step1':
                $('#step1').show();
                connection.trigger('updateButton', {
                    button: 'next',
                    enabled: Boolean(getMessage())
                });
                connection.trigger('updateButton', {
                    button: 'back',
                    visible: false
                });
                break;
            case 'step2':
                $('#step2').show();
                connection.trigger('updateButton', {
                    button: 'back',
                    visible: true
                });
                connection.trigger('updateButton', {
                    button: 'next',
                    text: 'next',
                    visible: true
                });
                break;
            case 'step3':
                $('#step3').show();
                connection.trigger('updateButton', {
                    button: 'back',
                    visible: true
                });
                if (lastStepEnabled) {
                    connection.trigger('updateButton', {
                        button: 'next',
                        text: 'next',
                        visible: true
                    });
                } else {
                    connection.trigger('updateButton', {
                        button: 'next',
                        text: 'done',
                        visible: true
                    });
                }
                break;*/
            case 'step1':
                $('#step1').show();
                connection.trigger('updateButton', {
                    button: 'done',
                    text: 'done',
                    visible: true
                });
                break;
            case 'step2': // Only 2 steps, so the equivalent of 'done' - send off the payload
                save();
                break;
        }
    }

    function save() {

        // 'payload' is initialized on 'initActivity' above.
        // Journey Builder sends an initial payload with defaults
        // set by this activity's config.json file.  Any property
        // may be overridden as desired.
        console.log('save');

        let headerFields = $('#headerField');
        let bodyFields = $('#bodyfield');

        if (headerFields) {
            for (let obj of headerFields) {
                console.log(obj.find('option:selected').attr('value'));
            }
        }

        if (bodyFields) {
            for (let obj of bodyFields) {
                console.log(obj.find('option:selected').attr('value'));
            }
        }

        payload.name = 'WhatsApp Activity';


        payload['arguments'].execute.inArguments = [];
        payload['arguments'].execute.inArguments.push({ "toNumber": '{{' + $('#toNumber').find('option:selected').attr('value') + '}}' });
        payload['arguments'].execute.inArguments.push({ "mid": $('#mid').val() });
        payload['arguments'].execute.inArguments.push({ "senderName": $('#senderName').val() });
        payload['arguments'].execute.inArguments.push({ "campaignName": eventData.name });
        payload['arguments'].execute.inArguments.push({ "templateId": $('#templateId').find('option:selected').attr('value') });

        let primaryKey = schema[schema.findIndex(obj => obj.isPrimaryKey)].key;
        payload['arguments'].execute.inArguments.push({ "primaryKey": '{{' + primaryKey + '}}' });

        payload['metaData'].isConfigured = true;

        console.log('payload: ', JSON.stringify(payload));


        connection.trigger('updateActivity', payload);
    }
});
