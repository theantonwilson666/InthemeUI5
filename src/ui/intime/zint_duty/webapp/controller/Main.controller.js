sap.ui.define([
        "jira/lib/BaseController",
        "sap/ui/core/library",
        "sap/ui/core/Fragment",
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/format/DateFormat",
        "sap/ui/model/json/JSONModel",
        "sap/ui/unified/library",
        "sap/m/library",
        "sap/m/MessageToast"


    ],
    function(BaseController, Fragment, Controller, DateFormat, JSONModel, unifiedLibrary, mobileLibrary, MessageToast) {
        "use strict";


        return BaseController.extend("intime.zint_duty.controller.Main", {

            onInit: function() {
                debugger;
                this.addExcelButton();
                // create model

                // this.getRouter()
                //     .getRoute("mainpage")
                //     .attachPatternMatched(this._onRouteMatched, this)
            },

            _onRouteMatched: function() {
                debugger;
                debugger;
                this._setValue();

            },

            _setValue: function() {
                // debugger;
                // const oModel = new JSONModel();
                //     oModel.setData({
                //         dateValue: new Date()
                //     });
                //     this.getView().setModel(oModel);
                //     this.byId("DP1").setDateValue(new Date());

            },

            getCelendarToolBar: function() {
                return this.byId("__xmlview0--SPC1-Header");
            },

            addExcelButton: function() {
                var oFilerUploader = new sap.ui.unified.FileUploader({
                    buttonOnly: true,
                    id: "fileUploader",
                    style: "Transparent",
                    name: "myFileUpload",
                    buttonText: "Загрузить",
                    fileType: "xls,xlsx,xlsm",
                    change: this.onUploadFile.bind(this),
                });

                var oCelendarToolBar = this.getCelendarToolBar();
                oCelendarToolBar.addAction(oFilerUploader);
            },

            onUploadFile: function(oEvent) {
                debugger;
            },

            loadDialog: function(oParams) {
                if (!this[oParams.sDialogName]) {
                    return Fragment.load({
                        id: this.getView().sId,
                        type: "XML",
                        name: oParams.sViewName,
                        controller: (oParams.controller) ? oParams.controller : this
                    }).then(function(oDialog) {
                        this[oParams.sDialogName] = oDialog;
                        if (oParams.sPath) { this[oParams.sDialogName].bindElement(oParams.sPath); }
                        if (oParams.bAddDependent === undefined || oParams.bAddDependent === true) {
                            this.getView().addDependent(this[oParams.sDialogName]);
                        }
                        if (!$.isArray(this[oParams.sDialogName])) { this[oParams.sDialogName].setBusyIndicatorDelay(0); }
                        return this[oParams.sDialogName];
                    }.bind(this));
                } else {
                    return new Promise(function(res) {
                        res(this[oParams.sDialogName]);
                    }.bind(this));
                }
            },

        });
    });