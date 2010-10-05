<?php
include ('builder.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>
<script type="text/javascript" src="freakdev.js"></script>
<script type="text/javascript">

window.onload = function () {
	var dh = freakdev.utils.Dom;
	
	var bgCanvas = new freakdev.canvas.Canvas(); 
	//bgCanvas.canvasNode.id = "background";

//    if (navigator.userAgent.indexOf('Safari') != -1)
//        freakdev.utils.Debug.setDebugPanel('poorman-console');
    	
    //bgCanvas.loadImage('waffle');
    //bgCanvas.loadImage('marseille');
    
    bgCanvas.resize(900, 600);

    var start = new Date().getTime();
  
    var testFn = function () {
        var img = new freakdev.canvas.scene.Image('marseille', parseInt(Math.random() * 250), parseInt(Math.random() * 250));
        bgCanvas.scene.push(img);
    };

    var i = freakdev.thread.Broker.getInstance();

    var cb = function ()
    {
        if (i.isFinnished(15)) {
            bgCanvas.render();
        }        
    };

    for (j=0; j<10; j++) {
        i.startThread(testFn, [], cb, 15);
    }

    //i.startThread({'fn': bgCanvas.render, 'scope':bgCanvas}, [], cb, 15);

//    var tmp = new Date().getTime();
//    while (!i.isFinnished(15) && (tmp - start) < 3000)
//    {    	
//        console.log('waiting for thread processing till ' + (tmp - start))
//        tmp = new Date().getTime();
//    }
    
    //for (i=0; i<40; i++) {
        //bgCanvas.addShape();
    //}
    
    /*
    bgCanvas.addEffect('filllight', {'limit' : 0.2, 'gain': 30});
    bgCanvas.addEffect('recover', {'value' : 0.7});
    bgCanvas.addEffect('saturation', {'value' : 0.0});
    */
    
    var end = new Date().getTime();
    freakdev.utils.Debug.print('done in ' + (end - start) + ' milliseconds');
    
    /*
    toolsCanvas = new freakdev.canvas.ToolsLayer();
    toolsCanvas.canvasNode.id = 'tools';
    toolsCanvas.setTarget(bgCanvas);
	toolsCanvas.render();

	toolsCanvas.setBrushSize(20);
	toolsCanvas.addEffect('saturation', {'value' : 0.0});
	toolsCanvas.activateMouseTraking();
	*/
	 
};
</script>
<style>
    #background { position: absolute; top:100; left:100; }
    #tools      { position: absolute; top:100; left:100; cursor:crosshair; opacity:0.3 }
</style>
</head>
<body>
<div>
    <img style="display:none" src="waffle.jpg" id="waffle">
    <img style="display:none" src="marseille.jpg" id="marseille">
    <!-- canvas width="200" height="333" id="canvas"></canvas -->
</div>
<div><input type="button" value="Apply" onclick="toolsCanvas.applyFilters();"></div>
<select onchange="toolsCanvas.setBrushSize(this.value);">
    <option value="10">10</option>
    <option value="20" selected="selected">20</option>
    <option value="30">30</option>
    <option value="50">50</option>
    <option value="100">100</option>
</select>
Select a brush size, paint on the picture, and then click "apply"
<div id="poorman-console"></div>
</body>
</html>