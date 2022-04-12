sap.ui.define([
        "intime/zpartners_registry/controller/App.controller",
        'sap/ui/core/Fragment',
        'sap/m/MessageBox',
        'sap/m/Button',
        "sap/ui/table/Row"
    ],
    function(AppController, Fragment, MessageBox, Button, TableRow) {
        "use strict";

        return AppController.extend("intime.zpartners_registry.controller.Detail", {
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


            onSaveButtonPress: function() {
                debugger;
            },

            onRejectButtonPress: function() {
                debugger;
            },

            onAddNewProjectButtonPress: function(oEvent) {
                var oNewEntryContext = this.getView().getModel().createEntry(this.getBindingPath() + "/to_Project", {
                    properties: {
                        Name: 'Новый проект'
                    }
                });
                this.setProjectSelection();
                this.byId("projectTab").unbindObject();
                this.byId("projectTab").setBindingContext(oNewEntryContext);
                this.setStateProperty("/editProjectMode", true);
                this.byId("projectForm").focus();
            },


            onAddNewProjectStageButtonPress: function() {
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
            }


        });
    });