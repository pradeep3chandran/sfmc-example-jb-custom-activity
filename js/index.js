'use strict';

$(window).ready(onRender);

function onRender() {

    $('#clientid').change(function () {
        var value = $('#clientid').val();
        console.log('value: ', value);
    });
}