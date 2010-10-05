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