sap.ui.define(
  [
    "intheme/zworker_schedule/controller/Main.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
    "sap/ui/unified/CalendarLegendItem",
    "sap/ui/unified/DateTypeRange",
  ],
  function (Controller, Filter, FilterOperator, Dialog, CalendarLegendItem,DateTypeRange) {
    "use strict";

    return Controller.extend(
      "intheme.zjira_project_register.controller.Detail",
      {
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
        },

        onDateSelect: function (oEvent) {
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
          oSmartForm.bindElement(sPath);
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
                  oCalendar.addSpecialDate(new DateTypeRange({
                    startDate: oElem.Date,
                    type: oElem.Type
                    // color: oElem.Color
                  }))
                }).bind(this);
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
      }
    );
  }
);
