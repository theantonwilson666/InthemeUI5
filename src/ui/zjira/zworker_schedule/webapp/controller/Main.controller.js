sap.ui.define(["jira/lib/BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend(
    "intheme.zjira_project_register.controller.Main",
    {
      onInit: function () {
        this.getRouter()
          .getRoute("WorklistRoute")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      onViewDetail: function (oEvent) {
        var oBindingObject = oEvent
          .getParameter("listItem")
          .getBindingContext()
          .getObject();

        var oParams = {
          Worker: oBindingObject.Worker
        };

        this.navTo("DetailRoute", { query: oParams }, false);
      },

      _onRouteMatched: function (oEvent) {
        var oSmartTable = this.byId("workerSmartTable");
        this.setStateProperty("/layout", "OneColumn");

        if (oSmartTable) {
          oSmartTable.getTable().removeSelections();
        }
      },

      onBeforeBindingTab: function (oEvent, iSumParam, iFilterInit) {
        var mBindingParams = oEvent.getParameter("bindingParams");
        //Event handlers for the binding
        this.SumParam = iSumParam;
        this.oTotalRow = {
          Project: "TotalHoursSum",
          Issue: "TotalHoursSum",
          ProjectWorker: "WorkerTotalHoursSum",
          Worklog: "TotalHoursSum",
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
              this.getView()
                .byId(this.oTotalRow[oEvent.getSource()._getEntityType().name])
                .setText(iSum);
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
              this.getView()
                .byId(this.oTotalRow[oEvent.getSource()._getEntityType().name])
                .setText(iSum);
            }.bind(this),

            dataRequested: function (oEvent) {
              this.setStateProperty(
                "/proj_filter",
                this.getView().byId("projectFilterBar").getFilterDataAsString()
              );
            }.bind(this),
          };
        }
      },

    }
  );
});
