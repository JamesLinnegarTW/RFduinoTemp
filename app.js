
function App() {
  var ConnectionManager = require('./ConnectionManager');
  var LightRepository = require('./LightRepository');
 
  var BleScanner = require('./BLEScanner');
  var bleScan = new BleScanner();

  var lightRepo = new LightRepository();
  var bluetoothConnection = new ConnectionManager(lightRepo);

  bluetoothConnection.start();
  bleScan.start();

  setInterval(function(){
      sendBuffer(bleScan.canISee('RFduino'));
  }, 1000);



  function sendBuffer(state){

    var b = new Buffer(3);
    var red = 0,
        yellow = 05,
        green = 255;

if(state){

    b.writeUInt8(red, 0);
    b.writeUInt8(yellow, 1);
    b.writeUInt8(green, 2);
} else {
    b.writeUInt8(255, 0);
    b.writeUInt8(0, 1);
    b.writeUInt8(0, 2);
}

    function callback(buffer){
      return function sendToLight(){
        this.writeBuffer(buffer, true);
      }
    }

    var cb = callback(b);
    lightRepo.toAll(cb);

  }

  function exitHandler(options, err) {
    console.log('exiting');
    lightRepo.toAll(function(){
      this.disconnect();
    });
    process.exit();
  }

  process.on('exit', exitHandler.bind(null,{cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


}

App();
