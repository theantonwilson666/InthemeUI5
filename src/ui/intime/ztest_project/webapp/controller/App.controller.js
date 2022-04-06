sap.ui.define([
    "jira/lib/BaseController",
    'sap/ui/core/Fragment'
],
    function (BaseController, Fragment) {
        "use strict";

        return BaseController.extend("intime.ztest_project.controller.App", {
            onInit: function () { },

            OnEdit: function () {
                this.changeEditMode();
                this.changeColor();
            },

            changeColor: function() { 

            var isChangeMode = this.isChangeMode();

                if ( isChangeMode === true ) { 
                     document.getElementById("application-ztest_project-display-component---App--page-cont").style.backgroundColor = "#DEDDD8";
                } else {
                     document.getElementById("application-ztest_project-display-component---App--page-cont").style.backgroundColor = "#fafafa";
                }
            },

            isChangeMode: function(){
                return this.getStateProperty("/editMode") ? true : false;
            },

            changeEditMode: function(){
                this.setStateProperty("/editMode", !this.getStateProperty("/editMode"));
            },

            OnDisplay: function () {
                this.changeEditMode();
                this.changeColor();
            },

            OpenDialog: function(oEvent) {

                var isChangeMode = this.isChangeMode();

                if ( isChangeMode === true ) {

                this.loadDialog
                .call(this, {
                    sDialogName: "EditDialog",
                    sViewName: "intime.ztest_project.view.fragment.EditDialog"
                })
                .then(
                    function(oDialog) {
                        oDialog.open();
                    }.bind(this)
                );
            } }, 


        });
    });
