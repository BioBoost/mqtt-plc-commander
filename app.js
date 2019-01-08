const net = require('net');
let port = 1234;

// Start a TCP Server
net.createServer(function (socket) {
  console.log("PLC Client connected to server");

  let data = new Buffer([0x10, -1, -2]);
  socket.write(data);

  socket.on('end', function () {
    console.log("PLC Client disconnected");
  });

  socket.on('close', function() {
    console.log('Connection closed');
  });
  
}).listen(port);

console.log("MQTT PLC Commander is listening on port " + port);