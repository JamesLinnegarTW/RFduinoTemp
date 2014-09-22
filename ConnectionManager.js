function ConnectionManager(deviceRepo){

  var noble = require('noble');
  var Device = require('./Device');

  function stateChangeHandler(state) {
    if (state === 'poweredOn') {
      noble.startScanning(['2220']); // don't allow duplicates
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

    console.log('peripheral discovered (' + peripheral.uuid+ '):');
    console.log('\thello my local name is:');
    console.log('\t\t' + peripheral.advertisement.localName);

    if (peripheral.advertisement.localName == 'RFduino') {

      function connect() {
        console.log('connecting to ' + peripheral.advertisement.localName);
        peripheral.connect(function(error) {

          if (error) {
            console.log('failed to connect to the RFduino, error is ', error);
          }
        });
      };

      function connectionHandler(){
        clearInterval(retryInterval);
        console.log('connected to ' + peripheral.advertisement.localName);
        console.log('discovering services');
        peripheral.discoverServices(['2220']);
      }

      function disconnectHandler(){
        console.log('disconnected peripheral ' + peripheral.advertisement.localName);
        //deviceRepo.removeDevice(peripheral);
        if(!retryInterval)
          retryInterval = setInterval(connect, 15000);
      }

      function servicesHandler(services) {
        console.log('discovering characteristics');
        services[0].on('characteristicsDiscover', characteristicsHandler);
        services[0].discoverCharacteristics(['2221', '2222']);
      }

      function characteristicsHandler(characteristics){
        console.log('registering read handler');
        device.registerReadHandler(characteristics[0]);
        console.log('registering write handler');
        device.registerWriteHandler(characteristics[1])
      }

      peripheral.on('connect', connectionHandler);
      peripheral.on('disconnect', disconnectHandler);
      peripheral.on('servicesDiscover', servicesHandler);



      device = new Device(peripheral);

      device.registerDisconnectHandler(function(){
        peripheral.disconnect();
      });

      deviceRepo.add(device);
      connect();
    }
  }
  this.start = function() {
    noble.on('stateChange', stateChangeHandler);
    noble.on('discover',    discoveryHandler);
  }
}

module.exports = ConnectionManager;