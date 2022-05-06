sap.ui.define([
    "intime/zpartners_registry/controller/App.controller",
    'sap/ui/core/Fragment',
    'sap/m/MessageBox',
    'sap/m/Button',
    "sap/ui/table/Row",
    "jira/lib/fiorielementslib/fioriBaseController"
],
    function (AppController, Fragment, MessageBox, Button, TableRow, fioriBaseController) {
        "use strict";

        return AppController.extend("intime.zpartners_registry.controller.Detail", {

            buttonId: null,
            onInit: function () {
                this.getRouter()
                    .getRoute("project")
                    .attachPatternMatched(this._onRouteMatched, this);


            },


            _onRouteMatched: function (oEvent) {
                var oArr = oEvent.getParameter("arguments")["?query"];
                this.getView().bindObject(`/ZSNN_PARTNER_ROOT('${oArr.PartnerId}')`);
                this.setFaviconIconByPartner(oArr.PartnerId);
                this.setStateProperty("/projectSelection", false);
                this.setStateProperty("/stageSelection", false);

                debugger;

                // this.getView().getModel().setDeferredGroups(["changes"])

            },

            onSelectRow: function (oEvent) {
                var oRowData = oEvent.getParameter("rowContext").getObject();

                this._selectedRowContext = oEvent.getParameter("rowContext");


                this.bindSections({
                    ID: oRowData.ID
                });

                //Проект
                if (oRowData.HierLevel === 0) {
                    this.setProjectSelection();

                    //Этап
                } else if (oRowData.HierLevel === 1) {
                    this.setStageSelection();
                };

                this.refreshAdminSection();
                this.setStateProperty("/editProjectMode", false);

                debugger;
            },

            refreshAdminSection: function () {
                var oTable = this.byId("_ProjectAdmins-Table");
                var oTemplate = new sap.m.ColumnListItem(
                    {
                        vAlign: "Middle",
                        cells: [
                            new sap.ui.comp.smartfield.SmartField({
                                value: "{Username}",
                                editable: "{state>/editProjectMode}"
                            }),
                            new sap.m.Switch({
                                state: "{CreateEnabled}",
                                type: "AcceptReject",
                                enabled: "{state>/editProjectMode}"
                            }),

                            new sap.m.Switch({
                                state: "{UpdateEnabled}",
                                type: "AcceptReject",
                                enabled: "{state>/editProjectMode}"
                            }),

                            new sap.m.Switch({
                                state: "{DeleteEnabled}",
                                type: "AcceptReject",
                                enabled: "{state>/editProjectMode}"
                            })

                        ]
                    });

                oTable.bindItems("to_Admins", oTemplate);

            },

            onDeleteAdminPress: function (oEvent) {
                var oDeletedContext = oEvent.getParameter("listItem").getBindingContext();
                this.byId("_ProjectAdmins-Table").setBusy(true);
                this.getModel().remove(oDeletedContext.getPath(), {
                    success: function (oData) {
                        this.byId("_ProjectAdmins-Table").setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.byId("_ProjectAdmins-Table").setBusy(false);
                        this.showError(oError);

                    }.bind(this)
                });
            },

            onAddAdminPress: function (oEvent) {

                var oProjectData = oEvent.getSource().getBindingContext().getObject();

                var oNewContext = this.getModel().createEntry(oEvent.getSource().getBindingContext().getPath() + "/to_Admins", {
                    groupId: "changes",
                    properties: {
                        ID: oProjectData.ID,
                        Type: oProjectData.HierLevel === 0 ? "project" : "stage"
                    }
                })

                var oItem = oEvent.getSource().getParent().getParent().getBindingInfo("items").template.clone();
                oItem.setBindingContext(oNewContext);
                oEvent.getSource().getParent().getParent().insertItem(oItem, 0);
            },

            onEditAdminPress: function (oEvent) {

                this.setStateProperty("/editProjectMode", !this.getStateProperty("/editProjectMode"));
                oEvent.getSource().getParent().getParent().setMode(this.getStateProperty("/editProjectMode") === true ? "Delete" : "None");

                // {state>/editProjectMode}

                // var oControlModel = oEvent.getSource().getModel("control");
                // var oData = oControlModel.getData();
                // oData.edit = !oData.edit;
                // oControlModel.updateBindings(true);
                // oEvent.getSource().setIcon(oData.edit === true ? "sap-icon://display" : "sap-icon://edit")
            },


            bindSections: function (oKey) {
                var aItems = this.byId("iconTabBar").getItems();
                for (var i = 0; i < aItems.length; i++) {
                    var oItem = aItems[i];
                    oItem.bindObject(`/ZSNN_INT_PROJECT('${oKey.ID}')`);
                };
            },

            setProjectSelection: function () {
                this.setStateProperty("/projectSelection", true);
                this.setStateProperty("/stageSelection", false);

                this.byId("ProjectChangeDocumentSmartTable").rebindTable();
            },

            setStageSelection: function () {
                this.setStateProperty("/projectSelection", false);
                this.setStateProperty("/stageSelection", true);

                this.byId("stageChangeDocumentSmartTable").rebindTable();
            },

            isSelected: function (ID) {
                debugger;
                this.buttonId = `${ID}`;
            },

            onDeletePartnerButtonPress: function (oEvent) {
                this.deletePartner(oEvent.getSource().getBindingContext());
            },

            onSaveProjectButtonPress: function (oEvent) {

                debugger;

                this.byId("projectPage").setBusy(true);

                this.submitChanges({
                    groupId: "changes",
                    success: function () {
                        debugger;

                        this.byId("projectPage").setBusy(false);

                        if (!this.isExistError()) {
                            // this.clearFileUploader();
                        }

                        // if (!this.isExistError()) {
                        //     this.byId("profitWorkerSmartTable").rebindTable();
                        //     this.closeBusyDialog();
                        // } else {
                        //     this.closeBusyDialog();
                        // }
                    }.bind(this),
                    error: function (oError) {

                        this.byId("projectPage").setBusy(false);
                        this.showError(oError);
                        // this.closeBusyDialog();
                        // this.showError(oError);
                    }.bind(this),

                });

            },

            onRejectButtonPress: function () { },

            onAddNewProjectButtonPress: function (oEvent) {
                var oNewEntryContext = this.getView().getModel().createEntry(this.getBindingPath() + "/to_Project", {
                    properties: {
                        Name: 'Новый проект',
                        PartnerID: this.getView().getBindingContext().getObject().PartnerId
                    },
                    groupId: "changes"
                });
                this.setProjectSelection();
                this.byId("projectTab").setBindingContext(oNewEntryContext);
                this.setStateProperty("/editProjectMode", true);
                this.byId("projectForm").focus();
            },


            onAddNewProjectStageButtonPress: function (oEvent) {

                var oNewEntryContext = this.getView().getModel().createEntry(this.getBindingPath() + "/to_Project", {
                    properties: {
                        Name: 'Новый этап',
                        ParentID: this._selectedRowContext.getObject().ID,
                        PartnerID: this._selectedRowContext.getObject().PartnerId
                    },
                    groupId: "changes"
                });
                this.setStageSelection();
                this.byId("stageTab").unbindObject();
                this.byId("stageTab").setBindingContext(oNewEntryContext);
                this.setStateProperty("/editProjectMode", true);
                this.byId("stageForm").focus();
            },

            getSmartTable: function () {
                return this.byId("projectSmartTable");
            },

            onDocumentNavigate: function (oEvent) {
                debugger;
                var oLinkData = oEvent.getSource().getBindingContext().getObject();

                var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");

                var sLinkForWinow = oCrossAppNav.hrefForExternal({
                    target: { semanticObject: "zissues_workspace", action: "display"},
                    params: { 
                        PartnerId: oLinkData.PartnerId
                    } 
                });
                window.open(sLinkForWinow, true);
            }
        });
    });