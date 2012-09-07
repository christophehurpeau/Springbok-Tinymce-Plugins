(function() {
	var DOM = tinymce.DOM;

	tinymce.create('tinymce.plugins.SpringbokClean', {
		init : function(ed, url) {
			var t=this;
			ed.onInit.add(function(ed) {
				ed.onBeforeSetContent.add(function(ed,o) {
					if( o.content ) o.content=t.cleanHTML(o.content);
				});
				ed.onSaveContent.add(function(ed,o){
					if( o.content ) o.content=t.cleanHTML(o.content);
				});
			});
		},
		
		cleanHTML:function(content){
			// remove invalid parent paragraphs when pasting HTML and/or switching to the HTML editor and back
			content = content.replace(/<\/p>\s*/g,"</p>\n")
					.replace(/<p>\s*<(p|div|ul|ol|dl|table|blockquote|h[1-6]|fieldset|pre|address)( [^>]*)?>/gi, '<$1$2>')
					.replace(/<\/(p|div|ul|ol|dl|table|blockquote|h[1-6]|fieldset|pre|address)>\s*<\/p>/gi, '</$1>')
					.replace(/style="([^"]+)"/gi,function(str,p1,offset,s){ return 'style="'+p1.replace(/\s*([;|:])\s*/g,'$1')+'"'; })
				;
			var i=4;
			while(i-- > 0){
				content = content.replace(/<span[^>]*>\s*<\/span>/g,'');
				content = content.replace(/<p[^>]*>\s*<\/p>\s*<p>/g,'<p class="mt20">');
			}
			i=4;
			while(i-- > 0){
				content=content.replace(/<span([^>]*)>(\s*)<span([^>]*)>(.*)<\/span>(\s*)<\/span>/,function(str,p1,p2,p3,p4,p5,offset,s){
					var attributes={},attrsMatches,style,m;
					$.each([p1,p3],function(i,attrs){
						attrsMatches=attrs.match(/([a-zA-Z]+)="([^"]+)"/g);
						if(attrsMatches) attrsMatches.each(function(k,attr){
							m=/^([a-zA-Z]+)="([^"]+)"$/.exec(attr);
							if(m[1]==='style'){
								style=m[2].trim().rtrim(';');
								attributes[m[1]] ? attributes[m[1]]+=';'+style : attributes[m[1]]=style;
							}else attributes[m[1]]=m[2];
						});
					});
					
					return '<span'+$.map(attributes,function(v,k){return ' '+k+'="'+v+'"'})+'>'+p2+p4+p5+'</span>';
				});
			}
			return content;
		},

		getInfo : function() {
			return {
				longname : 'Springbok Clean Plugin',
				author : 'Springbok',
				authorurl : 'http://springbok-framework.com',
				infourl : 'http://springbok-framework.com',
				version : '3.0'
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('springbokclean', tinymce.plugins.SpringbokClean);
})();

