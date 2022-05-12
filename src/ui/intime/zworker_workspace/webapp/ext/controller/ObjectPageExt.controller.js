$.sap.require("sap/viz/ui5/format/ChartFormatter");
var ChartFormatter = sap.ui.require(
    "sap/viz/ui5/format/ChartFormatter"
);

$.sap.require("sap/viz/ui5/api/env/Format");
var Format = sap.ui.require(
    "sap/viz/ui5/api/env/Format"
);



$.sap.require("jira/lib/intime_reuse/timeSheet/TimeSheetDialog");
var TimeSheetDialog = sap.ui.require(
    "jira/lib/intime_reuse/timeSheet/TimeSheetDialog"
);


sap.ui.controller("intime.zworker_workspace.ext.controller.ObjectPageExt", {
    _UserObjectPageId: 'intime.zworker_workspace::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_WORKER_LIST',

    onInit: function() {

        if (this.getView().getId() === this._UserObjectPageId) {
            this.uiExtension();
        }

    },

    uiExtension: function() {
        this.extensionAPI.attachPageDataLoaded(function() {
            this.initDateIntervalSelection();
            this.updateVizFrame();
        }.bind(this))
    },

    initDateIntervalSelection: function() {
        var oDay = this.getDayParam(new Date());
        this.byId("_TimeSheetIntervalSelection-DateRangeSelection").setDateValue(new Date(oDay.year, oDay.month, oDay.day - 7));
        this.byId("_TimeSheetIntervalSelection-DateRangeSelection").setSecondDateValue(new Date());
    },

    getDayParam: function(oDate) {
        return {
            year: oDate.getFullYear(),
            month: oDate.getMonth(),
            day: oDate.getDate()
        }
    },


    onCreateTimeSheetButtonPress: function(oEvent) {
        var oUser = oEvent.getSource().getBindingContext().getObject();
        var oItem = this.byId("to_AssignedSubTask::com.sap.vocabularies.UI.v1.LineItem::responsiveTable").getSelectedContexts()[0].getObject();

        var oDialog = new TimeSheetDialog({
            title: `Списать время - ${oUser.Surname} ${oUser.Name}`,
            executorID: oUser.UserID,
            subTaskID: oItem.SubTaskID,
            contentWidth: "50%"
        });

        oDialog.open();

    },

    onCreateTimeSheetHeaderButtonPress: function(oEvent) {
        var oDialog = new TimeSheetDialog({
            title: `Списать время - ${oEvent.getSource().getBindingContext().getObject().Surname} ${oEvent.getSource().getBindingContext().getObject().Name}`,
            executorID: oEvent.getSource().getBindingContext().getObject().UserID,
            contentWidth: "50%"
        });
        oDialog.open();
    },


    updateVizFrame: function() {
        Format.numericFormatter(ChartFormatter.getInstance());
        var formatPattern = ChartFormatter.DefaultPattern;

        this.byId("_TimeSheet-VizFrame").destroyDataset()
        this.byId("_TimeSheet-VizFrame").destroyFeeds()

        this.byId("_TimeSheet-VizFrame").setVizProperties({
            interaction: {
                selectability: {
                    mode: "SINGLE" //only one data point can be selected at a time
                }
            },

            title: {
                text: "Диаграмма списания",
            },
            plotArea: {
                dataLabel: {
                    formatString: formatPattern.SHORTFLOAT_MFD2,
                    visible: false,
                }
            },
            valueAxis: {
                title: {
                    text: "Списанные часы",
                    visible: true,
                },
            },
            categoryAxis: {
                title: {
                    text: "Дата",
                    visible: true,
                },
            },
        });

        var oDataSet = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [{
                name: "DateSheet",
                value: { path: "DateSheet", formatter: this.formatDate }
            }],
            measures: [{
                name: "SpendHours",
                value: "{SpendHours}"
            }],
            data: {
                path: this.getView().getBindingContext().getPath() + "/to_SpendHours"
            },
        });


        this.byId("_TimeSheet-VizFrame").setDataset(oDataSet);

        this.byId("_TimeSheet-VizFrame").getDataset().getBinding('data').filter([
            new sap.ui.model.Filter("DateSheet", 'BT', this.byId("_TimeSheetIntervalSelection-DateRangeSelection").getDateValue(), this.byId("_TimeSheetIntervalSelection-DateRangeSelection").getSecondDateValue())
        ]);

        var oFeedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            "uid": "valueAxis",
            "type": "Measure",
            "values": ["SpendHours"]
        });

        oFeedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            "uid": "categoryAxis",
            "type": "Dimension",
            "values": ["DateSheet"]
        });


        this.byId("_TimeSheet-VizFrame").addFeed(oFeedValueAxis);
        this.byId("_TimeSheet-VizFrame").addFeed(oFeedCategoryAxis);

        var oPopOver = this.getView().byId("_TimeSheet-Popover");
        oPopOver.connect(this.byId("_TimeSheet-VizFrame").getVizUid());
        // oPopOver.setActionItems([{
        //     type: 'action',
        //     text: 'Списать время',
        //     press: function(oEvent) {
        //         debugger;
        //     }
        // }]);

        oPopOver.setCustomDataControl(function(data) {
            if (!data.data.val) {
                var sSelectedDate = this.byId("_TimeSheet-VizFrame").vizSelection()[0].data.DateSheet;

                return new sap.m.Text({ text: 'test' });
            } else {
                return new sap.m.Text({ text: 'test_1' });
            }
        }.bind(this));

        debugger;

        // this.byId("_TimeSheet-VizFrame").setInteraction(new sap.viz.ui5.types.controller.Interaction({
        //     selectability: new sap.viz.ui5.types.controller.Interaction_selectability({
        //         mode: sap.viz.ui5.types.controller.Interaction_selectability_mode.none
        //     })
        // }));

        // this.byId("_TimeSheet-VizFrame").attachBrowserEvent("click", function() {
        //     debugger;
        //     if (!$(oEvent.srcElement).closest('.v-m-xAxis').length) return;
        // }.bind(this))

    },

    formatDate: function(oDate) {
        if (oDate) {
            return oDate.toLocaleDateString("ru-RU", { year: 'numeric', month: 'numeric', day: 'numeric' });
        };
    },

    onChangeDateRangeSelection: function(oEvent) {

        this.updateVizFrame();
        // var oStartDate = oEvent.getParameter("from");
        // var oEndDate = oEvent.getParameter("to");

        // debugger;


        // this.getView().getModel().updateBindings(true)
        // debugger;

        // this.byId("_TimeSheet-VizFrame").bindAggregation("dataset", oEvent.getSource().getBindingContext().getPath() + "/to_SpendHours", oDataSet);


    }
});