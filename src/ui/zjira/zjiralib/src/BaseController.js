sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "jira/lib/CommonFormatter",
    "sap/ui/core/Fragment",
    "jira/lib/MessageDialog",
    "sap/base/Log",
  ],
  function (Controller, CommonFormatter, Fragment, MessageDialog, Log) {
    "use strict";

    var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("jira.lib");

    return Controller.extend("jira.lib.BaseController", {
      commonFormatter: CommonFormatter,

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

      getRouter: function () {
        return this.getOwnerComponent().getRouter();
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

      handleFileSelected: function (
        oEvent,
        sEntitySet,
        oProperty,
        bGetFile,
        oUriParam
      ) {
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
                    this.showMessageToast(this.i18n("FILE_SUCCESSFUL_LOAD"));
                    res(true);
                  }.bind(this),
                  error: function (oError) {
                    this.closeBusyDialog();
                    oUploadInput.clear();
                    this.showMessageToast(this.i18n("FILE_LOAD_ERROR"));
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

      openPopoverBy: function (oParams) {
        if (!this[oParams.sPopoverName]) {
          return Fragment.load({
            id: this.getView().sId,
            type: "XML",
            name: oParams.sViewName,
            controller: this,
          }).then(
            function (oPopover) {
              this[oParams.sPopoverName] = oPopover;
              this.getView().addDependent(oPopover);
              return this._openPopoverBy(oParams);
            }.bind(this)
          );
        } else {
          if (this[oParams.sPopoverName].isOpen()) {
            this[oParams.sPopoverName].close();

            // Popover open if binding context different
            if (
              this[oParams.sPopoverName].getBindingContext() &&
              this[oParams.sPopoverName].getBindingContext().getPath() !==
                oParams.oSource.getBindingContext().getPath()
            ) {
              return this._openPopoverBy(oParams);
            }

            return new Promise(
              function (res) {
                res(this[oParams.sPopoverName]);
              }.bind(this)
            );
          } else {
            return this._openPopoverBy(oParams);
          }
        }
      },

      _openPopoverBy: function (oParams) {
        if (oParams.sPath) {
          this[oParams.sPopoverName].setBindingContext(
            new sap.ui.model.Context(this.getModel(), oParams.sPath)
          );
        }

        this[oParams.sPopoverName].openBy(oParams.oSource);

        return new Promise(
          function (res) {
            res(this[oParams.sPopoverName]);
          }.bind(this)
        );
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
    });
  }
);
