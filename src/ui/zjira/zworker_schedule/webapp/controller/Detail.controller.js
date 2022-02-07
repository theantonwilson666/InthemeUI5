sap.ui.define(
  [
    "intheme/zworker_schedule/controller/Main.controller",
    // "intheme/zjiralib/formatter/CommonFormatter", 
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
    "sap/ui/unified/CalendarLegendItem",
    "sap/ui/unified/DateTypeRange",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format",
    "../model/formatter/formatter"
  ],
  function (
    Controller,
    // Formatter,
    Filter,
    FilterOperator,
    Dialog,
    CalendarLegendItem,
    DateTypeRange,
    ChartFormatter,
    Format,
    formatter
  ) {
    "use strict";

    return Controller.extend("intheme.zworker_schedule.controller.Detail", {
      oVizFrame: null,
      formatter:formatter,
      onInit: function () {
        this.getRouter().getRoute("DetailRoute")
          .attachPatternMatched(this._onRouteMatched, this);
          var addWorkDayButton = this.byId('addWorkIntervalButton')
          if(addWorkDayButton){
            addWorkDayButton.setVisible(false)
          }
          if(this.byId("calendarLegend")){
             
          }
                  // sap.ui.getCore().byId('application-zworker_schedule-display-component---Detail--calendarLegend').getItems()[7].setColor('black')

         
          
      },

      /**
       * @override
       */
     

      setAutoResizeTable: function (oEvent) {
        var oSmartTable = this.getView().byId("dateSmartTable");
        var tableColumnsLength = oSmartTable.getTable().getColumns().length
        for (var i = 0; i < tableColumnsLength; i++) {
          oSmartTable.getTable().getColumns()[i].setWidth(`12rem`)
        }
      },
      checkIsAdmin: function () {
        //  
        this.getModel().callFunction("/isAdmin", {
          method: "GET",
          success: function (oData) {
            if (oData.isAdmin) {
              this.showAdminButton(oData.isAdmin)
            }
          }.bind(this),
        });
      },
      showAdminButton: function (oAdmin) {
        // 
        var oWorkFactCheckBox = this.getView().byId("WorkFactCheckBox")
        var oWorkFactFrom1 = this.getView().byId("WorkFactFrom1")
        var oWorkFactTo1 = this.getView().byId("WorkFactTo1")
        var oResetWorkerDay = this.getView().byId("resetWorkerDay")

        if (oAdmin.Admin === true) {
          oWorkFactCheckBox.setEditable(true)
          oWorkFactFrom1.setEditable(true)
          oWorkFactTo1.setEditable(true)
          oResetWorkerDay.setVisible(true)
        } else {
          oWorkFactCheckBox.setEditable(false)
          oWorkFactFrom1.setEditable(false)
          oWorkFactTo1.setEditable(false)
          oResetWorkerDay.setVisible(false)
        }
      },
      resetWorkerDay: function () {
        // 
        var currentDate = null;
        if (this.byId('workerCalendar').getSelectedDates()[0]) {
          currentDate = this.byId('workerCalendar').getSelectedDates()[0].getStartDate();
        } else {
          currentDate = new Date;
        }
        this.getModel().callFunction("/ResetWorkerDay", {
          method: "POST",
          urlParameters: {
            Date: currentDate.toLocaleDateString(),
            Worker: `${this.getCurrentWorker()}`
          },
          success: function (oData) {
            debugger
            console.log(oData);
          }.bind(this),
        });
      },
      resetTime: function (oData) {
     //    
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
        this.bindSmartTable(
          oArr.Worker,
          encodeURIComponent(this.convertDate(new Date()))
        );
        this.initCalendarLegend();
        this.checkIsAdmin();
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
        this.bindSmartTable(
          this.getWorker(),
          encodeURIComponent(
            this.convertDate(
              oEvent.getSource().getSelectedDates()[0].getStartDate()
            )
          )
        );
        this.checkIsAdmin();
      },
      underTen: function (time) {
        return time < 10 ? '0' + time : time
      },
      bindSmartTable: function (sWorkerId, sDate) {
       //  
        var sPath = "/WorkerScheduleSet(Date=datetime'" + sDate + "',Worker='" + sWorkerId + "')";
        var oSmartTable = this.getView().byId("dateSmartTable");
        oSmartTable.bindObject(sPath);
        this.setAutoResizeTable();
      },
      bindSmartForm: function (sWorkerId, sDate) {
        var sPath =
          "/WorkerScheduleSet(Date=datetime'" + sDate + "',Worker='" + sWorkerId + "')";
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
            this.updateCalendar()
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
              this.updateCalendar()
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
            }.bind(this),
          });
      },

      updateCalendar: function (oEvent) {
        var date = new Date().getDate()-1
        var month = new Date().getMonth()+1
        var year = new Date().getFullYear()
        var newTime = `${year}-${month}-${date}T21%3A00%3A00`
        this.bindSmartForm(this.getWorker(),newTime)

        debugger
        this.getData4VizChart();
        var oCalendar = this.getView().byId("workerCalendar");
        // 
        this.getModel().callFunction("/GetWorkerCalendar", {
          method: "GET",
          urlParameters: {
            Worker: this.getCurrentWorker(),
            StartOfMonth: oCalendar.getStartDate(),
          },
          success: function (oData) {

            debugger
            
            if (!this.isExistError()) {
              var oCalendar = this.getView().byId("workerCalendar");
              oCalendar.destroySpecialDates();
              oData.results.forEach((oElem) => {
                if(oElem.Type!='None'){
                oCalendar.addSpecialDate(
                  new DateTypeRange({
                    startDate: oElem.Date,
                    type: oElem.Type,
                    // color: oElem.Color
                  })
                );
                }
                else{
                  oCalendar.addSpecialDate(
                    new DateTypeRange({
                      startDate: oElem.Date,
                      type: "NonWorking",
                      // color: oElem.Color
                    })
                  );
                }
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
            "FirstDayOfMonth", FilterOperator.EQ, oCalendar.getStartDate()
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
            markerRenderer: function (oMarker) {
              if (oMarker.ctx.measureNames === 'Fact Hours') {
                var oData = this;
                var currentDay = oData.filter(day => {
                  if (oMarker.ctx.Date === day.Date)
                    return day
                })
                if (currentDay[0].Redacted === true)
                  oMarker.graphic.fill = "#945ecf"
              }
            }.bind(oData)
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
        var oJson = new sap.ui.model.json.JSONModel({
          Chart: oData
        });
        oVizFrame.setModel(oJson, "ChartMdl");
      },
      onStartDateChange: function (oEvent) {
        this.updateCalendar(oEvent);
      }
    });
  });