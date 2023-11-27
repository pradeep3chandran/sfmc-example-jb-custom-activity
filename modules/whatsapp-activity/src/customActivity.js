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
            let val = $('#message').val();
            val = val.includes(schema[i].key) ? val.replace(schema[i].key, schema[i].name) : val;
            $('#message').val(val);
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

                    $('#template').append(`<option value="${key}"> 
                                               ${name} 
                                          </option>`);
                }
            }));

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

        $('#template').change(function () {
            var value = $('#template').find('option:selected').attr('value');
            console.log('value: ', value);
            let indx = templateData.findIndex(obj => obj.templateid == value);

            $('#message').val(templateData[indx].templatetext);
            var messageBody = $('#message').val();
            console.log('message2: ', messageBody);
            var searchtext = messageBody.split('.*');
            console.log('searchtext: ', searchtext);

            for (let i = 0; i < searchtext.length - 1; i++) {
                console.log('fieldText ', fieldText);
                $("#fields").append('<br /><br /><label for="dataattributes">Field ' + (i + 1) + '</label><br /><select name="dataattributes" id="dataattributes"><option value="" selected>Select to add Merge fields...</option>' + fieldText + '</select>');
            }
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
                $('#' + key).val(val);
            });
        });

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

        payload.name = 'WhatsApp Activity';

        var message = $('#message').val();

        for (let i = 0; i < schema.length; i++) {
            message = message.includes(schema[i].name) ? message.replace(schema[i].name, schema[i].key) : message;
        }

        payload['arguments'].execute.inArguments = [];
        payload['arguments'].execute.inArguments.push({ "message": message });
        payload['arguments'].execute.inArguments.push({ "toNumber": '{{' + $('#toNumber').find('option:selected').attr('value') + '}}' });
        payload['arguments'].execute.inArguments.push({ "mid": $('#mid').val() });
        payload['arguments'].execute.inArguments.push({ "senderName": $('#senderName').val() });
        payload['arguments'].execute.inArguments.push({ "campaignName": eventData.name });

        let primaryKey = schema[schema.findIndex(obj => obj.isPrimaryKey)].key;
        payload['arguments'].execute.inArguments.push({ "primaryKey": '{{' + primaryKey + '}}' });

        payload['metaData'].isConfigured = true;

        console.log('payload: ', JSON.stringify(payload));


        connection.trigger('updateActivity', payload);
    }
});
