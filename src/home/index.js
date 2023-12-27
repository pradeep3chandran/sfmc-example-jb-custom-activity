'use strict';

$(window).ready(onRender);

function onRender() {

    var mid = getUrlParameter('mid');

    var host = window.location.host;
    $('#connect').click(function () {
        saveMC('connect');
    });
    $('#save').click(function () {
        saveMC('save');
    });

    $('#successToastClose').click(function () {
        $('#successToast').css('display', 'none');
    });

    $("#connect").mouseover(function () {
        $(this).css("background-color", "#2c2d6c");
    }).mouseout(function () {
        $(this).css("background-color", "#eb5c0b");
    });

    $("#save").mouseover(function () {
        $(this).css("background-color", "#2c2d6c");
    }).mouseout(function () {
        $(this).css("background-color", "#eb5c0b");
    });

    $(".mcrequired").each(function () {

        $('#' + this.id).change(function () {
            if (!this.value) {
                $('#' + this.id).css('border', '2px solid red');
                $('#' + this.id + 'Error').css('display', 'block');
            } else {
                $('#' + this.id).css('border', '');
                $('#' + this.id + 'Error').css('display', 'none');
            }
        })
    });

    $(".vfrequired").each(function () {

        $('#' + this.id).change(function () {
            if (!this.value) {
                $('#' + this.id).css('border', '2px solid red');
                $('#' + this.id + 'Error').css('display', 'block');
            } else {
                $('#' + this.id).css('border', '');
                $('#' + this.id + 'Error').css('display', 'none');
            }
        })
    });

    $('#helpButton').mouseover(function () {
        $('#help').css("display", "block");
    });

    $('#helpButton').mouseout(function () {
        $('#help').css("display", "none");
    });

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
            $('#spinner').css('display', 'none');
        }));

}

async function saveMC(buttonType) {

    $('#spinner').css('display', 'block');
    var mid = $('#mid').val();

    let isError = false;
    if (buttonType == 'connect') {
        $(".mcrequired").each(function () {
            if (!this.value) {
                isError = true;
                $('#' + this.id).css('border', '2px solid red');
                $('#' + this.id + 'Error').css('display', 'block');
            } else {
                $('#' + this.id).css('border', '');
                $('#' + this.id + 'Error').css('display', 'none');
            }
        });
    } else if (buttonType == 'save') {
        $(".vfrequired").each(function () {
            if (!this.value) {
                isError = true;
                $('#' + this.id).css('border', '2px solid red');
                $('#' + this.id + 'Error').css('display', 'block');
            } else {
                $('#' + this.id).css('border', '');
                $('#' + this.id + 'Error').css('display', 'none');
            }
        });
    }

    if (!isError) {

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
            ).then(res => {
                let data = res.data;
                if (data) {
                    $('#spinner').css('display', 'none');
                    if (buttonType == 'connect') {
                        $('#successToastMessage').html('Marketing Cloud Credentials connected successfully.');
                        $('#successToast').css('display', 'block');

                        setTimeout(function () {
                            $('#successToast').css('display', 'none');
                        }, 3000);
                    } else if (buttonType == 'save') {
                        $('#successToastMessage').html('SMS and WhatsApp Details saved successfully.');
                        $('#successToast').css('display', 'block');

                        setTimeout(function () {
                            $('#successToast').css('display', 'none');
                        }, 3000);
                    }
                }

            }));
    } else {
        $('#spinner').css('display', 'none');
    }

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