//version 0.1
(function () {
	///--remove code at build--///
	
	var scripts = [
	////--scripts to include at build--////
	    'sources.freakdev.utils.Dom', 
	    'sources.freakdev.utils.Debug',
	    'sources.freakdev.utils.Uuid',
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
	
	var head = document.getElementsByTagName('head').item(0);
		
	for(var i=0, len=scripts.length; i<len; i++) {
		node = document.createElement('script');
		node.setAttribute('type', 'text/javascript');
		fileName = scripts[i];
		node.setAttribute('src', fileName.replace(/\./g, '/').concat('.js'));
		
		head.appendChild(node);
		
		// ensure that scripts are loaded
		// this should be used only in local dev
		var start = new Date().getTime(), delay = 0;
		while(delay < 200) { delay = new Date().getTime() - start; }
	}
	
	///--remove code at build--///

	window.Fkd = (function () {	
		return {
			createNamespace: function (ns) {
				var names = ns.split('.');
				var parent = window;
				for (var i=0, len=names.length; i<len; i++) {
					if ('object' != typeof(parent[names[i]]) ) {
						parent[names[i]] = {};
					}
					
					parent = parent[names[i]];
				}
			},
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
			createDelegate: function (fn, scope) {
				return function () {
					fn.apply(scope, arguments);
				};
			},
			call_fn_array: function (fn, arguments) {
				if ('function' == typeof fn) {
					fn.apply(fn, arguments);
				} else {
					if (fn.scope && fn.fn) {
						fn.apply(scope, arguments)
					}
				}
			}
		};
	})();
	
	//--add included code here --//
	
})();

