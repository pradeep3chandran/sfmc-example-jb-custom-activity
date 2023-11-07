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
                data[0] = $('#clientid').val(data[indx].Client_ID);
                data[0] = $('#clientid').val(data[indx].Client_ID);
                data[0] = $('#clientsecret').val(data[indx].Client_Secret);
                data[0] = $('#authuri').val(data[indx].Auth_URI);
                data[0] = $('#resturi').val(data[indx].Rest_URI);
                data[0] = $('#username').val(data[indx].Username);
                data[0] = $('#password').val(data[indx].Password);

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
        Password: $('#password').val()
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