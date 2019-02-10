/* eslint-disable */

var roomName;
var roomId;

window.onload = function(){
    console.log('Me loaded!');

    var socket = io();
    var rooms = $('#rooms');
    

    socket.emit('get-sys-info');

    socket.on('sys-info', function (i) {
        console.log('System info recieved.');
        console.log(i);
        var k = Object.keys(i)
        var k_len = k.length;
        for (var x = 0; x < k.length; x++) { 
            rooms.prepend('<li><a href=\"'+k+'\">' + k + '</a>: ' + i[k] + '</li>');
        }
    });
}