function BLEScanner(deviceList){

  var noble = require('noble');
  var Device = require('./Device');

  var devices = {};

  function stateChangeHandler(state) {
    if (state === 'poweredOn') {
      noble.startScanning(['2220'], true); // don't allow duplicates
      console.log('scanning');
    } else {
      deviceRepo.clearAll();
      noble.stopScanning();
      console.log("stop scanning");
    }
  }


  function discoveryHandler(peripheral) {
    var device;
    var retryInterval;
    devices[peripheral.advertisement.localName] = {name: peripheral.advertisement.localName, rssi: peripheral.rssi, t: new Date()};
  }

  this.canISee = function(name){
	if(devices[name])
		if (new Date() - devices[name].t < 5000){
	 return devices[name];
		}
	 else
		return false;
  }
  this.start = function() {
    noble.on('stateChange', stateChangeHandler);
    noble.on('discover',    discoveryHandler);
  }
}

module.exports = BLEScanner;
