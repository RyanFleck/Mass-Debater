/* eslint-disable */

var roomName;
var roomId;

window.onload = function(){
    console.log('Me loaded!');

    var socket = io();
    var messages = $('#messages');
    

    socket.emit('get-page-info', window.location.pathname);

    socket.on('room-setup', function (messages, rname, rid) {
        roomName = rname;
        roomId = rid;
        console.log('Setting up room '+rname+'\nid: '+roomId);
        document.getElementById('room').innerHTML = 'Topic: ' + roomName;
    });

    socket.on('test', function(){
        console.log('Test passed.');
    });

    socket.on('message', function (m) { 
        console.log(m);
    });

    socket.on('message-to-room', function (x) {
        console.log('Recieved message\nu: '+x.username+'\nm: '+x.message)
        messages.prepend('<li>' + x.username + ': ' + x.message + '</li>' );
    });

    $('form').submit(function (e) {
        e.preventDefault();

        var u = $('#user-name').val();
        var p = $('#user-message').val();
        
        socket.emit('message-from-user', {
            'username': u,
            'message': p,
            'room': roomId
        });

        $('#user-message').val('').focus();
        return false;
    });
}