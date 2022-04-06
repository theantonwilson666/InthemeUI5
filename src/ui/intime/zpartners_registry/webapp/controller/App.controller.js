sap.ui.define([
    "jira/lib/BaseController",
    'sap/ui/core/Fragment'
],
    function (BaseController, Fragment) {
        "use strict";

        return BaseController.extend("intime.zpartners_registry.controller.App", {
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


        });
    });
