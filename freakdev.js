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
	
	

Fkd.createNamespace('freakdev.utils');

freakdev.utils.Dom = {
	/**
	 * get a DOMObject matching the given id attribute 
	 * @param {String} idAttr
	 * @returns {DOMObject} object
	 */
	get: function (idAttr) {
		return document.getElementById(idAttr);
	},
	/**
	 * get a list of DOMNode matching the given name attribute
	 * @param {String} name
	 * @returns {NodeList} object
	 */
	getByTagName: function (name) {
		return document.getElementsByTagName(name);
	}
};

/**
 * a shorthand for freakdev.utils.Dom. Is visible only insode the library
 * @type freakdev.utils.Dom
 */
var DomHelper = freakdev.utils.Dom; 

Fkd.createNamespace('freakdev.utils');

freakdev.utils.Debug = (function () {
	var debugActive = true;
	var debugPanel;
	
	return {
		setDebugMode: function (bool) {
			debugActive = bool;
		},
		setDebugPanel: function (idAttr) {
			var node = freakdev.utils.Dom.get(idAttr);
			if (node)
				debugPanel = node;
		},		
		print: function (content) {
			if (debugActive) {
				if (debugPanel) {
					debugPanel.appendChild(document.createTextNode(content));
					debugPanel.appendChild(document.createElement('br'));
				} else if (window.console) {
					console.log(content);
				}
			}
		}
	};
})();

var debug = freakdev.utils.Debug.print;

/*
Copyright (c) 2008, Robert Kieffer
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    * Neither the name of Robert Kieffer nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, 
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; 
OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

Fkd.createNamespace('freakdev.utils');

freakdev.utils.Uuid = (function() {
  // Private array of chars to use
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 

  return function (len, radix) {
    var chars = CHARS, uuid = [], rnd = Math.random;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (var i = 0; i < len; i++) uuid[i] = chars[0 | rnd()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (var i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | rnd()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
        }
      }
    }

    return uuid.join('');
  };
})();

// shorthand
var generateUuid = freakdev.utils.Uuid;

Fkd.createNamespace('freakdev.math');

freakdev.math.Point = function ()
{
	this.init.apply(this, arguments);
};

freakdev.math.Point.prototype.init = function (x, y)
{
	this.x = x;
	this.y = y;
}

Fkd.createNamespace('freakdev.event');

freakdev.event.CLICK = 'click';
freakdev.event.DBLCLICK = 'dblclick';

freakdev.event.MOUSE_DOWN = 'mousedown';
freakdev.event.MOUSE_MOVE = 'mousemove';
freakdev.event.MOUSE_OUT = 'mouseout';
freakdev.event.MOUSE_OVER = 'mouseover';
freakdev.event.MOUSE_UP = 'mouseup';
freakdev.event.MOUSE_WHEEL = 'mousewheel';

freakdev.event.KEY_DOWN = 'keydown';
freakdev.event.KEY_PRESS = 'keypress';
freakdev.event.KEY_UP = 'keyup';

freakdev.event.DRAG = 'drag';
freakdev.event.DRAG_END = 'dragend';
freakdev.event.DRAG_ENTER = 'dragenter';
freakdev.event.DRAG_LEAVE = 'dragleave';
freakdev.event.DRAG_OVER = 'dragover';
freakdev.event.DRAG_START = 'dragstart';
freakdev.event.DROP = 'drop';

freakdev.event.DOM_EVENTS = ['mousedown', 'mousemove', 'mouseout', 'mouseover', 
                 'mouseup', 'mousewheel', 'keydown', 'keypress', 
                 'keyup', 'drag', 'dragend', 'dragenter', 'dragleave', 
                 'dragover','dragstart', 'drop'];

freakdev.event.EventManager = function () 
{
	this.init.apply(this, arguments);
};

freakdev.event.EventManager.prototype.init = function ()
{
	this._eventListeners = [];
	this._registeredEvents = [];
};

freakdev.event.EventManager.instance = null;

freakdev.event.EventManager.getInstance = function ()
{
	if (null == freakdev.event.EventManager.instance) {
		freakdev.event.EventManager.instance = new freakdev.event.EventManager();
	}
	
	return freakdev.event.EventManager.instance;
};

freakdev.event.EventManager.prototype.addEventListener = function (e, cb, s)
{
	var eName = e instanceof freakdev.event.Event ? e.getName() : e;
	
	if (null == this._registeredEvents[eName])
		this._registeredEvents[eName] = [];

	if (null == this._registeredEvents[eName][s.getConstId()])
		this._registeredEvents[eName][s.getConstId()] = [];
	
	this._registeredEvents[eName][s.getConstId()].push(cb);
};

freakdev.event.EventManager.prototype.removeEventListener = function (e, s, cb)
{
	var eName = e instanceof freakdev.event.Event ? e.getName() : e;
	
	if (null == this._registeredEvents[eName])
		return;

	if (null == this._registeredEvents[eName][s.getConstId()])
		return;
	
	var cb = this._registeredEvents[eName][s.getConstId()];
	if (undefined != cb)
		delete(this._registeredEvents[eName][s.getConstId()][this._registeredEvents[eName][s.getConstId()].indexOf(cb)]);
	else
		delete(this._registeredEvents[eName][s.getConstId()][this._registeredEvents[eName][s.getConstId()]]);
};

freakdev.event.EventManager.prototype.domEventFactory = function (domEvent, canvas)
{
	if ('mouse' == domEvent.type.substr(0, 5)) {
		return new freakdev.event.MouseEvent(domEvent, canvas);
	} else if ('key' == domEvent.type.subtr(0, 3)) {
		//return new freakdev.event.KeyEvent(domEvent, canvas);
	} else if ('drop' == domEvent.type.subtr(0, 4) || 'drop' == domEvent.type.subtr(0, 4)) {
		//return new freakdev.event.DragEvent(domEvent, canvas);
	}
};

freakdev.event.EventManager.prototype.fireEvent = function (event, s)
{
	var eName = event instanceof freakdev.event.Event ? event.getName() : event;	
	
	if (this._registeredEvents[eName] && this._registeredEvents[eName][s.getConstId()]) {
		var callbacks = this._registeredEvents[eName][s.getConstId()]; 
		for (var i=0, len=callbacks.length; i<len; i++) {
			var cb = callbacks[i];
			cb(event);
			/*if (!event.canPropagate()) {
				break;
			}*/
		}
	}	
};


Fkd.createNamespace('freakdev.event');

freakdev.event.Event = function ()
{
	this.init.apply(this, arguments);
};

freakdev.event.Event.prototype.init = function (name)
{	
	this._name = name;
	this._allowPropagation = true;
};

freakdev.event.Event.prototype.getName = function () 
{
	return this._name;
};

freakdev.event.Event.prototype.stopPropagation = function () 
{
	this._allowPropagation = false;
	return false;
};

freakdev.event.Event.prototype.canPropagate = function () 
{
	return this._allowPropagation;
};

Fkd.createNamespace('freakdev.event');

freakdev.event.MouseEvent = Fkd.extend(freakdev.event.Event);

freakdev.event.MouseEvent.LEFT_BUTTON = 'lb';
freakdev.event.MouseEvent.RIGHT_BUTTON = 'rb';

freakdev.event.MouseEvent.prototype.init = function (domMouseEvent, canvas)
{
	freakdev.event.MouseEvent.superClass.init.call(this, domMouseEvent.type);
	
	this.canvas = canvas || domMouseEvent.target;
	this.type = domMouseEvent.type;
	
	this.button = (1 == domMouseEvent.button 
					? freakdev.event.MouseEvent.LEFT_BUTTON 
					: freakdev.event.MouseEvent.RIGHT_BUTTON);

	//this.specialKeys;	
		
	this.x = domMouseEvent.layerX - domMouseEvent.target.offsetLeft;
	this.y = domMouseEvent.layerY - domMouseEvent.target.offsetTop;
	
};

Fkd.createNamespace('freakdev.event');

freakdev.event.EventHandler = function ()
{
	this.init.apply(this, arguments);
};

freakdev.event.EventHandler.prototype.init = function (name)
{	
	this._eventManager = freakdev.event.EventManager.getInstance();
	this._constUID = generateUuid();
};

freakdev.event.EventHandler.prototype.getConstId = function () 
{
	return this._constUID;
};

freakdev.event.EventHandler.prototype.attachEvent = function(eventName, callback)
{
	this._eventManager.addEventListener(eventName, callback, this);
};

freakdev.event.EventHandler.prototype.detachEvent = function(eventName, callback)
{
	this._eventManager.addEventListener(eventName, this, callback);
};

freakdev.event.EventHandler.prototype.fireEvent = function(event, params)
{
	this._eventManager.fireEvent(event, this);
};

freakdev.event.EventHandler.prototype.fireEventAsync = function(event, params)
{
	var threadBroker = freakdev.thread.Broker.getInstance();
	
	threadBroker.startThread(this._eventManager.fireEvent, [event, this]);
};

Fkd.createNamespace('freakdev.canvas.image');

freakdev.canvas.image.Pixel = function (comp1, comp2, comp3, comp4, mode)
{
	
	this.red = 0;
	this.green = 0;
	this.blue = 0;
	this.hue = 0;
	this.saturation = 0;
	this.luminosity = 0;
	
	this.alpha = 0;
	
	if (undefined == mode || 'rgb' == mode) {
		this.red   = comp1;
		this.green = comp2;
		this.blue  = comp3;
	} else if ('hsl' == mode) {
		this.hue  	   = comp1;
		this.saturation = comp2;
		this.luminosity  = comp3;
	}
	
	this.alpha = comp4;
};

freakdev.canvas.image.Pixel.prototype.toRGB = function ()
{

	var Hue_2_RGB = function ( v1, v2, vH )             //Function Hue_2_RGB
	{
		   if ( vH < 0 ) vH += 1;
		   if ( vH > 1 ) vH -= 1;
		   if ( ( 6 * vH ) < 1 ) return ( v1 + ( v2 - v1 ) * 6 * vH );
		   if ( ( 2 * vH ) < 1 ) return ( v2 );
		   if ( ( 3 * vH ) < 2 ) return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6 );
		   return ( v1 );
	};
	
	if ( this.saturation == 0 )                       //HSL from 0 to 1
	{
	   R = this.luminosity * 255;                      //RGB results from 0 to 255
	   G = this.luminosity * 255;
	   B = this.luminosity * 255;
	}
	else
	{
	   if ( this.luminosity < 0.5 ) 
		   var_2 = this.luminosity * ( 1 + this.saturation );
	   else
		   var_2 = ( this.luminosity + this.saturation ) - ( this.saturation * this.luminosity );

	   var_1 = 2 * this.luminosity - var_2;

	   R = 255 * Hue_2_RGB( var_1, var_2, this.hue + ( 1 / 3 ) ); 
	   G = 255 * Hue_2_RGB( var_1, var_2, this.hue );
	   B = 255 * Hue_2_RGB( var_1, var_2, this.hue - ( 1 / 3 ) );
	}	
	
    this.red = R;
    this.green = G;
    this.blue = B;
    return {
    	'red'   : R,
    	'green' : G,
    	'blue'  : B
    };	
};

freakdev.canvas.image.Pixel.prototype.toHSL = function ()
{
	var_R = ( this.red / 255 );                     //RGB from 0 to 255
	var_G = ( this.green / 255 );
	var_B = ( this.blue / 255 );

	var_Min = Math.min( var_R, var_G, var_B );    //Min. value of RGB
	var_Max = Math.max( var_R, var_G, var_B );    //Max. value of RGB
	del_Max = var_Max - var_Min;             //Delta RGB value

	L = ( var_Max + var_Min ) / 2

	if ( del_Max == 0 )                     //This is a gray, no chroma...
	{
	   H = 0;                                //HSL results from 0 to 1
	   S = 0;
	}
	else                                    //Chromatic data...
	{
		if ( L < 0.5 ) 
			S = del_Max / ( var_Max + var_Min );
		else
			S = del_Max / ( 2 - var_Max - var_Min );

	    del_R = ( ( ( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max
	    del_G = ( ( ( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max
	    del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max

	    if ( var_R == var_Max ) 
	    	H = del_B - del_G;
	    else if ( var_G == var_Max ) 
		   H = ( 1 / 3 ) + del_R - del_B;
	    else if ( var_B == var_Max ) 
	    	H = ( 2 / 3 ) + del_G - del_R;

	    if ( H < 0 )
		   H += 1;
	   
	    if ( H > 1 )
	    	H -= 1;
	}
	
	this.hue = H;
	this.saturation = S;
	this.luminosity = L;
	return {
		'hue' : H,
		'sat' : S,
		'lig' : L
	};
};

freakdev.canvas.image.Pixel.prototype.blend = function(px)
{
	if (undefined == this.red)
		this.toRGB();
		
	this.red = (1 - px.alpha) * this.red + px.alpha * px.red;
	this.green = (1 - px.alpha) * this.green + px.alpha * px.green;
	this.blue = (1 - px.alpha) * this.blue + px.alpha * px.blue;
	this.alpha += px.alpha;
	
	return this;
};

Fkd.createNamespace('freakdev.canvas');

freakdev.canvas.Canvas = function ()
{	
	this.init.apply(this, arguments);
};

/**
 * constructor
 * @param {String} [optional] domCanvasId - the id attribute of a already existing canvas node
 */
freakdev.canvas.Canvas.prototype.init = function (domCanvasId)
{	
	/**
	 * is the canvas domobject has already been inserted to DOM
	 * @type {Boolean}
	 */
	this.insertedToDom = false;
	
	/**
	 * a placeholder dom node for the canvas element
	 * @type {DOMNode}
	 */
	this._domPlaceholder = null;	
	
	/**
	 * DOM node
	 * @type {DOMNode} 
	 */
	this.canvasNode = null;

	/**
	 * reference to the render timer
	 * @type {Integer?}
	 */
	this._autoRenderTimer = null;
	
	/**
	 * is the canvas beeing rendering itself
	 * @type {Boolean}
	 */
	this._isRendering = false;
	
	/**
	 * Frame per seconds
	 * @type {Integer}
	 */
	this._fps = 100;
	
	/**
	 * the scene
	 * @type {freakdev.canvas.scene.Scene}
	 */
	this.scene = null;	
	
	this.getCanvas(undefined != domCanvasId ? domCanvasId : false);
	this._initScene();
	this._initEvent();
};

/**
 * initialize scene object
 * @returns void
 */
freakdev.canvas.Canvas.prototype._initScene = function ()
{
	this.scene = new freakdev.canvas.scene.Scene(this);
	this.scene.setId('scene');
};

/** 
 * initialize DOMEvent handled by this canvas
 * @returns void
 */
freakdev.canvas.Canvas.prototype._initEvent = function ()
{
	var eventListener = Fkd.createDelegate(function (event) {
		var e = freakdev.event.EventManager.getInstance().domEventFactory(event, this);
		(Fkd.createDelegate(this.scene.handleDomEvent, this.scene))(e);
	}, this);
	
	for (var i in freakdev.event.DOM_EVENTS) {
		this.getCanvas().addEventListener(freakdev.event.DOM_EVENTS[i], eventListener, true);
	}
};

/**
 * Deprecated
 */
freakdev.canvas.Canvas.prototype.propagateEvent = function (event)
{
	this.scene.handleEvent.call(this, event);
};

/**
 * get or create DOMNode 
 * @param {String} idAttr id given, this function will get the canvas DOMNode with a matching id attribute 
 * @returns {DOMNode} canvasNode;
 */
freakdev.canvas.Canvas.prototype.getCanvas = function (idAttr)
{
	if (!this.canvasNode) {
		if (idAttr) {
			this.canvasNode = DomHelper.get(idAttr);
			this.insertedToDom = true;
		} else {
			this.canvasNode = document.createElement('canvas');
		}
	}
	return this.canvasNode;
};

/**
 * get the context from the canvas DOMNode object
 * @returns void
 */
freakdev.canvas.Canvas.prototype.getContext = function ()
{
	return this.getCanvas().getContext('2d');
};

/**
 * resize the canvas
 * @param {Integer} width
 * @param {Integer} height
 * @returns void
 */
freakdev.canvas.Canvas.prototype.resize = function (width, height)
{
	this.getCanvas().width = width;
	this.getCanvas().height = height;
	
	this.scene.resize(width, height);
};

/**
 * [not implemented yet] returns an object which has been added to the scene's object tree 
 * @param {String} queryString
 * @returns {freakdev.canvas.scene.Object}
 */
freakdev.canvas.Canvas.prototype.query = function (queryString)
{
	
};

freakdev.canvas.Canvas.prototype.setDomPlaceholder = function (ph) 
{
	if ('string' == typeof ph)
		ph = DomHelper.get(ph);
	
	if (null == ph)
		ph = DomHelper.getByTagName('body').item(0);
	
	this._domPlaceholder = ph;
};

freakdev.canvas.Canvas.prototype.getDomPlaceholder = function ()
{
	return this._domPlaceholder;
};

/**
 * render the scene, insert the canvas to the dom if needed
 * if canvas node is not already present in the dom, it try 
 * to append it to the dom node passed in arguments or if 
 * none were given, it append it to the body
 * @returns void
 */
freakdev.canvas.Canvas.prototype.render = function ()
{
	this._isRendering = true;
	
		if (!this.scene.isRendering()) {
	
		if (this.scene.isRenderNeeded()) {
			this.scene.renderTo(this);
		}
	}
	
	if (!this.insertedToDom) {
		this.insertedToDom = true;
		var pNode;
		if (arguments.length)
			pNode = this.setDomPlaceholder(arguments[0]);
		else
			pNode = this.getDomPlaceholder();
			
		if (!pNode)
			pNode = DomHelper.getByTagName('body').item(0);

		pNode.appendChild(this.getCanvas());
	}

	this._isRendering = false;
};

/**
 * wrapper for method CanvasRenderingContext2D.save()
 * @returns void
 */
freakdev.canvas.Canvas.prototype.save = function () 
{
	this.getContext().save();
};

/**
 * wrapper for method CanvasRenderingContext2D.restore()
 * if nb is given the restore function  will be called nb times
 * @param {Integer} nb
 * @returns void
 */
freakdev.canvas.Canvas.prototype.restore = function (nb) 
{
	if (undefined == nb)
		var nb = 1;

	for (var i=0; i<nb; i++) {
		this.getContext().restore();
	}
};

/**
 * generic setter for CanvasRenderingContext2D property
 * @param {String} field - the name of the property
 * @param {Mixed} value - the value to assign
 * @param {Boolean} autoSave - if true, CanvasRenderingContext2D.save() will be called before changing the property
 * @returns void
 */
freakdev.canvas.Canvas.prototype.updateContext = function (field, value, autoSave)
{
	if (false !== autoSave)
		this.save();
		
	var ctx = this.getContext();
	ctx[field] = value;
	
};

/**
 * wrapper for method CanvasRenderingContext2D.translate()
 * @param {Integer} x
 * @param {Integer} y
 * @param {Boolean} autoSave - if true, CanvasRenderingContext2D.save() will be called before changing the property
 * @returns void
 */
freakdev.canvas.Canvas.prototype.translateTo = function (x, y, autoSave) 
{
	if (false !== autoSave)
		this.save();	
	
	var ctx = this.getContext();
	ctx.translate(x, y);
};

/**
 * call the translateTo method with the coord of the given object "center" 
 * @param {freakdev.canvas.scene.Object} object
 * @param {Boolean} autoSave - if true, CanvasRenderingContext2D.save() will be called before changing the property
 * @returns void
 */
freakdev.canvas.Canvas.prototype.translateToObjectCenter = function (object, autoSave) 
{	
	var x = object.getX() + parseInt(object.getWidth() / 2);
	var y = object.getY() + parseInt(object.getHeight() / 2);
	
	this.translateTo(x, y, autoSave);
};

/**
 * wrapper for method rotate()
 * @param {Integer} angle - in degree
 * @param {Boolean} autoSave - if true, CanvasRenderingContext2D.save() will be called before changing the property
 * @returns void
 */
freakdev.canvas.Canvas.prototype.rotate = function (angle, autoSave)
{
	if (false !== autoSave)
		this.save();
	
	var ctx = this.getContext();
	ctx.rotate(angle * Math.PI / 180);
};

/**
 * wrapper for method scale()
 * @param {Integer} scale - the same scale will be applied to width and height
 * @param {Boolean} autoSave - if true, CanvasRenderingContext2D.save() will be called before changing the property
 * @returns void
 */
freakdev.canvas.Canvas.prototype.scale = function (scale, autoSave)
{
	this.scaleXY(scale, scale, autoSave);
};

/**
 * wrapper for method scale()
 * @param {Integer} scaleX
 * @param {Integer} scaleY
 * @param {Boolean} autoSave - if true, CanvasRenderingContext2D.save() will be called before changing the property
 * @returns void
 */
freakdev.canvas.Canvas.prototype.scaleXY = function (scaleX, scaleY, autoSave) 
{
	if (false !== autoSave)
		this.save();
	
	var ctx = this.getContext();
	ctx.scale(scaleX, scaleY);
};

/**
 * starts rendering at regular intervals (fps)
 * @param {Integer} fps - the value of fps can be set here the default (if it has never been set anywhere else) value is 100 fps
 * @returns void
 */
freakdev.canvas.Canvas.prototype.startAutoRender = function (fps)
{
	if (undefined != fps)
		this.setFps(fps);
	
	var interval = parseInt(1000 / this.getFps());
	
	this._autoRenderTimer = setInterval(Fkd.createDelegate(this.render, this), interval);
};

/**
 * change fps value
 * @param {Integer} fps - the value of fps can be set here the default (if it has never been set anywhere else) value is 100 fps
 * @returns void
 */
freakdev.canvas.Canvas.prototype.setFps = function (fps)
{
	this._fps = fps;
};

/**
 * get the fps
 * @param {Integer} fps
 * @returns {Integer}
 */
freakdev.canvas.Canvas.prototype.getFps = function ()
{
	return this._fps;
};


/**
 * stop auto rendering (at regular interval)
 * @returns void
 */
freakdev.canvas.Canvas.prototype.stopAutoRender = function () 
{
	clearInterval(this._autoRenderTimer);
};




Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.Object = Fkd.extend(freakdev.event.EventHandler);

/**
 * constructor
 * @param {Integer} x
 * @param {Integer} y
 * @param {Integer} width
 * @param {Integer} height
 */
freakdev.canvas.scene.Object.prototype.init = function(x, y, width, height)
{
	/**
	 * id attribute
	 * @type String
	 */
	this.id = freakdev.utils.Uuid();
	this._constId = freakdev.utils.Uuid();
	
	/**
	 * img tag used to make rendering to canvas easier and faster
	 * @type Image
	 */
	this._imgTag = new Image((width ? width : null), (height ? height : null));
	
	/**
	 * non modified width of the image tag
	 * @type {Integer}
	 */
	this._naturalWidth = 0;
	
	/**
	 * non modified height of the image tag
	 * @type {Integer}
	 */	
	this._naturalHeight = 0;
	
	/**
	 * x position of the object
	 * @type {Integer}
	 */
	this.x = undefined == x ? 0 : x;

	/**
	 * y position of the object
	 * @type {Integer}
	 */	
	this.y = undefined == y ? 0 : y;
	
	/**
	 * whether or not an object is active
	 * @type {Boolean}
	 */	
	this.activeStatus = false;

	/**
	 * whether or not an object has the focus
	 * @type {Boolean}
	 */	
	this.focusStatus = false;

	/**
	 * whether or not an object is visible
	 * @type {Boolean}
	 */	
	this.visibilityStatus = true;

	/**
	 * opacity value of the object
	 * @type {Integer}
	 */	
	this.opacity = 1;

	/**
	 * rotation value of the object
	 * @type {Integer}
	 */	
	this.rotation = 0; // degree
	
	/**
	 * scale for 'x' dimension of the object
	 * @type {Integer}
	 */	
	this.scaleX = 1;
	
	/**
	 * scale for 'y' dimension of the object
	 * @type {Integer}
	 */	
	this.scaleY = 1;
	//this.effectPool = new freakdev.canvas.image.EffectPool();
	
	/**
	 * reference to the container in which the object has been added (eg:a displaygroup, the scene, ...)
	 * @type {freakdev.canvas.scene.Object}
	 */
	this._container = null;
	
	/**
	 * whether or not an object has to render
	 * @type {Boolean}
	 */
	this._needToRender = true;
	
	/**
	 * true when the rendering job is not terminated
	 * @type {Boolean}
	 */
	this._isRendering = false;
	
	this._eventListeners = [];
	
	/**
	 * anchor point for geometric transformations (only used for mouse drag and drop for the moment)
	 * @type Object 
	 */
	this._anchorPoint = {};
	
	
	this.resetAnchorPoint();
};

/**
 * setter for the needToRender flag
 * @param {Boolean} value
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setNeedToRender = function (value)
{
	if (undefined == value)
		value = true;
	
	if (value && null != this._container) {
		this._container.setNeedToRender();
	}
	
	this._needToRender = value;
};

/**
 * reset anchor point to 0, 0
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.resetAnchorPoint = function ()
{
	this._anchorPoint = {x: 0, y: 0};
};

/**
 * define anchor point 
 * @param {Integer} x
 * @param {Integer} y
 * @returns void 
 */
freakdev.canvas.scene.Object.prototype.setAnchorPoint = function (x, y)
{
	this._anchorPoint = {'x': x, 'y': y};
};

/**
 * set the id property (id should be unique)
 * @param {String} value
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setId = function (value) 
{
	this.id = value;
};

/**
 * return the id property
 * @returns {String} id
 */
freakdev.canvas.scene.Object.prototype.getId = function () 
{
	return this.id;
};

freakdev.canvas.scene.Object.prototype._prepareTarget = function (target)
{
	if (this.opacity < 1 || 0 != this.rotation || 1 != this.getScaleX() || 1 != this.getScaleY()) {
		
		target.updateContext('globalAlpha', this.opacity);
		
		target.translateToObjectCenter(this);
		
		tmpX = this.getX(); tmpY = this.getY();
		this.setX(- (parseInt((this.getWidth() / 2))));
		this.setY(- (parseInt((this.getHeight() / 2))));

		target.rotate(this.rotation);
		
		target.scale(this.getScaleX(), this.getScaleY());
	}	
};

freakdev.canvas.scene.Object.prototype._restoreTarget = function (target)
{
	if (this.opacity < 1 || 0 != this.rotation || 1 != this.getScaleX() || 1 != this.getScaleY()) {
		
		target.restore(4);
		this.setX(tmpX);
		this.setY(tmpY);
		
	}	
};

/**
 * render if needed and print the content of the object to the given target
 * this méthod is called by the object container during the rendering process
 * @param {freakdev.canvas.Cnavas} target
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.renderTo = function (target) 
{
	var tmpX, tmpY;
	
	if (this.isVisible()) {
		if (this.isRenderNeeded())
			this.render();
			
		this.fireEvent('beforeRenderTo', this);
		
		this._prepareTarget(target);
		
		this._drawToTarget(target);
		
		this._restoreTarget(target);
		
		this.fireEvent('afterRenderTo', this);
	}
};

/**
 * draw the raw content of the object to the target  
 * @param {freakdev.canvas.Canvas} target
 * @returns void
 */
freakdev.canvas.scene.Object.prototype._drawToTarget = function (target)
{
	if (this._naturalWidth > 0 && this._naturalHeight > 0)
		target.getContext().drawImage(this.getImgTag(), 0, 0, this._naturalWidth, this._naturalHeight, this.getX(), this.getY(), this.getWidth(), this.getHeight());
};

/**
 * getter for the needToRender flag
 * @returns {Boolean} needToRender
 */
freakdev.canvas.scene.Object.prototype.isRenderNeeded = function ()
{
	return this._needToRender;
};

/**
 * set the object container
 * this method is automatically called by the container
 * @param {freakdev.canvas.scene.Object} obj
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setContainer = function (obj)
{
	this._container = obj;
};

/**
 * render the object (apply effects)
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.render = function () 
{
	if (this._isRendering)
		return;
	
	this._isRendering = true;
	this.setNeedToRender(false);
	
	//this.effectPool.apply(this);
	
	this._isRendering = false;
};

/**
 * getter fot the is_rendering flag
 * @returns {Boolean} isRendering
 */
freakdev.canvas.scene.Object.prototype.isRendering = function ()
{
	return this._isRendering;
};

freakdev.canvas.scene.Object.prototype.isDomEventHandled = function (eventName)
{
	if (this._eventListeners[eventName])
		return true;
	else 
		return false;
};

freakdev.canvas.scene.Object.prototype.handleDomEvent = function (e)
{
	if (!e.type)
		throw Error('Invalid event');
	
	if (!this.isDomEventHandled(e.type))
		// continue propagation
		return true;
	
	for (var j=0,len=this._eventListeners[e.type].length; j<len; j++) {
		Fkd.call_fn_array(this._eventListeners[e.type][j], [e]);
		if (false === e.canPropagate())
			break;
	}
	return e.canPropagate();
};

freakdev.canvas.scene.Object.prototype.removeEventListeners = function (eventName, listener) 
{
	if (!this.isDomEventHandled(eventName))
		return
		
	if (listener) {
		this._eventListeners[eventName].splice(indexof(listener, this._eventListeners[eventName]), 1);
		if (0 == this._eventListeners[eventName].length)
			delete(this._eventListeners[eventName]);
	} else {
		delete(this._eventListeners[eventName]);
	}
};

freakdev.canvas.scene.Object.prototype.addEventListener = function (eventName, listener) 
{
	var em = freakdev.event.EventManager.getInstance();
	
	if (!this.isDomEventHandled(eventName))
		this._eventListeners[eventName] = [];		
		
	this._eventListeners[eventName].push(listener);
};

freakdev.canvas.scene.Object.prototype._shouldHandleMouseEvent = function (event)
{
	var ctx = event.canvas.getContext();

//	if (0 != this.rotation) {
//		//ctx.save();
//	}
	
	ctx.beginPath();
	ctx.moveTo(this.getX()					, this.getY());
	ctx.lineTo(this.getX() + this.getWidth(), this.getY());
	ctx.lineTo(this.getX() + this.getWidth(), this.getY() + this.getHeight());
	ctx.lineTo(this.getX()					, this.getY() + this.getHeight());	
	ctx.lineTo(this.getX()					, this.getY());
	ctx.closePath();
		
	// debug
	//ctx.stroke();
	
	//debug(event);
	var isPtInPath = ctx.isPointInPath(event.x, event.y);
	
	return isPtInPath;
};

/** 
 * returns width of the object
 * @returns {Integer} width
 */
freakdev.canvas.scene.Object.prototype.getWidth = function () 
{
	return this.getImgTag().width;
};

/** 
 * returns height of the object
 * @returns {Integer} height
 */
freakdev.canvas.scene.Object.prototype.getHeight = function ()
{
	return this.getImgTag().height;
};

/** 
 * returns x of the object
 * @returns {Integer} x
 */
freakdev.canvas.scene.Object.prototype.getX = function () 
{
	return this.x;
};

/** 
 * returns y of the object
 * @returns {Integer} y
 */
freakdev.canvas.scene.Object.prototype.getY = function ()
{
	return this.y;
};

/** 
 * returns image tag of the object
 * @returns {Integer} imgTag
 */
freakdev.canvas.scene.Object.prototype.getImgTag = function ()
{
	return this._imgTag;
};

/** 
 * returns opacity of the object
 * @returns {Integer} opacity
 */
freakdev.canvas.scene.Object.prototype.getOpacity = function ()
{
	return this.opacity;
};

/** 
 * returns rotation angle in degree of the object
 * @returns {Integer} rotation
 */
freakdev.canvas.scene.Object.prototype.getRotation = function ()
{
	return this.rotation;
};

/** 
 * returns scale of the object - the two dimensions are return in the 'x' and 'y' property of a simple JS object
 * @returns {Object} scale
 */
freakdev.canvas.scene.Object.prototype.getScale = function ()
{
	return {'x' : this.scaleX, 'y' : this.scaleY};
};

/** 
 * returns scale on X axis of the object
 * @returns {Integer} scale
 */
freakdev.canvas.scene.Object.prototype.getScaleX = function ()
{
	return this.scaleX;
};

/** 
 * returns scale on Y axis of the object
 * @returns {Integer} scale
 */
freakdev.canvas.scene.Object.prototype.getScaleY = function ()
{
	return this.scaleY;
};

/** 
 * returns whether or not the object is active (not implemented yet)
 * @returns {Boolean} focusStatus
 */
freakdev.canvas.scene.Object.prototype.isActive = function ()
{
	return this.activeStatus;
};

/** 
 * returns whether or not the object has focus (not implemented yet)
 * @returns {Boolean} focusStatus
 */
freakdev.canvas.scene.Object.prototype.hasFocus = function ()
{
	return this.focusStatus;
};

/** 
 * returns whether or not the object is visible
 * @returns {Boolean} visibilityStatus
 */
freakdev.canvas.scene.Object.prototype.isVisible = function ()
{
	return this.visibilityStatus;
};




/** 
 * set opacity of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setOpacity = function (value) 
{
	this.opacity = value;
};

/** 
 * set rotation of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setRotation = function (value) 
{
	this.rotation = value;
};

/** 
 * set scale on x axys of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setScaleX = function (value) 
{
	this.scaleX = parseFloat(value);
	var oldWidth = this.getWidth();
	this.setWidth(this._naturalWidth * this.getScaleX());
	this.setX(this.getX() - (this.getWidth() - oldWidth) / 2);
};

/** 
 * set scale on y axys of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setScaleY = function (value) 
{
	this.scaleY = parseFloat(value);
	var oldHeight = this.getHeight();
	this.setHeight(this._naturalHeight * this.getScaleY());
	this.setY(this.getY() - (this.getHeight() - oldHeight) / 2);
};

/** 
 * set scale of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setScale = function (value) 
{
	this.setScaleX(parseFloat(value));
	this.setScaleY(parseFloat(value));
};

/** 
 * set image tag of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setImgTag = function (value) 
{
	this._imgTag = value;
	this._naturalWidth = this._imgTag.width;
	this._naturalHeight = this._imgTag.height;
};

/** 
 * set width of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setWidth = function (value) 
{
	this.getImgTag().width = value;
};

/** 
 * set height of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setHeight = function (value)
{
	this.getImgTag().height = value;
};

/** 
 * set x of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setX = function (value)
{
	this.x = value;
};

/** 
 * set y of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setY = function (value)
{
	this.y = value;
};

/** 
 * set active of the object (not implemented yet)
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setActive = function (status)
{
	if (undefined == status)
		status = true;
	
	this.activeStatus = status;
};

/** 
 * set focud on the object (not implemented yet)
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.focus = function (status)
{
	if (undefined == status)
		status = true;
	
	this.focusStatus = status;
};

/** 
 * set visibility of the object
 * @returns void
 */
freakdev.canvas.scene.Object.prototype.setVisible = function (status)
{
	if (undefined == status)
		status = true;
	
	this.visibilityStatus = status;
};


Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.DisplayGroup = Fkd.extend(freakdev.canvas.scene.Object);

/**
 * constructor
 * @param {Integer} x
 * @param {Integer} y
 * @param {Integer} width
 * @param {Integer} height
 */
freakdev.canvas.scene.DisplayGroup.prototype.init = function(x, y, width, height)
{
	/**
	 * atlas of elements that belongs to this display group
	 * @type Array
	 */
	this._atlas = [];
	
	this.targetCanvas = null;
	
	freakdev.canvas.scene.DisplayGroup.superClass.init.call(this, x, y, width, height);
};

/**
 * handle DOM event (mouse, keyboard event, etc...)
 * @param {freakdev.event.Event} e
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.handleDomEvent = function (e)
{
	for (var i=(this._atlas.length - 1); i>=0; i--) {
		var o = this._atlas[i];
		if (false == o.handleDomEvent.call(o, e)) 
			break;
	}	
	
	if (e.canPropagate())
		return freakdev.canvas.scene.DisplayGroup.superClass.handleDomEvent.call(this, e);
	else
		return false;
};

freakdev.canvas.scene.DisplayGroup.prototype._drawToTarget = function (target) { 

	for (var i=0,len=this._atlas.length; i<len; i++) {
		var o = this._atlas[i];
		o.renderTo(this.targetCanvas);
	}
	
};

/**
 * callback for threads in charge of rendering
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype._renderThreadCallback = function ()
{
	var threadBroker = freakdev.thread.Broker.getInstance();

	if (threadBroker.isFinished(this.getId())) {
		this._isRendering = false;
		this.setNeedToRender(false);
		this.renderTo(this.targetCanvas);
	}
};

/**
 * trigger rendering of each child
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.render = function ()
{
	if (this._isRendering)
		return;
	
	var threadBroker = freakdev.thread.Broker.getInstance();

	var threadGroupID = freakdev.utils.Uuid();
	
	for (var i=0,len=this._atlas.length; i<len; i++) {
		var o = this._atlas[i];

    	threadBroker.startThread(Fkd.createDelegate(o.render, o), [], Fkd.createDelegate(this._renderThreadCallback, this), this.getId());
	}
};

freakdev.canvas.scene.DisplayGroup.prototype._prepareTarget = function (target)
{
	if (this.opacity < 1 || 0 != this.rotation || 1 != this.getScaleX() || 1 != this.getScaleY()) {
		
		target.updateContext('globalAlpha', this.opacity);
		
		target.translateToObjectCenter(this);
		
		tmpX = this.getX(); tmpY = this.getY();
		this.setX(- (parseInt((this.getWidth() / 2))));
		this.setY(- (parseInt((this.getHeight() / 2))));

		for (var i=0,len=this._atlas.length; i<len; i++) {
			var o = this._atlas[i];
			o.setX(o.getX() + this.getX());
			o.setY(o.getY() + this.getY());
		}
		
		target.rotate(this.rotation);
		
		target.scale(this.getScaleX(), this.getScaleY());
	}	
};

freakdev.canvas.scene.DisplayGroup.prototype._restoreTarget = function (target)
{
	if (this.opacity < 1 || 0 != this.rotation || 1 != this.getScaleX() || 1 != this.getScaleY()) {
		
		target.restore(4);
		
		this.setX(tmpX);
		this.setY(tmpY);
		
		for (var i=0,len=this._atlas.length; i<len; i++) {
			var o = this._atlas[i];
			o.setX(o.getX() + this.getX());
			o.setY(o.getY() + this.getY());
		}		
		
	}	
};

/**
 * in charge all the rendering process for himself and its child and printing the rendered content on a target (canvas)
 * this method is called during the rendering process managed by the freakdev.canvas.Canvas Object 
 * @param {freakdev.canvas.Canvas} canvas
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.renderTo = function (canvas) 
{	
	if (undefined != canvas)
		this.targetCanvas = canvas;
	
	freakdev.canvas.scene.DisplayGroup.superClass.renderTo.call(this, this.targetCanvas);
};

/**
 * push an element at the end of the children stack (it will overlay all previously added children)
 * @param {freakdev.canvas.scene.Object} o
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.push = function (o)
{
	o.setContainer(this);
	this._atlas.push(o);
};

/**
 * remove the last element of the children stack
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.pop = function ()
{
	var o = this._atlas.pop();
	o.setContainer(null);
};

/**
 * add en element at the top of the children stack (it will be overlayed by all previously added children)
 * @param {freakdev.canvas.scene.Object} o
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.unshift = function (o)
{
	o.setContainer(this);
	this._atlas.unshift(o);
};

/**
 * remove the first element from the children stack
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.shift = function ()
{
	var o = this._atlas.shift();
	o.setContainer(null);
};

/**
 * insert an element at a given place in the children stack
 * @param {freakdev.canvas.scene.Object} o
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.insertAt = function (i, o)
{
	o.setContainer(this);
	this._atlas.splice(i, 0, o);
};

/**
 * remove an element at a given place in the children stack
 * @returns void
 */
freakdev.canvas.scene.DisplayGroup.prototype.removeAt = function (i)
{
	var o = this._atlas.splice(i, 1);
	o[0].setContainer(null);
};



Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.Scene = Fkd.extend(freakdev.canvas.scene.DisplayGroup);

/**
 * constructor
 * @param {freakdev.canvas.Canvas} target - Canvas object in which the scene will be rendered 
 */
freakdev.canvas.scene.Scene.prototype.init = function (target)
{	
	freakdev.canvas.scene.Scene.superClass.init.call(this, 0, 0, target.width, target.height);
	
	this.targetCanvas = target;
};

/**
 * in charge of rendering the scene
 * @param {freakdev.canvas.Canvas} [optional] canvas - set the target 
 * @returns void
 */
freakdev.canvas.scene.Scene.prototype.renderTo = function (canvas) 
{
	if (undefined != canvas)
		this.targetCanvas = canvas;
	
	ctx = this.targetCanvas.getContext();
	
	ctx.clearRect(0, 0, this.targetCanvas.getCanvas().width, this.targetCanvas.getCanvas().height);
	
	for (var i=0,len=this._atlas.length; i<len; i++) {
		var o = this._atlas[i];
		o.renderTo(this.targetCanvas);
	}
};

freakdev.canvas.scene.Scene.prototype.setVisible = function (status) { throw new Error('Can\'t change visibility status of the scene'); };

/**
 * resize the scene, this method is automatically called by the canvas 
 * @param {Integer} width
 * @param {Integer} height
 * @returns void
 */
freakdev.canvas.scene.Scene.prototype.resize = function (width, height)
{
	this.setWidth(width);
	this.setHeight(height);
};

Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.Image = Fkd.extend(freakdev.canvas.scene.Object);
/**
 * constructor
 * @param {String} domId - id attribute of an image tag
 * @param {Integer} x 
 * @param {Integer} y
 */
freakdev.canvas.scene.Image.prototype.init = function(domId, x, y)
{
	x = undefined == x ? 0 : x;
	y = undefined == y ? 0 : y;
	
	if (domId) {
		var node = freakdev.utils.Dom.get(domId);
		if (node) {
			freakdev.canvas.scene.Image.superClass.init.call(this, x, y);
			this.setImgTag(node);
			return;
		}
	}
	
	throw new Error('invalid tag');
};


Fkd.createNamespace('freakdev.canvas.scene');

/**
 * Abstract Class
 */
freakdev.canvas.scene.Shape = Fkd.extend(freakdev.canvas.scene.Object);

freakdev.canvas.scene.Shape.prototype.init = function()
{
	this._isMask = false;
	
	freakdev.canvas.scene.Shape.superClass.init.apply(this, arguments);
};

freakdev.canvas.scene.Shape.prototype.renderTo = function (canvas) 
{	
	if (undefined != canvas)
		this.targetCanvas = canvas;
	
	var ctx = this.targetCanvas.getContext('2d');
	
	if (!this.isMask()) {
		freakdev.canvas.scene.Shape.superClass.renderTo.call(this, this.targetCanvas);
	}
	else {
		ctx.beginPath();
		this.draw();
		ctx.closePath();
		ctx.save();
		ctx.clip();
	}
		
};

// abstract
freakdev.canvas.scene.Shape.prototype.draw = function ()
{
	throw new Error('should be implemented by the children class');
};

freakdev.canvas.scene.Shape.prototype.isMask = function ()
{
	return this._isMask;
};

freakdev.canvas.scene.Shape.prototype.setAsMask = function ()
{
	this._isMask = true;
	var em = freakdev.event.EventManager.getInstance();
	this._container.attachEvent('afterRenderTo', Fkd.createDelegate(function () {
		this.targetCanvas.restore();
	}, this));
	
};

Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.Path = Fkd.extend(freakdev.canvas.scene.Shape);

freakdev.canvas.scene.Path.prototype.init = function (points)
{
	freakdev.canvas.scene.Path.superClass.init.call(this);
	
	this._points = (undefined == points ? [] : points);
	
	/**
	 * internal canvas used for rendergin purpose only
	 * @type DOMCanvasNode
	 */
	this._canvas = document.createElement('canvas');
	
	/**
	 * pointer to store which points have been already rendered
	 * @type Integer
	 */
	this._renderIndex = 0;
	
	this.targetCanvas = null;
	
};

freakdev.canvas.scene.Path.setTarget = function (canvas) 
{
	this.targetCanvas = canvas;
};

freakdev.canvas.scene.Path.prototype.beginPath = function ()
{
	this.targetCanvas.getContext('2d').beginPath();
};

freakdev.canvas.scene.Path.prototype.closePath = function ()
{
	this.targetCanvas.getContext('2d').closePath();
};

freakdev.canvas.scene.Path.prototype.draw = function (pts, ctx)
{
	if (undefined == ctx)
		ctx = this.targetCanvas.getContext('2d');

	if (undefined == pts)
		pts = this._points;	
	
	if (pts.length) {
		ctx.moveTo(pts[0].x, pts[0].y);
		for (var i=1,len=pts.length; i<len; i++) {
			ctx.lineTo(pts[i].x, pts[i].y);
		}
	}
};

freakdev.canvas.scene.Path.prototype.render = function ()
{
	if (this._isRendering)
		return;
	
	this._isRendering = true;
	this.setNeedToRender(false);
	
	var ctx = this._canvas.getContext('2d');
		
	var tmpPt = this._points.slice(this._renderIndex);
	this._renderIndex = this._points.length > 2 ? this._points.length - 1 : 0;
	
	if (tmpPt.length) {
		this.draw(tmpPt, ctx);
		ctx.stroke();
		
		var img = new Image();
		
		img.onload = Fkd.createDelegate(function () {
			this.setImgTag(img);
			this._isRendering = false;
		}, this);
		img.src = this._canvas.toDataURL();
	}
	
	delete(ctx); delete(tmpPt);
	
};

freakdev.canvas.scene.Path.prototype.push = function (pt)
{
	this.setNeedToRender();
	
	this._points.push(pt);	
};

freakdev.canvas.scene.Path.prototype.setContainer = function (container)
{
	freakdev.canvas.scene.Path.superClass.setContainer.call(this, container);
	
	if (this._container) {
		this.setWidth(this._container.getWidth());
		this.setHeight(this._container.getHeight());
		this.setX(this._container.getX());
		this.setY(this._container.getY());
	}		
};

freakdev.canvas.scene.Path.prototype.setWidth = function (w) 
{
	this._canvas.width = w;
};

freakdev.canvas.scene.Path.prototype.setHeight = function (h) 
{
	this._canvas.height = h;
};


Fkd.createNamespace('freakdev.thread');

// design pattern singleton

// private
freakdev.thread.Broker = function () 
{
    this.init.apply(this, arguments);
};

freakdev.thread.Broker.instance = null;

freakdev.thread.Broker.getInstance = function ()
{
	if (!freakdev.thread.Broker.instance)
		freakdev.thread.Broker.instance = new freakdev.thread.Broker();
	
	return freakdev.thread.Broker.instance;
};

freakdev.thread.Broker.prototype.init = function () 
{
	this.nbStarted = 0;
	this.threads = [];
	this.threadStack = [];
};

freakdev.thread.Broker.prototype.startThread = function (fn, params, callback, groupID)
{
//	if (fn)
//		throw new Error('No fn given');	
	
	if (undefined == groupID)
		groupID = new Date().getTime();
	
	groupID = groupID.toString();
	
	if (undefined == params)
		params = [];
	
	if (undefined == callback)
		callback = function () {};
	
	var t = new freakdev.thread.Thread(fn, params, callback);
		
	if (undefined == this.threads[groupID] || null == this.threads[groupID]) {
		this.threads[groupID] = [t];
		this.threadStack.push(groupID);
	}		
	else
		this.threads[groupID].push(t);
		
	var script = document.createElement("script");
	script.src  = "data:text/javascript,";
	script.onload = Fkd.createDelegate(function () {
		document.body.removeChild(script);
		this.processStack();
	}, this);
	document.getElementsByTagName('body').item(0).appendChild(script);
	
};

freakdev.thread.Broker.prototype.processStack = function ()
{
	
	this.nbStarted++;
	
	var groupID = this.threadStack[0];	
	
	if (!this.threads[groupID])
		return; 
	
	var t = this.threads[groupID].shift();
	
	var r = t.run();
		
	this.nbStarted--;
	
	if (0 == this.threads[groupID].length) {
		delete(this.threads[groupID]);
		this.threadStack.splice(0, 1);
	}
	
	t.callback(r);
};

freakdev.thread.Broker.prototype.isFinished = function (groupID)
{
	var r = (this.threadStack.indexOf(groupID.toString()) == -1 ? true : false);
	return r;
};


Fkd.createNamespace('freakdev.thread');

freakdev.thread.Thread = function () 
{
	this.init.apply(this, arguments);
};

freakdev.thread.Thread.prototype.init = function (fn, params, callback)
{
	this.fn = fn;
	this.params = params;
	this.callback = callback;
};

freakdev.thread.Thread.prototype.run = function ()
{		
	return this.fn (this.params);
};	
	
})();

