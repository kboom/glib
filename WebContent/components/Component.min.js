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

var Component={name:"Component",onLoad:function(){},definition:function(e){var t=e["Logger"].createLog("Component module");var n=e["Util"];t.log("verbose","Component module is being loaded...");var r=function(){};r.prototype["createSubtype"]=function(){var e=this;var t=function(e){n.each(e,function(e,t){if(this[t]===undefined)this[t]=e},this);return this};var r=function(){};r.prototype=e;t.prototype=new r;t.prototype.constructor=t;var i=Array.prototype.slice.call(arguments,1);for(var s=0;s<arguments.length;s++){n.augment(t.prototype,arguments[s])}t.prototype.getType=function(){return t};t.prototype.getSuperType=function(){return e.getType()};return t};r.prototype["augmentWith"]=function(){for(var e=0;e<arguments.length;e++){n.augment(this,arguments[e])}};r.prototype["getType"]=function(){return r};r.prototype["getStaticContext"]=function(){return this.getType()};r.prototype["getInstanceContext"]=function(){return this};r.prototype["setId"]=function(e){this.id=e};r.prototype["getId"]=function(){return this.id||DEFAULT_ID};r.prototype["sealType"]=function(e){return e};return r.prototype["sealType"](r)}}