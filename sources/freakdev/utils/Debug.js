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