/* eslint-disable */

var roomName;
var roomId;

window.onload = function(){
    console.log('Me loaded!');

    var socket = io();
    var messages = $('#messages');
    

    socket.emit('get-sys-info');

    socket.on('sys-info', function (i) {
        console.log('System info recieved.');
        console.log(i);
    });
}