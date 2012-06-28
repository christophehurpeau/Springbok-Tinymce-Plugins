(function() {
	var DOM = tinymce.DOM;

	tinymce.create('tinymce.plugins.Springbok', {
		init : function(ed, url) {
			
			ed.onSaveContent.add(function(ed,o){
				// when in is "HTML" mode (S.tinymce.switch)
				if( ed.isHidden() ) o.content = o.element.value;
			});

		},

		getInfo : function() {
			return {
				longname : 'Springbok Plugin',
				author : 'Springbok',
				authorurl : 'http://springbok-framework.com',
				infourl : 'http://springbok-framework.com',
				version : '3.0'
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('springbok', tinymce.plugins.Springbok);
})();

