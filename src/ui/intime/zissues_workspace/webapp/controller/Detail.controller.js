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
                this.getRouter()
                    .getRoute("task")
                    .attachPatternMatched(this._onRouteMatched, this);

            },

            _onRouteMatched: function (oEvent) {
                var oArr = oEvent.getParameter("arguments")["?query"];
                this.getView().bindObject(`/ZSNN_INTIME_TASK('${oArr.TaskId}')`);

            }

        });
    });