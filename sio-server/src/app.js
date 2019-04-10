var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var documents = {};

io.on("connection", socket => {
    console.log('connection');
    var previousId;
    var safeJoin = currentId => {
        console.log('connection');
      socket.leave(previousId);
      socket.join(currentId);
      previousId = currentId;
    };
  
    socket.on("getDoc", docId => {
        console.log('getDoc ' + docId);
      safeJoin(docId);
      socket.emit("document", documents[docId]);
    });
  
    socket.on("addDoc", doc => {
        console.log('addDoc ' + JSON.stringify(doc));
      documents[doc.id] = doc;
      safeJoin(doc.id);
      console.log('documents ' + JSON.stringify(Object.keys(documents)));
      io.emit("documents", Object.keys(documents));
      socket.emit("document", doc);
    });
  
    socket.on("editDoc", doc => {
        console.log('editDoc ' + doc);
      documents[doc.id] = doc;
      socket.to(doc.id).emit("document", doc);
    });
  
    io.emit("documents", Object.keys(documents));
  });

  console.log('started @' + process.env.port);
  http.listen(process.env.port);
