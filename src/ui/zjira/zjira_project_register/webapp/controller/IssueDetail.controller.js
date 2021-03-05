sap.ui.define(
  ["intheme/zjira_project_register/controller/Main.controller", "sap/m/Dialog"],
  function (Controller, Dialog) {
    "use strict";

    return Controller.extend(
      "intheme.zjira_project_register.controller.IssueDetail",
      {
        onInit: function () {
          this.getRouter()
            .getRoute("IssueDetailRoute")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
          var oArr = oEvent.getParameter("arguments")["?query"];
          this.bindView({
            entitySet: "/IssueSet",
            keyParameters: oArr,
          }).then(function (oData) {}.bind(this));

          this.setStateProperty("/layout", "EndColumnFullScreen");
        },
      }
    );
  }
);
