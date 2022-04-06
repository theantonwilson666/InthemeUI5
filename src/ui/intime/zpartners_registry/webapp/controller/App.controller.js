sap.ui.define([
    "jira/lib/BaseController",
    'sap/ui/core/Fragment'
],
    function (BaseController, Fragment) {
        "use strict";

        return BaseController.extend("intime.zpartners_registry.controller.App", {
            onInit: function () { },

            OnEdit: function () {
                this.changeEditMode();
            },

            isChangeMode: function(){
                return this.getStateProperty("/editMode") ? true : false;
            },

            changeEditMode: function(){
                this.setStateProperty("/editMode", !this.getStateProperty("/editMode"));
            },

            OnDisplay: function () {
                this.changeEditMode();
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
