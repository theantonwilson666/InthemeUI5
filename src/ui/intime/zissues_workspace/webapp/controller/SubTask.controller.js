sap.ui.define([
    // "intime.zissues_workspace.controller.App",
    "intime/zissues_workspace/controller/Detail.controller",
    'sap/ui/core/Fragment',
    'sap/m/MessageBox',
    'sap/m/Button'
],
    function (DetailController, Fragment, MessageBox, Button) {
        "use strict";

        return DetailController.extend("intime.zissues_workspace.controller.SubTask", {
            onInit: function () {
                this.getRouter()
                    .getRoute("subtask")
                    .attachPatternMatched(this._onRouteMatched, this);

            },

            _onRouteMatched: function (oEvent) {


                this.getView().bindObject({
                    path : `/ZSNN_INTIME_SUBTASK('${atob(oEvent.getParameter("arguments").subTaskId)}')`,
                    parameters: {
                        expand: "to_Task"
                     }
                });

                // this.byId("subTaskSmartTable").bindProperty("editable", "state>/taskEditMode");

                // this.byId("__xmlview0--subTaskSmartTable-btnEditToggle").setVisible(false); // ???????????


            }


        });
    });