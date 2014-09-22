function Device(peripheral){
  this._peripheral = peripheral;
}


Device.prototype.getName = function(){
  return this._peripheral.advertisement.localName;
}

Device.prototype.getUUID = function(){
  return this._peripheral.uuid;
}


Device.prototype.writeBuffer = function(data){
  console.log('default buffer');
}

Device.prototype.readBuffer = function(callback){
  console.log('default');
}

Device.prototype.readCallback = function(data, isNotification){
  console.log('readcb', data, isNotification);
  return data;
}

Device.prototype.registerDisconnectHandler = function(handler){
  this.disconnect = handler;
}

Device.prototype.registerReadHandler = function(characteristic){

  this.readService = characteristic;
  this.readService.notify(true);

  this.readBuffer = function(callback){
    this.readService.read(function(error, data){
      callback(data);
    });
  }

  return this;
}


Device.prototype.registerWriteHandler = function(characteristic){
  this.writeService = characteristic;

  this.writeBuffer = function(data){
    this.writeService.write(data, true);
    return this;
  }
  return this;
}

Device.prototype.sleep = function(){

}


module.exports = Device;