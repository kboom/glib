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

var ChangeSupport={name:"ChangeSupport",onLoad:function(){},definition:function(e,t){var n=t["logger"].createLog("ChangeSupport");var r=t["Util"];var i=e.prototype.getStaticContext();var s=function(e,t){n.log("info","Registering listener on property "+e);var r;this.targetListeners||(this.targetListeners={});var r=this.targetListeners[e]?this.targetListeners[e]:this.targetListeners[e]=[];r.push(t);return t};var o=function(e,t){n.log("info","Dismissing listener on property "+e);var r;this.targetListeners||(this.targetListeners={});var r=this.targetListeners[e];if(r){var i=r.indexOf(t);r.splice(i,1)}};var u=function(e){this.targetListeners||(this.targetListeners={});var t=this.targetListeners[e]||(this.targetListeners[e]=[]);for(var n=0;n<t.length;n++){t[n].apply(this,Array.prototype.slice.call(arguments,1))}};return function(){this["registerChangeListener"]=s;this["dismissChangeListener"]=o;this["fireChange"]=u}}}