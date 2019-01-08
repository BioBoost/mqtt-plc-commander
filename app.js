const net = require('net');
const mqtt = require('mqtt');

let port = 1234;
let plc = null;

let mqttClient = mqtt.connect('mqtt://127.0.0.1');

mqttClient.on('connect', function () {
  console.log("Connected to MQTT Broker")
  mqttClient.subscribe('test/plc/drive', function (err) {
    if (!err) {
      console.log("Successfully subscribed to drive topic");
    }
  })
});

// Start a TCP Server
net.createServer(function (socket) {
  console.log("PLC Client connected to server");
  plc = socket;

  socket.on('end', function () {
    console.log("PLC Client disconnected");
    plc = null;
  });

  socket.on('close', function() {
    console.log('Connection closed');
    plc = null;
  });
  
}).listen(port);

mqttClient.on('message', function (topic, message) {
  if (plc) {
    console.log("Receiving drive command from mqtt: " + message.toString());
    let data = new Buffer([0x10, -1, -2]);
    plc.write(data);
  } else {
    console.log("No plc connected");
  }
});

console.log("MQTT PLC Commander is listening on port " + port);