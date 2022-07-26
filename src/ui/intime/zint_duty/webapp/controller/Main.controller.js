sap.ui.define([
        "jira/lib/BaseController",
        "sap/ui/core/Fragment",
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/unified/library",
        "sap/m/library",
        "sap/m/MessageToast"


    ],
    function(BaseController, Fragment, Controller, JSONModel, unifiedLibrary, mobileLibrary, MessageToast) {
        "use strict";

        var CalendarDayType = unifiedLibrary.CalendarDayType;

        return BaseController.extend("intime.zint_duty.controller.Main", {

            onInit: function() {
                this.addExcelButton();

                this.getRouter()
                    .getRoute("mainpage")
                    .attachPatternMatched(this._onRouteMatched, this)
            },

            _onRouteMatched: function() {
                this._setValue();

            },

            _setValue: function() {


                const oModel = new JSONModel({
                    startDate: new Date("2022", "6", "2"),
                    appointments: [

                        {
                            title: "Alexander Zaburdaev",
                            type: "Type01",
                            // icon: "/sap/opu/odata/sap/ZINT_UI_USERS_SRV/UserPhotoSet('VILSONAYU')/$value",
                            icon: "https://imgur.com/t/space/t3qBCUf",
                            startDate: new Date("2022", "6", "1", "0", "0", "0"),
                            endDate: new Date("2022", "6", "1", "23", "59", "59")
                        },
                        {
                            title: "Efimova Alexandra",
                            type: "Type02",
                            // icon: "/sap/opu/odata/sap/ZINT_UI_USERS_SRV/UserPhotoSet('VILSONAYU')/$value",
                            icon: "https://imgur.com/t/space/t3qBCUf",
                            startDate: new Date("2022", "6", "1", "0", "0", "0"),
                            endDate: new Date("2022", "6", "1", "23", "59", "59")
                        }
                    ]
                });
                this.byId('SPC1').setModel(oModel, 'test');
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

            onEditButtonTollBar: function(oEvent) {
                this.byId('EditButtonTollBar').setVisible(false);

                if (this.byId('otb1').getContent()[1]) {
                    this.byId('otb1').getContent()[1].setVisible(true);
                } else {
                    var oButton = new sap.m.Button("DisplayButtonToolBar", {
                        text: "Просмотр",
                        icon: "sap-icon://display",
                        type: "Transparent",
                        press: this.onDisplayButtonToolBar
                    });
                    this.byId('EditButtonTollBar').getParent().addContent(oButton);
                }
            },

            onDisplayButtonToolBar: function(oEvent) {
                this.setVisible(false);
                this.getParent().getContent()[0].setVisible(true);
            },

            onUploadFile: function(oEvent) {
                debugger;
            },

            onEditButtonOverFullButton: function(oEvent) {
                if (this.byId('FlexBoxActions').getVisible()) {
                    this.byId('FlexBoxActions').setVisible(false);
                    this.byId('editButton').setText('Редактировать');
                } else {
                    this.byId('FlexBoxActions').setVisible(true);
                    this.byId('editButton').setText('Просмотр');
                }
            },

            onCellPress: function(oEvent) {
                this.loadDialog
                    .call(this, {
                        sDialogName: "_CellDialog",
                        sViewName: "intime.zint_duty.view.fragment.CellDialog"
                    })
                    .then(
                        function(oDialog) {
                            oDialog.open();
                        }.bind(this)
                    );
            },

            onCancelDialog: function(oEvent) {
                oEvent.getSource().getParent().close();
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