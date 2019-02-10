/* eslint-disable */

window.onload = function(){
    console.log('Me loaded!');

    var socket = io();
    var messages = $('#messages');

    socket.on('room-setup', function(messages, name){
        console.log('Setting up room '+name);
        document.getElementById('room').innerHTML = 'Topic: ' + name;
    });

    socket.on('test', function(){
        console.log('Test passed.');
    });

    socket.on('message-to-room', function (x) {
        messages.prepend('<li>' + x.username + ': ' + x.message + '</li>' );
    });

    socket.emit('get-page-info', window.location.pathname);

    $('form').submit(function (e) {
        e.preventDefault();
        
        socket.emit('message-from-user', {
            'username': $('#user-name').val(),
            'message': $('#user-message').val(),
        });

        $('#user-message').val('').focus();

        return false;
    });
}