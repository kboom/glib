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

var ControllerTemplate=function(e){var t=e["Logger"].createLog("ControllerTemplate module");var n=e["Util"];var r=e["sources"].createChild("controllers");return function(){var i="addControllers";var s={};var o;var u=function(){return this}.call(function(e){u=e;u[i]=e[i]||(e[i]={})});s[i]=function(e){if(!(e instanceof Object))throw new Ex.WRONG_ARGUMENT("Wrong notation. Controllers must be listed in object literal notation.");n.each(e,function(e,n){(function(n){o.call(function(e){var n=e.name||n;var r=e.parent||"controllers";var s=e.augment?e.augment instanceof Array?e.augment:[e.augment]:[];var o=e.definition;t.log("debug","Controller definition <"+n+"> extends <"+r+"> loaded.");u[i][n]={name:n,parent:r,augment:s,definition:o}},e,n)})(n)})};return{getBuilder:function(e,t){u(e);o=t;return s},construct:function(){function s(e){var i=e.parent;var s=e.name;var o=e.augment;var u=e.definition;var a=r.findChildByName(i);var f=a.createChild(s);var l=u.call(this,t);var c={};n.each(o,function(e){var t=r.findChildByName(e);c[e]=t});f.setData({augments:c});f.setObject(l)}function a(e){var t=o[e].parent;if(o[t])a(t);n.each(o[e].augment,function(e){if(o[e])a(e)});s(o[e]);delete o[e]}var t={create:n.bind(e["create"],e),inject:n.bind(e["inject"],e),logger:e["Logger"],timer:e["Timer"],remove:n.bind(e["remove"],e)};r.setObject(function(){});r.setData({});var o=u[i];n.each(o,function(e,t){a(t)});delete this}}}()}