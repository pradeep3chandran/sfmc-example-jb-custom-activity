'use strict';

$(window).ready(onRender);

function onRender() {

    var mid = getUrlParameter('mid');

    var host = window.location.host;
    $('#connect').click(saveMC);
    $('#save').click(saveMC);

    fetch('getConfigData/?mid=' + mid, { method: 'GET' }).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })
        ).then(res => {
            let data = res.data;
            if (data) {
                $('#mid').val(data.MID);
                $('#clientid').val(data.Client_ID);
                $('#clientsecret').val(data.Client_Secret);
                $('#authuri').val(data.Auth_URI);
                $('#resturi').val(data.Rest_URI);
                $('#username').val(data.Username);
                $('#password').val(data.Password);
                $('#wausername').val(data.WhatsApp_Username);
                $('#wapassword').val(data.WhatsApp_Password);
                $('#webhookurl').val('https://' + host + '/modules/whatsapp-activity/inboundmessage?mid=' + $('#mid').val());
            }
        }));

}

async function saveMC() {
    var mid = $('#mid').val();

    var rowData = {
        MID: mid,
        Client_ID: $('#clientid').val(),
        Client_Secret: $('#clientsecret').val(),
        Auth_URI: $('#authuri').val(),
        Rest_URI: $('#resturi').val(),
        Username: $('#username').val(),
        Password: $('#password').val(),
        WhatsApp_Username: $('#wausername').val(),
        WhatsApp_Password: $('#wapassword').val()
    }



    const customHeaders = {
        "Content-Type": "application/json",
    }
    fetch('updateConfigData/', { method: 'POST', body: JSON.stringify(rowData), headers: customHeaders }).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })
        ));

}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};