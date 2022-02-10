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
    "../model/formatter/formatter",
    'sap/ui/model/json/JSONModel'
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
    formatter,
    JSONModel
  ) {
    "use strict";

    return Controller.extend("intheme.zworker_schedule.controller.Detail", {
      oVizFrame: null,
      formatter: formatter,
      onInit: function () {
        this.getRouter().getRoute("DetailRoute")
          .attachPatternMatched(this._onRouteMatched, this);
        var addWorkDayButton = this.byId('addWorkIntervalButton')
        if (addWorkDayButton) {
          addWorkDayButton.setVisible(false)
        }
        if (this.byId("calendarLegend")) {

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
        var date = new Date().getDate() - 1
        var month = new Date().getMonth() + 1
        var year = new Date().getFullYear()
        var newTime = `${year}-${month}-${date}T21%3A00%3A00`
        this.bindSmartForm(this.getWorker(), newTime)

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


            if (!this.isExistError()) {
              var oCalendar = this.getView().byId("workerCalendar");
              oCalendar.destroySpecialDates();
              oData.results.forEach((oElem) => {
                if (oElem.Type != 'None') {
                  oCalendar.addSpecialDate(
                    new DateTypeRange({
                      startDate: oElem.Date,
                      type: oElem.Type,
                      // color: oElem.Color
                    })
                  );
                }
                else {
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

      getFirstMondayCurrentMonth: function () {
        var iYear = new Date().getFullYear();
        var iMonth = new Date().getMonth(); //- 1;
        var firstMondayDate = (iYear, iMonth) => {
          var firstDate = new Date(`${iYear}`, `${iMonth}`, '1', '0', '0')
          while (firstDate.getDay() != 1) {
            firstDate = new Date(`${iYear}`, `${iMonth}`, `${firstDate.getDate() + 1}`, '0', '0')
          }
          return firstDate.getDate()
        }
        return new Date(`${iYear}`, `${iMonth}`, `${firstMondayDate(iYear, iMonth)}`, "0", "0")
      },

      handleAppointmentSelect: function (oEvent) {
        var oModel = this.getConfigModel();
        var oConfigData = oModel.getData();

        var oClickedAppointment = oEvent.mParameters.appointment.getBindingContext("configData").getObject();

        oConfigData.people[0].Schedule.forEach(function (oAppointment, sIndex, aAppointments) {
          if (oAppointment === this) {
            debugger;
            aAppointments.splice(sIndex, 1);
          };
        }, oClickedAppointment);

        oModel.updateBindings(true);

      },

      parseTimePicker: function (sTimePickerValue) {
        var aBuff = sTimePickerValue.split(":");
        return {
          hours: aBuff[0],
          minutes: aBuff[1]
        }
      },

      handleIntervalSelect: function (oEvent) {
        var oModel = this.getConfigModel();
        var oConfigData = oModel.getData();

        var oStartDate = new Date(
          oEvent.mParameters.startDate.getFullYear(),
          oEvent.mParameters.startDate.getMonth(),
          oEvent.mParameters.startDate.getDate(),
          this.parseTimePicker(this.byId("DateTimeFromSchedule").getValue()).hours,
          this.parseTimePicker(this.byId("DateTimeFromSchedule").getValue()).minutes,
        );

        var oEndDate = new Date(
          oEvent.mParameters.startDate.getFullYear(),
          oEvent.mParameters.startDate.getMonth(),
          oEvent.mParameters.startDate.getDate(),
          this.parseTimePicker(this.byId("DateTimeToSchedule").getValue()).hours,
          this.parseTimePicker(this.byId("DateTimeToSchedule").getValue()).minutes,
        );

        oConfigData.people[0].Schedule.push({
          IntervalType: this.byId("selectTypeDaySchedule").getSelectedItem().getBindingContext().getObject().Type,
          IntervalInternalType: this.byId("selectTypeDaySchedule").getSelectedItem().getBindingContext().getObject().InternalType,
          EndDate: oEndDate,
          StartDate: oStartDate,
          weekType: this.byId("configCalendar").getViewKey(),
          EndDateOut: oEvent.mParameters.endDate,
          StartDateOut: oEvent.mParameters.startDate,
          Title: this.byId("selectTypeDaySchedule").getSelectedItem().getBindingContext().getObject().Text,
          Info: this.byId("DateTimeFromSchedule").getValue() + " - " + this.byId("DateTimeToSchedule").getValue(),
          Color: this.byId("selectTypeDaySchedule").getSelectedItem().getBindingContext().getObject().Color
        });

        oConfigData.people[0].headers.push({
          IntervalType: this.byId("selectTypeDaySchedule").getSelectedItem().getBindingContext().getObject().Type,
          IntervalInternalType: this.byId("selectTypeDaySchedule").getSelectedItem().getBindingContext().getObject().InternalType,
          EndDate: oEndDate,
          StartDate: oStartDate,
          weekType: this.byId("configCalendar").getViewKey(),
          EndDateOut: oEvent.mParameters.endDate,
          StartDateOut: oEvent.mParameters.startDate,
          Title: this.byId("selectTypeDaySchedule").getSelectedItem().getBindingContext().getObject().Text,
          Info: this.byId("DateTimeFromSchedule").getValue() + " - " + this.byId("DateTimeToSchedule").getValue(),
          Color: this.byId("selectTypeDaySchedule").getSelectedItem().getBindingContext().getObject().Color
        });


        oModel.updateBindings(true);
      },

      getConfigCalendar: function () {
        return this.getView().byId("configCalendar");
      },

      getConfigModel: function () {
        return this.getConfigCalendar().getModel("configData");
      },

      getFirstDayOfMonth: function () {
        var iYear = new Date().getFullYear();
        var iMonth = new Date().getMonth();
        return new Date(`${iYear}`, `${iMonth}`, `1`, "0", "0")
      },

      onPressConfigUI: function (oEvent) {
        this.loadDialog
          .call(this, {
            sDialogName: "_ScheduleInputDialog",
            sViewName:
              "intheme.zworker_schedule.view.fragments.ScheduleInput",
          })
          .then(
            function (oDialog) {

              var oConfigData = {
                startDate: this.getFirstMondayCurrentMonth(),
                people: [
                  {
                    WorkerID: oDialog.getBindingContext().getObject().Worker,
                    WorkerText: oDialog.getBindingContext().getObject().WorkerName,
                    Schedule: [
                    ],

                    headers: [

                    ]
                  }
                ]
              };

              var oConfigModel = new JSONModel(oConfigData);
              this.getView().byId("configCalendar").setModel(oConfigModel, "configData");
              oConfigModel.updateBindings(true);

              this.getView().byId("configCalendar").setStartDate(oConfigData.startDate);

              var oResultData = {
                StartDate: this.getFirstDayOfMonth(),
                Appointments: [

                ]

              };

              var oResultModel = new JSONModel(oResultData);
              this.byId("resultCalendar").setModel(oResultModel, "resultData");

              oDialog.open();
            }.bind(this)
          );

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


      addDaysToDateTime: function (oDate, iDays) {
        var sYear = oDate.getFullYear();
        var sMonth = oDate.getMonth();
        var sDate = oDate.getDate();
        return new Date(sYear + "", sMonth + "", sDate + iDays + "", "0", "0");

      },

      handleConfigViewChange: function (oEvent) {

        var oOddStartDate = oEvent.getSource().getModel("configData").getData().startDate;

        switch (oEvent.getSource().getViewKey()) {
          case "even":
            var oDate = this.addDaysToDateTime(oOddStartDate, 7);
            oEvent.getSource().setStartDate(oDate);
            break;

          case "odd":
            oEvent.getSource().setStartDate(oOddStartDate);
            break;
        }
      },


      onCalcScheduleButtonPress: function () {
        this.byId("inputScheduleDefaultDialog").close();
        this.byId("inputScheduleDialog").setBusy(true);

        var oConfigData = this.byId("configCalendar").getModel("configData").getData();
        var aSchedules = oConfigData.people[0].Schedule;

        var oFIInputData = {
          WORKER: oConfigData.people[0].WorkerID,
          MONTH: (oConfigData.startDate.getMonth() + 1).toString().padStart(2, "0"),
          YEAR: oConfigData.startDate.getFullYear().toString(),
          EVEN_WEEK: this.buildWeek("even"),
          ODD_WEEK: this.buildWeek("odd"),
          DAY_DEFAULT: {
            TYPE: this.byId("selectTypeDayScheduleDefault").getSelectedItem().getBindingContext().getObject().InternalType,
            TIMEFROM: `${this.parseTimePicker(this.byId("DateTimeFromScheduleDefault").getValue()).hours}${this.parseTimePicker(this.byId("DateTimeFromSchedule").getValue()).minutes}`,
            TIMETO: `${this.parseTimePicker(this.byId("DateTimeToScheduleDefault").getValue()).hours}${this.parseTimePicker(this.byId("DateTimeToSchedule").getValue()).minutes}`
          }
        }

        var sFIInputData = JSON.stringify(oFIInputData);

        this.getModel().callFunction("/RecalcScheduleTable", {
          method: "POST",
          urlParameters: {
            inputDataJSON: sFIInputData
          },
          success: function (oData) {
            var oRecalcData = JSON.parse(oData.RecalcScheduleTable.dataJSON);
            this.updateResultCalendar(oRecalcData);

            this.byId("inputScheduleDialog").setBusy(false);
            this.showMessageToast("Успех");
          }.bind(this),

          error: function (oError) {
            this.byId("inputScheduleDialog").setBusy(false);
            this.showError(oError);
          }.bind(this)
        });

      },

      updateResultCalendar: function (oResultData) {
        var oModel = this.byId("resultCalendar").getModel("resultData");
        var oData = oModel.getData();

        oData.Appointments = [];

        for (var i = 0; i < oResultData.SCHEDULE.length; i++) {
          var oSchedule = oResultData.SCHEDULE[i];

          for (var j = 0; j < oSchedule.INTERVALS.length; j++) {
            var oInterval = oSchedule.INTERVALS[j];
            oData.Appointments.push({
              Title: oInterval.INTERVAL_TYPE_TEXT,
              Text: this.convertTimeToPretty(oInterval.TIME_BEGIN) + " - " + this.convertTimeToPretty(oInterval.TIME_END),
              Type: oInterval.INTERVAL_TYPE,
              Color: oInterval.INTERVAL_COLOR,
              StartDate: this.convertSAPDateTimeToJS(oSchedule.DATE, oInterval.TIME_BEGIN),
              EndDate: this.convertSAPDateTimeToJS(oSchedule.DATE, oInterval.TIME_END),
              StartDateOut: this.convertSAPDateTimeToJS(oSchedule.DATE, oInterval.TIME_BEGIN),
              EndDateOut: this.convertSAPDateTimeToJS(oSchedule.DATE, oInterval.TIME_END),
              Icon: ""
            })

          }
        }


        oModel.updateBindings(true);
      },

      convertSAPDateTimeToJS: function (sDate, sTime) {
        var sYear = sDate.substr(0, 4);
        var sMonth = sDate.substr(4, 2) - 1;
        var sDay = sDate.substr(6, 2);
        var sHour = sTime.substr(0, 2);
        var sMinutes = sTime.substr(2, 2);

        return new Date(sYear, sMonth, sDay, sHour, sMinutes);

      },

      convertTimeToPretty: function (sTime) {
        return sTime.substr(0, 2) + ":" + sTime.substr(2, 2);
      },

      getWeek: function () {
        var aOut = [];
        for (var i = 0; i < 7; i++) {
          aOut.push({
            DAY: i + 1,
            INTERVALS: []
          })
        }
        return aOut;
      },

      buildWeek: function (sWeekType) {
        var oModel = this.getConfigModel();
        var oConfigData = oModel.getData();

        var aOut = this.getWeek();

        oConfigData.people[0].Schedule.forEach(function (oSchedule, index, array) {
          if (oSchedule.weekType === this.weekType) {
            this.out[this.controller.convertDay(oSchedule.StartDate.getDay())].INTERVALS.push({
              START: this.controller.convertTimeFromDateTime(oSchedule.StartDate),
              END: this.controller.convertTimeFromDateTime(oSchedule.EndDate),
              TENTATIVE: false,
              TITLE: oSchedule.Title,
              TYPE: oSchedule.IntervalInternalType
            });
          }
        }, {
          out: aOut,
          weekType: sWeekType,
          controller: this
        });


        return aOut;

      },

      convertDay: function (iDay) {
        if (iDay === 0) {
          return 6
        }

        return iDay - 1;
      },


      getIntervalFromSchedule: function (oSchedule) {

        return {
          INTERVAL_TYPE: oSchedule.IntervalType,
          TIME_BEGIN: this.convertTimeFromDateTime(oSchedule.StartDate),
          TIME_END: this.convertTimeFromDateTime(oSchedule.EndDate)
        }

      },

      convertTimeFromDateTime: function (oDate) {
        var sHours = oDate.getHours().toString().padStart(2, "0");
        var sMinutes = oDate.getMinutes().toString().padStart(2, "0");
        return `${sHours}${sMinutes}`;
      },

      convernDateTimeToChar: function (oDate) {
        var sYear = oDate.getFullYear();
        var sMonth = oDate.getMonth().toString().padStart(2, "0");
        var sDay = oDate.getDate().toString().padStart(2, "0");

        return `${sYear}${sMonth}${sDay}`
      },


      onDisplayDefaultInputPress: function () {
        this.loadDialog
          .call(this, {
            sDialogName: "_ScheduleDefaultInputDialog",
            sViewName:
              "intheme.zworker_schedule.view.fragments.dayDefaultInput",
          })
          .then(
            function (oDialog) {
              oDialog.open();
            }.bind(this)
          );

      },

      // oData.Appointments.push({
      //   Title: oInterval.INTERVAL_TYPE_TEXT,
      //   Text: this.convertTimeToPretty(oInterval.TIME_BEGIN) + " - " + this.convertTimeToPretty(oInterval.TIME_END),
      //   Type: oInterval.INTERVAL_TYPE,
      //   Color: oInterval.INTERVAL_COLOR,
      //   StartDate: this.convertSAPDateTimeToJS(oSchedule.DATE, oInterval.TIME_BEGIN),
      //   EndDate: this.convertSAPDateTimeToJS(oSchedule.DATE, oInterval.TIME_END),
      //   StartDateOut: this.convertSAPDateTimeToJS(oSchedule.DATE, oInterval.TIME_BEGIN),
      //   EndDateOut: this.convertSAPDateTimeToJS(oSchedule.DATE, oInterval.TIME_END),
      //   Icon: ""
      // })

      buildMonth: function (sDate) {
        var aMonth = [];

        var oDateIndex = {};

        var oDate = sDate;
        var sCurrentMonth = sDate.getMonth();
        var sMonth = oDate.getMonth();

        while (sCurrentMonth === sMonth) {
          var sYear = oDate.getFullYear();
          var sMonth = oDate.getMonth();
          var sDay = oDate.getDate() + 1;

          if (sCurrentMonth === sMonth) {

            aMonth.push({
              DATE: this.convernDateTimeToChar(oDate),
              INTERVALS: [
              ]
            })

            oDateIndex[this.convernDateTimeToChar(oDate)] = aMonth.length - 1;
            oDate = new Date(sYear, sMonth, sDay);
          }
        };

        return {
          monthArr: aMonth,
          monthIndex: oDateIndex
        };
      },

      buildSchedulesOut: function (aAppointments, sDate) {
        var aOut = [];

        var oConfigMonth = this.buildMonth(sDate);

        aOut = oConfigMonth.monthArr;

        var oDateIndex = oConfigMonth.monthIndex;

        for (var i = 0; i < aAppointments.length; i++) {
          var oAppointment = aAppointments[i];
          var oSchedule = aOut[oDateIndex[this.convernDateTimeToChar(oAppointment.StartDate)]];

          oSchedule.INTERVALS.push({
            INTERVAL_TYPE: oAppointment.Type,
            TIME_BEGIN: this.convertTimeFromDateTime(oAppointment.StartDate),
            TIME_END: this.convertTimeFromDateTime(oAppointment.EndDate)
          });

        }

        return aOut;
      },


      onUploadScheduleButtonPress: function () {

        this.byId("inputScheduleDialog").setBusy(true);

        var oModel = this.byId("resultCalendar").getModel("resultData");
        var oScheduleData = oModel.getData();

        var oConfigData = this.byId("configCalendar").getModel("configData").getData();

        var oScheduleOutData = {
          WORKER: oConfigData.people[0].WorkerID,
          MONTH: (oConfigData.startDate.getMonth() + 1).toString().padStart(2, "0"),
          YEAR: oConfigData.startDate.getFullYear().toString(),
          SCHEDULE: this.buildSchedulesOut(oScheduleData.Appointments, oScheduleData.StartDate)
        };

        var sScheduleData = JSON.stringify(oScheduleOutData);

        this.getModel().callFunction("/SaveScheduleTable", {
          method: "POST",
          urlParameters: {
            inputDataJSON: sScheduleData,
          },
          success: function (oData) {
            this.byId("inputScheduleDialog").setBusy(false);
            this.byId("inputScheduleDialog").close();
            this.showMessageToast("Успех!!!!");
          }.bind(this),

          error: function (oError) {
            this.byId("inputScheduleDialog").setBusy(false);
            this.showMessageToast("Косяк");
          }.bind(this)
        });


      },


      onAppointmentDrop: function (oEvent) {
        var oModel = this.byId("resultCalendar").getModel("resultData");
        var oScheduleData = oModel.getData();

        var oAppointmentFrom = oEvent.mParameters.appointment.getBindingContext("resultData").getObject();

        for (var i = 0; i < oScheduleData.Appointments.length; i++) {
          var oAppointment = oScheduleData.Appointments[i];

          if (oAppointment === oAppointmentFrom) {

            var iYear = oEvent.mParameters.startDate.getFullYear();
            var iMonth = oEvent.mParameters.startDate.getMonth();
            var iDay = oEvent.mParameters.startDate.getDate();

            oAppointment.StartDate = new Date(iYear, iMonth, iDay, oAppointment.StartDate.getHours(), oAppointment.StartDate.getMinutes());
            oAppointment.StartDateOut = new Date(iYear, iMonth, iDay, oAppointment.StartDate.getHours(), oAppointment.StartDate.getMinutes());

            oAppointment.EndDate = new Date(iYear, iMonth, iDay, oAppointment.EndDate.getHours(), oAppointment.EndDate.getMinutes());
            oAppointment.EndDateOut = new Date(iYear, iMonth, iDay, oAppointment.EndDate.getHours(), oAppointment.EndDate.getMinutes());

          }

        }

        oModel.updateBindings(true);
      },

      onAppoitmentSelect: function(oEvent){
          
        var oModel = this.byId("resultCalendar").getModel("resultData");
        var oResultData = oModel.getData();

        var oClickedAppointment = oEvent.mParameters.appointment.getBindingContext("resultData").getObject();

        oResultData.Appointments.forEach(function (oAppointment, sIndex, aAppointments) {
          if (oAppointment === this) {
            debugger;
            aAppointments.splice(sIndex, 1);
          };
        }, oClickedAppointment);

        oModel.updateBindings(true);
      },

      onAppointmentCreate: function (oEvent) {

        var oModel = this.byId("resultCalendar").getModel("resultData");
        var oResultData = oModel.getData();

        var oStartDate = new Date(
          oEvent.mParameters.startDate.getFullYear(),
          oEvent.mParameters.startDate.getMonth(),
          oEvent.mParameters.startDate.getDate(),
          this.parseTimePicker(this.byId("DateTimeFromSchedule").getValue()).hours,
          this.parseTimePicker(this.byId("DateTimeFromSchedule").getValue()).minutes,
        );

        var oEndDate = new Date(
          oEvent.mParameters.startDate.getFullYear(),
          oEvent.mParameters.startDate.getMonth(),
          oEvent.mParameters.startDate.getDate(),
          this.parseTimePicker(this.byId("DateTimeToSchedule").getValue()).hours,
          this.parseTimePicker(this.byId("DateTimeToSchedule").getValue()).minutes,
        );

        oResultData.Appointments.push({
          Title: `${this.byId("selectTypeDaySchedule").getSelectedItem().getBindingContext().getObject().Text}`,
          Text : this.byId("DateTimeFromSchedule").getValue() + " - " + this.byId("DateTimeToSchedule").getValue(),
          Type: this.byId("selectTypeDaySchedule").getSelectedItem().getBindingContext().getObject().Type,
          Color: this.byId("selectTypeDaySchedule").getSelectedItem().getBindingContext().getObject().Color,
          StartDate: oStartDate,
          EndDate: oEndDate,
          StartDateOut: oStartDate,
          EndDateOut: oEndDate
        })

        oModel.updateBindings(true);

      },

      onCancelUploadSchedulePress: function (oEvent) {
        oEvent.getSource().getParent().close();
      },

      onCancelInputDefaultPress: function (oEvent) {
        oEvent.getSource().getParent().close();
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