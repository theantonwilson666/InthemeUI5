sap.ui.define([

    "intheme/zjira_workers_grade/controller/WorkerGrades.controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator"

], function(Controller, History, MessageToast, BusyIndicator) {

    "use strict";

    return Controller.extend(

        ["intheme.zjira_workers_grade.controller.GradeDates",
            "sap.ui.demo.smartControls.SmartForm"
        ],

        {
            onInit: function() {
                this.getRouter()
                    .getRoute("GradeDatesRoute")
                    .attachPatternMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function(oEvent) {

                var oArr = oEvent.getParameter("arguments")["?query"];
                var oPage = this.getView().byId("GradeDates");
                oPage.bindElement(`/WorkerGradesSet('${oArr.Worker}')`);

                this.setStateProperty("/layout", "TwoColumnsBeginExpanded");

            },

            navToWorkerGrades: function() {
                this.getRouter().getRoute("WorkerGradesRoute").attachPatternMatched(this._onRouteMatched, this);
                this.navTo("WorkerGradesRoute")
                this.setStateProperty("/layout", "OneColumn");
            },

            saveGradeDates: function(oEvent) {

                var oTable = this.getView().byId("GradeDatesSmartTab").getTable()

                var mItems = oTable.getItems()

                mItems.forEach(
                    function(oItem) {
                        if (oItem.getBindingContext().bCreated) {
                            oTable.removeItem(oItem);
                        }
                    }.bind(this)
                );

                this.submitChanges({
                    success: function() {
                        MessageToast.show(this.i18n("SaveSuccess"));
                        BusyIndicator.hide();
                    }.bind(this),
                    error: function() {
                        MessageToast.show(this.i18n("SaveError"));
                        BusyIndicator.hide();
                    }.bind(this),
                });

            }
        }
    );
});