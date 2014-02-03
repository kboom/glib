//  Copyright 2014 Grzegorz Gurgul gurgul.grzegorz@gmail.com
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

/**
 * This augmentation makes an object able to register property
 * listeners on and notify each of them when a method is called.
 * It will be a setter most of a time. In order this to work,
 * each field change shall be done by the setter.
 * 
 * @Author Grzegorz Gurgul gurgul.grzegorz@gmail.com
 */
var ChangeSupport = {
	name : "ChangeSupport",
	onLoad : function() { },
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("ChangeSupport");
		var util = System["Util"];
		
		var sc = Clazz.prototype.getStaticContext();
		
		var registerChangeListener = function(target, listener) {
			log.log("info", "Registering listener on property " + target);
			var listenerList;
			this.targetListeners || (this.targetListeners = {});
			var listenerList = this.targetListeners[target] ? this.targetListeners[target] : this.targetListeners[target] = [];
			listenerList.push(listener);
			return listener;
		};
		
		var dismissChangeListener = function(target, listener) {
			log.log("info", "Dismissing listener on property " + target);
			var listenerList;
			this.targetListeners || (this.targetListeners = {});
			var listenerList = this.targetListeners[target];
			if(listenerList) {
				var index = listenerList.indexOf(listener);
				listenerList.splice(index, 1);
			}			
		};
		
		var fireChange = function(target) {
			this.targetListeners || (this.targetListeners = {});
			var listenerList = this.targetListeners[target] || (this.targetListeners[target] = []);
			for(var i = 0; i < listenerList.length; i++) {
				listenerList[i].apply(this, Array.prototype.slice.call(arguments,1));
			}	
		};
		
		return function() {
			this["registerChangeListener"] = registerChangeListener;
			this["dismissChangeListener"] = dismissChangeListener;
			this["fireChange"] = fireChange;
		};
	}
};