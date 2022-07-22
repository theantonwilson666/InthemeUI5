sap.ui.define([
    "jira/lib/BaseController",
    "sap/ui/core/Fragment",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/unified/library",
    "sap/m/library",
    "sap/m/MessageToast"


],
    function (BaseController, Fragment, Controller, JSONModel, unifiedLibrary, mobileLibrary, MessageToast) {
        "use strict";

        var CalendarDayType = unifiedLibrary.CalendarDayType;

        return BaseController.extend("intime.zint_duty.controller.Main", {

            onInit: function () {
                debugger;
                this.addExcelButton();
                // create model

                this.getRouter()
                    .getRoute("mainpage")
                    .attachPatternMatched(this._onRouteMatched, this)
            },

            _onRouteMatched: function () {
                debugger;
                debugger;
                this._setValue();

            },

            _setValue: function () {


                const oModel = new JSONModel({
                    startDate : new Date("2022", "6", "2"),
                    appointments: [

                        {
                            title: "Meet John Miller",
                            type: "Type01",
                            icon: "/sap/opu/odata/sap/ZINT_UI_USERS_SRV/UserPhotoSet('VILSONAYU')/$value",
                            startDate: new Date("2022", "6", "1", "0", "0", "0"),
                            endDate: new Date("2022", "6", "1", "23", "59", "59")
                        },
                        // {
                        //     title: "Discussion of the plan",
                        //     type: "Type01",
                        //     startDate: new Date("2022", "6", "2", "6", "0"),
                        //     endDate: new Date("2022", "6", "2", "7", "9")
                        // }, {
                        //     title: "Lunch",
                        //     text: "canteen",
                        //     type: "Type01",
                        //     startDate: new Date("2022", "6", "3", "7", "0"),
                        //     endDate: new Date("2022", "6", "3", "8", "0")
                        // }, {
                        //     title: "New Product",
                        //     text: "room 105",
                        //     type: "Type01",
                        //     icon: "sap-icon://meeting-room",
                        //     startDate: new Date("2022", "6", "3", "8", "0"),
                        //     endDate: new Date("2022", "6", "3", "9", "0")
                        // }

                    ]
                });


                this.byId('SPC1').setModel(oModel, 'test');


            },

            getCelendarToolBar: function () {
                return this.byId("__xmlview0--SPC1-Header");
            },

            addExcelButton: function () {
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

            onUploadFile: function (oEvent) {
                debugger;
            },

            loadDialog: function (oParams) {
                if (!this[oParams.sDialogName]) {
                    return Fragment.load({
                        id: this.getView().sId,
                        type: "XML",
                        name: oParams.sViewName,
                        controller: (oParams.controller) ? oParams.controller : this
                    }).then(function (oDialog) {
                        this[oParams.sDialogName] = oDialog;
                        if (oParams.sPath) { this[oParams.sDialogName].bindElement(oParams.sPath); }
                        if (oParams.bAddDependent === undefined || oParams.bAddDependent === true) {
                            this.getView().addDependent(this[oParams.sDialogName]);
                        }
                        if (!$.isArray(this[oParams.sDialogName])) { this[oParams.sDialogName].setBusyIndicatorDelay(0); }
                        return this[oParams.sDialogName];
                    }.bind(this));
                } else {
                    return new Promise(function (res) {
                        res(this[oParams.sDialogName]);
                    }.bind(this));
                }
            },

        });
    });