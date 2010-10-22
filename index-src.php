<?php
include ('builder.php');
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>
<script type="text/javascript" src="freakdev.js"></script>
<!--<script type="text/javascript" src="fkdCanvas-build.js"></script>-->
<script type="text/javascript">

var waffleImg, marseilleImg, myGroup, layer, path, bgCanvas;

var trackActive = false;

var trackMouse = function (e) {

	switch (e.type) {
        case freakdev.event.MOUSE_DOWN:
            if (this._shouldHandleMouseEvent(e)) {
            	trackActive = true;
            	this.setAnchorPoint(e.x - this.getX(), e.y - this.getY());

            	return e.stopPropagation();
            }
            break;
        case freakdev.event.MOUSE_UP:
		    trackActive = false;
		    this.resetAnchorPoint();
		    break;
        case freakdev.event.MOUSE_MOVE:
        	if (trackActive) {
            	this.setX(e.x - this._anchorPoint.x);
            	this.setY(e.y - this._anchorPoint.y);
        	}
            break;
	}
};


var rotateActive = false;
var initAngle = 0;

var mouseRotate = function (e) {

    var imgCenter = {
        x: this.getX() + this.getWidth() / 2,
        y: this.getY() + this.getHeight() / 2
    };

    var R  = (this.getWidth() > this.getHeight() ? this.getWidth() : this.getHeight()) / 2;

    var calcAngle = function (x, y) {
        
        var scale = 1 / Math.sqrt(Math.pow(x - imgCenter.x, 2) + Math.pow(y - imgCenter.y, 2));
        
        var rot = Math.acos(Math.abs(x - imgCenter.x) * scale);

        if (x > imgCenter.x) {
            if (y > imgCenter.y) {
                rot = 2*Math.PI - rot;
            }
        } else {
            if (y > imgCenter.y) {
            	rot += Math.PI;
            } else {
            	rot = Math.PI - rot;
            }
        }

        return rot;
    };   
    
    switch (e.type) {
        case freakdev.event.MOUSE_DOWN:
            
            if (e.x >= imgCenter.x - R && e.x <= imgCenter.x + R && e.y >= imgCenter.y - R && e.y <= imgCenter.y + R && e.y) {
            	rotateActive = true;
                this.setAnchorPoint(e.x - this.getX(), e.y - this.getY());

                initAngle  = this.getRotation() * Math.PI / 180 + calcAngle(e.x, e.y);
                return e.stopPropagation();                
            }
            break;
        case freakdev.event.MOUSE_UP:
        	rotateActive = false;
            this.resetAnchorPoint();
            break;
        case freakdev.event.MOUSE_MOVE:
            if (rotateActive) {
                var angle  = calcAngle(e.x, e.y);
                
                this.setRotation( (initAngle - angle) * 180 / Math.PI  );
            }
            break;
    }
    
};


var currentPath = null;
var drawActive = false;

var drawMouse = function (e) {

    switch (e.type) {
        case freakdev.event.MOUSE_DOWN:
            currentPath = new freakdev.canvas.scene.Path();
            currentPath.push(new freakdev.math.Point(e.x, e.y));
            this.push(currentPath);
            drawActive = true;
            break;
        case freakdev.event.MOUSE_UP:
        case freakdev.event.MOUSE_OUT:
        	drawActive = false;
        	//currentPath = null;
            break;
        case freakdev.event.MOUSE_MOVE:
            if (drawActive) {
            	currentPath.push(new freakdev.math.Point(e.x, e.y));
            }
            break;
    }
};


window.onload = function () {

    var stepsTitle = document.getElementsByTagName('h2');
    for (var i=0, len=stepsTitle.length; i<len; i++) {
        stepsTitle.item(i).onclick = Fkd.createDelegate(function (e) {
            var id = ['div-', this.id].join('');

            var disp = document.getElementById(id).style.display;
            document.getElementById(id).style.display = disp == 'none' ? 'block' : 'none';
            
        }, stepsTitle.item(i));

        if (i>0 && i < (len - 1)) {
            var id = ['div-', stepsTitle.item(i).id].join('');
            document.getElementById(id).style.display = 'none';
        }
            
    }
	
    //freakdev.utils.Debug.setDebugPanel('poorman-console');
	
	bgCanvas = new freakdev.canvas.Canvas();
	bgCanvas.getCanvas().id = 'fkdcanvas'; 

    bgCanvas.setDomPlaceholder('canvas-div');
    
    bgCanvas.resize(700, 500);

    bgCanvas.startAutoRender();
    
    marseilleImg = new freakdev.canvas.scene.Image('marseille', 30, 10);
    bgCanvas.scene.push(marseilleImg);

    
    layer = new freakdev.canvas.scene.DisplayGroup(0, 0, 700, 500);
    layer.setId('layer');
    bgCanvas.scene.push(layer);
    
    layer.addEventListener(freakdev.event.MOUSE_DOWN, Fkd.createDelegate(drawMouse, layer));
    layer.addEventListener(freakdev.event.MOUSE_MOVE, Fkd.createDelegate(drawMouse, layer));
    layer.addEventListener(freakdev.event.MOUSE_UP, Fkd.createDelegate(drawMouse, layer));
    layer.addEventListener(freakdev.event.MOUSE_OUT, Fkd.createDelegate(drawMouse, layer)); 

    
    myGroup = new freakdev.canvas.scene.DisplayGroup(0, 0, 700, 500);
    bgCanvas.scene.push(myGroup);

    waffleImg = new freakdev.canvas.scene.Image('waffle', 50, 60);
    waffleImg.setId('waffle');
    waffleImg.setOpacity(0.3);

    waffleImg.addEventListener(freakdev.event.MOUSE_DOWN, Fkd.createDelegate(trackMouse, waffleImg));
    waffleImg.addEventListener(freakdev.event.MOUSE_MOVE, Fkd.createDelegate(trackMouse, waffleImg));
    waffleImg.addEventListener(freakdev.event.MOUSE_UP, Fkd.createDelegate(trackMouse, waffleImg));

    myGroup.push(waffleImg);

    coffeeImg = new freakdev.canvas.scene.Image('coffee', 400, 100);
    coffeeImg.setId('coffee');

    coffeeImg.addEventListener(freakdev.event.MOUSE_DOWN, Fkd.createDelegate(mouseRotate, coffeeImg));
    coffeeImg.addEventListener(freakdev.event.MOUSE_MOVE, Fkd.createDelegate(mouseRotate, coffeeImg));
    coffeeImg.addEventListener(freakdev.event.MOUSE_UP, Fkd.createDelegate(mouseRotate, coffeeImg));  
    
    myGroup.push(coffeeImg); 
    
};
</script>
<style>
    #title { width: 150px; margin:0 auto 20px auto; }
    
    h2 { cursor:pointer; }

    #control-panel { float: left; width: 600px; }
    
    #canvas-div { margin-left: 610px; }
    #fkdcanvas { border: 1px solid black; }
    
    #assets { display:none; }
</style>
</head>
<body>
    <div>
        <h1 id="title">FkdCanvas</h1>
    </div>
    <div id="control-panel">
        <div>
            <h2 id="step-1">Step 1 - Initialize canvas</h2>
            <div id="div-step-1"> 
                <div class="code"><pre>
  var bgCanvas = new freakdev.canvas.Canvas();
  bgCanvas.resize(700, 500);  
  bgCanvas.startAutoRender();
                </pre></div>
            </div>
        </div>
        <div>
            <h2 id="step-2">Step 2 - Adding elements</h2>
            <div id="div-step-2">    
                <div class="code"><pre>
  marseilleImg = new freakdev.canvas.scene.Image('marseille', 30, 10);
  bgCanvas.scene.push(marseilleImg);

  // create a group of element
  myGroup = new freakdev.canvas.scene.DisplayGroup(0, 0, 700, 500);
  bgCanvas.scene.push(myGroup);

  waffleImg = new freakdev.canvas.scene.Image('waffle', 50, 60);
  myGroup.push(waffleImg);

  coffeeImg = new freakdev.canvas.scene.Image('coffee', 400, 100);
  myGroup.push(coffeeImg);

                </pre></div>
            </div>
        </div>
        <div>
            <h2 id="step-3">Step 3 - Playing with them</h2>
            <div id="div-step-3">    
                <div>
                    Change opacity of the waffle picture
                    <select onchange="waffleImg.setOpacity(this.value)">
                        <option value="0.1">10%</option>
                        <option value="0.3" selected="selected">30%</option>
                        <option value="0.6">60%</option>
                        <option value="0.8">80%</option>
                        <option value="1">100%</option>
                    </select>
                    <div class="code"><pre>  waffleImg.setOpacity(value)</pre></div>
                </div>
                <div>
                    Rotate the waffle picture
                    <select onchange="waffleImg.setRotation(this.value)">
                        <option value="-30">30° (anticlockwise)</option>
                        <option value="0" selected="selected">0°</option>
                        <option value="30">30°</option>
                        <option value="45">45°</option>
                        <option value="90">90°</option>
                        <option value="130">130°</option>
                    </select>
                    <div class="code"><pre>  waffleImg.setRotation(value)</pre></div>
                </div>
                <div>
                    Resize the waffle picture
                    <select onchange="waffleImg.setScale(this.value)">
                        <option value="0.5">Small</option>
                        <option value="1" selected="selected">Normal</option>
                        <option value="1.5">Big</option>
                    </select>
                    <div class="code"><pre>  waffleImg.setScale(value)</pre></div>
                </div>
                <div>
                    Show / hide the background picture
                    <input type="checkbox" checked="checked"" onchange="marseilleImg.setVisible((this.checked ? true : false))" />
                    <div class="code"><pre>  marseilleImg.setVisible(value)</pre></div>
                </div>
                <div>
                    Show / hide a group of element
                    <input type="checkbox" checked="checked"" onchange="myGroup.setVisible((this.checked ? true : false))" />
                    <div class="code"><pre>  myGroup.setVisible(value)</pre></div>
                </div>
<!--                <div>-->
<!--                    Rotate a group of element-->
<!--                    <select onchange="myGroup.setRotation(this.value)">-->
<!--                        <option value="-30">30° (anticlockwise)</option>-->
<!--                        <option value="0" selected="selected">0°</option>-->
<!--                        <option value="30">30°</option>-->
<!--                        <option value="45">45°</option>-->
<!--                        <option value="90">90°</option>-->
<!--                        <option value="130">130°</option>-->
<!--                    </select>-->
<!--                    <div class="code"><pre>  waffleImg.setRotation(value)</pre></div>-->
<!--                </div>-->
            </div>
        </div>
        <div>
            <h2 id="step-4">Step 4 - What about events handler</h2>
            <div id="div-step-4">
                Mainly used DOM event are available, and you can attach listener to a any object inside your scene
                <div class="code"><pre>
  // drag'n'drop
  waffleImg.addEventListener(freakdev.event.MOUSE_DOWN, waffleHandler);
  waffleImg.addEventListener(freakdev.event.MOUSE_MOVE, waffleHandler);
  waffleImg.addEventListener(freakdev.event.MOUSE_UP, waffleHandler);

  // rotation with the mouse
  coffeeImg.addEventListener(freakdev.event.MOUSE_DOWN, coffeeHandler);
  coffeeImg.addEventListener(freakdev.event.MOUSE_MOVE, coffeeHandler);
  coffeeImg.addEventListener(freakdev.event.MOUSE_UP, coffeeHandler);
                </pre></div>
  <!--input type="button" onclick="currentPath.setAsMask();" value="set as mask" /-->
            </div>
        </div>
        <div>
            <h2>Step 5 - Enjoy !</h2>
            Download latest release (alpha) :<br /> 
            - Minified (20kb) => <a href="fkdCanvas-build.js">fkdCanvas-build.js</a><br />
            - Checkout on Google Code => <a href="http://code.google.com/p/fkd-canvas/">http://code.google.com/p/fkd-canvas/</a><br />
            - Fork on GitHub => <a href="http://github.com/FreakDev/fkd-canvas">http://github.com/FreakDev/fkd-canvas</a><br />
            <br />
            <br />
            By the way, you may want to save your master piece => <a href="javascript:document.location.href=bgCanvas.getCanvas().toDataURL().replace('image/png', 'image/octet-stream');">save</a>
        </div>    
        <div id="poorman-console"></div>
    </div>

    <div id="canvas-div">
        <div id="assets">
            <img src="waffle.jpg" id="waffle">
            <img src="marseille.jpg" id="marseille">
            <img src="coffee.jpg" id="coffee">
        </div>
    </div>

</body>
</html>