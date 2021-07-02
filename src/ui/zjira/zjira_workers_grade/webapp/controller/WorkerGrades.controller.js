sap.ui.define(
  [
    "intheme/zjira_workers_grade/controller/Base.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast",
    "sap/ui/model/Sorter",
  ],
  function (Controller, JSONModel, BusyIndicator, MessageToast, Sorter) {
    "use strict";

    return Controller.extend(
      "intheme.zjira_workers_grade.controller.WorkerGrades",
      {
        onInit: function () {
          this.getRouter()
            .getRoute("WorkerGradesRoute")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        onPressColumnListItem: function (oEvent) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

          var oBindingObject = oEvent
            .getSource()
            .getBindingContext()
            .getObject();

          var oParams = {
            Worker: oBindingObject.Worker,
          };

          this.setStateProperty("/currentRow", oBindingObject);
          this.navTo("GradeDatesRoute", { query: oParams }, false);
        },
        beforeRebindWorkerGrades: function (oEvent) {
          var oBindingParams = oEvent.getParameter("bindingParams");
          oBindingParams.sorter.push(
            new sap.ui.model.Sorter("WorkerName", false, true)
          );
        },

        onInitSmartFilter: function (oEvent) {
          this.byId("workerFilterBar").setFilterData({
            Team: {
              items: [
                {
                  key: "4804435888992895598",
                  text: "Разработка",
                },
              ],
            },
          });
        },

        onEditToggled: function (oEvent) {
          var bEditable = oEvent.getParameter("editable");
          this.setStateProperty("/edit", bEditable ? true : false);
        },

        onSaveChanges: function (oEvent) {
          this.showBusyDialog();
          this.getModel().submitChanges({
            success: function () {
              this.closeBusyDialog();
              if (!this.isExistError()) {
                this.showMessageToast("zzz");
              }
              this.resetChanges();
            }.bind(this),
            error: function () {
              this.closeBusyDialog();
              this.showError();
              this.resetChanges();
            }.bind(this),
          });
        },
      }
    );
  }
);
