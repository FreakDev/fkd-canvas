//version 0.1
(function () {
	


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
	
	

Fkd.createNamespace('freakdev.utils');

freakdev.utils.Dom = (function () 
{	
	return {
		get: function (idAttr) {
			return document.getElementById(idAttr);
		},
		getByTagName: function (name) {
			return document.getElementsByTagName(name);
		}
	};
})();

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

Fkd.createNamespace('freakdev.canvas.image');

freakdev.canvas.image.Pixel = function (comp1, comp2, comp3, comp4, mode)
{
	
	this.red;
	this.green;
	this.blue;
	this.hue;
	this.saturation;
	this.luminosity;
	
	this.alpha;
	
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

freakdev.canvas.Canvas.CLICK = 'click';
freakdev.canvas.Canvas.DBLCLICK = 'dblclick';

freakdev.canvas.Canvas.MOUSE_DOWN = 'mousedown';
freakdev.canvas.Canvas.MOUSE_MOVE = 'mousemove';
freakdev.canvas.Canvas.MOUSE_OUT = 'mouseout';
freakdev.canvas.Canvas.MOUSE_OVER = 'mouseover';
freakdev.canvas.Canvas.MOUSE_UP = 'mouseup';

freakdev.canvas.Canvas.KEY_DOWN = 'keydown';
freakdev.canvas.Canvas.KEY_PRESS = 'keypress';
freakdev.canvas.Canvas.KEY_UP = 'keyup';

freakdev.canvas.Canvas.EVENTS = ['click', 'dblclick', 'mousedown', 
                                 'mousemove', 'mouseout', 'mouseover', 
                                 'mouseup', 'keydown', 'keypress', 'keyup'];

freakdev.canvas.Canvas.prototype.init = function (domCanvasId)
{	
		
	// shorthands
	this.Dom = freakdev.utils.Dom;
	this.Debug = freakdev.utils.Debug;	

	this.insertedToDom = false;
	
	this.canvasNode;
	this.getCanvas(undefined != domCanvasId ? domCanvasId : false);

	this._autoRenderTimer;
	this._isRendering;
	
	this.scene;	
	this._initScene();
	this._initEvent();
};

freakdev.canvas.Canvas.prototype._initScene = function ()
{
	this.scene = new freakdev.canvas.scene.Scene(this.getCanvas());
	this.scene.setId('scene');
};

freakdev.canvas.Canvas.prototype._initEvent = function ()
{
	for (var i in freakdev.canvas.Canvas.EVENTS) {
		this.getCanvas().addEventListener(freakdev.canvas.Canvas.EVENTS[i], Fkd.createDelegate(this.scene.handleEvent, this.scene), true);
	}
};

freakdev.canvas.Canvas.prototype.getCanvas = function (idAttr)
{
	if (!this.canvasNode) {
		if (idAttr) {
			this.canvasNode = this.Dom.get(idAttr);
			this.insertedToDom = true;
		} else {
			this.canvasNode = document.createElement('canvas');
		}
	}
	return this.canvasNode;
};

freakdev.canvas.Canvas.prototype.getContext = function ()
{
	return this.getCanvas().getContext('2d');
};

freakdev.canvas.Canvas.prototype.resize = function (width, height)
{
	this.getCanvas().width = width;
	this.getCanvas().height = height;
	
	this._initScene();
};

freakdev.canvas.Canvas.prototype.query = function (queryString)
{
	
};

freakdev.canvas.Canvas.prototype.render = function ()
{
	this._isRendering = true;
	
	if (this.scene.isRenderNeeded()) {
		this.scene.renderTo(this.getContext());
	}
	
	if (!this.insertedToDom) {
		var pNode;
		if (arguments.length) {
			pNode = this.Dom.get(arguments[0]);
		} else {
			pNode = this.Dom.getByTagName('body').item(0);
		}
		pNode.appendChild(this.getCanvas());
	}

	this._isRendering = false;
};

freakdev.canvas.Canvas.prototype.runAutoRender = function (fps)
{
	if (undefined == fps)
		fps = 40;
	
	var interval = parseInt(1000 / fps);
	
	this._autoRenderTimer = setInterval(Fkd.createDelegate(this.render, this), interval);
};

freakdev.canvas.Canvas.prototype.stopAutoRender = function () 
{
	clearInterval(this._autoRenderTimer);
};



Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.Object = function ()
{
	this.init.apply(this, arguments);
};

freakdev.canvas.scene.Object.prototype.init = function(x, y, width, height)
{
	this.id = freakdev.utils.Uuid();
	this._imgTag = new Image((width ? width : null), (height ? height : null));
	
	this.x = undefined == x ? 0 : x;
	this.y = undefined == y ? 0 : y;
	this.activeStatus = false;
	this.focusStatus = false;
	this.visibilityStatus = true;
	this.opacity = 1;
	//this.effectPool = new freakdev.canvas.image.EffectPool();
	
	this._container;
	this._needToRender = true;
	
	this._eventListeners = [];
};

freakdev.canvas.scene.Object.prototype.setId = function (value) 
{
	this.id = value;
};

freakdev.canvas.scene.Object.prototype.getId = function () 
{
	return this.id;
};

freakdev.canvas.scene.Object.prototype.renderTo = function (target) 
{
	if (this.isVisible()) {
		if (this._needToRender)
			this.render();
		
		if (this.opacity < 1) {
			target.save();
			target.globalAlpha = this.opacity;
		}		
		
		this._drawToTarget(target);
		
		if (this.opacity < 1)
			target.restore();		
	}
};

freakdev.canvas.scene.Object.prototype._drawToTarget = function (target)
{
	target.drawImage(this.getImgTag(), this.x, this.y, this.getWidth(), this.getHeight());	
}

freakdev.canvas.scene.Object.prototype.needToRender = function ()
{
	this._needToRender = true;
	this._container.needToRender();
};

freakdev.canvas.scene.Object.prototype.isRenderNeeded = function ()
{
	return this._needToRender;
};

freakdev.canvas.scene.Object.prototype.setContainer = function (obj)
{
	this._container = obj;
}

freakdev.canvas.scene.Object.prototype.render = function () 
{
	this._needToRender = false;
	//this.effectPool.apply(this);
};

freakdev.canvas.scene.Object.prototype.isEventHandled = function (eventName)
{
	if (this._eventListeners[eventName])
		return true;
	else 
		return false;
}

freakdev.canvas.scene.Object.prototype.handleEvent = function (e)
{
	if (!e.type)
		throw Error('Invalid event');
	
	if (!this.isEventHandled(e.type))
		return false;
	
	if (this._shouldHandleEvent(e)) {
		for (var j=0,len=this._eventListeners[e.type].length; j<len; j++) {
			Fkd.call_fn_array(this._eventListeners[e.type][j], [e]);
		}
		return true;
	} else {
		return false;
	}
};

freakdev.canvas.scene.Object.prototype.removeEventListeners = function (eventName, listener) 
{
	if (!this.isEventHandled(eventName))
		return
		
	if (listener) {
		this._eventListeners[eventName].splice(indexof(listener, this._eventListeners[eventName]), 1);
		if (0 == this._eventListeners[eventName].length)
			this._eventListeners[eventName] = null;
	} else {
		this._eventListeners[eventName] = null;
	}
};

freakdev.canvas.scene.Object.prototype.addEventListener = function (eventName, listener) 
{
	if (!this.isEventHandled(eventName))
		this._eventListeners[eventName] = [];		
		
	this._eventListeners[eventName].push(listener);
};

freakdev.canvas.scene.Object.prototype._shouldHandleEvent = function (event)
{
	return false;
};

freakdev.canvas.scene.Object.prototype.getWidth = function () 
{
	return this.getImgTag().width;
};

freakdev.canvas.scene.Object.prototype.getHeight = function ()
{
	return this.getImgTag().height;
};

freakdev.canvas.scene.Object.prototype.getX = function () 
{
	return this.x;
};

freakdev.canvas.scene.Object.prototype.getY = function ()
{
	return this.y;
};

freakdev.canvas.scene.Object.prototype.getImgTag = function ()
{
	return this._imgTag;
};

freakdev.canvas.scene.Object.prototype.getOpacity = function ()
{
	return this.opacity;
};

freakdev.canvas.scene.Object.prototype.setOpacity = function (value) 
{
	this.opacity = value;
};

freakdev.canvas.scene.Object.prototype.setImgTag = function (value) 
{
	this._imgTag = value;
};

freakdev.canvas.scene.Object.prototype.setWidth = function (value) 
{
	this.getImgTag().width = value;
};

freakdev.canvas.scene.Object.prototype.setHeight = function (value)
{
	this.getImgTag().height = value;
};

freakdev.canvas.scene.Object.prototype.setX = function (value)
{
	this.x = value;
};

freakdev.canvas.scene.Object.prototype.setY = function (value)
{
	this.y = value;
};

freakdev.canvas.scene.Object.prototype.setActive = function (status)
{
	if (undefined == status)
		status = true;
	
	this.activeStatus = status;
};

freakdev.canvas.scene.Object.prototype.isActive = function ()
{
	return this.activeStatus;
};

freakdev.canvas.scene.Object.prototype.focus = function (status)
{
	if (undefined == status)
		status = true;
	
	this.focusStatus = status;
};

freakdev.canvas.scene.Object.prototype.hasFocus = function ()
{
	return this.focusStatus;
};

freakdev.canvas.scene.Object.prototype.setVisible = function (status)
{
	if (undefined == status)
		status = true;
	
	this.visibilityStatus = status;
};

freakdev.canvas.scene.Object.prototype.isVisible = function ()
{
	return this.visibilityStatus;
};


Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.DisplayGroup = Fkd.extend(freakdev.canvas.scene.Object);

freakdev.canvas.scene.DisplayGroup.prototype.init = function(x, y, width, height)
{
	this._atlas = [];
	
	freakdev.canvas.scene.DisplayGroup.superClass.init.call(this, x, y, width, height);
};

freakdev.canvas.scene.DisplayGroup.prototype._drawToTarget = function (target)
{	
	for (var i=0,len=this._atlas.length; i<len; i++) {
		var o = this._atlas[i];
		o.renderTo(target);
	}
};

freakdev.canvas.scene.DisplayGroup.prototype.render = function ()
{
	var threadBroker = freakdev.thread.Broker.getInstance();

	var threadGroupID = freakdev.utils.Uuid();
	
	for (var i=0,len=this._atlas.length; i<len; i++) {
		var o = this._atlas[i];

    	threadBroker.startThread({fn:o.render, scope:o}, [], null, threadGroupID);
	}
	
	// wait for all process to be finnished
	while(!threadBroker.isFinnished(threadGroupID)) { }
}

freakdev.canvas.scene.DisplayGroup.prototype.push = function (o)
{
	o.setContainer(this);
	this._atlas.push(o);
};

freakdev.canvas.scene.DisplayGroup.prototype.pop = function ()
{
	var o = this._atlas.pop();
	o.setContainer(null);
};

freakdev.canvas.scene.DisplayGroup.prototype.unshift = function (o)
{
	o.setContainer(this);
	this._atlas.unshift(o);
};

freakdev.canvas.scene.DisplayGroup.prototype.shift = function ()
{
	var o = this._atlas.shift();
	o.setContainer(null);
};

freakdev.canvas.scene.DisplayGroup.prototype.insertAt = function (i, o)
{
	o.setContainer(this);
	this._atlas.splice(i, 0, o);
};

freakdev.canvas.scene.DisplayGroup.prototype.removeAt = function (i)
{
	var o = this._atlas.splice(i, 1);
	o[0].setContainer(null);
};



Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.Scene = Fkd.extend(freakdev.canvas.scene.DisplayGroup);

freakdev.canvas.scene.Scene.prototype.init = function (target)
{	
	this.targetCanvas = target;
	
	freakdev.canvas.scene.Scene.superClass.init.call(this, 0, 0, this.targetCanvas.width, this.targetCanvas.height);	
};

freakdev.canvas.scene.Scene.prototype.render = function () 
{
	//freakdev.canvas.scene.Scene.superClass.renderTo(this.targetCanvas.getContext('2d'));
};

freakdev.canvas.scene.Scene.prototype.renderTo = function () 
{

	ctx = this.targetCanvas.getContext('2d');
	
	ctx.clearRect(0, 0, this.targetCanvas.width, this.targetCanvas.height);
	
	for (var i=0,len=this._atlas.length; i<len; i++) {
		var o = this._atlas[i];
		o.renderTo(ctx);
	}

};

Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.Image = Fkd.extend(freakdev.canvas.scene.Object);

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


Fkd.createNamespace('freakdev.thread');

// design pattern singleton

// private
freakdev.thread.Broker = function () 
{
    this.init.apply(this, arguments);
};

freakdev.thread.Broker.instance;

freakdev.thread.Broker.getInstance = function ()
{
	if (!freakdev.thread.Broker.instance)
		freakdev.thread.Broker.instance = new freakdev.thread.Broker();
	
	return freakdev.thread.Broker.instance;
};

freakdev.thread.Broker.prototype.init = function () 
{
	this.maxSimul = 10;
	this.nbStarted = 0;
	this.threads = [];
	this.threadStack = [];
	this.timerID;
	this.timerOn = false;
};



freakdev.thread.Broker.prototype.setMaxSimultaneous = function (value) 
{
	this.maxSimul = parseInt(value);
};

freakdev.thread.Broker.prototype.startTimer = function ()
{
	this.timerOn = true;
	this.timerID = setInterval(Fkd.createDelegate(this.processStack, this), 1);
};

freakdev.thread.Broker.prototype.stopTimer = function ()
{
	this.timerOn = false;
	clearInterval(this.timerID);
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
	
	if (!this.timerOn)
		this.startTimer();
};

freakdev.thread.Broker.prototype.processStack = function ()
{
	if (this.nbStarted >= this.maxSimul)
		return;
	
	this.nbStarted++;
	
	if (!this.threadStack[0]) {
		this.stopTimer();
		return;
	}
	
	var groupID = this.threadStack[0];	
	
	if (!this.threads[groupID])
		return; 
	
	var t = this.threads[groupID].shift();
	
	var r = t.run();
	
	if (t.callback.scope && t.callback.fn) {
		scope = t.callback.scope;
		fn = t.callback.fn;
	} else {
		scope = window;
		fn = t.callback;
	}	
	
	this.nbStarted--;
	
	if (0 == this.threads[groupID].length) {
		this.threads[groupID] = null;
		this.threadStack.splice(0, 1);
	}
	
	if (0 == this.threadStack.length) {
		this.stopTimer();
	}
	
	fn.call(scope, r);
};

freakdev.thread.Broker.prototype.isFinnished = function (groupID) 
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
	var fn, scope;
	if (this.fn.scope && this.fn.fn) {
		scope = this.fn.scope;
		fn = this.fn.fn;
	} else {
		scope = window;
		fn = this.fn;
	}
		
	return fn.apply(scope, this.params);
		
};
	
})();

