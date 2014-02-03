var Timer = function(System) {
	var log = System["Logger"].createLog("Timer module");

	log.log("debug", "Preparing manager");
	
	var Timer = System["Timer"] = {};
	var waitingFor = "";
	var breaker = 100;
	var clock = 0;
	
	var stepForward = Timer["stepForward"] = function(name) {
		log.log("verbose", "Will wait for " + name);
		waitingFor += name + " ";
		clock++;
	};
	
	var stepBackward = Timer["stepBackward"] = function(name) {
		log.log("verbose", "No longer waiting for " + name);
		waitingFor = waitingFor.split(name).pop();
		clock--;
	};
	
	
	var wait = Timer["wait"] = function(callback) {
		console.log("clock: " + clock);
		if(clock > 0) setTimeout(function() {
			if(breaker-- < 1) {
				breaker = 100;
				log.log("warn","These actions are blocking the execution: " + waitingFor);
				return;
			} 
			wait(callback);
		}, 25);		
		else {
			callback && callback();
		}
	};
};