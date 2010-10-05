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
