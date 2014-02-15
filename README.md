# JVC - a JavaScript library for advanced object-oriented programming

Everytime you have to craft some non-trivial code in JavaScript you don't bother to respect some rules you would normally follow in any other Object-Oriented language, do you? That's probably because JavaScript seems so unnatural when it comes to Object-Oriented programming that you cannot adapt to it so easily. You lack some syntax. You struggle to maintain a project structure and most likely end up having all the logically uncoupled code tied together in just one file. You are confused by the fact that JavaScript is an interpreted language. You don't have a nice IDE. And most importantly, you don't even know if what you're doing is right.

## What does it help you with?
It makes writing Object-Oriented applications in JavaScript more like the way you know it from the other languages supporting this paradigm. You are provided with *code templates* to define types, *classloading mechanisms*, *managed context and dependency injection*, built-in *MVC model* and many more just the way you like it.

## What has been already done with it?
**Gesktop** is the demonstrational but fully-capable project based on **JVC**. It is a single-page application designed to present content in a manner similiar to the way you know from the operating systems. Although the final outcome might not be so appealing, the way it's built certainly is. It's highly customisable so you can introduce custom components almost effortlessly. It's easy to maintain. It is dependent on jQuery (no UI dependency) only.

![Gesktop 1](http://s29.postimg.org/9c1kx08dj/image.png)

![Gesktop 2](http://s27.postimg.org/nm204jmfn/image.png)

You can download it from a separate repository. Browse through the code. There's everything you need to know about how to use this library.

### Code templates
You'd surely like to be able to define a type in a separate file and forget for a moment about everything unrelated to it's purpose. Narrow down it's responsibilities and implement them. After all, it's what OO is all about, isn't it? And that's the way you do this:  

```
var ModelA = {    
  name : "ModelA",  
  parent : "ModelAParent",  
  augment : [ "AugmentA", "AugmentB" ],  
  definition : function(Clazz, System) {  
    
    var ic = Clazz.prototype.getInstanceContext();
    var sc = Clazz.prototype.getStaticContext();  
    var sp = Clazz.prototype.getSuperType.prototype;  
  
    return function() {  
    
    }  
}
```

This is the simplest model. It's name is _ModelA_, it extends _ModelAParent_ and has the functionalities _AugmentA_ and _AugmentB_ built-in. The _ic_ variable is to be used to define methods specific to all instances of the type being implemented. The _sc_ variable is a container used to hold shared data, common for each instance of the type. Referal to the base class is possible by qualifying calls from within _sp_ variable. The returned function is a constructor of the defined type. That's where the instance context is first initialized. There are three types of such templates, one for each component of the MVC model. See detailed section for more information.

### Classloading mechanisms
Such definitions must be known to the system. You do this simply by listing paths to the files used with no respect to the order used. The library will process these files in the correct order. After that, you'll be able to use all of these components in your application.

```
JVCBuilder.getModelBuilder({
  "addModels" : {	
    "ModelA" : "@models/ModelA.js",	
    "ModelB" : "@models/ModelB.js",	
    "ModelC" : "@models/ModelC.js",	
  }
});	

JVCBuilder.getViewBuilder({
  "addViews" : {
    "ViewA" : "@views/ViewA.js",
    "ViewB" : "@views/ViewB.js",
    "ViewC" : "@views/ViewC.js"
  }
});

JVCBuilder.getControllerBuilder({
  "addControllers" : {
    "ControllerA" : "@controllers/ControllerA.js",
    "ControllerB" : "@controllers/ControllerB.js",
    "ControllerC" : "@controllers/ControllerC.js"
}
```

You create, store and destroy such components using built-in application context feature, discussed in the next section. As you can see, the only part of the application that has a knowledge of which components are used in it is the static configuration part discussed in this section. This can be easily extracted to some external location making same application working differently according to the needs of the user.

### Managed context and dependency injection (CDI)
It would be very helpful to have such feature in JavaScript environment, wouldn't it? For those who haven't yet experienced how great such an approach is let's imagine the environment where you can access any object from anywhere in your application just by specifying it's name. No construction parameters, no setters, no overhead. No component knows which collaborators are really the ones being used and that's what makes it so flexible. Library-wise, it is extremely simple, you won't get anything more that you need:

```
var existingOrInexistingObject = JVCApi.inject(className);
var inexistingPrototypalObject = JVCApi.create(className, scope);
```

The first method provides you with the object of a given type. If such object doesn't exist at the moment, it will be created on the spot. Further calls will return the same instance. The second call will construct objects which are not Singletons and will not be shared unless you want them to.

### MVC Model

The purpose of most JavaScript applications is to handle the interaction with the user. In the majority of them, JavaScript realizes the Controller functionality only. And that's good. But as soon as the application becomes more advanced such approach doesn't fit so nicely anymore. It's because you should not place any logic other than translation-wise inside the Controller but you will eventually end up doing so, either knowing it from the begining or realizing it just at the end, not knowing which of two is worse. As this library is for creating advanced-standalone JavaScript applications it's natural JavaScript role has been expanded to cover all components of the MVC model.

Don't worry. There is not much to memorise. You just have three templates instead of one. They seem very alike and have clear responsibilities. You get all the mechanisms you need. Let's assume we'd like to create an application that increases the counter after pressing a button and displays updated value just after that. 

The Model
```
var CounterModel = {    
  name : "CounterModel",  
  definition : function(Clazz, System) {  
    
    var ic = Clazz.prototype.getInstanceContext();
  
    var getCounterValue() {
      return this["counter"];
    }
  
    var countUp = function() {
      this["counter"]++;
      this.fireChange("countedUp");
    }
    
    return function() {  
      this["counter"] = 0;
    }  
}
```

The View
```
var CounterView = {    
  name : "CounterView",  
  definition : function(System) {  
    
    return function() {  
     	this["buttonUp"] = $root.find("#content-leftpane-buttonUp");
	this["counter"] = $root.find("#content-leftpane-counterLabel");
    }  
}
```

The Controller
```
var CounterController = {
	name : "CounterController",
	definition : function(System) {
		
		var displayValueController = function(model) {
			var newValue = model.getCounterValue();
			this["counter"].setText();
		};
		
		return function() {
			var model = this["model"] = System.create("CounterModel");
			var view = this["view"] = System.create("CounterView");
			
			model.registerChangeListener("countedUp", function(item) {
				displayValueController.call(view, model, item);
			});
			
			view.on("click", function() { model.countUp(); });
			
		};
	}
};
```

## Where to start from?

Choose one of the examples, launch it and see how it works. 

## Extensibility

The library itself has been built respecting OO paradigms. Thus it is very easily configurable and extendable. You can swap almost any module morphing the behavior to suit your needs. 

This library stretches JavaScript to its blurry limits enabling you to create really awesome applications at small cost. 





