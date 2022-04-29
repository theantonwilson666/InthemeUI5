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

            onShowSubTaskListButtonPress: function (oEvent) {
                var oList = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1];
                oList.setVisible(!oList.getVisible());

                debugger;

                if (oList.getVisible()) {
                    oEvent.getSource().setIcon("sap-icon://hide");
                } else {
                    oEvent.getSource().setIcon("sap-icon://arrow-bottom")
                }
            },


            onTaskTitlePress: function (oEvent) {
                //  var oParams = {
                //     TaskId: oEvent.getSource().getBindingContext().getObject().TaskId
                // };

                this.navTo("task", {
                    taskId: btoa(oEvent.getSource().getBindingContext().getObject().TaskId)
                }, false);
            },

            onNewTaskButtonPress: function (oEvent) {

                this.navTo("task", {
                    taskId: btoa("new"),
                    query: {
                        status: oEvent.getSource().getBindingContext().getObject().TaskStatus,
                        project: "" // TODO
                    }
                }, false);

            },

            onChangeTaskStatusDrop: function (oEvent) {
                var oTask = oEvent.getParameter("draggedControl").getBindingContext();
                var sStatus = oEvent.getParameter("droppedControl").getBindingContext().getObject().TaskStatus;


                this._droppedStatus = oEvent.getParameter("droppedControl");

                this.getView().getModel().update(oTask.getPath(), {
                    Status: sStatus
                }, {
                    success: function () {
                        
                        this._droppedStatus.getContent()[0].getItems()[1].getBinding("items").refresh(); // todo : опасно

                        // this.byId("statusGridList").refreshItems(true);
                    
                    }.bind(this),

                    error: function (oError) {
                        this.showError(oError);
                    }.bind(this)
                })
            },

            onDeleteTaskButtonPress: function (oEvent) {
                this._delTask = oEvent.getSource().getBindingContext();

                this.getView().setBusy(true);

                MessageBox.warning(`Удалить задачу "${this._delTask.getObject().Name}"?`, {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    onClose: function (sAction) {


                        this.getView().setBusy(false);

                        if (sAction === 'OK') {

                            this.getModel().remove(this._delTask.getPath(), {
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
            }

        });
    });