sap.ui.define([
    // "intime.zissues_workspace.controller.App",
    "intime/zissues_workspace/controller/Main.controller",
    'sap/ui/core/Fragment',
    'sap/m/MessageBox',
    'sap/m/Button'
],
    function (MainController, Fragment, MessageBox, Button) {
        "use strict";

        return MainController.extend("intime.zissues_workspace.controller.Detail", {
            onInit: function () {
            },

        });
    });