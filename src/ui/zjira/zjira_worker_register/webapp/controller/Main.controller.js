sap.ui.define(["jira/lib/BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend(
    "intheme.zjira_worker_register.controller.Main",
    {
      onInit: function () {},

      onBeforeBindingTab: function (oEvent) {
        var mBindingParams = oEvent.getParameter("bindingParams");

        var oCustom = {
          BonusClosed: this.getView().byId('closedIssueBonus').getSelected().toString()
        };

        mBindingParams.parameters.custom = oCustom;

        mBindingParams.events = {
          dataRequested: function (oEvent) {
            this.setStateProperty(
              "/worker_filter",
              this.getView().byId("workerFilterBar").getFilterDataAsString()
            );
          }.bind(this),
        };
      },

      onViewWorker: function (oEvent) {
        var oTable = this.byId("workerSmartTable").getTable();
        var sPath = oTable.getSelectedItem().getBindingContext().getPath();
        this.loadDialog
          .call(this, {
            sDialogName: "_oClosedIssueDialog",
            sViewName: "intheme.zjira_worker_register.view.dialogs.ClosedIssue",
          })
          .then(
            function (oDialog) {
              // oDialog.setBusy(true);
              oDialog.open();
              oDialog.bindElement({
                path: sPath,
                parameters: {
                  custom: {
                    Filter: this.getStateProperty("/worker_filter"),
                  },
                },
                events: {
                  dataReceived: function (oEvent) {
                    if (!oEvent.getParameter("data")) {
                      // this.showError();
                      oDialog.close();
                    } else {
                      oDialog.setBusy(false);
                    }
                  }.bind(this),
                },
              });
            }.bind(this)
          );
      },

      onOpenBonusSettingDialog: function (oEvent) {
        this.loadDialog
          .call(this, {
            sDialogName: "_oBonusSettingDialog",
            sViewName:
              "intheme.zjira_worker_register.view.dialogs.BonusSetting",
          })
          .then(
            function (oDialog) {
              oDialog.open();
              this.getView().byId("PositionConfST").rebindTable();
              this.getView().byId("ProjectConfST").rebindTable();
            }.bind(this)
          );
      },

      onDeleteAllBonusSettings: function (oEvent) {
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

      onSaveBonusSettingDialog: function (oEvent) {
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

      onCancelBonusSettingDialog: function (oEvent) {
        oEvent.getSource().getParent().close();
        this.resetChanges();
      },

      onIconTabConfBarSelected: function(oEvent){
        this.setStateProperty(
          "/currentTab",
          oEvent.getSource().getSelectedKey()
        );
      },

      handleConfFileSelected: function(oEvent){
        this.handleFileSelected(oEvent, '/FileSet', {SourceID: this.getStateProperty('/currentTab')})
      },

      onEditToggled: function (oEvent) {
        var bEditable = oEvent.getParameter("editable");
        this.setStateProperty(
          "/BonusSettingSTMode",
          bEditable ? "Delete" : "None"
        );
      },

      onBeforeClosedIssueTab: function(oEvent){
        var mBindingParams = oEvent.getParameter("bindingParams");
        var oFilter = {
          Filter: this.getStateProperty("/worker_filter")
        };
        mBindingParams.parameters.custom = oFilter;
      },

      onCloseDialog: function(oEvent){
        oEvent.getSource().getParent().close();
      }

    }
  );
});
