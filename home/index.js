'use strict';

$(window).ready(onRender);

function onRender() {
    console.log('render');

    var host = window.location.host;
    console.log('host: ', host);
    $('#webhookurl').val('https://' + host + '/modules/whatsapp-activity/inboundmessage');

    $('#connect').click(saveMC);
    $('#save').click(saveMC);

    fetch('getFileDetail/', { method: 'GET' }).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })
        ).then(res => {
            console.log('data', res.data);
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
                //$('#fromnumber').val(data[0].WhatsApp_From_Number);
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
        WhatsApp_Password: $('#wapassword').val(),
        //WhatsApp_From_Number: $('#fromnumber').val(),
    }



    const customHeaders = {
        "Content-Type": "application/json",
    }
    fetch('writefile/', { method: 'POST', body: JSON.stringify(rowData), headers: customHeaders }).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })
        ));

}