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
                        this.setFaviconIconByPartner(oTaskContext.getObject().PartnerID);
                    }

                    if (this._routeSubTaskParam.subTaskId === 'new') {

                        this.setStateProperty("/subTaskCreateMode", true);

                        if (!oTaskContext) {
                            this.goToMainPage(true);
                            return;
                        }

                        this.getView().setBusy(true);

                        this.getModel().callFunction("/GetCreatedSubTask", {
                            method: "POST",
                            urlParameters: {
                                TaskID: this._routeSubTaskParam.taskId
                            },

                            success: function (oData) {
                                this.getView().setBusy(false);
                                this.isExistError();

                                var oNewSubTaskContext = this.getView().getModel().createEntry(`/ZSNN_INTIME_SUBTASK`, {
                                    properties: oData,
                                    groupId: "changes",
                                    success: function (oData) {
                                        this.navTo("subtask", {
                                            taskId: btoa(oData.TaskId),
                                            subTaskId: btoa(oData.SubtaskId)
                                        }, true);
                                    }.bind(this)
                                });

                                this.getView().unbindObject();
                                this.getView().setBindingContext(oNewSubTaskContext);
                                this.setStateProperty("/subTaskEditMode", true);

                            }.bind(this),

                            error: function (oError) {
                                this.getView().setBusy(false);
                                this.showError(oError);
                            }.bind(this)
                        });






                    } else {

                        this.setStateProperty("/subTaskCreateMode", false);

                        this.getView().bindObject({
                            path: `/ZSNN_INTIME_SUBTASK('${this._routeSubTaskParam.subTaskId}')`,
                            parameters: {
                                expand: "to_Task"
                            },
                            events: {

                                dataReceived: function (oData) {
                                    var oTaskModel = new JSONModel(oData.getParameter("data").to_Task);
                                    this.getView().setModel(oTaskModel, "taskData");
                                    this.setFaviconIconByPartner(oData.getParameter("data").to_Task.PartnerID);
                                }.bind(this)
                            }
                        });
                    }

                }.bind(this));


                // this.byId("_SubTaskExecutors-SmartTable").bindProperty("editable", "state>/subTaskEditMode");

            },


            getTaskData: function () {

                if (this.getView().getBindingContext().bCreated) {
                    this.goToMainPage(true);
                    return;
                }

                return new Promise(function (resolve, reject) {
                    this.getModel().read(this.getModel().getBindingContext().getPath() + "/to_Task", {
                        success: resolve,
                        error: reject
                    })
                }.bind(this));
            },


            onSubTaskEditButtonPress: function () {
                this.setStateProperty("/subTaskEditMode", !this.getStateProperty("/subTaskEditMode"));
            },

            onSubTaskDeleteButtonPress: function (oEvent) {

                this._delSubTask = oEvent.getSource().getBindingContext();

                this.getView().setBusy(true);

                MessageBox.warning(`Удалить подзадачу "${this._delSubTask.getObject().Name}"?`, {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    onClose: function (sAction) {
                        this.getView().setBusy(false);
                        if (sAction === 'OK') {

                            this.getModel().remove(this._delSubTask.getPath(), {
                                success: function (oData) {
                                    this.isExistError();
                                }.bind(this),

                                error: function (oError) {
                                    this.showError(oError);
                                }.bind(this)
                            });

                        }
                    }.bind(this)
                });

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

            },

            afterCloseDialog: function (oEvent) {
                debugger;
            },


            onAddSubTaskExecutor: function (oEvent) {
                debugger;
                this.loadDialog
                    .call(this, {
                        sDialogName: "_newSubTaskExecutorDialog",
                        sViewName: "intime.zissues_workspace.view.SubTaskSection.NewExecutorDialog"
                    })
                    .then(
                        function (oDialog) {

                            var oExecutorContext = this.getModel().createEntry(this.getPage().getBindingContext().getPath() + "/to_Executors", {
                                groupId: "changes",
                                properties: {
                                    SubTaskID: this.getPage().getBindingContext().getObject().SubtaskId,
                                    StartDate: this.getPage().getBindingContext().getObject().StartDate,
                                    EndDate: this.getPage().getBindingContext().getObject().EndDate,
                                },
                            });

                            oDialog.setBindingContext(oExecutorContext);
                            oDialog.open();
                        }.bind(this)
                    );
            },


            onOkNewExecutorDialog: function (oEvent) {
                this.onSaveSubTaskButtonPress();
                oEvent.getSource().getParent().close();
                this.onRemoveRowSelection();

            },

            onCancelNewExecutorDialog: function (oEvent) {
                oEvent.getSource().getParent().close();
                this.onRemoveRowSelection();
            },

            onDeleteSelection: function (oEvent) {
                debugger

                var oItem = oEvent.getSource().getParent();
                var oEntry = oItem.getBindingContext().getObject();

                sap.m.MessageBox.warning(`Вы уверены, что хотите удалить исполнителя ${oEntry.ExecutorName}`, {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        switch (sAction) {
                            case MessageBox.Action.OK:
                                this.getModel().remove(oItem.getBindingContext().sPath);
                                debugger;
                                break;
                            case MessageBox.Action.CANCEL:
                                sap.m.MessageToast.show("Операция отменена");
                            default:
                                break;
                        }
                    }.bind(this)
                });
            },


            onTimeSheetCreateButtonPress: function (oEvent) {

                debugger;

                this.loadDialog
                    .call(this, {
                        sDialogName: "_createTimeSheetDialog",
                        sViewName: "intime.zissues_workspace.view.SubTaskSection.CreateTimeSheet",
                        sPath: oEvent.getSource().getBindingContext().getPath()

                    })
                    .then(
                        function (oDialog) {

                            oDialog.open();

                            oDialog.timeSheetSaveResult.then(function (oSuccess) {
                                this.isExistError();
                                this.refreshPage();
                            }.bind(this), function (oError) {
                                this.showError(oError);;
                            }.bind(this));


                        }.bind(this)
                    );;
            },

            onRemoveRowSelection: function () {
                var oFirstSelectedItem = this.byId("_SubTaskExecutors-SmartTable").getTable().getSelectedItems()[0];
                this.byId("_SubTaskExecutors-SmartTable").getTable().setSelectedItem(oFirstSelectedItem, false);
            }
        });
    });