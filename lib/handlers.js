// Request Handlers
let handlers = {};

handlers.ping = (data,callback) => {
    callback(200);
}

handlers.users = (data,callback) => {
    let acceptedMethods = ['get','post','put','delete'];

    if(acceptedMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data,callback);
    }else {
        callback(405);
    }
}

handlers._users.get = (data, callback) => {

}

handlers._users.put = (data, callback) => {

}

handlers._users.post = (data, callback) => {

}

handlers._users.delete = (data, callback) => {

}

// No Handler found
handlers.notFound = (data, callback) => {
    callback(404);
}

module.exports = handlers;