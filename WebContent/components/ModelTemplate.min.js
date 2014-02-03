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

var ModelTemplate=function(e){var t=e["Logger"].createLog("ModelTemplate module");t.log("verbose","Loading");var n=e["Exception"];var r=e["Util"];var i=e["sources"].createChild("models");return function(){var s="addModels";var o="setSuperType";var u={};var a;var f=function(){return this}.call(function(e){f=e;f[s]=e[s]||(e[s]={});f[o]=e[o]||(e[o]=function(){})});u[s]=function(e){if(!(e instanceof Object))throw new n.WRONG_ARGUMENT("Wrong notation. Models must be listed in object literal notation.");r.each(e,function(e,n){(function(n){a.call(function(e){var n=e.name||n;var r=e.parent||"models";var i=e.augment?e.augment instanceof Array?e.augment:[e.augment]:[];var o=e.dependency?e.dependency instanceof Array?e.dependency:[e.dependency]:[];var u=e.definition;t.log("debug","Model definition <"+n+"> extends <"+r+"> loaded.");f[s][n]={name:n,parent:r,augment:i,dependency:o,definition:u}},e,n)})(n)})};u[o]=function(e){if(!(e instanceof Object))throw new n.WRONG_ARGUMENT("Wrong notation. Models must be listed in object literal notation.");r.each(e,function(e,t){(function(t){a.call(function(e){f[o]=e.definition},e,t)})(t)})};return{getBuilder:function(e,t){f(e);a=t;return u},construct:function(){function n(e){var n=e.parent;var s=e.name;var o=e.augment;var u=e.definition;var a=i.findChildByName(n);var f=a.getObject();var l=f.prototype.createSubtype();var c=u.call({},l,t);var h={};r.each(o,function(e){var t=i.findChildByName(e);h[e]=t});var p=a.createChild(s);p.setObject(l);l.prototype.sealType();p.setData({augments:h,cargs:c})}function a(e){var t=u[e].parent;if(u[t])a(t);r.each(u[e].dependency,function(e){if(u[e])a(e)});r.each(u[e].augment,function(e){if(u[e])a(e)});n(u[e]);delete u[e]}i.setObject(f[o](e));i.setData({cargs:{}});var t={create:r.bind(e["create"],e),inject:r.bind(e["inject"],e),augment:r.augment,util:r,logger:e["Logger"],timer:e["Timer"]};var u=f[s];r.each(u,function(e,t){a(t)});delete this}}}()}