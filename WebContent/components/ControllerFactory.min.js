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

var ControllerFactory=function(e){var t=e["Logger"].createLog("ControllerDresser module");var n=e["Util"];t.log("debug","Preparing manager");var r=e["sources"].findChildByName("controllers");var i=e["factories"].createChild("controllerFactory");r.setHandler(i);var s=function(e,t,i){var o=e;do{var u=o.getObject();u.call(t);var a=o.getData().augments;n.each(a,function(e){s(e,t,i)})}while((o=o.getParent())!==r)};i["create"]=function(e,n,r){t.log("debug",'Dressing with controller "'+e.getName()+'"');var i={};s(e,i,n);r("model",i.model);r("view",i.view);return i}}