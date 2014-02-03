/**
 * Basic exception mechanism used inside application.
 * 
 */
var Exception = function(System) {
	var util = System["util"];
	var log = System["Logger"].createLog("Exception module");
	
	var MISSING_RESOURCE = "MISSING_RESOURCE";
	var WRONG_ARGUMENT = "WRONG_ARGUMENT";
		
	var BaseException = function(name, message) {
		this.name = name;
		this.message = message;
	};
	BaseException.prototype = new Error();
	BaseException.prototype.constructor = BaseException;
	
	var ExceptionSet = {};	
	
	ExceptionSet[MISSING_RESOURCE] = function(message) {
		return new BaseException(MISSING_RESOURCE, 
				"Resource " + message + " could not be found");
	};
	
	ExceptionSet[WRONG_ARGUMENT] = function(message) {
		return new BaseException(WRONG_ARGUMENT,
				"Argument " + message + " is not a valid one for this function.");
	};
	
	return ExceptionSet; 
};