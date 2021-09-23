sap.ui.define(
  ["jira/lib/BaseController", "sap/m/PDFViewer"],
  function (BaseController, PDFViewer) {
    "use strict";


    return BaseController.extend(
      "intheme.zjira_worker_register.controller.Main", {
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
                value2: oData.GetCurrentQuarter.High,
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

        onBeforeBindingTab: function (oEvent, iSumParam) {
          var mBindingParams = oEvent.getParameter("bindingParams");
          this.SumParam = iSumParam;
          this.oTotalRow = {
            WorkerRegister: 'TotalBonusSum',
          };


          var oCustom = {
            BonusClosed: this.getView()
              .byId("closedIssueBonus")
              .getSelected()
              .toString(),

            ManagmentTaskBonus: this.getView()
              .byId("bonusWithManagmentTask")
              .getSelected()
              .toString(),

            ShowEmptyWorker: this.getView()
              .byId("showEmptyWorker")
              .getSelected()
              .toString(),

            CalcWithError: this.getView()
              .byId("calcWithError")
              .getSelected()
              .toString(),
          };
          mBindingParams.events = {
            dataReceived: function (oEvent) {
              var oReceivedData = oEvent.getParameter("data");
              var iSum = 0;
              oReceivedData.results.forEach(
                function (oItem) {
                  iSum += Number(oItem[this.SumParam]);
                }.bind(this)
              );
              this.getView()
                .byId(this.oTotalRow[oEvent.getSource()._getEntityType().name])
                .setNumber(iSum);
            }.bind(this),
          };

          mBindingParams.parameters.custom = oCustom;
          this.setStateProperty(
            "/worker_filter",
            this.getView().byId("workerFilterBar").getFilterDataAsString()
          );
        },

        onViewWorker: function (oEvent) {
          debugger
          var oTable = this.byId("workerSmartTable").getTable();
          var sPath = oTable.getSelectedItem().getBindingContext().getPath();
          this.loadDialog
            .call(this, {
              sDialogName: "_oClosedIssueDialog",
              sViewName: "intheme.zjira_worker_register.view.dialogs.ClosedIssue",
            })
            .then(
              function (oDialog) {
                debugger
                // oDialog.setBusy(true);
                oDialog.open();
                oDialog.bindElement({
                  path: sPath,
                  parameters: {
                    custom: {
                      Filter: this.getStateProperty("/worker_filter"),
                      Test: "11",
                    },
                  },
                  events: {
                    dataReceived: function (oEvent) {
                      debugger
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

        rebindConfTab: function (oEvent) {
          var oConf = this.getStateProperty("/smartTabConf");

          Object.keys(oConf).forEach(function (sKey) {
            this.getView().byId(oConf[sKey]).rebindTable();
          }.bind(this));
        },

        onOpenBonusSettingDialog: function (oEvent) {
          this.loadDialog
            .call(this, {
              sDialogName: "_oBonusSettingDialog",
              sViewName: "intheme.zjira_worker_register.view.dialogs.BonusSetting",
            })
            .then(
              function (oDialog) {
                oDialog.open();
                this.rebindConfTab();
              }.bind(this)
            );
        },

        onDeleteAllBonusSettings: function (oEvent) {
          this.showBusyDialog();
          this.getModel().callFunction("/DeletePaymentSettings", {
            method: "POST",
            urlParameters: {
              SourceID: this.getStateProperty("/currentTab")
            },
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
          var oConf = this.getStateProperty("/smartTabConf");

          Object.keys(oConf).forEach(function (sKey) {
            var oTable = this.getView().byId(oConf[sKey]).getTable();
            var mItems = oTable.getItems();
            mItems.forEach(function (oItem) {
              if (oItem.getBindingContext().bCreated) {
                oTable.removeItem(oItem);
              }
            }.bind(this));
          }.bind(this));

          this.submitChanges({
            success: function () {
              this.isExistError();
              this.rebindConfTab();
            }.bind(this),
            error: this.showError.bind(this),
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
            bEditable ? "SingleSelectLeft" : "None"
          );
        },

        onBeforeClosedIssueTab: function (oEvent) {
          var mBindingParams = oEvent.getParameter("bindingParams");

          var oFilter = {
            Filter: this.getStateProperty("/worker_filter"),
            BonusClosed: this.getView()
              .byId("closedIssueBonus")
              .getSelected()
              .toString(),

            ManagmentTaskBonus: this.getView()
              .byId("bonusWithManagmentTask")
              .getSelected()
              .toString(),

            ShowEmptyWorker: this.getView()
              .byId("showEmptyWorker")
              .getSelected()
              .toString(),

            CalcWithError: this.getView()
              .byId("calcWithError")
              .getSelected()
              .toString(),
          };
          mBindingParams.parameters.custom = oFilter;
        },

        onCloseDialog: function (oEvent) {
          oEvent.getSource().getParent().close();
        },

        onPressWorkerLog: function (oEvent) {
          this.openPopoverBy
            .call(this, {
              sPopoverName: "_workerlogPopover",
              sViewName: "intheme.zjira_worker_register.view.popovers.WorkerLog",
              sPath: oEvent.getSource().getBindingContext().getPath(),
              oSource: oEvent.getSource(),
            })
            .then(
              function (oPopover) {
                this.getView().byId("WorkerLogST").rebindTable();
                // var sTax = this.getView().byId("taxInput").getValue() + '%';
                // this.getView().byId("TaxField").setText(sTax);
              }.bind(this)
            );
        },

        onBeforeRebindWorkerLogTab: function (oEvent) {
          var mBindingParams = oEvent.getParameter("bindingParams");
          var oFilter = {
            Filter: this.getStateProperty("/worker_filter"),
          };
          mBindingParams.parameters.custom = oFilter;
          mBindingParams.parameters.numberOfExpandedLevels = 3;
        },

        onSendLogToTelegramButton: function (oEvent) {
          this.showBusyDialog();

          var oWorker = oEvent
            .getSource()
            .getParent()
            .getParent()
            .getBindingContext()
            .getObject();

          this.getModel().callFunction("/SendLogToTelegram", {
            method: "POST",
            urlParameters: {
              WorkerID: oWorker.Worker,
              Filter: this.getStateProperty("/worker_filter"),
            },
            success: function (oData) {
              if (oData.SendLogToTelegram.Ok === true) {
                this.closeBusyDialog();
              } else {
                this.closeBusyDialog();
              }
            }.bind(this),
            error: function (oData) {
              this.closeBusyDialog();
            }.bind(this),
            refreshAfterChange: false,
          });
        },

        afterCloseIssuesDialog: function (oEvent) {
          this.getView().byId("workerSmartTable").getTable().removeSelections();
        },

        onPressPaymentSheetButton: function (oEvent) {
          var oObject = oEvent
            .getSource()
            .getParent()
            .getParent()
            .getBindingContext()
            .getObject();

          var oConf = {
            BonusClosed: this.getView()
              .byId("closedIssueBonus")
              .getSelected()
              .toString(),

            ManagmentTaskBonus: this.getView()
              .byId("bonusWithManagmentTask")
              .getSelected()
              .toString(),

            ShowEmptyWorker: this.getView()
              .byId("showEmptyWorker")
              .getSelected()
              .toString(),

            CalcWithError: this.getView()
              .byId("calcWithError")
              .getSelected()
              .toString(),
          };

          var oPDFViewer = new PDFViewer();
          var sSource =
            this.getModel().sServiceUrl +
            this.getModel().createKey("/PaymentSheetPDFSet", {
              Worker: oObject.Worker,
              Filter: this.getStateProperty("/worker_filter"),
              Conf: JSON.stringify(oConf),
            }) +
            "/$value";

          oPDFViewer.setTitle(
            this.i18n("PaymentSheetButtonTitle") + " - " + oObject.WorkerName
          );
          oPDFViewer.setSource(sSource);
          oPDFViewer.open();
        },

        onInitFilterKPI: function (oEvent) {
          this.getModel().callFunction("/GetCurrentQuarter", {
            method: "POST",
            success: function (oData) {
              var oFilter = this.getView().byId("WorkerKPIFilter");

              var aRanges = [];

              aRanges.push({
                exclude: false,
                keyField: "DateFrom",
                operation: "BT",
                value1: oData.GetCurrentQuarter.Low,
                value2: oData.GetCurrentQuarter.High,
              });


              var aTeam = [];
              aTeam.push({
                key: "3763699611210895198",
                text: "Чебоксары"
              });

              var oDefaultFilter = {
                DateFrom: {
                  conditionTypeInfo: {
                    data: {
                      operation: "THISQUARTER",
                      value1: null,
                      value2: null,
                      key: "DateFrom",
                      calendarType: "Gregorian",
                    },
                    name: "sap.ui.comp.config.condition.DateRangeType",
                  },
                  items: [],
                  ranges: aRanges,
                },

                Team: {
                  items: aTeam,
                  value: null
                }
              };
              oFilter.setFilterData(oDefaultFilter, true);
              this.getView().byId("WorkerKPI_ST").rebindTable();
            }.bind(this),
            error: function (oData) {
              debugger;
            }.bind(this),
          });
        },


        onBeforeBindingTabKPI: function (oEvent) {
          debugger
        }
      }
    );
  }
);