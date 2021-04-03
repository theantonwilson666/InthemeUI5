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
          ProjectID: oBindingObject.ProjectID,
          Filter: this.getStateProperty("/proj_filter"),
        };

        this.setStateProperty("/rebindProj", true);
        this.navTo("DetailRoute", { query: oParams }, false);
      },

      _onRouteMatched: function (oEvent) {
        var oSmartTable = this.byId("projectSmartTable");
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

      onOpenPaymentSettingDialog: function (oEvent) {
        this.loadDialog
          .call(this, {
            sDialogName: "_oPaymentSettingDialog",
            sViewName:
              "intheme.zjira_project_register.view.dialogs.PaymentSetting",
          })
          .then(
            function (oDialog) {
              oDialog.open();
              this.getView().byId("PaymentSettingST").rebindTable();
              this.getView().byId("ProjWeekendST").rebindTable();
              this.getView().byId("WorkerCostConfST").rebindTable();
            }.bind(this)
          );
      },

      onSavePaymentSettingDialog: function (oEvent) {
        oEvent.getSource().getParent().close();
        this.submitChanges({
          success: function () {
            this.showMessageToast(this.i18n("MessageSuccess"));
          }.bind(this),
          error: function () {
            this.showMessageToast(this.i18n("MessageError"));
          }.bind(this),
        });
      },

      onCancelPaymentSettingDialog: function (oEvent) {
        oEvent.getSource().getParent().close();
        this.resetChanges();
      },

      onEditToggled: function (oEvent) {
        var bEditable = oEvent.getParameter("editable");
        this.setStateProperty(
          "/PaymentSettingSTMode",
          bEditable ? "Delete" : "None"
        );
      },

     

      onDeleteAllPaymentSettings: function (oEvent) {
        this.showBusyDialog();
        this.getModel().callFunction("/DeletePaymentSettings", {
          method: "POST",
          urlParameters: {SourceID : this.getStateProperty('/currentTab')},
          success: function (oData) {
            if (oData.DeletePaymentSettings.Ok === true) {
              this.closeBusyDialog();
              this.showMessageToast(this.i18n("MessageSuccess"));
              this.byId("PaymentSettingST").rebindTable();
            } else {
              this.closeBusyDialog();
              this.showMessageToast(this.i18n("MessageError"));
            }
          }.bind(this),
          error: function (oData) {
            this.closeBusyDialog();
            this.showMessageToast(this.i18n("MessageError"));
          }.bind(this),
          refreshAfterChange: false,
        });
      },

      onIconTabConfBarSelected: function (oEvent) {
        this.setStateProperty(
          "/currentTab",
          oEvent.getSource().getSelectedKey()
        );
      },

      handleConfFileSelected: function(oEvent){
        this.handleFileSelected(oEvent, '/FileSet', {SourceID: this.getStateProperty('/currentTab')})
      }
    }
  );
});
