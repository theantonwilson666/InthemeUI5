sap.ui.define([
    "intime/zpartners_registry/controller/App.controller",
    'sap/ui/core/Fragment',
    'sap/m/MessageBox',
    'sap/m/Button',
    "sap/ui/table/Row",
    "jira/lib/fiorielementslib/fioriBaseController"
],
function(AppController, Fragment, MessageBox, Button, TableRow, fioriBaseController) {
    "use strict";

    return AppController.extend("intime.zpartners_registry.controller.Detail", {

        buttonId: null,
        onInit: function() {
            this.getRouter()
                .getRoute("project")
                .attachPatternMatched(this._onRouteMatched, this);


        },


        _onRouteMatched: function(oEvent) {
            var oArr = oEvent.getParameter("arguments")["?query"];
            this.getView().bindObject(`/ZSNN_PARTNER_ROOT('${oArr.PartnerId}')`);
            this.setStateProperty("/projectSelection", false);
            this.setStateProperty("/stageSelection", false);

            this.getView().getModel().setDeferredGroups(["projectChange"])
            
        },

        onSelectRow: function(oEvent) {
            var oRowData = oEvent.getParameter("rowContext").getObject();

            this._selectedRowContext = oEvent.getParameter("rowContext");

            //Проект
            if (oRowData.HierLevel === 0) {
                this.setProjectSelection();

                //Этап
            } else if (oRowData.HierLevel === 1) {
                this.setStageSelection();
            };

            this.bindSections({
                ID: oRowData.ID
            });


            this.setStateProperty("/editProjectMode", false);

            debugger;
        },

        bindSections: function(oKey) {
            var aItems = this.byId("iconTabBar").getItems();
            for (var i = 0; i < aItems.length; i++) {
                var oItem = aItems[i];
                oItem.bindObject(`/ZSNN_INT_PROJECT('${oKey.ID}')`);
            };
        },

        setProjectSelection: function() {
            this.setStateProperty("/projectSelection", true);
            this.setStateProperty("/stageSelection", false);

        },

        setStageSelection: function() {
            this.setStateProperty("/projectSelection", false);
            this.setStateProperty("/stageSelection", true);
        },

        isSelected: function(ID) {
            debugger;
            this.buttonId = `${ID}`;
        },


        onSaveProjectButtonPress: function(oEvent) {
            
            this.byId("projectPage").setBusy(true);

            this.submitChanges({
                groupId : "projectChange",
                success: function() {
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
                error: function(oError) {

                    this.byId("projectPage").setBusy(false);
                    this.showError(oError);
                    // this.closeBusyDialog();
                    // this.showError(oError);
                }.bind(this),

            });

        },

        onRejectButtonPress: function() {
        },

        onAddNewProjectButtonPress: function(oEvent) {
            var oNewEntryContext = this.getView().getModel().createEntry(this.getBindingPath() + "/to_Project", {
                properties: {
                    Name: 'Новый проект',
                    PartnerID : this.getView().getBindingContext().getObject().PartnerId
                },
                groupId : "projectChange"
            });
            this.setProjectSelection();
            this.byId("projectTab").setBindingContext(oNewEntryContext);
            this.setStateProperty("/editProjectMode", true);
            this.byId("projectForm").focus();
        },


        onAddNewProjectStageButtonPress: function(oEvent) {

            var oNewEntryContext = this.getView().getModel().createEntry(this.getBindingPath() + "/to_Project", {
                properties: {
                    Name: 'Новый этап',
                    ParentID : this._selectedRowContext.getObject().ID,
                    PartnerID : this._selectedRowContext.getObject().PartnerId
                },
                groupId : "projectChange"
            });
            this.setStageSelection();
            this.byId("stageTab").unbindObject();
            this.byId("stageTab").setBindingContext(oNewEntryContext);
            this.setStateProperty("/editProjectMode", true);
            this.byId("stageForm").focus();
        },

        getSmartTable: function() {
            return this.byId("projectSmartTable");
        }
    });
});