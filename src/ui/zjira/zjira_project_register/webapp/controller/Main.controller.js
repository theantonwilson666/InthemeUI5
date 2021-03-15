sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "intheme/zjira_project_register/Formatter",
    "sap/m/Dialog",
  ],
  function (Controller, Formatter, Dialog) {
    "use strict";

    return Controller.extend("intheme.zjira_project_register.controller.Main", {
      formatter: Formatter,

      onInit: function () {
        this.getRouter()
          .getRoute("WorklistRoute")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },

      onViewDetail: function (oEvent) {
        var oBindingObject = oEvent
          .getParameter("listItem")
          .getBindingContext()
          .getObject();

        var oParams = {
          ProjectID: oBindingObject.ProjectID,
          Filter: this.getStateProperty("/proj_filter"),
        };

        this.navTo("DetailRoute", { query: oParams }, false);
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
        var ViewBinderClass = this.getOwnerComponent()
          .getViewBinder()
          .getMetadata()
          .getClass();
        this.viewBinder = new ViewBinderClass();
        this.viewBinder.setModel(this.getModel());
        this.viewBinder.setView(this.getView());
      },

      getViewBinder: function () {
        return this.viewBinder;
      },

      setStateProperty: function (sPath, oValue, oContext, bAsyncUpdate) {
        return this.getModel("state").setProperty(
          sPath,
          oValue,
          oContext,
          bAsyncUpdate
        );
      },

      getStateProperty: function (sPath, oContext) {
        return this.getModel("state").getProperty(sPath, oContext);
      },

      getModel: function (sName) {
        return (
          this.getOwnerComponent().getModel(sName) ||
          this.getView().getModel(sName)
        );
      },

      onDataRequested: function (oEvent) {
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
      },

      addBindingListener: function (oBindingInfo, sEventName, fHandler) {
        oBindingInfo.events = oBindingInfo.events || {};

        if (!oBindingInfo.events[sEventName]) {
          oBindingInfo.events[sEventName] = fHandler;
        } else {
          // Wrap the event handler of the other party to add our handler.
          var fOriginalHandler = oBindingInfo.events[sEventName];
          oBindingInfo.events[sEventName] = function () {
            fHandler.apply(this, arguments);
            fOriginalHandler.apply(this, arguments);
          };
        }
      },

      onBeforeBindingTab: function (
        oEvent,
        iSumParam,
        iFilterInit
      ) {
        var mBindingParams = oEvent.getParameter("bindingParams");
        //Event handlers for the binding
        this.SumParam = iSumParam;
        this.oTotalRow = {
          Project : "TotalHoursSum",
          Issue : "TotalHoursSum",
          ProjectWorker : "WorkerTotalHoursSum",
          Worklog  : "TotalHoursSum"
        };

        if (!iFilterInit) {
          mBindingParams.events = {
            dataReceived: function (oEvent, iSumParam) {
              var oReceivedData = oEvent.getParameter("data");
              var iSum = 0;
              oReceivedData.results.forEach(
                function (oItem) {
                  iSum += oItem[this.SumParam];
                }.bind(this)
              );
              this.getView().byId(this.oTotalRow[oEvent.getSource()._getEntityType().name]).setText(iSum);
            }.bind(this),
          };
        } else {
          mBindingParams.events = {
            dataReceived: function (oEvent, iSumParam) {
              var oReceivedData = oEvent.getParameter("data");
              var iSum = 0;
              oReceivedData.results.forEach(
                function (oItem) {
                  iSum += oItem[this.SumParam];
                }.bind(this)
              );
              this.getView().byId(this.oTotalRow[oEvent.getSource()._getEntityType().name]).setText(iSum);
            }.bind(this),

            dataRequested: function(oEvent){
              this.setStateProperty("/proj_filter", this.getView().byId("projectFilterBar").getFilterDataAsString()) ;
            }.bind(this)

          };
        }
      },
    });
  }
);
