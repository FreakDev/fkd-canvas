<?php
include ('builder.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>
<script type="text/javascript" src="freakdev.js"></script>
<!--<script type="text/javascript" src="freakdev-build.js"></script>-->
<script type="text/javascript">

var waffleImg, marseilleImg;

window.onload = function () {	
	var bgCanvas = new freakdev.canvas.Canvas(); 
    
    bgCanvas.resize(900, 600);
  
    marseilleImg = new freakdev.canvas.scene.Image('marseille');
    bgCanvas.scene.push(marseilleImg);

    waffleImg = new freakdev.canvas.scene.Image('waffle', 30, 30);
    waffleImg.setOpacity(0.3);
    bgCanvas.scene.push(waffleImg);

    bgCanvas.runAutoRender();
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
<div>
Change opacity of the waffle picture
<select onchange="waffleImg.setOpacity(this.value)">
    <option value="0.1">10%</option>
    <option value="0.3" selected="selected">30%</option>
    <option value="0.6">60%</option>
    <option value="0.8">80%</option>
    <option value="1">100%</option>
</select>
</div>
<div>
Show / hide the background picture
<input type="checkbox" checked="checked"" onchange="marseilleImg.setVisible((this.checked ? true : false))" />
</div>
<div id="poorman-console"></div>
</body>
</html>