sap.ui.define(
  [
    "intheme/zworker_schedule/controller/Main.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
    "sap/ui/unified/CalendarLegendItem",
    "sap/ui/unified/DateTypeRange",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format",
  ],
  function (
    Controller,
    Filter,
    FilterOperator,
    Dialog,
    CalendarLegendItem,
    DateTypeRange,
    ChartFormatter,
    Format
  ) {
    "use strict";

    return Controller.extend("intheme.zworker_schedule.controller.Detail", {
      oVizFrame: null,

      onInit: function () {
        this.getRouter()
          .getRoute("DetailRoute")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        var oArr = oEvent.getParameter("arguments")["?query"];
        this.bindView({
          entitySet: "/WorkerRegisterSet",
          keyParameters: oArr,
        });

        this.setStateProperty("/layout", "TwoColumnsMidExpanded");
        this.setStateProperty(
          "/detailBindingPath",
          this.getModel().createKey("/WorkerRegisterSet", oArr)
        );

        this.setCurrentWorker(oArr.Worker);

        this.bindSmartForm(
          oArr.Worker,
          encodeURIComponent(this.convertDate(new Date()))
        );

        this.initCalendarLegend();
        this.updateCalendar()
        
      },

      onDateSelect: function (oEvent) {
        this.hideSecondWorkInterval();
        this.bindSmartForm(
          this.getWorker(),
          encodeURIComponent(
            this.convertDate(
              oEvent.getSource().getSelectedDates()[0].getStartDate()
            )
          )
        );
      },

      bindSmartForm: function (sWorkerId, sDate) {
        var sPath =
          "/WorkerScheduleSet(Date=datetime'" +
          sDate +
          "',Worker='" +
          sWorkerId +
          "')";
        var oSmartForm = this.getView().byId("dateSmartForm");
        oSmartForm.bindElement({
          path: sPath,
          events: {
            dataReceived: function (oData) {
              if (oData.getParameter("data").WorkFrom2.ms == 0) {
                this.hideSecondWorkInterval();
              } else {
                this.showSecondWorkInterval();
              }
            }.bind(this),
          },
        });
      },

      convertDate: function (oDate) {
        return oDate.toJSON().split(".")[0];
      },

      getWorker: function () {
        return this.getView().getBindingContext().getObject().Worker;
      },

      onTimeChange: function (oEvent, sPropName) {
        var oBindingWorker = this.getView()
          .byId("dateSmartForm")
          .getBindingContext()
          .getObject();

        oBindingWorker.StudyTo = new Date();
      },

      onSaveChanges: function (oEvent) {
        this.showBusyDialog();
        this.getModel().submitChanges({
          success: function () {
            this.closeBusyDialog();
            if (!this.isExistError()) {
              this.showMessageToast("zzz");
            }
            this.resetChanges();
          }.bind(this),
          error: function () {
            this.closeBusyDialog();
            this.showError();
            this.resetChanges();
          }.bind(this),
        });
      },

      initCalendarLegend: function () {
        this.getView()
          .getModel()
          .read("/CalendarLegendSet", {
            success: function (oData, response) {
              var oLegend = this.getView().byId("calendarLegend");
              oLegend.destroyItems();
              oLegend.setStandardItems(["Today", "Selected"]);
              oData.results
                .forEach((oElem) => {
                  oLegend.addItem(
                    new CalendarLegendItem({
                      text: oElem.Text,
                      type: oElem.Type,
                      color: oElem.Color,
                    })
                  );
                })
                .bind(this);
            }.bind(this),
          });
      },

      updateCalendar: function (oEvent) {
        this.getData4VizChart();
        var oCalendar = this.getView().byId("workerCalendar");
        this.getModel().callFunction("/GetWorkerCalendar", {
          method: "GET",
          urlParameters: {
            Worker: this.getCurrentWorker(),
            StartOfMonth: oCalendar.getStartDate(),
          },
          success: function (oData) {
            if (!this.isExistError()) {
              var oCalendar = this.getView().byId("workerCalendar");
              oCalendar.destroySpecialDates();
              oData.results.forEach((oElem) => {
                oCalendar.addSpecialDate(
                  new DateTypeRange({
                    startDate: oElem.Date,
                    type: oElem.Type,
                    // color: oElem.Color
                  })
                );
              });
            }
          }.bind(this),

          error: function (oError) {
            this.closeBusyDialog();
            this.showError(oError);
          }.bind(this),

          refreshAfterChange: false,
        });
      },

      setCurrentWorker: function (sWorker) {
        this.setStateProperty("/currentWorker", sWorker);
      },

      getCurrentWorker: function () {
        return this.getStateProperty("/currentWorker");
      },

      onAddWorkIntervalPress: function (oEvent) {
        this.showSecondWorkInterval();
      },

      showSecondWorkInterval: function () {
        this.setStateProperty("/showNewInterval", true);
      },

      hideSecondWorkInterval: function () {
        this.setStateProperty("/showNewInterval", false);
      },

      getData4VizChart: function () {
        var oCalendar = this.getView().byId("workerCalendar");
        var oFilter = [
          new Filter("Worker", FilterOperator.EQ, this.getCurrentWorker()),
          new Filter(
            "FirstDayOfMonth",
            FilterOperator.EQ,
            oCalendar.getStartDate()
          ),
        ];

        this.getModel().read("/WorkerMonthDataSet", {
          filters: oFilter,
          success: function (oData) {
            this.setChartData(oData.results);
          }.bind(this),
          error: function () {
            this.showError.bind(this);
          }.bind(this),
        });
      },

      setChartData: function (oData) {
        Format.numericFormatter(ChartFormatter.getInstance());
        var formatPattern = ChartFormatter.DefaultPattern;
        var oVizFrame = (this.oVizFrame = this.getView().byId("monthPlot"));
        oVizFrame.setVizProperties({
          title: {
            text: this.i18n("ChartTitle"),
          },
          plotArea: {
            dataLabel: {
              formatString: formatPattern.SHORTFLOAT_MFD2,
              visible: false,
            },
          },
          valueAxis: {
            title: {
              text: this.i18n("YAxisLabel"),
              visible: true,
            },
          },
          categoryAxis: {
            title: {
              text: this.i18n("XAxisLabel"),
              visible: true,
            },
          },
        });
        var oPopOver = this.getView().byId("vizPopover");
        oPopOver.connect(oVizFrame.getVizUid());
        oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
        var oJson = new sap.ui.model.json.JSONModel({ Chart: oData });
        oVizFrame.setModel(oJson, "ChartMdl");
      },


      onStartDateChange: function(oEvent){
        this.updateCalendar(oEvent);
      }
    });
  }
);
