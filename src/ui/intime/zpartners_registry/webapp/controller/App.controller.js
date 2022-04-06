sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/Fragment'
],
    function (Controller, Fragment) {
        "use strict";

        return Controller.extend("intime.zpartners_registry.controller.App", {
            onInit: function () { },

            OnEdit: function () {
                // this.byId('EditButton').setIcon('sap-icon://display');
                this.byId('EditButton').setVisible(false) && this.byId('DisplayButton').setVisible(true)
            },

            OnDisplay: function () {
                this.byId('DisplayButton').setVisible(false) && this.byId('EditButton').setVisible(true);
            },

            OpenDialog: function(oEvent) {

                this.loadDialog
                .call(this, {
                    sDialogName: "Dialog",
                    sViewName: "intime.zpartners_registry.view.fragment.Dialog"
                })
                .then(
                    function(oDialog) {
                        oDialog.open();
                    }.bind(this)
                );
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
            }

        });
    });
