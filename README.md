# MQTT PLC Commander

Command the Tilt Table from MQTT.

## Whos Who

This script acts as a TCP server for the PLC. Commands received on MQTT are channeled to the PLC.

## Available commands

### Driving the Tilt table

Send the following json message to the `test/plc/drive` topic to drive the tilt table:

```json
{
  "x": 12,
  "y": 22
}
```

`x` and `y` are both limited to the range `[-128, 127]`.