function DeviceRespository(){
  var Devices = [];
  return {
    add: function(l){
      Devices.push(l);
    },
    toAll: function(callback){
      Devices.forEach(function(Device){
        callback.call(Device);
      });
    },
    removeDevice: function(peripheral){
      Devices.forEach(function(Device, index, array){
        if(Device._peripheral.uuid === peripheral.uuid){
          console.log('yo remove me');
          array.splice(index, 1);
        } else {
          console.log('nope');
        }
      });

    },
    clearAll: function(){
      Devices = [];
    }
  };
}

module.exports = DeviceRespository;