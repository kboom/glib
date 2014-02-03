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

var ModelFactory=function(e){var t=e["Logger"].createLog("ModelFactory module");var n=e["Util"];t.log("debug","Preparing manager");var r=e["sources"].findChildByName("models");var i=e["factories"].createChild("modelFactory");r.setHandler(i);var s=function(e,t){var i=e;do{var o={};var u=i.getData()["cargs"];u instanceof Function?u.call(o):o=u;var a=i.getData().augments;n.each(a,function(e){s(e,t)});n.each(o,function(e,n){if(t[n]===undefined)t[n]=e})}while((i=i.getParent())!==r)};i["create"]=function(e,r){t.log("debug",'Creating new model "'+e.getName()+'"');var i={};n.addAll(i,r);s(e,i);var o=e.getObject();return new o(i)}}