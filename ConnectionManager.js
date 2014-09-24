function ConnectionManager(lightRepo){

  var noble = require('noble');
  var Light = require('./Light');

  function stateChangeHandler(state) {
    if (state === 'poweredOn') {
      noble.startScanning(['2220']); // don't allow duplicates
      console.log('scanning');
    } else {
      lightRepo.clearAll();
      noble.stopScanning();
      console.log("stop scanning");
    }
  }


  function discoveryHandler(peripheral) {
    var light;
    var retryInterval;


    if (peripheral.advertisement.localName == 'BuildLight') {

      function connect() {
	clearInterval(retryInterval);
        console.log('connecting to ' + peripheral.advertisement.localName);
        peripheral.connect(function(error) {

          if (error) {
            console.log('failed to connect to the RFduino, error is ', error);
          }
        });
      };

      function connectionHandler(){
        console.log('connected to ' + peripheral.advertisement.localName);
        console.log('discovering services');
        peripheral.discoverServices(['2220']);
      }

      function disconnectHandler(){
        console.log('disconnected peripheral ' + peripheral.advertisement.localName);
        lightRepo.removeLight(peripheral);
        retryInterval = setInterval(connect, 10000);
      }

      function servicesHandler(services) {
        console.log('discovering characteristics');
        services[0].on('characteristicsDiscover', characteristicsHandler);
        services[0].discoverCharacteristics(['2221', '2222']);
      }

      function characteristicsHandler(characteristics){
        console.log('registering read handler');
        light.registerReadHandler(characteristics[0]);
        console.log('registering write handler');
        light.registerWriteHandler(characteristics[1])
        console.log('sending reset');
        light.sendReset();
      }

      peripheral.on('connect', connectionHandler);
      peripheral.on('disconnect', disconnectHandler);
      peripheral.on('servicesDiscover', servicesHandler);



      light = new Light(peripheral);

      light.registerDisconnectHandler(function(){
        peripheral.disconnect();
      });

      lightRepo.add(light);
      connect();
    }
  }
  this.start = function() {
    noble.on('stateChange', stateChangeHandler);
    noble.on('discover',    discoveryHandler);
  }
}

module.exports = ConnectionManager;
