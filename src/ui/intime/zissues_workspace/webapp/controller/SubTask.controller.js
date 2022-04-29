sap.ui.define([
    // "intime.zissues_workspace.controller.App",
    "intime/zissues_workspace/controller/Detail.controller",
    'sap/ui/core/Fragment',
    'sap/m/MessageBox',
    'sap/m/Button',
    "sap/ui/model/json/JSONModel"
],
    function (DetailController, Fragment, MessageBox, Button, JSONModel) {
        "use strict";

        return DetailController.extend("intime.zissues_workspace.controller.SubTask", {
            onInit: function () {
                this.getRouter()
                    .getRoute("subtask")
                    .attachPatternMatched(this._onRouteMatched, this);

            },

            _onRouteMatched: function (oEvent) {
                this._routeSubTaskParam = {
                    taskId: atob(oEvent.getParameter("arguments").taskId),
                    subTaskId: atob(oEvent.getParameter("arguments").subTaskId),
                    param: oEvent.getParameter("arguments")["?query"]
                };

                this.getView().getModel().metadataLoaded().then(function () {

                    var oTaskContext = this.getStateProperty("/taskContext");
                    if (oTaskContext) {
                        this.getView().setModel(new JSONModel(oTaskContext.getObject()), "taskData");
                    }

                    if (this._routeSubTaskParam.subTaskId === 'new') {
                        //todo : stage project
                        var oNewSubTaskContext = this.getView().getModel().createEntry(`/ZSNN_INTIME_SUBTASK`, {
                            properties: {
                                Name: 'Новая подзадача',
                                TaskId: this._routeSubTaskParam.taskId
                            },
                            groupId: "changes",

                            success: function (oData) {

                                debugger;

                                this.navTo("subtask", {
                                    taskId: btoa(oData.TaskId),
                                    subTaskId: btoa(oData.SubtaskId)

                                }, true);

                                // this.getView().bindObject(`/ZSNN_INTIME_TASK('${oData.TaskId}')`);
                            }.bind(this)
                        });


                        this.getView().unbindObject();
                        this.getView().setBindingContext(oNewSubTaskContext);
                        this.setStateProperty("/subTaskEditMode", true);


                    } else {
                        this.getView().bindObject({
                            path: `/ZSNN_INTIME_SUBTASK('${this._routeSubTaskParam.subTaskId}')`,
                            parameters: {
                                expand: "to_Task"
                            }
                        });
                    }

                }.bind(this));

            },

            onSubTaskEditButtonPress: function () {
                this.setStateProperty("/subTaskEditMode", !this.getStateProperty("/subTaskEditMode"));
            },

            onSubTaskDeleteButtonPress: function () {

            },

            getPage: function () {
                return this.byId("subTaskPage");
            },

            onSaveSubTaskButtonPress: function () {
                this.getPage().setBusy(true);

                this.submitChanges({
                    groupId: "changes",
                    success: function () {
                        this.getPage().setBusy(false);

                        if (!this.isExistError()) {
                            this.setStateProperty("/subTaskEditMode", !this.getStateProperty("/subTaskEditMode"));
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

            onRejectSubTaskButtonPress: function () {

            }




        });
    });