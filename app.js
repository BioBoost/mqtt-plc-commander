const net = require('net');
const mqtt = require('mqtt');
var validate = require('jsonschema').validate;

const driveSchema = {
  "type": "object",
  "properties": {
    "x": {"type": "integer", "minimum": -128, "maximum": 127},
    "y": {"type": "integer", "minimum": -128, "maximum": 127}
  },
  "required": ["x", "y"]
};

let port = 1234;
let plc = null;
let driveTopic = 'test/plc/drive';
let driveCommand = 0x10;

let mqttClient = mqtt.connect('mqtt://127.0.0.1');

mqttClient.on('connect', function () {
  console.log("Connected to MQTT Broker")
  mqttClient.subscribe(driveTopic, function (err) {
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
    if (topic == driveTopic) {
      console.log("Receiving drive command from mqtt: " + message.toString());
      let data = JSON.parse(message.toString());
      if (validate(data, driveSchema).valid) {
        let buffer = new Buffer.from([driveCommand, data.x, data.y]);
        plc.write(buffer);
      } else {
        console.log("Received data was invalid");
      }
    }
  } else {
    console.log("No plc connected");
  }
});

console.log("MQTT PLC Commander is listening on port " + port);