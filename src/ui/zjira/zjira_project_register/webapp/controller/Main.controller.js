sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "intheme/zjira_project_register/Formatter",
    "sap/m/Dialog",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
  ],
  function (Controller, Formatter, Dialog, Fragment, MessageBox) {
    "use strict";

    return Controller.extend("intheme.zjira_project_register.controller.Main", {
      formatter: Formatter,

      onInit: function () {
        this.getRouter()
          .getRoute("WorklistRoute")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      getRouter: function () {
        return this.getOwnerComponent().getRouter();
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

        this.navTo("DetailRoute", { query: oParams }, false);
      },

      _onRouteMatched: function (oEvent) {
        var oSmartTable = this.byId("projectSmartTable");
        this.setStateProperty("/layout", "OneColumn");

        if (oSmartTable) {
          oSmartTable.getTable().removeSelections();
        }
      },

      bindView: function (mParameters) {
        this._initViewBinder();
        return this.viewBinder.bind(mParameters);
      },

      _initViewBinder: function () {
        var ViewBinderClass = this.getOwnerComponent()
          .getViewBinder()
          .getMetadata()
          .getClass();
        this.viewBinder = new ViewBinderClass();
        this.viewBinder.setModel(this.getModel());
        this.viewBinder.setView(this.getView());
      },

      getViewBinder: function () {
        return this.viewBinder;
      },

      setStateProperty: function (sPath, oValue, oContext, bAsyncUpdate) {
        return this.getModel("state").setProperty(
          sPath,
          oValue,
          oContext,
          bAsyncUpdate
        );
      },

      getStateProperty: function (sPath, oContext) {
        return this.getModel("state").getProperty(sPath, oContext);
      },

      getModel: function (sName) {
        return (
          this.getOwnerComponent().getModel(sName) ||
          this.getView().getModel(sName)
        );
      },

      onDataRequested: function (oEvent) {
        debugger;
      },

      onFireSearchAfterSelectSmartVariant: function (sFilterBarId) {
        if (typeof sFilterBarId === "string" && sFilterBarId.length > 0) {
          this.byId(sFilterBarId).fireSearch();
          return true;
        }

        return false;
      },

      navTo: function (sName, oParameters, bReplace) {
        this.getRouter().navTo(sName, oParameters, bReplace);
      },

      addBindingListener: function (oBindingInfo, sEventName, fHandler) {
        oBindingInfo.events = oBindingInfo.events || {};

        if (!oBindingInfo.events[sEventName]) {
          oBindingInfo.events[sEventName] = fHandler;
        } else {
          // Wrap the event handler of the other party to add our handler.
          var fOriginalHandler = oBindingInfo.events[sEventName];
          oBindingInfo.events[sEventName] = function () {
            fHandler.apply(this, arguments);
            fOriginalHandler.apply(this, arguments);
          };
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

              // oDialog.attachEventOnce(
              //   "afterClose",
              //   function () {
              //     this.setEditableTradeLanesST(false);
              //   }.bind(this)
              // );
            }.bind(this)
          );
      },

      loadDialog: function (oParams) {
        if (!this[oParams.sDialogName]) {
          return Fragment.load({
            id: this.getView().sId,
            type: "XML",
            name: oParams.sViewName,
            controller: oParams.controller ? oParams.controller : this,
          }).then(
            function (oDialog) {
              this[oParams.sDialogName] = oDialog;
              if (oParams.sPath) {
                this[oParams.sDialogName].bindElement(oParams.sPath);
              }
              if (
                oParams.bAddDependent === undefined ||
                oParams.bAddDependent === true
              ) {
                this.getView().addDependent(this[oParams.sDialogName]);
              }
              if (!$.isArray(this[oParams.sDialogName])) {
                this[oParams.sDialogName].setBusyIndicatorDelay(0);
              }
              return this[oParams.sDialogName];
            }.bind(this)
          );
        } else {
          return new Promise(
            function (res) {
              res(this[oParams.sDialogName]);
            }.bind(this)
          );
        }
      },

      resetChanges: function (aPath) {
        if (this.getModel().hasPendingChanges()) {
          if ($.isArray(aPath)) {
            return this.getModel().resetChanges(aPath);
          } else {
            return this.getModel().resetChanges();
          }
        }
        return false;
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

      onAddPaymentSetting: function (oEvent) {
        var oTable = this.getView().byId("PaymentSettingST").getTable();
        var lisItemForTable = this.byId("paymentSettingListItem").clone();
        var oCreatedTrade = this.getModel().createEntry("PaymentSettingSet", {
          properties: {},
        });

        lisItemForTable.setBindingContext(oCreatedTrade);
        oTable.insertItem(lisItemForTable, 0);
      },

      onEditToggled: function (oEvent) {
        var bEditable = oEvent.getParameter("editable");
        this.setStateProperty(
          "/PaymentSettingSTMode",
          bEditable ? "Delete" : "None"
        );
      },

      onDeletePaymentSetting: function (oEvent) {
        var oListItem = oEvent.getParameter("listItem");
        var oBindingContext = oListItem.getBindingContext();

        MessageBox.confirm(this.i18n("ConfirmDeletePaymentSetting"), {
          styleClass: "sapUiSizeCompact",
          onClose: function (sAction) {
            if (MessageBox.Action.OK === sAction) {
              if (oBindingContext.bCreated) {
                this.getView()
                  .byId("PaymentSettingST")
                  .getTable()
                  .removeItem(oListItem);
                this.getModel().deleteCreatedEntry(oBindingContext);
              } else {
                this.getModel().remove(oBindingContext.getPath(), {
                  success: function () {
                    this.showMessageToast(this.i18n("SuccessfullyDeleted"));
                  }.bind(this),
                  error: function () {
                    this.showMessageToast(this.i18n("MessageError"));
                  }.bind(this),
                });
              }
            }
          }.bind(this),
        });
      },

      submitChanges: function (oEvents) {
        return this.getModel().submitChanges(oEvents);
      },

      i18n: function (sKey, aArgs) {
        return this.getResourceBundle().getText(sKey, aArgs);
      },

      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },

      showMessageToast: function (sText) {
        return sap.m.MessageToast.show(sText);
      },

      onDeleteAllPaymentSettings: function (oEvent) {
        this.showBusyDialog();
        this.getModel().callFunction("/DeletePaymentSettings", {
          method: "POST",
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

      showBusyDialog: function () {
        this.oBusyDialog = new sap.m.BusyDialog({
          title: this.i18n("PleaseWait"),
          showCancelButton: true,
          close: function (oEvent) {
            oEvent.getSource().close();
          },
        });
        this.oBusyDialog.open();
        this.oBusyDialog.attachClose(
          function () {
            this.oBusyDialog.destroy();
            this.oBusyDialog = null;
          }.bind(this)
        );
      },

      closeBusyDialog: function () {
        if (this.oBusyDialog) {
          this.oBusyDialog.close();
        }
      },

      handleTypeMissmatch: function (oEvent) {
        var aFileTypes = oEvent.getSource().getFileType();
        $.each(aFileTypes, function (key, value) {
          aFileTypes[key] = "*." + value;
        });
        var sMessage = this.i18n("FileMissmatch") + aFileTypes.join(", ");
        sap.m.MessageToast.show(sMessage);
      },

      handleFileSelected: function (oEvent, sEntitySet, oProperty, bGetFile, oUriParam) {
        return new Promise(
          function (res, rej) {
            var oUploadInput = oEvent.getSource();
            var oFile = oEvent.getSource().getFocusDomRef().files[0];
            if (oFile) {
              var oReader = new FileReader();
              oReader.onload = function (e) {
                var oModel = this.getModel();
                var vContent = e.currentTarget.result.replace(
                  "data:" + oFile.type + ";base64,",
                  ""
                );

                var oObj = {
                  FileName: oFile.name,
                  MimeType: oFile.type,
                  Value: vContent,
                };

                if (
                  e.currentTarget.result.includes("application/octet-stream")
                ) {
                  oObj.MimeType = "application/octet-stream";
                  oObj.Value = e.currentTarget.result.replace(
                    "data:application/octet-stream;base64,",
                    ""
                  );
                }

                if (typeof oProperty === "object") {
                  oObj = Object.assign(oProperty, oObj);
                }

                if (bGetFile) {
                  oUploadInput.clear();
                  return res(oObj);
                }

                this.showBusyDialog();
                return oModel.create(sEntitySet, oObj, {
                  urlParameters: oUriParam,
                  success: function () {
                    this.closeBusyDialog();
                    oUploadInput.clear();
                    this.showMessageToast(
                      this.i18n('FILE_SUCCESSFUL_LOAD')
                    );
                    res(true);
                  }.bind(this),
                  error: function (oError) {
                    this.closeBusyDialog();
                    oUploadInput.clear();
                    this.showMessageToast(
                      this.i18n('FILE_LOAD_ERROR')
                    );
                    rej(false);
                  }.bind(this),
                });
              }.bind(this);
              oReader.readAsDataURL(oFile);
            } else {
              Log.error("File not found");
              rej(false);
            }
          }.bind(this)
        );
      },
    });
  }
);
