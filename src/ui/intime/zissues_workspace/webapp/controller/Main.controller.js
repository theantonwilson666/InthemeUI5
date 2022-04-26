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
                        sViewName: "intime.zissues_workspace.view.fragments.chooseProjectDialog"
                    })
                    .then(
                        function (oDialog) {
                            oDialog.open();
                        }.bind(this)
                    );
            }

        });
    });