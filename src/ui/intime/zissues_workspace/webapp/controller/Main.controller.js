sap.ui.define([
    // "intime.zissues_workspace.controller.App",
    "jira/lib/BaseController",
    'sap/ui/core/Fragment',
    'sap/m/MessageBox',
    'sap/m/Button'
],
    function (BaseController, Fragment, MessageBox, Button) {
        "use strict";

        return BaseController.extend("intime.zissues_workspace.controller.Main", {
            onInit: function () {

               
            },

            onChooseProjectTitlePress: function () {
                this.loadDialog
                    .call(this, {
                        sDialogName: "_chooseProjectDialog",
                        sViewName: "intime.zissues_workspace.view.dialogs.chooseProjectDialog"
                    })
                    .then(
                        function (oDialog) {
                            oDialog.open();
                        }.bind(this)
                    );
            },

            onShowSubTaskListButtonPress: function(oEvent){
                var oList = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1];
                oList.setVisible(!oList.getVisible());

                debugger;

                if (oList.getVisible()){
                    oEvent.getSource().setIcon("sap-icon://hide");
                } else {
                    oEvent.getSource().setIcon("sap-icon://arrow-bottom")
                }
            },


            onTaskTitlePress: function(oEvent){
                //  var oParams = {
                //     TaskId: oEvent.getSource().getBindingContext().getObject().TaskId
                // };

                this.navTo("task", { 
                    taskId: btoa(oEvent.getSource().getBindingContext().getObject().TaskId) }, false);
            }

        });
    });