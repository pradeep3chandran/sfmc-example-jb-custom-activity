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

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);
    connection.on('requestedSchema', function (data) {
        schema = data.schema;
        for (let i = 0; i < schema.length; i++) {

            let name = schema[i].name;

            $('#dataattributes').append(`<option value="${name}"> 
                                       ${name} 
                                  </option>`);

            if (schema[i].type == 'Phone') {
                $('#phonefield').append(`<option value="${name}"> 
                                       ${name} 
                                  </option>`);
            }
        }
        console.log('*** Schema1 ***', schema);
    });


    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestSchema');

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

        payload.name = name;

        payload['arguments'].execute.inArguments = [{ "message": '' }];

        payload['metaData'].isConfigured = true;

        console.log('payload: ', payload);


        connection.trigger('updateActivity', payload);
    }
});
