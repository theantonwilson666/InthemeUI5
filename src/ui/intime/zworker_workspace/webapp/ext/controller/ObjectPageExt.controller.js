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

  onInit: function () {

    if (this.getView().getId() === this._UserObjectPageId) {
      this.uiExtension();
    }

  },

  uiExtension: function () {
    debugger;
  },

  onCreateTimeSheetButtonPress: function (oEvent) {
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

  onCreateTimeSheetHeaderButtonPress: function (oEvent) {
    var oDialog = new TimeSheetDialog({
      title: `Списать время - ${oEvent.getSource().getBindingContext().getObject().Surname} ${oEvent.getSource().getBindingContext().getObject().Name}`,
      executorID: oEvent.getSource().getBindingContext().getObject().UserID,
      contentWidth: "50%"
    });
    oDialog.open();
  },


  onChangeDateRangeSelection: function (oEvent) {

    Format.numericFormatter(ChartFormatter.getInstance());
    var formatPattern = ChartFormatter.DefaultPattern;

    var oStartDate = oEvent.getParameter("from");
    var oEndDate = oEvent.getParameter("to");

    var oDataSet = new sap.viz.ui5.data.FlattenedDataset({
      data: {
        path: oEvent.getSource().getBindingContext().getPath() + "/to_SpendHours"
      },

      dimensions: [
        new sap.viz.ui5.data.DimensionDefinition({
          name: "DateSheet",
          value: "{DateSheet}"
        })
      ],
      measures: [
        new sap.viz.ui5.data.MeasureDefinition({
          name: "SpendHours",
          value: "{SpendHours}"
        })
      ]
    });

    this.byId("_TimeSheet-VizFrame").setVizProperties({
      title: {
        text: "Test",
      },
      plotArea: {
        dataLabel: {
          formatString: formatPattern.SHORTFLOAT_MFD2,
          visible: false,
        }
      },
      valueAxis: {
        title: {
          text: "X",
          visible: true,
        },
      },
      categoryAxis: {
        title: {
          text: "Y",
          visible: true,
        },
      },
    });

    this.byId("_TimeSheet-VizFrame").setDataset(oDataSet);

    // this.byId("_TimeSheet-VizFrame").bindAggregation("dataset", oEvent.getSource().getBindingContext().getPath() + "/to_SpendHours", oDataSet);


  }
});
