(function(ns, root, def) {
	if (typeof module !== 'undefined')
		module.exports = def(ns, root, $);
	else if (typeof define === 'function' && typeof define.amd === 'object')
		define(def);
	else
		root[ns] = def(ns, root, JMF, $);
})("JVC", this, function(ns, root, JMF, $) {
	
	var DEVEL_VERSION = true;
	
	var path = "/JVC/sources/";
	
	var Exception = (function() {
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
	})();
	
	var Util = (function() {

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

		var splitString = function(str, delim) {
			return str.split(delim);
		};
		
		var getSuffix = function(name) {
			var hierarchy = splitString(name,":");
			return hierarchy[hierarchy.length - 1];
		};
		
		var getPrefix = function(name) {
			var hierarchy = splitString(name,":");
			if(hierarchy.length > 1)
				return hierarchy[hierarchy.length - 2];
			else 
				return "";
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

		var any = function(obj, iterator, context) {
			iterator || (iterator = _.identity);
			var result = false;
			if (obj == null)
				return result;
			if (nativeSome && obj.some === nativeSome)
				return obj.some(iterator, context);
			each(obj,
					function(value, index, list) {
						if (result
								|| (result = iterator.call(context, value, index,
										list)))
							return pureObj;
					});
			return !!result;
		};

		var findValue = function(obj, iterator, context) {
			var result;
			any(obj, function(value, index, list) {
				if (iterator.call(context, value, index, list)) {
					result = value;
					return true;
				}
			});
			return result;
		};

		var containsValue = function(obj, target) {
			if (obj == null)
				return false;
			if (nativeIndexOf && obj.indexOf === nativeIndexOf)
				return obj.indexOf(target) != -1;
			return any(obj, function(value) {
				return value === target;
			});
		};

		var findKey = function(array, obj) {
			if (!(array && obj))
				return false;
			if (nativeIndexOf && obj.indexOf === nativeIndexOf)
				return obj.indexOf(array);
			for (key in array) {
				if (obj === array[item])
					return key;
			}
			;
			return -1;
		};

		var listProperties = function(obj) {
			var list = "";
			var delimeter = ",";
			var keylist = keys(obj);
			var size = keylist.length;
			for ( var i = 0; i < size; i++) {
				list += keylist[i];
				if (i < size - 1)
					list += delimeter;
			}
			return list;
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

		var addAll = function(dest, src, iterator, context) {
			if (!(dest && src))
				return false;
			var added;
			each(src, function(key) {
				if ((added = !dest[key]) && (dest[key] = src[key])) {
					iterator && iterator.call(context || this, src[key], key, added);
				}
			}, context || this);
			return true;
		};

		var removeAll = function(dest, src, iterator, context) {
			if (!(dest && src))
				return false;
			var removed, index;
			each(src, function(key) {
				(index = tellPosition(dest, src[key])) > 0 ? dest[index].remove()
						: removed = false;
				iterator.call(context || this, src[key], key, removed);
				removed = true;
			}, context || this);
			return true;
		};

		var augment = function(obj) {
			if (!obj)
				throw "Cannot augment undefined object!";
			sources = slice.call(arguments, 1);
			each(sources, function(item) {
				for (property in item) {
					if (!has(obj, property)) {
						obj[property] = item[property];
					}
				}
			});

			return obj;
		};
		
		var clone = function(obj) {
		    if(obj == null || typeof(obj) != 'object')
		        return obj;

		    var temp = obj.constructor();

		    for(var key in obj)
		        temp[key] = clone(obj[key]);
		    return temp;
		};
		
		var delay = function(conditionFn, delayedFn, accuracy) {
			return fn() ? (true && delayedFn()) : setTimeout(function() {
				return waitUntil(conditionFn, delayedFn, accuracy);
			}, accuracy);	
		};		

		return {		
			/*requireFiles : requireFiles,
			require : require,*/
			delay : delay,
			has : has,			
			any : any,
			clone: clone,
			augment : augment,
			size: size,
			getPrefix : getPrefix,
			getSuffix : getSuffix,
			generateUniqueId : generateUniqueId,
			findKey : findKey,
			findValue : findValue,
			containsValue : containsValue,
			listProperties : listProperties,
			addAll : addAll,
			removeAll : removeAll,		
			each : each,
			bind : bind,				
			slice : slice,
			hasOwnProperty : hasOwnProperty
		};
	})();
	
	/**
	 * Framework
	 */
	return (function() {
		
		
		var System = JMF.createInstance();
		
		var Logger = System["Logger"];
		
		if(DEVEL_VERSION) {
			Logger.setDefaultLevel("verbose");
			Logger.enforceLevel("all");
		}
		
		var log = Logger.createLog("JVC");
		
		
		/**
		 * Public methods usable within global context after application is
		 * constructed.
		 */
		var API = {
				"create" : Util.bind(System["create"], System),
	 			"inject" : Util.bind(System["inject"], System)
		};
		
		System.includeAll({
			/**
			 * Include required modules.
			 */
			"Logger" : Logger,
			"Util" : Util,
			"Exception" : Exception				
		});
							
		/**
		 * A configuration factory. It is set of builders operating on some part
		 * of configuration object. Any builder does not know what the other
		 * does.
		 */	
		return (function() {
			
			/**
			 * Each function name should reflect configuration field name what
			 * it populates.
			 */
			var MODEL_TEMPLATE = "getModelBuilder";
			var CONTROLLER_TEMPLATE = "getControllerBuilder";		
			var VIEW_TEMPLATE = "getViewBuilder";
			var ROOT_PATH = "setRootPath";
			
			/**
			 * Main builder for entire application. All other builders work on
			 * behalf of this one without knowing it. It gathers configuration
			 * from all of them automatically.
			 */
			var builder = {};
			
			/**
			 * There can be multiple configs being loaded asynchroneusly.
			 */
			var loadCounter = 0;
			
			/**
			 * Configuration structure. All hosted builders populate its
			 * branches.
			 */
			var mainConfig = (function() {			
				/* local */
				
				/* remote */
				this[MODEL_TEMPLATE] = {};
				this[CONTROLLER_TEMPLATE] = {};			
				this[VIEW_TEMPLATE] = {};
				
				this[ROOT_PATH] = "";
				
				/* fixed */
				return this;
			}).call({});
			
			/**
			 * This gets invoked everytime a new config is being applied. Builders
			 * use this to load configs from file.
			 */
			var apply = function(config, fileName) {
				var that = this;
				function callback(config) {
					if(!config) throw new Exception["MissingResource"]("Could not load file");
					config.onLoad && config.onLoad();
					that(config);
				}
				
				if(typeof(config) === "string" && config[0] === "@") {
					/* extract it first */
					var path = mainConfig[ROOT_PATH] + config.slice(1);
					System["Timer"].stepForward(fileName);
					System.loadScript(path, function() {
						callback(root[fileName]);
						System["Timer"].stepBackward(fileName);
					});
				} else callback(config);
			};
			
			var applyAll = function(config, callback) {
				var that = this;
				Util.each(config, function(item, name) {
					that[name](item);
				});				
			};
			
			builder.loadConfig = function(config) {
				applyAll.call(builder, config);
			};
			
			builder.getConfig = function() {
				return mainConfig;
			};
			
			/**
			 * Sets absolute path used for resolving each resource.
			 */
			builder[ROOT_PATH] = function(config, callback) {
				config && apply.call(function(config) {
					mainConfig[ROOT_PATH] = config;
					callback && callback();
				}, config, ROOT_PATH);
			};

			/**
			 * Delegates model template configuration to a specialized builder.
			 */
			var ModelTemplateBuilder;
			builder[MODEL_TEMPLATE] = function(config, callback) {
				if(!ModelTemplateBuilder) {
					var configSlot = mainConfig[MODEL_TEMPLATE];
					ModelTemplateBuilder = System["ModelTemplate"].getBuilder(configSlot, apply);
				}
				config && applyAll.call(ModelTemplateBuilder, config, callback);
				return ModelTemplateBuilder;
			};
			
			/**
			 * Delegates view template configuration to a specialized builder.
			 */
			var ViewTemplateBuilder;
			builder[VIEW_TEMPLATE] = function(config, callback) {
				if(!ViewTemplateBuilder) {
					var configSlot = mainConfig[VIEW_TEMPLATE];
					ViewTemplateBuilder = System["ViewTemplate"].getBuilder(configSlot, apply);
				}
				config && applyAll.call(ViewTemplateBuilder, config, callback);				
				return ViewTemplateBuilder;
			};		
			
			/**
			 * Delegates controller template configuration to a specialized
			 * builder.
			 */
			var ControllerTemplateBuilder;
			builder[CONTROLLER_TEMPLATE] = function(config, callback) {
				if(!ControllerTemplateBuilder) {
					var configSlot = mainConfig[CONTROLLER_TEMPLATE];
					ControllerTemplateBuilder = System["ControllerTemplate"].getBuilder(configSlot, apply);
				}
				config && applyAll.call(ControllerTemplateBuilder, config, callback);
				return ControllerTemplateBuilder;
			};	
			
			return {
				"plugIn" : function(name, component, callback) {
					log.log("Plugging in " + name);
					if(component instanceof String) System.require(name, component, callback);
					else System.include(name, component);
				},		
				/**
				 * Loads library core with given modules some of which can be
				 * loaded synchroneously, before others. Modules that are to be
				 * load synchroneously and do replace default ones must be
				 * included in the separate, first block to load.
				 */
				"load" : function(callback, asyncModules) {
					asyncModules || (asyncModules = {});
					var syncModulesOverrideBlock = arguments[2] || {};
					var syncModulesBlocks = Util.slice(arguments, 3) || {};				

					System.includeEvery({
						/* modules to include before the others */
						"configuration" : function(System) {
							// does nothing
						}
					}, function() {
						System.includeEvery(syncModulesBlocks, function() {
							System.includeEvery([{
								"Timer" : asyncModules["Timer"] || "extras/Timer.js",								
								"ModelTemplate" : asyncModules["ModelTemplate"] || "core/templates/ModelTemplate.js",
								"ViewTemplate" : asyncModules["ViewTemplate"] || "core/templates/ViewTemplate.js",
								"ControllerTemplate" : asyncModules["ControllerTemplate"] || "core/templates/ControllerTemplate.js"								
							},{
								"ModelFactory" : asyncModules["ModelFactory"] || "core/ModelFactory.js",
								"ViewFactory" : asyncModules["ViewFactory"] || "core/ViewFactory.js",
								"ControllerFactory" : asyncModules["ControllerFactory"] || "core/ControllerFactory.js",
							}], callback, path);
						},path);					
					}, path);
				},
				/**
				 * If a config parameter is provided, it must be complete as it replaces the default one.
				 * If only several things have to be replaced use methods from obtained builder to
				 * do that.
				 */
				"getBuilder" : function(userConfig) {
					if(!userConfig.jvcPath) {
						path = userConfig.jvcPath;
					}		
					
					if(!!builder) {
						var defaultConfiguration = (function() {
							this[MODEL_TEMPLATE] = {
								"setSuperType" : {
									"Component" : "@" + path + "impl/Component.js",
								},
								"addModels" : {
									"ChangeSupport" : "@" + path + "impl/ChangeSupport.js",
								}
							};
							this[CONTROLLER_TEMPLATE] = {};
							this[VIEW_TEMPLATE] = {};
							this[ROOT_PATH] = "./";
							return this;
						}).call({});
						
						config = !!!userConfig ? defaultConfiguration :  
						(function() {
							this[CONTROLLER_TEMPLATE] = userConfig[CONTROLLER_TEMPLATE] || defaultConfiguration[CONTROLLER_TEMPLATE];
							this[MODEL_TEMPLATE] = userConfig[MODEL_TEMPLATE] || defaultConfiguration[MODEL_TEMPLATE];
							this[VIEW_TEMPLATE] = userConfig[VIEW_TEMPLATE] || defaultConfiguration[VIEW_TEMPLATE];
							this[ROOT_PATH] = userConfig[ROOT_PATH] || defaultConfiguration[ROOT_PATH];
							return this;
						}).call({});
						
						builder.loadConfig(config);
					}
					return builder;
				},
				"ready" : function(callback) {
					System["Timer"].wait(callback);					
				},
				"construct" : function() {
					System["ModelTemplate"].construct();	
					System["ControllerTemplate"].construct();
					System["ViewTemplate"].construct();
					return API;
				}
			};
		})();
	})();	
});
