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


                this.getView().bindObject(`/ZSNN_INTIME_TASK('${atob(oEvent.getParameter("arguments").taskId)}')`);

                this.byId("subTaskSmartTable").bindProperty("editable", "state>/taskEditMode");

                this.byId("__xmlview0--subTaskSmartTable-btnEditToggle").setVisible(false); // ???????????


            },

            onTaskEditButtonPress: function (oEvent) {
                this.setStateProperty("/taskEditMode", !this.getStateProperty("/taskEditMode"));
                // this.getView().getModel("state").updateBindings(true);
            },

            getPage: function () {

                return this.byId("taskPage");
            },

            refreshPage: function () {
                this.getView().getElementBinding().refresh(true)
            },

            onSaveTaskButtonPress: function () {
                this.getPage().setBusy(true);

                this.submitChanges({
                    groupId: "changes",
                    success: function () {
                        this.getPage().setBusy(false);

                        if (!this.isExistError()) {
                            this.setStateProperty("/taskEditMode", !this.getStateProperty("/taskEditMode"));
                            this.refreshPage();
                        }
                    }.bind(this),
                    error: function (oError) {
                        this.getPage().setBusy(false);
                        this.showError(oError);
                        this.refreshPage();
                    }.bind(this),

                });
            },


            onRejectButtonPress: function () {
                this.setStateProperty("/taskEditMode", !this.getStateProperty("/taskEditMode"));
            },


            onSubTaskItemPress: function (oEvent) {
                oEvent.getParameter("listItem").setSelected(false);

                this.navTo("subtask", { 
                    taskId: btoa(this.getView().getBindingContext().getObject().TaskId),
                    subTaskId : btoa(oEvent.getParameter("listItem").getBindingContext().getObject().SubtaskId)
                }, false);

            }

        });
    });