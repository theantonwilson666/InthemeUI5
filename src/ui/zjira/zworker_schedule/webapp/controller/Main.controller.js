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
      }
    }
  );
});
