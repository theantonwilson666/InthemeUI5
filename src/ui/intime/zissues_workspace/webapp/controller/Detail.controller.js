sap.ui.define([
    // "intime.zissues_workspace.controller.App",
    "intime/zissues_workspace/controller/Main.controller",
    "jira/lib/BaseController",
    'sap/ui/core/Fragment',
    'sap/m/MessageBox',
    'sap/m/Button',
    "sap/ui/core/routing/History",
    "jira/lib/intime_reuse/timeSheet/MoveTasktoAnotherStageDialog"
],

    function (BaseController, MainController, Fragment, MessageBox, Button, History, MoveTasktoAnotherStageDialog) {
        "use strict";

        return MainController.extend("intime.zissues_workspace.controller.Detail", {
            onInit: function () {
                this.getRouter()
                    .getRoute("task")
                    .attachPatternMatched(this._onRouteMatched, this);
            },

            // onAfterRendering: function() {
            //     debugger;
            //     sap.ui.getCore().byId('__xmlview0--subTaskSmartTable-btnEditToggle').setVisible(false);
            // },

            _onRouteMatched: function (oEvent) {

                this._routeParam = {
                    taskId: atob(oEvent.getParameter("arguments").taskId),
                    param: oEvent.getParameter("arguments")["?query"]
                };

                this.getView().getModel().metadataLoaded().then(function () {

                    if (this._routeParam.taskId === 'new') {

                        this.setStateProperty("/taskCreated", true);

                        var oProjectData = this.getStateProperty("/ProjectData");

                        this.getView().setBusy(true);

                        this.getModel().callFunction("/GetCreatedTask", {
                            method: "POST",
                            urlParameters: {
                                PartnerID: oProjectData ? oProjectData.PartnerID : "",
                                ProjectID: oProjectData ? oProjectData.ProjectID : "",  //this._selectedRowContext.getObject().ID,
                                ProjectStageID: oProjectData ? oProjectData.ProjectStageID : ""
                            },

                            success: function (oData) {
                                this.getView().setBusy(false);
                                this.isExistError();
                                var oParam = this._routeParam.param;

                                //todo : stage project
                                var oNewTaskContext = this.getView().getModel().createEntry("/ZSNN_INTIME_TASK", {
                                    properties: oData,
                                    groupId: "changes",

                                    success: function (oData) {
                                        this.navTo("task", {
                                            taskId: btoa(oData.TaskId)
                                        }, true);
                                    }.bind(this)
                                });

                                this.getView().unbindObject();
                                this.getView().setBindingContext(oNewTaskContext);

                                this.setStateProperty("/taskEditMode", true);
                                this.setStateProperty("/taskContext", this.getView().getBindingContext());

                            }.bind(this),

                            error: function (oError) {
                                this.getView().setBusy(false);
                                this.showError(oError);
                            }.bind(this)
                        });



                    } else {
                        this.setStateProperty("/taskCreated", false);
                        this.getView().bindObject({
                            path: `/ZSNN_INTIME_TASK('${this._routeParam.taskId}')`,
                            events: {
                                dataReceived: function (oEvent) {
                                    this.setFaviconIconByPartner(this.getView().getBindingContext().getObject().PartnerID);
                                    this.setStateProperty("/taskContext", this.getView().getBindingContext());
                                    this.byId("taskAttachments").getContent()[0].setDocumentID(oEvent.getParameter("data").TaskId);
                                    this.byId("taskAttachments").getContent()[0].setDocumentType('task')
                                }.bind(this)
                            }
                        });

                        if (this.getView().getBindingContext()) {
                            this.setStateProperty("/taskContext", this.getView().getBindingContext());
                            this.setFaviconIconByPartner(this.getView().getBindingContext().getObject().PartnerID);
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
                this.getView().getModel().resetChanges();
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
                    subTaskId: btoa("new")
                }, false);
            },

            onCancelMoveDialog: function (oEvent) {
                oEvent.getSource().getParent().close();
                this.onRemoveRowSelectionForMoveToProjectStage();
            },

            onErrorAttachment: function (oEvent) {
                this.showError(oEvent.mParameters);
            },

            onOkMoveDialog: function (oEvent) {

                debugger;
                var oSelectedItem = this.byId("_TaskProjectStage-SmartTable").getTable().getSelectedItem();

                if (!oSelectedItem) {
                    MessageBox.show("Выберите этап проекта");
                    return;
                }


                this.byId("_moveTaskToProjectStage-Dialog").setBusy(true);

                this.getModel().callFunction("/MoveTaskToProjectStage", {
                    method: "POST",
                    urlParameters: {
                        TaskID: oEvent.getSource().getParent().getBindingContext().getObject().TaskId,
                        ProjectStageID: oSelectedItem.getBindingContext().getObject().StageID
                    },

                    success: function (oData) {
                        debugger;
                        this.byId("_moveTaskToProjectStage-Dialog").setBusy(false);
                        this.isExistError();
                        this.byId("_moveTaskToProjectStage-Dialog").close();
                        this.onRemoveRowSelectionForMoveToProjectStage();

                    }.bind(this),

                    error: function (oError) {
                        this.byId("_moveTaskToProjectStage-Dialog").setBusy(false);
                        this.showError(oError);
                        this.onRemoveRowSelectionForMoveToProjectStage();
                    }.bind(this)
                });

            },


            onMoveToAnotherStageButtonPress: function (oEvent) {

                this.loadDialog
                    .call(this, {
                        sDialogName: "_moveToProjectStageDialog",
                        sViewName: "intime.zissues_workspace.view.taskSections.MoveToProjectStage"
                    })
                    .then(
                        function (oDialog) {

                            debugger;

                            oDialog.open();
                        }.bind(this)
                    );
            },

            onRemoveRowSelectionForMoveToProjectStage: function () {
                var oFirstSelectedItem = this.byId("_TaskProjectStage-SmartTable").getTable().getSelectedItems()[0];
                this.byId("_TaskProjectStage-SmartTable").getTable().setSelectedItem(oFirstSelectedItem, false);
            }


        });
    });