/*!
 * fkdCanvas JavaScript Library v0.1
 *
 * Copyright 2010, Mathias DESLOGES
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * 
 *   - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer
 *     in the documentation and/or other materials provided with the distribution. 
 *   - Neither the name of the <ORGANIZATION> nor the names of its contributors may be used to 
 *     endorse or promote products derived from this software without specific prior written permission. 
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE 
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT 
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Includes Math.uuid.js
 * http://www.broofa.com/blog/?p=151
 * Copyright (c) 2008, Robert Kieffer
 * Released under Dual licensed under the MIT and GPL licenses.
 *
 */
(function () {
	///--remove code at build--///
	
	var scripts = [
	////--scripts to include at build--////
	    'sources.freakdev.utils.Dom', 
	    'sources.freakdev.utils.Debug',
	    'sources.freakdev.utils.Uuid',
	    'sources.freakdev.math.Point',
	    'sources.freakdev.event.EventManager',
	    'sources.freakdev.event.Event',
	    'sources.freakdev.event.MouseEvent',
	    'sources.freakdev.event.EventHandler',
	    'sources.freakdev.canvas.image.Pixel',
	    'sources.freakdev.canvas.Canvas',
	    'sources.freakdev.canvas.scene.Object',
	    'sources.freakdev.canvas.scene.DisplayGroup',
	    'sources.freakdev.canvas.scene.Scene',
	    'sources.freakdev.canvas.scene.Image',
	    'sources.freakdev.canvas.scene.Shape',
	    'sources.freakdev.canvas.scene.Path',
	    'sources.freakdev.thread.Broker',
	    'sources.freakdev.thread.Thread'
	////--scripts to include at build--////
	];
	
	///--remove code at build--///

	window.Fkd = {
		/**
		 * creates recursively nested object to define a namespace
		 * @param {String} ns - the desired namespace
		 * @returns {Object} - the deepest level of ns namespace 
		 */
		createNamespace: function (ns) {
			var names = ns.split('.');
			var parent = window;
			for (var i=0, len=names.length; i<len; i++) {
				if ('object' != typeof(parent[names[i]]) ) {
					parent[names[i]] = {};
				}
				
				parent = parent[names[i]];
			}
			return parent[names[i]];
		},
		/**
		 * create a class that extends the given one
		 * @param {Function} parentClass the parent class to extend
		 * @returns {Function} - the child class
		 */
        extend: function(parentClass) {
			var fn, fnConstructor = fn = function () { 
				parentClass.apply(this, arguments);
			};
			fn.prototype = new parentClass;

			fn.prototype.constructor = fnConstructor;
			
			fn.superClass = parentClass.prototype;
			fn.prototype.superClass = function () { return parentClass.prototype; };
			
			return fn;
		},
		/**
		 * creates a delegate of the given function with the desired scope
		 * @param {Function} fn
		 * @param {Object} scope
		 * @returns {Function}
		 */
		createDelegate: function (fn, scope) {
			return function () {
				fn.apply(scope, arguments);
			};
		},
		call_fn_array: function (fn, args) {
			if ('function' == typeof fn) {
				fn.apply(fn, args);
			} else {
				if (fn.scope && fn.fn) {
					fn.apply(scope, args);
				}
			}
		}
	};
	
	//--add included code here --//	
	
})();

