sap.ui.define(
	["sap/ui/core/Component",
	 "zJiraPlugin/modules/LanguageTab",
	 "zJiraPlugin/modules/ToolArea"],
	function (Component, LanguageTab, ToolArea) {
	  return Component.extend("zJiraPlugin.Component", {
		metadata: {
		  manifest: "json",
		},
  
		init: function () {
		  var oFormatSettings = sap.ui
			.getCore()
			.getConfiguration()
			.getFormatSettings();
  
		  oFormatSettings.setNumberSymbol("group", " ");
  
		  var oRender = this._getRenderer();
		  oRender.then(function (oRender) {
			this._addContentToRender(oRender);
		  }.bind(this));
		},
  
		_addContentToRender: function (oRender) {
		  LanguageTab.addLanguageMenu(oRender);
		  ToolArea.createToolArea(oRender);
		},
  
	   
  
  
  
  
		
		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {object}
		 *      a jQuery promise, resolved with the renderer instance, or
		 *      rejected with an error message.
		 */
		_getRenderer: function () {
		  var that = this,
			oDeferred = new jQuery.Deferred(),
			oRenderer;
  
		  that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
		  if (!that._oShellContainer) {
			oDeferred.reject(
			  "Illegal state: shell container not available; this component must be executed in a unified shell runtime context."
			);
		  } else {
			oRenderer = that._oShellContainer.getRenderer();
			if (oRenderer) {
			  oDeferred.resolve(oRenderer);
			} else {
			  // renderer not initialized yet, listen to rendererCreated event
			  that._onRendererCreated = function (oEvent) {
				oRenderer = oEvent.getParameter("renderer");
				if (oRenderer) {
				  oDeferred.resolve(oRenderer);
				} else {
				  oDeferred.reject(
					"Illegal state: shell renderer not available after recieving 'rendererLoaded' event."
				  );
				}
			  };
			  that._oShellContainer.attachRendererCreatedEvent(
				that._onRendererCreated
			  );
			}
		  }
		  return oDeferred.promise();
		},
	  });
	}
  );
  