sap.ui.define(
  [
    "intheme/zjira_project_register/controller/Main.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
  ],
  function (Controller, Filter, FilterOperator, Dialog) {
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

        onViewIssue: function (oEvent) {
          var oBindingObject = oEvent
            .getParameter("listItem")
            .getBindingContext()
            .getObject();

          var oParams = {
            ProjectID: oBindingObject.ProjectID,
            IssueID: oBindingObject.IssueID,
            Filter: this.getStateProperty("/proj_filter"),
          };

          this.navTo("IssueDetailRoute", { query: oParams }, false);
        },

        onProfitabilyButtonPress: function (oEvent) {
          this.loadDialog
            .call(this, {
              sDialogName: "_oProfitabilitySettingDialog",
              sViewName:
                "intheme.zjira_project_register.view.dialogs.Profitability",
            })
            .then(
              function (oDialog) {
                oDialog.open();
              }.bind(this)
            );
        },

        onCancelProfitabilityDialog: function (oEvent) {
          oEvent.getSource().getParent().close();
        },

        onCalcProfitability: function (oEvent) {
          var oTab = this.getView().byId("projectStageSmartTable");
          oTab.rebindTable();
        },

        onBeforeBindingProjectStage: function (oEvent) {
          if (this.getStateProperty("/rebindProj") == false) {
            var mBindingParams = oEvent.getParameter("bindingParams");
            var aItems = this.getView()
              .byId("projectStageSmartTable")
              .getTable()
              .getItems();

            if (aItems.lenth != 0) {
              var aFilterData = [];
              aItems.forEach(
                function (oItem) {
                  var oObj = oItem.getBindingContext().getObject();
                  aFilterData.push({
                    ProjectStage: oObj.ProjectStageID,
                    RequestNo: oObj.RequestNo,
                    Profit: oObj.Profit,
                  });
                }.bind(this)
              );

              var oFilter = {
                Tax: this.getView().byId("taxInput").getValue(),
                Data: aFilterData,
              };

              mBindingParams.filters.push(
                new Filter({
                  path: "TechFilter",
                  operator: FilterOperator.EQ,
                  value1: JSON.stringify(oFilter),
                })
              );
            }
          } else {
            
            this.setStateProperty("/rebindProj", false);
          }
        },

        onPressProfitLink: function (oEvent) {
          // var sPath = oEvent.getSource().getBindingContext().getPath()
          this.openPopoverBy
            .call(this, {
              sPopoverName: "_profitPopover",
              sViewName:
                "intheme.zjira_project_register.view.popovers.ProfitPopover",
              sPath: oEvent.getSource().getBindingContext().getPath(),
              oSource: oEvent.getSource(),
            })
            .then(
              function (oPopover) {
                var sTax = this.getView().byId("taxInput").getValue() + '%';
                this.getView().byId("TaxField").setText(sTax);
              }.bind(this)
            );
        },

        onPressProfitListItem: function(oEvent){
          var oBindProjectStage = {
            Path : oEvent.mParameters.listItem.getBindingContext().getPath(),
            Object : oEvent.mParameters.listItem.getBindingContext().getObject()
          };

          this.setStateProperty("/currentProjectStage", oBindProjectStage)


          this.loadDialog
            .call(this, {
              sDialogName: "_oProfitWorkerDialog",
              sViewName:
                "intheme.zjira_project_register.view.dialogs.ProfitWorker",
            })
            .then(
              function (oDialog) {
                var oBindProjectStage = this.getStateProperty("/currentProjectStage");
                oDialog.bindElement({
                  path: oBindProjectStage.Path
                });
                oDialog.open();
              }.bind(this)
            );
        }
      }
    );
  }
);
