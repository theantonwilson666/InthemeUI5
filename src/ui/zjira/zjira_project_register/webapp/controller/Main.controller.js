sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "intheme/zjira_project_register/Formatter",
    "sap/m/Dialog",
], function (Controller, Formatter, Dialog ) {
    "use strict";

    return Controller.extend("intheme.zjira_project_register.controller.Main", {

        formatter: Formatter,


        onInit: function () {
            this.getRouter().getRoute("WorklistRoute").attachPatternMatched(this._onRouteMatched, this);
        },

        getRouter: function () {
			return this.getOwnerComponent().getRouter();
        },
        
        onViewDetail: function(oEvent){
            var oBindingObject = oEvent.getParameter("listItem").getBindingContext().getObject();
            
            var oParams = {
                ProjectID: oBindingObject.ProjectID
            };

            this.navTo("DetailRoute", {query: oParams}, false);
        },

        _onRouteMatched: function (oEvent) {
            var oSmartTable = this.byId("projectSmartTable");
			this.setStateProperty("/layout", "OneColumn");

			if (oSmartTable) {
				oSmartTable.getTable().removeSelections();
			}
        },

        bindView: function (mParameters) {
			this._initViewBinder();
			return this.viewBinder.bind(mParameters);
		},
        
        _initViewBinder: function () {
			var ViewBinderClass = this.getOwnerComponent().getViewBinder().getMetadata().getClass();
			this.viewBinder = new ViewBinderClass();
			this.viewBinder.setModel(this.getModel());
			this.viewBinder.setView(this.getView());
        },
        
        getViewBinder: function () {
			return this.viewBinder;
        },
        
        setStateProperty: function (sPath, oValue, oContext, bAsyncUpdate) {
			return this.getModel("state").setProperty(sPath, oValue, oContext, bAsyncUpdate);
        },
        
        
        getModel: function (sName) {
			return this.getOwnerComponent().getModel(sName) || this.getView().getModel(sName);
        },

        onDataRequested: function(oEvent){
            debugger;
        },

        onFireSearchAfterSelectSmartVariant: function (sFilterBarId) {
			if (typeof sFilterBarId === "string" && sFilterBarId.length > 0) {
				this.byId(sFilterBarId).fireSearch();
				return true;
			}

			return false;
		},

        navTo: function (sName, oParameters, bReplace) {
			this.getRouter().navTo(sName, oParameters, bReplace);
		}

    });
});