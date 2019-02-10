/* eslint-disable */

window.onload = function(){
    console.log('Me loaded!');

    var socket = io();
    var room = document.getElementById('room');
    var messages = document.getElementById('messages');
    var userinput = document.getElementById('userinput');

    socket.on('room-setup', function(messages, name){
        console.log('Setting up room '+name);
        room.innerHTML = name;
    });

    socket.on('test', function(){
        console.log('Test passed.');
    });

    socket.on('message-to-client',function(username,message){
        messages.prepend('<li>'+username+': '+message+'</li>');
    });

    socket.emit('get-page-info', window.location.pathname);

    userinput.onsubmit(function(e){
        e.preventDefault();
        console.log('Sending message...');
        socket.emit('message-from-user', 'testuser', 'I have joined.');
        return false;
    });
}