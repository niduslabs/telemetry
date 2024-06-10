const WebSocket = require('ws');
const uniqid = require('uniqid');
const https = require('https');

// Fill in your endpoint and token

const apiEndpoint = 'gcs.hybrid-xxxxxxxxxxx.herotech8-cloud.com'; // Fill in your hybrid server address here
const endpoint = 'wss://'+apiEndpoint+'/api/ws'; 
const token = ''; // Your generated API token (see usage guide)

console.log('endpoint: '+endpoint);

const droneSerialNumber = 'DR1X-XXXX-XXXX';

// Interact with the WebSocket API to launch the drone
const requestId = uniqid();

console.log('Connecting to WebSocket endpoint');

const ws = new WebSocket(endpoint, {
  rejectUnauthorized: false
});

ws.on('open', function open() {
  console.log('Connection opened to WebSocket');

  console.log('Sending identification message');

  ws.send(JSON.stringify({
    method: 'identify',
    token: token
  }));
});


const sTopic ={};
  sTopic['drone/'+droneSerialNumber+'/telemetry/gps/satellites'] = null;
  sTopic['drone/'+droneSerialNumber+'/telemetry/gps/level'] =  null;
  sTopic['drone/'+droneSerialNumber+'/telemetry/battery-cell/voltages'] =  null;
  sTopic['drone/'+droneSerialNumber+'/telemetry/battery/temperature'] =  null;
  sTopic['drone/'+droneSerialNumber+'/telemetry/go-home-assessment'] =  null;
  sTopic['drone/'+droneSerialNumber+'/telemetry/wind-warning'] =  null;
  sTopic['drone/'+droneSerialNumber+'/telemetry/diagnostics'] =  null;
  sTopic['drone/'+droneSerialNumber+'/telemetry/adsb'] =  null;
  sTopic['drone/'+droneSerialNumber+'/telemetry/gimbal-pitch'] =  null;
  sTopic['drone/'+droneSerialNumber+'/telemetry/speed'] =  null;
  sTopic['drone/'+droneSerialNumber+'/telemetry/signal/uplink'] =  null;
  sTopic['drone/'+droneSerialNumber+'/telemetry/signal/downlink'] =  null;
  sTopic['drone/'+droneSerialNumber+'/telemetry/flightOrientation'] =  null;
  sTopic['drone/'+droneSerialNumber+'/telemetry/compass/heading'] =  null;
  sTopic['drone/'+droneSerialNumber+'/telemetry/compass/hasError'] =  null;
  sTopic['drone/'+droneSerialNumber+'/hardwear/rc/battery'] =  null;



var i  = 0;
ws.on('message', function message(data) {
  if (data == 'Client Setup') {
    console.log('Client Setup');
    console.log('Subscribing to new telemetry');
    for (n in sTopic){
        ws.send(JSON.stringify({
            method: 'subscribe',
            topic: n
          }));      
    }
    console.log('Wait for the Data');
    ws.send(JSON.stringify({
      method: 'publish',
      topic: 'drone/' + droneSerialNumber + '/telemetry/signal/downlink/get',
      message: {
        drone: droneSerialNumber
      }
    }));
     ws.send(JSON.stringify({
      method: 'publish',
      topic: 'drone/' + droneSerialNumber + '/telemetry/signal/uplink/get',
      message: {
        drone: droneSerialNumber
      }
    }));
    return;
  }
  
  try {
    _data = JSON.parse(data);
  } catch(err) {
    console.log('Error parsing JSON data');
    return;
  }
  if (sTopic[_data.topic] ===null ){
    i++;
    try {
      _msg = JSON.parse(_data.message);
    }catch(err){
      _msg = _data.message;
    }
    sTopic[_data.topic] = _msg;
    console.log( JSON.stringify(sTopic,null,2));  
    console.log('number of topic received: ' +i+ ' out of '+Object.keys(sTopic).length);  
  }
});

setInterval(function() {}, 1000);
