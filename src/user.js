/*
 * User.JS
 */

module.exports = class User{

    constructor(s){
        this.socket = s;
    }

    setRoom (id, name) {
        this.roomid = id.toString();
        this.roomname = name.toString();
        return true;
    }

    getRoom () { 
        return this.roomid;
    }

    getRoomName () { 
        return this.roomname;
    }

};