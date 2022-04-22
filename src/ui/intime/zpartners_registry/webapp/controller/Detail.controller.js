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

        },

        onSelectRow: function(oEvent) {
            var oRowData = oEvent.getParameter("rowContext").getObject();

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


        onSaveButtonPress: function(oEvent) {

            if (this.buttonId == "NewProject") {

            var oBindingContext = this.byId('projectForm').getBindingContext();
            
            var s = this.getView().getModel().createEntry(this.getSmartTable().getEntitySet(), {
                properties: { Name: oBindingContext.getObject().Name,  
                              ProjectStatus: oBindingContext.getObject().ProjectStatus, 
                              ProjectType: oBindingContext.getObject().ProjectType,
                              StartDate: oBindingContext.getObject().StartDate,
                              EndDate: oBindingContext.getObject().EndDate
                            },
                batchGroupId: "changes",
                changeSetId: "changes"
            });
            this.getView().getModel().updateBindings(true);
        } 
            
            else if (this.buttonId == "NewStage") {

                var oBindingContext = this.byId('stageForm').getBindingContext();
                var s = this.getView().getModel().createEntry(this.getSmartTable().getEntitySet(), {
                properties: { Name: oBindingContext.getObject().Name,  
                              StageStatus: oBindingContext.getObject().StageStatus, 
                              StageType: oBindingContext.getObject().StageType,
                              StartDate: oBindingContext.getObject().StartDate,
                              EndDate: oBindingContext.getObject().EndDate
                            },
                batchGroupId: "changes",
                changeSetId: "changes"
            });
            this.getView().getModel().updateBindings(true);
                
            }
        },

        onRejectButtonPress: function() {
        },

        onAddNewProjectButtonPress: function(oEvent) {

            this.isSelected("NewProject");

            var oNewEntryContext = this.getView().getModel().createEntry(this.getBindingPath() + "/to_Project", {
                properties: {
                    Name: 'Новый проект'
                }
            });
            this.setProjectSelection();
            this.byId("projectTab").setBindingContext(oNewEntryContext);
            this.setStateProperty("/editProjectMode", true);
            this.byId("projectForm").focus();
        },


        onAddNewProjectStageButtonPress: function(oEvent) {

            this.isSelected("NewStage"); 

            var oNewEntryContext = this.getView().getModel().createEntry(this.getBindingPath() + "/to_Project", {
                properties: {
                    Name: 'Новый этап'
                }
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