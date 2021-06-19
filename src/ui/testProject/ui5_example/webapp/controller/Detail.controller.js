sap.ui.define(
  [
    "intheme/zui5_example/controller/Main.controller",
    "sap/m/Dialog",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, Dialog, JSONModel) {
    "use strict";

    return Controller.extend(
      "intheme.zjira_project_register.controller.Detail",
      {
        onInit: function () {
          this.getRouter()
            .getRoute("DetailRoute")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
          var oArr = oEvent.getParameter("arguments")["?query"];
          this.getView()
            .byId("DetailForm")
            .bindElement("/MaterialSet('" + oArr.MaterialID + "')/Quantities");

          this.getView()
            .byId("OrderSmartTable")
            .bindElement("/MaterialSet('" + oArr.MaterialID + "')");

          this.setStateProperty("/layout", "TwoColumnsMidExpanded");
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

        onPressDetailItem: function (oEvent) {
          var oBindingObject = oEvent.getSource().getBindingContext().getObject();

          var oParams = {
            Material: oBindingObject.Material,
            Order: oBindingObject.Order
          };

          this.navTo("DetailDetailRoute", { query: oParams }, false);
        },
      }
    );
  }
);
