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
    function(BaseController, Fragment, MessageBox, Button, Filter, GridListTask, VBox, HBox) {
        "use strict";

        return BaseController.extend("intime.zissues_workspace.controller.Main", {
            onInit: function() {
                this.getRouter()
                    .getRoute("mainpage")
                    .attachPatternMatched(this._onRouteMatched, this);
                // this.getRouter().getRoute("mainpage").attachPatternMatched(this._onMasterMatched, this);

                // this.NavToTask();
            },

            NavToTask: function () {
                debugger;

                var oItems = this.getOwnerComponent().getComponentData().startupParameters;
                var sItems = JSON.stringify(oItems);
                this.getModel().callFunction("/NavToTasks", {
                    method: "POST",
                    urlParameters: {
                        AllParameters: sItems
                    },
                    success: function (oData) {
                        debugger

                    }.bind(this),
                    error: function (oError) {
                        debugger
                    }.bind(this)
                })
                
            },

            onAfterRendering: function() {
                debugger;
                this.NavToTask();
            },

            _onRouteMatched: function() {
                this.getView().getModel().metadataLoaded().then(function() {

                    var startupParams = this.getOwnerComponent().getComponentData().startupParameters;
                    debugger;

                    if (this.byId("statusGridList")) {

                        // var oUrlParam = jQuery.sap.getUriParameters().mParams;
                        // this.handleParams(oUrlParam);
                    };

                }.bind(this));
            },

            handleParams: function(oParam) {

            },

            onSmartFilterGoPress: function() {
                this.byId("statusGridList").getBinding("items").refresh(true);
            },

            updateFinished: function(oEvent) {
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

            getFilters: function() {
                return this.byId("taskSmartFilter").getFilters();
            },

            getGridListTask: function() {
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
                                        info: "{StatusText}"
                                    })
                                })
                            ]
                        }),



                    ]
                })
            },

            onChooseProjectTitlePress: function() {
                this.loadDialog
                    .call(this, {
                        sDialogName: "_chooseProjectDialog",
                        sViewName: "intime.zissues_workspace.view.dialogs.chooseProjectDialog"
                    })
                    .then(
                        function(oDialog) {
                            oDialog.open();
                        }.bind(this)
                    );
            },

            onShowSubTaskListButtonPress: function(oEvent) {
                var oList = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1];
                oList.setVisible(!oList.getVisible());

                debugger;

                if (oList.getVisible()) {
                    oEvent.getSource().setIcon("sap-icon://hide");
                } else {
                    oEvent.getSource().setIcon("sap-icon://arrow-bottom")
                }
            },


            onTaskTitlePress: function(oEvent) {
                this.navTo("task", {
                    taskId: btoa(oEvent.getSource().getBindingContext().getObject().TaskId)
                }, false);
            },

            onNewTaskButtonPress: function(oEvent) {

                this.navTo("task", {
                    taskId: btoa("new"),
                    query: {
                        status: oEvent.getSource().getBindingContext().getObject().TaskStatus,
                        project: "" // TODO
                    }
                }, false);

            },

            goToMainPage: function(bHistory) {
                this.navTo("mainpage", {}, bHistory);
            },


            onChangeTaskStatusDrop: function(oEvent) {
                var oTask = oEvent.getParameter("draggedControl").getBindingContext();
                var sStatus = oEvent.getParameter("droppedControl").getBindingContext().getObject().TaskStatus;


                this._droppedStatus = oEvent.getParameter("droppedControl");

                this.getView().getModel().update(oTask.getPath(), {
                    Status: sStatus
                }, {
                    success: function() {

                        this._droppedStatus.getContent()[0].getItems()[1].getBinding("items").refresh();
                    }.bind(this),

                    error: function(oError) {
                        this.showError(oError);
                    }.bind(this)
                })
            },



            onDeleteTaskButtonPress: function(oEvent) {
                this._delTask = oEvent.getSource().getBindingContext();

                this.getView().setBusy(true);

                MessageBox.warning(`Удалить задачу "${this._delTask.getObject().Name}"?`, {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    onClose: function(sAction) {


                        this.getView().setBusy(false);

                        if (sAction === 'OK') {

                            this.getModel().remove(this._delTask.getPath(), {
                                success: function(oData) {
                                    this.isExistError();
                                }.bind(this),

                                error: function(oError) {
                                    this.showError(oError);
                                }.bind(this)
                            });

                        }
                    }.bind(this)
                });
            },

            onTaskDataRequested: function(oEvent) {
                debugger;

                var aFilter = [
                    new Filter('ProjectId', 'EQ', '0001000006')
                ];
                // aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));

                oEvent.getSource().filter(aFilter);
            },

            createContent: function(oEvent) {
                debugger;
            },

            _onMasterMatched: function(oEvent) {

            },

            onTaskFilterinitialized: function(oEvent) {

                var startupParams = this.getOwnerComponent().getComponentData().startupParameters,
                    oSmartFilterBar = this.byId("taskSmartFilter");
                if (startupParams.ProjectID && startupParams.HierLevel[0] == "0") {
                    var oFilterProject = {
                        ProjectId: {
                            value: null,
                            ranges: [{
                                exclude: false,
                                operation: "EQ",
                                value1: startupParams.ProjectID[0],
                                keyField: "ProjectId",
                                tokenText: `=${startupParams.ProjectStageName[0]} (${startupParams.ProjectID[0]})`
                            }],
                            items: []
                        }
                    }
                    oSmartFilterBar.setFilterData(oFilterProject, true);


                    this.setStateProperty("/filterBlocked", true);
                }

                if (startupParams.ProjectStageID && startupParams.HierLevel[0] !== "0") {
                    var oFilterProjectStage = {
                        ProjectStageId: {
                            value: null,
                            ranges: [{
                                exclude: false,
                                operation: "EQ",
                                value1: startupParams.ProjectStageID[0],
                                keyField: "ProjectStageId",
                                tokenText: `${startupParams.ProjectStageName[0]} (${startupParams.ProjectStageID[0]})`
                            }],
                            items: []
                        }
                    }
                    oSmartFilterBar.setFilterData(oFilterProjectStage, true);

                    this.setStateProperty("/filterBlocked", true);
                }

                if (startupParams.PartnerId) {
                    var oFilter = {
                        PartnerID: {
                            value: null,
                            ranges: [{
                                exclude: false,
                                operation: "EQ",
                                value1: startupParams.PartnerId[0],
                                keyField: "PartnerID",
                                tokenText: `=${startupParams.PartnerId[0]}`
                            }],
                            items: []
                        }
                    }
                    oSmartFilterBar.setFilterData(oFilter, true);
                    this.setStateProperty("/filterBlocked", true);
                }

                if (oSmartFilterBar.getFilters().length === 0) {
                    this.setStateProperty("/filterBlocked", false);
                } else {
                    this.setPageHeader(startupParams)
                };
            },

            setPageHeader: function(oStartUpParam) {
                // var oBreadCrumbs = this.byId("_MainPage-BreadCrumbs");
                var aEntityNav = this.getStateProperty("/EntityNavigation");
                var oParam = this.parseStartUpParam(oStartUpParam)

                this.setStateProperty("/ProjectData", oParam);

                if (oParam.PartnerID !== '0000000000') {
                    aEntityNav.push({
                        Name: oParam.PartnerName,
                        SemanticObjectParam: {
                            target: { semanticObject: "zpartners_registry", action: "display" },
                            params: {
                                PartnerID: oParam.PartnerID,
                                PartnerName: oParam.PartnerName
                            }
                        }
                    })
                }

                if (oParam.ProjectID !== '0000000000') {
                    aEntityNav.push({
                        Name: oParam.ProjectName,
                        SemanticObjectParam: {
                            target: { semanticObject: "zpartners_registry", action: "display" },
                            params: {
                                PartnerID: oParam.PartnerID,
                                PartnerName: oParam.PartnerName
                            }
                        }
                    })
                }

                if (oParam.ProjectStageID !== '0000000000') {
                    aEntityNav.push({
                        Name: oParam.ProjectStageName,
                        SemanticObjectParam: {
                            target: { semanticObject: "zpartners_registry", action: "display" },
                            params: {
                                PartnerID: oParam.PartnerID,
                                PartnerName: oParam.PartnerName
                            }
                        }
                    })
                }



                this.setStateProperty("/EntityNavigation", aEntityNav);


            },

            parseStartUpParam: function(oStartUpParam) {
                var sPartnerID;
                var sPartnerName;
                var sProjectID;
                var sProjectName;
                var sProjectStageID;
                var sProjectStageName;

                if (oStartUpParam.PartnerId && oStartUpParam.PartnerId[0]) {
                    sPartnerID = oStartUpParam.PartnerId[0];
                }

                if (oStartUpParam.PartnerID && oStartUpParam.PartnerID[0]) {
                    sPartnerID = oStartUpParam.PartnerID[0];
                }

                if (oStartUpParam.PartnerName && oStartUpParam.PartnerName[0]) {
                    sPartnerName = oStartUpParam.PartnerName[0];
                }

                if (oStartUpParam.ProjectID && oStartUpParam.ProjectID[0]) {
                    sProjectID = oStartUpParam.ProjectID[0];
                }

                if (oStartUpParam.ProjectName && oStartUpParam.ProjectName[0]) {
                    sProjectName = oStartUpParam.ProjectName[0];
                }


                if (oStartUpParam.ProjectStageID && oStartUpParam.ProjectStageID[0]) {
                    sProjectStageID = oStartUpParam.ProjectStageID[0];
                }

                if (oStartUpParam.ProjectStageName && oStartUpParam.ProjectStageName[0]) {
                    sProjectStageName = oStartUpParam.ProjectStageName[0];
                }

                return {
                    PartnerID: sPartnerID,
                    PartnerName: sPartnerName,
                    ProjectID: sProjectID,
                    ProjectName: sProjectName,
                    ProjectStageID: sProjectStageID,
                    ProjectStageName: sProjectStageName
                }
            },

            onPressBreadCrumbNavigate: function(oEvent) {
                var oNavParam = oEvent.getSource().getBindingContext("state").getObject().SemanticObjectParam;
                var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");
                var sLinkForWinow = oCrossAppNav.hrefForExternal(oNavParam);
                window.open(sLinkForWinow, true);
            }
        });
    });