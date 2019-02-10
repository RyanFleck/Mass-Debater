/* eslint-disable */

window.onload = function(){
    console.log('Me loaded!');

    var socket = io();

    socket.on('room-setup', function(messages, name){
        console.log('Setting up room '+name);
        document.getElementById('room').innerHTML = name;
    });


    socket.on('test', function(){
        console.log('Test passed.');
    });

    socket.emit('get-page-info', window.location.pathname);

    socket.emit('message-from-user', 'testuser', 'I have joined.')
}