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

var ViewFactory=function(e){var t=e["Logger"].createLog("ViewFactory module");t.log("debug","Preparing manager");var n=e["sources"].findChildByName("views");var r=e["factories"].createChild("viewFactory");n.setHandler(r);var i=function(e,t,r){var i=e;var s=[];do{var o=i.getObject();s.push(o)}while((i=i.getParent())!==n);for(var u=s.length-1;u>=0;u--){s[u].call(t,r)}};r["create"]=function(e,n){t.log("debug",'Creating new view "'+e.getName()+'"');var r={};i(e,r,n);return r}}