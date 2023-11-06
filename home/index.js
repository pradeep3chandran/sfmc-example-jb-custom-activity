'use strict';

$(window).ready(onRender);

function onRender() {
    console.log('render');

    $('#clientid').change(function () {
        var value = $('#clientid').val();
        console.log('value: ', value);
    });
}