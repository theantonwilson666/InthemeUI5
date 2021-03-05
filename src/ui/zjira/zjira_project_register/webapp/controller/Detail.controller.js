sap.ui.define(
  ["intheme/zjira_project_register/controller/Main.controller", "sap/m/Dialog"],
  function (Controller, Dialog) {
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
          this.bindView({
            entitySet: "/ProjectSet",
            keyParameters: oArr,
          }).then(
            function () {
              this.setStateProperty(
                "/sOpenedProjectBindingCtnx",
                this.getView().getBindingContext()
              );
            }.bind(this)
          );

          this.setStateProperty("/layout", "TwoColumnsMidExpanded");
          this.setStateProperty(
            "/detailBindingPath",
            this.getModel().createKey("/ProjectSet", oArr)
          );
        },

        

        onViewIssue: function(oEvent){
          var oBindingObject = oEvent.getParameter("listItem").getBindingContext().getObject();

          var oParams = {
            ProjectID: oBindingObject.ProjectID,
            IssueID: oBindingObject.IssueID
          };

          this.navTo("IssueDetailRoute", {query: oParams}, false);

        }

      }
    );
  }
);
