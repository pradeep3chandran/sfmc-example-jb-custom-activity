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
    var configData = {};

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

            $('#dataattributes').append(`<option value="${name}"> 
                                       ${name} 
                                  </option>`);

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

        console.log($('.next-btn').css());
        console.log($('.modal-footer').css());
        $('.next-btn').css("background-color", "#eb5c0b");
        $('.next-btn').css("border", "1px #d1dfe4");
        $('.next-btn').css("color", "white");
        $('.next-btn').css("height", "35px");
        $('.next-btn').css("width", "100px");

        $('#done').hover(function () {
            $(this).css("background-color", "#2c2d6c");
        });

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

        $('#mid').change(function () {
            getConfigData();
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

    function getConfigData() {
        let mid = $('#mid').val();
        if (mid) {
            fetch('getConfigData?mid=' + mid, { method: 'GET' }).then(response =>
                response.json().then(data => ({
                    data: data,
                    status: response.status
                })
                ).then(res => {
                    console.log('data', res.data);
                    configData = res.data;
                }));
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
                $('#' + key).val(val);
            });
        });

        getConfigData();

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
            case 'step1':
                $('#step1').show();
                connection.trigger('updateButton', {
                    button: 'done',
                    text: 'done',
                    visible: true
                });
                break;
            case 'step2':
                save();
                break;
        }
    }

    function save() {

        console.log('save');
        let host = window.location.host;

        payload.name = 'Send VF SMS';

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
        payload['arguments'].execute.inArguments.push({ "configData": configData });
        payload['arguments'].execute.inArguments.push({ "host": host });

        let primaryKey = schema[schema.findIndex(obj => obj.isPrimaryKey)].key;
        payload['arguments'].execute.inArguments.push({ "primaryKey": '{{' + primaryKey + '}}' });

        payload['metaData'].isConfigured = true;

        console.log('payload: ', JSON.stringify(payload));


        connection.trigger('updateActivity', payload);
    }
});
