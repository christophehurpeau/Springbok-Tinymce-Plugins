(function() {
	tinymce.PluginManager.requireLangPack('springboklink');

	tinymce.create('tinymce.plugins.springbokLink', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			var disabled = true;

			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
			ed.addCommand('springbokLink', function() {
				if ( disabled )
					return;
				var attrs,linkToggle,internalLinksParams=ed.getParam('internalLinks'),linksDiv=false,formInternalLinks,
					form=(new S.HForm(false,{'class':'small-label'}))
						.appendInputUrl('href','URL',{style:'width:330px'})
						.appendInputText('title',i18nc.Title,{style:'width:330px'})
						.appendCheckbox('newTab',ed.getLang('springboklink.target_blank'))
						.end(false),
					div=$('<div/>').html(form);
				if(internalLinksParams){
					linksDiv=$('<div class="input text"/>').hide().html(''),
					div.append($('<div class="separated"/>').html(linkToggle=$('<a href="#"/>').text(ed.getLang('springboklink.internal_link'))).toggleLink(linksDiv),linksDiv);
					
					var f=new S.HForm(false,{},false);
					formInternalLinks=$('<form action=""/>').appendTo(linksDiv);
					$.each(internalLinksParams,function(i,p){
						var div=$('<div/>').css('margin','2px 0').appendTo(formInternalLinks).html($('<span class="smallinfo"/>').css({width:'55px',display:'inline-block'}).text(p.title+' : ')),width=340;
						$.each(p.params,function(i2,p2){ i2=f.inputText(i+'_'+i2,false,p2).defaultInput().change(function(){
							var t=$(this),val=t.val();
							if(!val || val==t.attr('title')) return;
							if($.isFunction(p2.checkParam)) p2.checkParam(t,i2);
							else{
								data=S.syncJson(p.checkParam,{val:val});
								if(!data) alert(i18nc.Error);
								else if(data.error){
									alert(data.error);
									if(p.search) formInternalLinks.find('#Input'+i.ucFirst()+'_search').val('').change();
								}else{
									formInternalLinks.find('input').not(t).val('').change();
									if(p.search && data.value) formInternalLinks.find('#Input'+i.ucFirst()+'_search').val(data.value).change();
									form.find('#InputHref').val(data.url||'');
								}
							}
						}); div.append(i2); width-=i2.outerWidth(); });
						if(p.search) div.append(' &nbsp; ',f.inputText(i+'_search',false,p.search).defaultInput().width(width).autocomplete(p.autocomplete));
					});
					
				}
				
				var e = ed.dom.getParent(ed.selection.getNode(),'A');
				if(e){
					form.find('#InputHref').val(ed.dom.getAttrib(e,'href'));
					form.find('#InputTitle').val(ed.dom.getAttrib(e,'title'));
					form.find('#CheckboxNewTab').prop('checked', "_blank" == ed.dom.getAttrib(e, 'target'));
					
					if(internalLinksParams && ed.dom.getAttrib(e,'data-role')==='internalLink'){
						var params=ed.dom.getAttrib(e,'data-params'),type=ed.dom.getAttrib(e,'data-type');
						params=params?$.evalJSON(params):{};
						
						form.find('#InputHref').prop('disabled',true);
						$.each(params,function(i,p){
							formInternalLinks.find('#Input'+type.ucFirst()+'_'+i).val(p).change();
						});
						
						linkToggle.click();
					}
				}
				
				
				S.dialogs.form(ed.getLang('advanced.link_desc'),div,ed.getLang('advanced.link_desc'),function(){
					attrs={
						'href':form.find('#InputHref').val(),
						'title':form.find('#InputTitle').val(),
						'target':form.find('#CheckboxNewTab').prop('checked')?'_blank':undefined,
						'data-role':undefined,
						'data-type':undefined,
						'data-params':undefined
					};

					if (! attrs.href || attrs.href == 'http://'  || attrs.href == 'https://' ){
						if(e){
							ed.execCommand("mceBeginUndoLevel");
							b = ed.selection.getBookmark();
							ed.dom.remove(e,1);
							ed.selection.moveToBookmark(b);
							ed.execCommand("mceEndUndoLevel");
						}
						return;
					}
					
					if(internalLinksParams){
						var found=false,params;
						$.each(internalLinksParams,function(i,p){
							var ifound=true;
							params={};
							$.each(p.params,function(i2,p2){ var input=$('#Input'+i.ucFirst()+'_'+i2),param=input.val(); if(param && param!=input.attr('title')) params[i2]=param; else{ ifound=false; return false } });
							if(ifound){
								found=i;
								return false;
							}
						});
						
						if(found){
							attrs['data-role']='internalLink';
							attrs['data-type']=found;
							attrs['data-params']=$.toJSON(params);
						}
					}
					
					ed.execCommand("mceBeginUndoLevel");
					
					if(e == null){
						ed.execCommand("mceInsertLink", false,attrs);
					}else ed.dom.setAttribs(e, attrs);
					
					// Don't move caret if selection was image
					if ( e && (e.childNodes.length != 1 || e.firstChild.nodeName != 'IMG') ) {
						ed.focus();
						ed.selection.select(e);
						ed.selection.collapse(0);
					}

					ed.execCommand("mceEndUndoLevel");
				});
			});

			// Register example button
			ed.addButton('link', {
				title : ed.getLang('advanced.link_desc'),
				cmd : 'springbokLink'
			});

			ed.addShortcut('alt+shift+a', ed.getLang('advanced.link_desc'), 'springbokLink');

			ed.onNodeChange.add(function(ed, cm, n, co) {
				disabled = co && n.nodeName != 'A';
			});
		},
		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Srpingbok Link Dialog',
				author : 'Springbok Framework',
				authorurl : 'http://springbok-framework.com',
				infourl : 'http://springbok-framework.com',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('springboklink', tinymce.plugins.springbokLink);
})();
