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
 * Module loader is to include all modules into application with the correct
 * order satisfying their dependencies regardless of where they are defined.
 * Development versions tend to use separate files for each module. It is
 * advisable to put reference to external file when developing a plug-in keeping
 * other in place.
 * 
 * It also tests every module dependency including method checks and other
 * stuff. If such error is found before application is launched it is much
 * easier to debug.
 */
(function(ns, root, def) {
	if (typeof module !== 'undefined')
		module.exports = def(ns, root);
	else if (typeof define === 'function' && typeof define.amd === 'object')
		define(def);
	else
		root[ns] = def(ns, root);
})("JMF", this, function(ns,root) {
	
	var DEVEL_VERSION = true;
	
	/**
	 * JMFInstance logger.
	 */
	var Logger = (function() { 
		var levels = {
			"off" : 0,
			"fatal" : 1,
			"error" : 2,
			"warning" : 3,
			"info" : 4,
			"all" : 5
		}
		var logs = [];

		var defaultTag = "Unnamed log";
		var defaultLevel = levels["error"];
		var enforceLevel = false;
		var levelEnforced = defaultLevel;
		var tagDelimeter = ">";
		var lvlDelimeter = ">";

		var Log = function(tag, level) {
			this.tag = tag || defaultTag;
			this.level = level || defaultLevel;
		};
		Log.prototype.setLevel = function(level) {
			(typeof level == 'string') && (level = levels[level])
			this.level = level;
		};
		Log.prototype.log = function(level, msg) {
			var strLevel, numLevel;
			if (typeof level == 'string') {
				strLevel = level;
				numLevel = levels[strLevel];
			} else {
				strLevel = (function() {
					for (name in levels)
						if (levels[name] == level)
							return name;
				})();
			}
			if ((enforceLevel && (level < levelEnforced)) || this.level > level)
				return;

			console.log(level + lvlDelimeter + this.tag + tagDelimeter + msg);
		}

		return {
			createLog : function(tag, level) {
				var log = new Log(tag, level);
				logs.push(log);
				return log;
			},
			setDefaultLevel : function(level) {
				level && (defaultLevel = level);
			},
			enforceLevel : function(level) {
				enforceLevel = true;
				levelEnforced = level;
			},
			dropLevelEnforcement : function() {
				enforceLevel = false;
			}
		};
	})();
	
	if(DEVEL_VERSION) {
		Logger.setDefaultLevel("verbose");
		Logger.enforceLevel("all");
	}
	var log = Logger.createLog(ns);
	
	var Exception = (function(log) {
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
	})(log);
	
	var Util = (function(log) {

		var pureObj = {};
		var pureCtor = function() {};
		var slice = Array.prototype.slice;

		var hasOwnProperty = Object.prototype.hasOwnProperty;
		var nativeForEach = Array.prototype.forEach;
		var nativeKeys = Object.keys;
		var nativeBind = Function.prototype.bind;
		var nativeSome = Array.prototype.some;
		var nativeIndexOf = Array.prototype.indexOf;
		
		if (typeof (/./) !== 'function') {
			var isFunction = function(obj) {
				return typeof obj === 'function';
			}
		};
		
		var usedIds = 0;
		var generateUniqueId = function(prefix) {
			var id = ++usedIds + '';
			return prefix ? prefix + id : id;
		};
		
		var indexOf = function(s1, s2) {
			return (s1.length - s1.replace(new RegExp(s2,"g"), '').length) / s2.length;
		};

		var has = function(obj, prop) {
			return hasOwnProperty.call(obj, prop);
		};

		var keys = nativeKeys || function(obj) {
			if (obj !== Object(obj))
				throw new TypeError("Invalid object");
			var keys = [];
			for ( var key in obj) {
				if (has(obj, key))
					keys.push(key);
			}
			return keys;
		};

		var size = function(obj) {
			if (obj === null)
				return 0;
			return (obj.length === +obj.length) ? obj.length : keys(obj).length;
		};

		var bind = function(fn, context) {
			var args, bound;
			if (fn.bind === nativeBind && nativeBind)
				return nativeBind.apply(fn, slice.call(arguments, 1));
			if (!isFunction(fn))
				throw new TypeError;
			args = slice.call(arguments, 2);
			return bound = function() {
				if (!(this instanceof bound))
					return fn.apply(context, args.concat(slice.call(arguments)));
				ctor.prototype = fn.prototype;
				var self = new pureCtor;
				pureCtor.prototype = null;
				var result = fn.apply(self, args.concat(slice.call(arguments)));
				if (Object(result) === result)
					return result;
				return self;
			}
		};

		var each = function(obj, iterator, context) {
			if (obj === null)
				return;
			if (nativeForEach && obj.forEach === nativeForEach) {
				obj.forEach(iterator, context);
			} else if (obj.length === +obj.length) {
				for ( var i = 0; l = obj.length, i < l; i++) {
					if (iterator.call(context, obj[i], i, obj) === pureObj)
						return;
				}
			} else {
				for ( var key in obj) {
					if (has(obj, key)) {
						if (iterator.call(context, obj[key], key, obj) === pureObj)
							return;
					}
				}
			}
		};
		
		var requireScript = function(file, callback) {
			var filenode = document.createElement('script');
			filenode.src = file;
			 // IE
	        var alreadyIncluded = false;
	        filenode.onreadystatechange = function () {
	            if (filenode.readyState === 'loaded' || filenode.readyState === 'complete') {
	                filenode.onreadystatechange = null;
	                if(alreadyIncluded) return;
	                alreadyIncluded = true;
	                callback(filenode);
	            }
	        };
	        filenode.onload = function () {
	        	if(alreadyIncluded) return;
	        	alreadyIncluded = true;
	            callback(filenode);
	        };
	        document.head.appendChild(filenode);
		};
		
		var requireStylesheet = function(file, callback) {
			filenode = document.createElement('link');
	        filenode.rel = 'stylesheet';
	        filenode.type = 'text/css';
	        filenode.href = file;
	        document.head.appendChild(filenode);
	        callback(filenode);
		};
		
		var requireText = function(file, callback) {
			var resource = new XMLHttpRequest();
			resource.open("GET", file, true);
			resource.onreadystatechange = function () {
			      if (resource.readyState === 4) {  
			         if (resource.status === 200) {  
			        	 callback && callback(txtFile.responseText, true);  
			         } else callback && callback("", false);
			      }
			};
			resource.send(null);
		};
		
		/**
		 * Launches specified require function for every resource in the set.
		 * Calls callback every time new resource is loaded. If the last one
		 * is, the second paramter is set to true
		 */
		var requireAll = function(loader, resources, callback) {
			var index = 0;
			var count = size(resources);
				        
	        each(resources, function(value, key) {
	        	loader.call(this, value, function(result) {
	        		++index >= count ? callback(key, true, result) : callback(key, false, result);
	        	});
	        });	        
		};

		return {		
			requireScript : requireScript,
			requireStylesheet : requireStylesheet,
			requireText : requireText,
			requireAll : requireAll,
			size: size,
			generateUniqueId : generateUniqueId,
			each : each,
			bind : bind,
		};
	})();
	
	
	
	var JMF = root["ns"] = {};

	/**
	 * An implementation of the graph node. Some modules use it.
	 */
	var Node = (function() {
		var Node = function(name) {
			this.name = name;
			this.children = [];
			this.asLeaf = false;
		};
		Node.prototype.getName = function() {
			return this.name;
		};
		Node.prototype.setHandler = function(handler) {
			this.handler = handler;
		};
		Node.prototype.getHandler = function() {
			return this.handler;
		};
		Node.prototype.getObject = function() {
			return this.obj;
		};
		Node.prototype.setObject = function(obj) {
			this.obj = obj;
		};
		Node.prototype.setData = function(data) {
			this.data = data;
		};
		Node.prototype.getData = function() {
			return this.data;
		};
		Node.prototype.setAsLeaf = function(state) {
			this.asLeaf = state;
		};
		Node.prototype.isLeaf = function() {
			return this.asLeaf;
		};
		Node.prototype.remove = function() {
			var children = this.children;
			var parent = this.parent;
			for(var i = 0; i < children.length; i++) {
				children[i].parent = parent;
			}
			delete this;
		};
		Node.prototype.createChild = function(name) {
			var child = new Node(name);
			child.parent = this;
			child.handler = this.handler;
			this.children.push(child);
			return child;
		};
		Node.prototype.getParent = function() {
			return this.parent;
		};
		Node.prototype.findChildByName = function(name, leaf) {
			if (this.name === name)
				return this;
			else if(this.asLeaf && leaf) {
				return undefined;
			} else {
				for ( var result, i = 0; i < this.children.length; i++) {
					if ((result = this.children[i].findChildByName(name)) !== undefined) {
						return result;
					}
				}
				return undefined;
			}
		};
		Node.prototype.findParent = function(fn) {
			if (fn(this))
				return this;
			else
				return this.parent.findParent(fn);
		};
		Node.prototype.findChild = function(fn) {
			if (fn(this))
				return this;
			else {
				for ( var result, i = 0; i < this.children.length; i++) {
					if (result = this.children[i].findChild(fn)) {
						return result;
					}
				}
				return undefined;
			}
		};
		return Node;
	})();
	
	var unwrapModule = function(name, wrapper) {
		var module;
		if (wrapper instanceof Function) {
			module = wrapper(this);
		} else {
			module = wrapper;
		}

		if (module instanceof Object) {
			this[name] = module;
		}
	};
	
	var JMFInstance = function() {
		this["container"] = new Node("container");
		this["sources"] = new Node("sources");
		this["factories"] = new Node("factories");
	};
	
	var node = JMFInstance.prototype["Node"] = Node;
	var logger = JMFInstance.prototype["Logger"] = Logger;

	var unwrapModule = function(moduleName, moduleSource) {
		if(moduleSource instanceof Function) {
			var module = (moduleSource)(this);
			module && (this[moduleName] = module);
		} else {
			this[moduleName] = moduleSource;
		}
	};
	
	/**
	 * Use as an object container. All objects are assigned to the unique
	 * numeric id which can be used later on to refer to them.
	 */
	var create = JMFInstance.prototype["create"] = function(name, named, params) {
		log.log("debug", "Creating object " + name);

		var component;
		var success = false;
		try {
			var sourceComponent = this["sources"].findChildByName(name);
			var sourceFactory = sourceComponent.getHandler();

			var assignId = named ? name : Util.generateUniqueId();
			var componentNode = this["container"].createChild(assignId);			
			component = sourceFactory.create(sourceComponent, params, function(childName, obj, parentName) {
				(parentName ? componentNode.findChildByName(parentName) : componentNode)
					.createChild(childName)
					.setObject(obj);
			});			
			success = true;
		} catch (e) {
			log.log("error",
			"Fatal error in creation process: Missing resource.");
			log.log(e.stack);
		} finally {
			if (!success) {
				
			}
		}
		
		componentNode.setObject(component);	
		componentNode.setAsLeaf(true);
		return component;
	};

	/**
	 * Gets an object with a given name from the pool.
	 */
	var inject = JMFInstance.prototype["inject"] = function(id, as) {
		log.log("debug", "Injecting " + id);		
		var obj;
		if(id instanceof Object) {
			obj = this["container"].findChild(function(node) {
				return node.getObject() === id ? true : false;
			}).getParent().findChildByName(as, false);
		} else if(!(obj = this["container"].findChildByName(id))){
			return create.call(this, id, true);
		}
		
		return obj.getObject();
	};
	
	/**
	 * Removes an object from a object container meaning there is no way
	 * of further referencing this object and it will be collected when
	 * no other references are held.
	 */
	var remove = JMFInstance.prototype["remove"] = function(id, as) {
		log.log("debug", "Removing " + id);		
		if((obj = this["container"].findChildByName(id))) {
			obj.remove();
		}
	};

	/**
	 * Loads external file asynchroneously and includes it into the system if
	 * valid. Does not load or include modules that are already defined.
	 */
	var require = JMFInstance.prototype["require"] = function(moduleName, moduleUri, callback) {
		log.log("debug", "Loading module " + moduleName);
		if (this[moduleName]) {
			log.log("debug", "Module " + moduleName
					+ " has already been included. Skipping.");
			return;
		}
		var that = this;
		Util.requireScript(moduleUri, function() {
			unwrapModule.call(that, moduleName, root[moduleName]);
			callback && callback();
		});
	};

	/**
	 * Plugs the module in
	 */
	var include = JMFInstance.prototype["include"] = function(moduleName, moduleDefinition) {
		if (this[moduleName]) {
			log.log("debug", "Module " + moduleName
					+ " has already been included. Skipping.");
			return;
		}
		unwrapModule.call(this, moduleName, moduleDefinition);
		delete moduleDefinition;
	};

	/**
	 * Includes modules. Those modules must not be dependent over each other
	 * since the order they are declared in is not quaranteed to be respected.
	 */
	var includeAll = JMFInstance.prototype["includeAll"] = function(moduleDefinitions,
			callback, resourcePath) {
		if (moduleDefinitions.length < 1) {
			callback && callback();
			return;
		}

		var resourcePath = resourcePath || "./";
		var modulesToLoad = Util.size(moduleDefinitions);
		for (moduleName in moduleDefinitions) {
			if (this[moduleName])
				continue;
			if (typeof moduleDefinitions[moduleName] === "string") {
				require.call(this, moduleName, resourcePath
						+ moduleDefinitions[moduleName], Util.bind(function(
						moduleName) {
					log.log("verbose", "Loaded module " + moduleName
							+ ", to go: " + modulesToLoad);
					if (--modulesToLoad == 0) {
						callback && callback();
					}
				}, this, moduleName));
			} else {
				include.call(this, moduleName, moduleDefinitions[moduleName]);
				if (--modulesToLoad == 0)
					callback && callback();
			}
		}
	};

	/**
	 * Includes groups of modules. If a module is dependant over another module
	 * it should be declared in the group after it. All paths are relative to
	 * same path, if provided, or to global path.
	 */
	var includeEvery = JMFInstance.prototype["includeEvery"] = function(
			moduleDefinitionBlocks, callback, resourcePath) {
		if (moduleDefinitionBlocks.length < 1) {
			callback && callback();
			return;
		}
		if (moduleDefinitionBlocks instanceof Array) {
			var loadIndex = 0;
			var that = this;
			var loadRecursion = function(moduleBlocks, index) {
				includeAll.call(that, moduleBlocks[index], function() {
					log.log("Loading module block " + loadIndex + "/"
							+ moduleBlocks.length);
					if (moduleBlocks.length - 1 > index) {
						loadRecursion.call(that, moduleBlocks, index + 1);
					} else {
						log.log("All blocks have been loaded successfully");
						callback && callback();
					}
				}, resourcePath);
			};
			loadRecursion(moduleDefinitionBlocks, 0);
			log.log("All " + loadIndex - 1
					+ " blocks are being loaded one after another.");
		} else {
			includeAll.call(this, moduleDefinitionBlocks, function() {
				log.log("Loading single module block");
				log.log("All blocks have been loaded successfully");
				callback && callback();
			}, resourcePath);
		}
	};
	
	var loadScript = JMFInstance.prototype["loadScript"] = function(filePath, callback) {
		Util.requireScript(filePath, callback);
	};
	
	var loadAllScript = JMFInstance.prototype["loadAllScript"] = function(resources, callback) {
		Util.requireAll(Util.requireScript, resources, callback);
	};

	return {
		"createInstance" : function() {
			return new JMFInstance;
		},
		
		/* and static methods */
		loadScript : loadScript,
		loadAllScript : loadAllScript
	};
});