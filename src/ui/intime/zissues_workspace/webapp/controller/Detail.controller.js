sap.ui.define([
    // "intime.zissues_workspace.controller.App",
    "intime/zissues_workspace/controller/Main.controller",
    'sap/ui/core/Fragment',
    'sap/m/MessageBox',
    'sap/m/Button',
    "sap/ui/core/routing/History"
],
    function (MainController, Fragment, MessageBox, Button, History) {
        "use strict";

        return MainController.extend("intime.zissues_workspace.controller.Detail", {
            onInit: function () {
                this.getRouter()
                    .getRoute("task")
                    .attachPatternMatched(this._onRouteMatched, this);

            },

            _onRouteMatched: function (oEvent) {

                this._routeParam = {
                    taskId: atob(oEvent.getParameter("arguments").taskId),
                    param: oEvent.getParameter("arguments")["?query"]
                };

                this.getView().getModel().metadataLoaded().then(function () {

                    if (this._routeParam.taskId === 'new') {

                        var oParam = this._routeParam.param;

                        //todo : stage project
                        var oNewTaskContext = this.getView().getModel().createEntry("/ZSNN_INTIME_TASK", {
                            properties: {
                                Name: 'Новая задача',
                                Status: oParam.status
                            },
                            groupId: "changes",

                            success: function (oData) {
                                this.navTo("task", {
                                    taskId: btoa(oData.TaskId)
                                }, true);
                            }.bind(this)
                        });

                        this.getView().unbindObject();
                        this.getView().setBindingContext(oNewTaskContext);

                        this.setStateProperty("/taskContext", this.getView().getBindingContext());

                    } else {
                        this.getView().bindObject({
                            path: `/ZSNN_INTIME_TASK('${this._routeParam.taskId}')`,
                            events: {
                                dataReceived: function (oEvent) {
                                    this.setStateProperty("/taskContext", this.getView().getBindingContext());
                                }.bind(this)
                            }
                        });

                        if (this.getView().getBindingContext()) {
                            this.setStateProperty("/taskContext", this.getView().getBindingContext());
                        }


                    }
                    this.byId("subTaskSmartTable").bindProperty("editable", "state>/taskEditMode");

                    debugger;

                }.bind(this))
            },

            onTaskEditButtonPress: function (oEvent) {
                this.setStateProperty("/taskEditMode", !this.getStateProperty("/taskEditMode"));
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
                    subTaskId: btoa(oEvent.getParameter("listItem").getBindingContext().getObject().SubtaskId)
                }, false);

            },

            onAddNewSubTask: function () {



                this.navTo("subtask", {
                    taskId: btoa(this.getView().getBindingContext().getObject().TaskId),
                    subTaskId: btoa("new")//btoa(oEvent.getParameter("listItem").getBindingContext().getObject().SubtaskId)
                    // query: {
                    //     partnerId: btoa(this.getView().getBindingContext().getObject().PartnerID),
                    //     projectId: btoa(this.getView().getBindingContext().getObject().ProjectId),
                    //     stageId: btoa(this.getView().getBindingContext().getObject().ProjectStageId)
                    // }
                }, false);
            }


        });
    });