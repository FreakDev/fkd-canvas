Fkd.createNamespace('freakdev.canvas.scene');

freakdev.canvas.scene.Shape = Fkd.extend(freakdev.canvas.scene.Object);

freakdev.canvas.scene.Shape.prototype.init = function(width, height, x, y)
{
	freakdev.canvas.scene.Shape.superClass.init.apply(this, arguments);
	
	var data = [], i = 0;
	for (var j=0; j<height; j++) {
		for (var k=0; k<width; k++) {
			data[i] = data[++i] = data[++i] = 0;
			data[++i] = 255;
			++i;
		}		
	}
	this.pxMap.setData(data);
};

//freakdev.canvas.scene.Shape.prototype.renderTo = function(target)
//{	
//	target.putImageData(this.pxMap.data, 0, 0, this.width, this.height);
//};
