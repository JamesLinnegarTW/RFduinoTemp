
function App() {
  var BleScanner = require('./BLEScanner');
  var bleScan = new BleScanner();

  bleScan.start();

  setInterval(function(){
	console.log(bleScan.canISee('RFduino'));
  }, 1000);
  function exitHandler(options, err) {
    process.exit();
  }


//  process.on('exit', exitHandler.bind(null,{cleanup:true}));
 // process.on('SIGINT', exitHandler.bind(null, {exit:true}));
 // process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


}

App();
