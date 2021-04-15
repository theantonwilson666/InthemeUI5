sap.ui.define(["jira/lib/BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend(
    "intheme.zjira_worker_register.controller.Main",
    {
      onInit: function () {},

      onInitFilter: function (oEvent) {
        this.getModel().callFunction("/GetCurrentQuarter", {
          method: "POST",
          success: function (oData) {
            var oFilter = this.getView().byId("workerFilterBar");

            var aRanges = [];
            
            aRanges.push({
              exclude: false,
              keyField: "CloseIssueDate",
              operation: "BT",
              value1: oData.GetCurrentQuarter.Low,
              value2:  oData.GetCurrentQuarter.High
            });

            var oDefaultFilter = {
              CloseIssueDate: {
                conditionTypeInfo: {
                  data: {
                    operation: "THISQUARTER",
                    value1: null,
                    value2: null,
                    key: "CloseIssueDate",
                    calendarType: "Gregorian",
                  },
                  name: "sap.ui.comp.config.condition.DateRangeType",
                },
                items: [],
                ranges: aRanges,
              },
            };
            oFilter.setFilterData(oDefaultFilter, true);
            this.getView().byId("workerSmartTable").rebindTable();

          }.bind(this),
          error: function (oData) {
            debugger;
          }.bind(this),
        });

        
      },

      onBeforeBindingTab: function (oEvent) {
        var mBindingParams = oEvent.getParameter("bindingParams");

        var oCustom = {
          BonusClosed: this.getView()
            .byId("closedIssueBonus")
            .getSelected()
            .toString(),

          ManagmentTaskBonus: this.getView()
          .byId("bonusWithManagmentTask")
          .getSelected()
          .toString(),
        };

        mBindingParams.parameters.custom = oCustom;
        this.setStateProperty("/worker_filter", this.getView().byId("workerFilterBar").getFilterDataAsString());

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
                    Test : '11'
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
          urlParameters: { SourceID: this.getStateProperty("/currentTab") },
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

      onIconTabConfBarSelected: function (oEvent) {
        this.setStateProperty(
          "/currentTab",
          oEvent.getSource().getSelectedKey()
        );
      },

      handleConfFileSelected: function (oEvent) {
        this.handleFileSelected(oEvent, "/FileSet", {
          SourceID: this.getStateProperty("/currentTab"),
        });
      },

      onEditToggled: function (oEvent) {
        var bEditable = oEvent.getParameter("editable");
        this.setStateProperty(
          "/BonusSettingSTMode",
          bEditable ? "Delete" : "None"
        );
      },

      onBeforeClosedIssueTab: function (oEvent) {
        var mBindingParams = oEvent.getParameter("bindingParams");
        var oFilter = {
          Filter: this.getStateProperty("/worker_filter"),
        };
        mBindingParams.parameters.custom = oFilter;
      },

      onCloseDialog: function (oEvent) {
        oEvent.getSource().getParent().close();
      },


      onPressWorkerLog: function(oEvent){
        this.openPopoverBy
        .call(this, {
          sPopoverName: "_workerlogPopover",
          sViewName:
            "intheme.zjira_worker_register.view.popovers.WorkerLog",
          sPath: oEvent.getSource().getBindingContext().getPath(),
          oSource: oEvent.getSource(),
        })
        .then(
          function (oPopover) {
            this.getView().byId('WorkerLogST').rebindTable();
            // var sTax = this.getView().byId("taxInput").getValue() + '%';
            // this.getView().byId("TaxField").setText(sTax);
          }.bind(this)
        );
      },

      onBeforeRebindWorkerLogTab: function(oEvent){
        var mBindingParams = oEvent.getParameter("bindingParams");
        var oFilter = {
          Filter: this.getStateProperty("/worker_filter"),
        };
        mBindingParams.parameters.custom = oFilter;
      }
    }
  );
});