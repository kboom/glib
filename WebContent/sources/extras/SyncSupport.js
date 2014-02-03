/**
 * Allows multiple objects perform synchronization over 
 * an object supporting events (EventSupport).
 * 
 * @Author 
 * Grzegorz Gurgul 
 * gurgul.grzegorz@gmail.com
 */
var SyncSupport = function(Module) {
	var util = Module["Util"];
	var log = Module["Logger"].createLog("SyncSupport module");

	log.log("verbose", "SyncSupport module is being loaded...");
	
	var SyncSupport = {
		stopListening: function(obj, name, callback) {
		      var listeners = this._listeners;
		      if (!listeners) return this;
		      var deleteListener = !name && !callback;
		      if (typeof name === 'object') callback = this;
		      if (obj) (listeners = {})[obj._listenerId] = obj;
		      for (var id in listeners) {
		        listeners[id].off(name, callback, this);
		        if (deleteListener) delete this._listeners[id];
		      }
		      return this;
	    }				
	};
	
	var listenMethods = { registerEvent: 'on', pushEvent : 'once'};
	  
	  util.each(listenMethods, function(implementation, method) {
		  SyncSupport[method] = function(obj, name, callback) {
	      var listeners = this._listeners || (this._listeners = {});
	      var id = obj._listenerId || (obj._listenerId = util.generateUniqueId('l'));
		  listeners[id] = obj;
		  if (typeof name === 'object') 
			  callback = this;			      
		  obj[implementation](name, callback, this);
		  return this;
		};
	  });
	
	return SyncSupport;
};