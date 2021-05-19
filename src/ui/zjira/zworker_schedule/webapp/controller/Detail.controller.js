sap.ui.define(
  [
    "intheme/zjira_project_register/controller/Main.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
  ],
  function (Controller, Filter, FilterOperator, Dialog) {
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

          this.bindSmartForm(
            oArr.Worker,
            encodeURIComponent(this.convertDate(new Date()))
          );
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
                this.showMessageToast('zzz');
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
      }
    );
  }
);
