
function Temperature() {
  var led = 0;
  var DeviceRepository = require('./DeviceRepository');
  var ConnectionManager = require('./ConnectionManager');

  var deviceRepo = new DeviceRepository();
  var bluetoothConnection = new ConnectionManager(deviceRepo);

  bluetoothConnection.start();


  function exitHandler(options, err) {
    console.log('exiting test');
    deviceRepo.toAll(function(){
      this.disconnect();
    });
    process.exit();
  }



  function sendBuffer(){

    function readCallback(){
      return function(){
        var device = this;
        device.readBuffer(function(data){
          console.log("Current Temp with " + device.getName() + " is: " + data.readFloatLE(0) + "");
        });
      }
    }

    var cb = readCallback();
    deviceRepo.toAll(cb);


  }

  setInterval(sendBuffer, 5000);

  process.on('exit', exitHandler.bind(null,{cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


}

Temperature();
