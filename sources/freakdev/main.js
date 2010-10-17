//version 0.1
(function () {
	///--remove code at build--///
	
	var scripts = [
	////--scripts to include at build--////
	    'sources.freakdev.utils.Dom', 
	    'sources.freakdev.utils.Debug',
	    'sources.freakdev.utils.Uuid',
	    'sources.freakdev.event.EventManager',
	    'sources.freakdev.event.Event',
	    'sources.freakdev.event.MouseEvent',
	    'sources.freakdev.canvas.image.Pixel',
	    'sources.freakdev.canvas.Canvas',
	    'sources.freakdev.canvas.scene.Object',
	    'sources.freakdev.canvas.scene.DisplayGroup',
	    'sources.freakdev.canvas.scene.Scene',
	    'sources.freakdev.canvas.scene.Image',
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

