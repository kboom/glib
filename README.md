# GlibJS - a JavaScript library for advanced object-oriented programming

Everytime you have to craft some non-trivial code in JavaScript you don't bother to respect some rules you would normally follow in any other Object-Oriented language, do you? That's most likely because JavaScript seems so unnatural when it comes to Object-Oriented programming that you cannot adapt to it so easily. You lack some syntax. You struggle with maintaining a project structure most likely ending up having all the logically uncoupled code tied together in just one file. You are confused with the fact that JavaScript is an interpreted language. You don't have a nice IDE. And most importantly, you don't even know what you're doing is right.

## What does it help you with?
It makes writing Object-Oriented applications in JavaScript more like the way you know it from the other languages supporting this paradigm. You are provided with *code templates* to define types, *classloading mechanisms*, *dependency injection*, built-in *MVC model* and many more just the way you like it.

### Code templates
You'd surely like to be able to define a type in separate file and forget for a moment about everything else unrelated to it's purpose. Narrow down it's responsibilities and implement them. After all, it's what OO is all about, isn't it? That's the way you do this:  

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

This is a simplest model. It's name is _ModelA_, it extends _ModelAParent_ and will have functionality _AugmentA_ and _AugmentB_ built-in. You should use the _ic_ variable to define methods specific to all instances of the type you're implementing. The _sc_ variable makes you able to define fields and methods specific to the type. If you need to refer to the base class you can use the _sp_ variable. The returned function is a constructor of the defined type. That's where the instance context is first initialized.
