'use strict';

$(window).ready(onRender);

function onRender() {
    console.log('render');

    $('#connect').click(saveMC);
    $('#save').click(saveMC);
}

async function saveMC() {
    var clientId = $('#clientid').val();

    var rowData = {
        MID: mid,
        Client_ID: $('#clientid').val(),
        Client_Secret: $('#clientsecret').val(),
        Auth_URI: $('#authuri').val(),
        Rest_URI: $('#resturi').val(),
        Username: $('#username').val(),
        Password: $('#password').val()
    }

    console.log('clientId', clientId);
    console.log('clientSecret', clientSecret);
    console.log('mid', mid);
    console.log('authURI', authURI);
    console.log('restURI', restURI);


    fetch('readfile/', { method: 'GET' }).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })
        ).then(res => {
            console.log('data', res.data);
            let data = res.data;
            let indx = data.findIndex(data => data.MID == mid);
            if (indx > -1) {
                data[indx] = rowData;
            } else {
                data.push(rowData);
            }
            const customHeaders = {
                "Content-Type": "application/json",
            }
            fetch('writefile/', { method: 'POST', body: JSON.stringify(data), headers: customHeaders }).then(response =>
                response.json().then(data => ({
                    data: data,
                    status: response.status
                })
                ))

        }));

}