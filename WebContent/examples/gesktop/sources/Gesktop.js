(function(ns, root, def) {
	if (typeof module !== 'undefined')
		module.exports = def(ns, JVC, root, $);
	else if (typeof define === 'function' && typeof define.amd === 'object')
		define(def);
	else
		root[ns] = def(ns, JVC, root, $);
})("Gesktop", this, function(ns, JVC, root, $) {
	if (JVC === undefined)
		throw new Error("JVC is not accessible.");
	if ($ === undefined)
		throw new Error("jQuery is not accessible.");
		
		var Components = (function(JVCApi) {
			return function(config) {
				for(var name in config) {
					this[name] = config[name];
				}
				
				return this;
			};
		});
		
		var Factory = (function(JVCApi) {
			return function(config) {
				for(name in config) {
					this["create" + name] = (function(context, creationData) {
						var scope = creationData.scope == "singleton" ? true : false;
						var type = creationData.type || "Controller";
						var className = creationData.name || name + type;
						return function() {
							if(scope) return JVCApi.inject(className).model;
							return JVCApi.create(className, scope).model;
						};
					})(config[name].context || this, config[name]);
				}
				
				return this;
			};			
		});
		
		var Facade = function(JVCApi) {
			return function(config) {
				for(name in config) {
					this[name] = config[name];
				}
				
				return this;
			};
		};		
		
		var System = (function(JVCApi){
			
			var SystemBus = JVCApi.create("ChangeSupport");			
						
			var Dimension = (function() {
				var windowHeight;
				var windowWidth;	
				
				window.onresize = function(event) {
					var g = $(window);
					windowHeight = g.height();
					windowWidth = g.width();
					SystemBus.fireChange("windowDimensions");								
				};
				
				return {
					"getScreenWidth" : function() {
						return windowWidth;
					},
					"getScreenHeight" : function() {
						return windowHeight;
					}
				};
			})();
			
			return function() {
				window.onresize();
				
				return {
					"bus" : SystemBus,
					"dimen" : Dimension
				};					
			};			
		});
		
		
		return {
			"config" : function(JVCConfig, components, componentConfig, userConfig, libraryConfig) {
				
				var GesktopContext = {};
				GesktopContext.System = {};
				GesktopContext.Components = {};
				GesktopContext.Factory = {};
				GesktopContext.Facade = {};
				
				JVC.load(JVCConfig, function() {
					var JVCBuilder = JVC.getBuilder(JVCConfig);
					componentConfig(JVCBuilder);
					
					JVC.ready(function() {
						var JVCApi = JVC.construct();
						
						Factory = Factory(JVCApi);
						System = System(JVCApi);
						Facade = Facade(JVCApi);
						Components = Components(JVCApi);
						
						
						JVC.ready(function() {		
							
							var boundSystem = System.bind(GesktopContext.System);
							var boundComponents = Components.bind(GesktopContext.Components);
							var boundFactory = Factory.bind(GesktopContext.Factory);
							var boundFacade = Facade.bind(GesktopContext.Facade);
							
							libraryConfig(JVCApi, 
								boundSystem,
								boundComponents, 
								boundFactory, 
								boundFacade
							);
													
							userConfig(
								boundSystem,
								boundComponents, 
								boundFactory, 
								boundFacade,
								JVCApi
							);						
						});	
					});		
				}, components);						
			}
		};
});