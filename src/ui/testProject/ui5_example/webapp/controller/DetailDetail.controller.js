sap.ui.define(
  [
    "intheme/zui5_example/controller/Main.controller",
    "sap/m/Dialog",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, Dialog, JSONModel) {
    "use strict";

    return Controller.extend(
      "intheme.zjira_project_register.controller.DetailDetail",
      {
        onInit: function () {
          this.getRouter()
            .getRoute("DetailDetailRoute")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
          var oArr = oEvent.getParameter("arguments")["?query"];
          this.getView()
            .byId("detailPage")
            .bindElement("/MaterialOrdersSet(Material='" + oArr.Material + "',Order='" + oArr.Order + "')");

          this.setStateProperty("/layout", "EndColumnFullScreen");
        },

        onViewIssue: function (oEvent) {
          var oBindingObject = oEvent
            .getParameter("listItem")
            .getBindingContext()
            .getObject();

          var oParams = {
            ProjectID: oBindingObject.ProjectID,
            IssueID: oBindingObject.IssueID,
          };

          this.navTo("IssueDetailRoute", { query: oParams }, false);
        },
      }
    );
  }
);
