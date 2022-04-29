sap.ui.define([
    // "intime.zissues_workspace.controller.App",
    "jira/lib/BaseController",
    'sap/ui/core/Fragment',
    'sap/m/MessageBox',
    'sap/m/Button',
    'sap/ui/model/Filter',
    'intime/zissues_workspace/controls/GridListTask',
    'sap/m/VBox',
    'sap/m/HBox'

],
    function (BaseController, Fragment, MessageBox, Button, Filter, GridListTask, VBox, HBox) {
        "use strict";

        return BaseController.extend("intime.zissues_workspace.controller.Main", {
            onInit: function () {
                this.getRouter()
                    .getRoute("mainpage")
                    .attachPatternMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function () {
                this.getView().getModel().metadataLoaded().then(function () {
                    if (this.byId("statusGridList")) {
                        // this.byId("statusGridList").bindItems({
                        //     path: "/ZBNN_TASK_STATUS",
                        //     template: this.getGridListStatus()
                        // });

                        debugger;

                    };

                }.bind(this));
            },

            onSmartFilterGoPress: function () {
                this.byId("statusGridList").getBinding("items").refresh(true);
            },

            updateFinished: function (oEvent) {
                var aItem = oEvent.getSource().getItems();
                for (var i = 0; i < aItem.length; i++) {
                    var oItem = aItem[i];
                    var oTaskGridList = oItem.getContent()[0].getItems()[1];

                    oTaskGridList.bindItems({
                        path: "to_Task",
                        template: this.getGridListTask(),
                        filters: this.getFilters()
                    })
                }
            },

            getFilters: function () {
                return this.byId("taskSmartFilter").getFilters();
            },

            getGridListTask: function () {
                return new GridListTask({

                    dragDropConfig: [
                        new sap.ui.core.dnd.DragInfo()
                    ],

                    content: [
                        new VBox({
                            height: "100%",
                            justifyContent: "SpaceBetween",
                            items: [
                                new VBox({
                                    items: [
                                        new HBox({
                                            alignItems: "Start",
                                            justifyContent: "SpaceBetween",
                                            items: [
                                                new sap.m.ObjectIdentifier({
                                                    title: "{Name}",
                                                    text: "{ProjectStageName}({ProjectName})",
                                                    titleActive: true,
                                                    titlePress: this.onTaskTitlePress.bind(this),

                                                }).addStyleClass("sapUiTinyMargin"),

                                                new HBox({
                                                    items: [
                                                        new sap.m.Button({
                                                            icon: "sap-icon://arrow-bottom",
                                                            press: this.onShowSubTaskListButtonPress.bind(this)
                                                        }),

                                                        new sap.m.Button({
                                                            icon: "sap-icon://delete",
                                                            press: this.onDeleteTaskButtonPress.bind(this)
                                                        })


                                                    ]
                                                }).addStyleClass("sapUiTinyMargin")
                                            ]
                                        }),

                                        new sap.m.Text({
                                            text: {
                                                path: 'EndDate',
                                                formatter: this.commonFormatter.formatDateTimeToShortDate
                                            }

                                        }).addStyleClass("sapUiTinyMarginBegin"),
                                    ]
                                }),

                                new sap.m.List({
                                    visible: false
                                }).bindItems({
                                    path: 'to_SubTask',
                                    template: new sap.m.StandardListItem({
                                        title: "{Name}",
                                        info: "StatusText"
                                    })
                                })
                            ]
                        }),



                    ]
                })
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

            goToMainPage: function (bHistory) {
                this.navTo("mainpage", {}, bHistory);
            },


            onChangeTaskStatusDrop: function (oEvent) {
                var oTask = oEvent.getParameter("draggedControl").getBindingContext();
                var sStatus = oEvent.getParameter("droppedControl").getBindingContext().getObject().TaskStatus;


                this._droppedStatus = oEvent.getParameter("droppedControl");

                this.getView().getModel().update(oTask.getPath(), {
                    Status: sStatus
                }, {
                    success: function () {

                        this._droppedStatus.getContent()[0].getItems()[1].getBinding("items").refresh();
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
            },

            onTaskDataRequested: function (oEvent) {
                debugger;

                var aFilter = [
                    new Filter('ProjectId', 'EQ', '0001000006')
                ];
                // aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));

                oEvent.getSource().filter(aFilter);
            },

            createContent: function (oEvent) {
                debugger;
            }

        });
    });