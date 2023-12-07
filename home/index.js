'use strict';

$(window).ready(onRender);

function onRender() {
    console.log('render');

    let cookies = document.cookie;
    console.log('cookies', cookies);

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
                $('#mid').val(data[0].MID);
                $('#clientid').val(data[0].Client_ID);
                $('#clientsecret').val(data[0].Client_Secret);
                $('#authuri').val(data[0].Auth_URI);
                $('#resturi').val(data[0].Rest_URI);
                $('#username').val(data[0].Username);
                $('#password').val(data[0].Password);
                $('#wausername').val(data[0].WhatsApp_Username);
                $('#wapassword').val(data[0].WhatsApp_Password);
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