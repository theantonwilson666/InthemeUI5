sap.ui.define(["jira/lib/BaseController",
	"sap/m/MessageToast",    "../model/formatter/formatter"
], function (BaseController,
	MessageToast,    formatter
  ) {
  "use strict";
  return BaseController.extend("intheme.zworker_schedule.controller.Main", {
    formatter:formatter,
    onInit: function () {

      this.getRouter()
        .getRoute("WorklistRoute")
        .attachPatternMatched(this._onRouteMatched, this);
        


    },
    onViewDetail: function (oEvent) {
      var oBindingObject = oEvent
        .getParameter("listItem")
        .getBindingContext()
        .getObject();

      var oParams = {
        Worker: oBindingObject.Worker,
      };

      this.navTo("DetailRoute", {
        query: oParams
      }, false);
    },

    _onRouteMatched: function (oEvent) {
      var oSmartTable = this.byId("workerSmartTable");
      this.setStateProperty("/layout", "OneColumn");

      if (oSmartTable) {
        oSmartTable.getTable().removeSelections();
      }

      this.checkIsAdmin();
    },

    onPressDownloadExcel: function (oEvent) {
      this.loadDialog
        .call(this, {
          sDialogName: "_oDownloadScheduleDialog",
          sViewName: "intheme.zworker_schedule.view.dialogs.DownloadSchedule",
        })
        .then(
          function (oDialog) {
            oDialog.open();
          }.bind(this)
        );
    },

    onValueHelpRequest: function (oEvent) {
      delete this._oDirectDialog;
       ;

      var fnHandleConfirm = function (oEvent) {
        var oSelectedType = oEvent
          .getParameter("selectedItems")[0]
          .getBindingContext()
          .getObject();
        this.byId("scheduleTypeInput").setSelectedItem(
          new sap.ui.core.Item({
            key: oSelectedType.Type,
            text: oSelectedType.TypeDescr,
          })
        );
      };

      var fnCancelSearch = function () {
        // this.getView().byId('registryView').setBusy(false);
      };

      var fnHandleSearch = function (oEvent) {
        var sQuery = oEvent.getParameter("value");
        this._oDirectDialog.bindAggregation("items", {
          path: "/ScheduleTypeSHSet",
          template: new sap.m.StandardListItem({
            title: "{TypeDescr}",
            description: "{Type}",
            type: "Active",
          }),
        });
      };

      this._oDirectDialog = new sap.m.SelectDialog({
        title: "{i18n>ScheduleType}",
        confirm: fnHandleConfirm.bind(this),
        search: fnHandleSearch.bind(this),
        cancel: fnCancelSearch.bind(this),
      });

      this._oDirectDialog.bindAggregation("items", {
        path: "/ScheduleTypeSHSet",
        template: new sap.m.StandardListItem({
          title: "{TypeDescr}",
          description: "{Type}",
          type: "Active",
        }),
      });

      this.getView().addDependent(this._oDirectDialog);
      this._oDirectDialog.open();
    },

    onCloseDialog: function (oEvent) {
      oEvent.getSource().getParent().close();
    },

    changeDateRange:function(oEvent){
      try {
        if(oEvent.getSource().getTo().getMonth()!=oEvent.getSource().getFrom().getMonth()){
          throw new Error("Данные некорректны")
        }
      } catch (error) {
        new sap.m.MessageToast.show('Выберете даты в одном месяце')
        oEvent.getSource().setTo(new Date())
        oEvent.getSource().setFrom(new Date())
        console.log(error);
      }
    },
    onDownloadSchedule: function (oEvent) {
      var oModel = this.getModel();
      var sServiceUrl = oModel.sServiceUrl;

      var oFilter = {
        type: this.byId("scheduleTypeInput").getSelectedKey(),
        date: {
          from: this.byId("SchedulePeriod").getFrom(),
          to: this.byId("SchedulePeriod").getTo(),
        },
      };

      var sPath = oModel.createKey("/DownloadExcelSet", {
        EntitySet: "WorkerRegisterSet",
        Filter: JSON.stringify(oFilter),
      });
      var sUrl = sServiceUrl + sPath + "/$value";    
      sap.m.URLHelper.redirect(sUrl, true);
      oEvent.getSource().getParent().close();
    },

    checkIsAdmin: function () {
      this.getModel().callFunction("/isAdmin", {
        method: "GET",
        success: function (oData) {
          if (oData.isAdmin.Admin) {
            this.showAdminButton();
          }
        }.bind(this),
      });
    },

    showAdminButton: function () {
      var oScheduleButton = this.getView().byId("configScheduleButton");
      var oExcelButton = this.getView().byId("excelScheduleButton");
      var adminColumn1 = this.getView().byId("adminColumn1");
      var adminColumn2 = this.getView().byId("adminColumn2");

      if (oScheduleButton) {
        oScheduleButton.setVisible(true);
      }

      if (oExcelButton) {
        oExcelButton.setVisible(true);
      }

      if (adminColumn1) {
        adminColumn1.setVisible(true);
      }

      if (adminColumn2) {
        adminColumn2.setVisible(true);
      }

    },

    startButtonHide: function () {
      var WrenchButton = this.getView().byId("__xmlview0--WrenchButton");
      var excel_attachmentButton = this.getView().byId(
        "__xmlview0--excel-attachmentButton"
      );
      if (WrenchButton) {
        WrenchButton.setVisible(true);
        excel_attachmentButton.setVisible(true);
      }
    },

    onPressConfig: function (oEvent) {
      this.loadDialog
        .call(this, {
          sDialogName: "_oConfSettingDialog",
          sViewName: "intheme.zworker_schedule.view.fragments.Config",
        })
        .then(
          function (oDialog) {
            oDialog.open();
            this.getView().byId("PositionConfST").rebindTable();
            this.getView().byId("WorkerConfST").rebindTable();
          }.bind(this)
        );
    },

    onSaveConfigDialog: function (oEvent) {
      var oConf = this.getStateProperty("/smartTabConf");

      Object.keys(oConf).forEach(
        function (sKey) {
          var oTable = this.getView().byId(oConf[sKey]).getTable();
          var mItems = oTable.getItems();
          mItems.forEach(
            function (oItem) {
              if (oItem.getBindingContext().bCreated) {
                oTable.removeItem(oItem);
              }
            }.bind(this)
          );
        }.bind(this)
      );

      this.submitChanges({
        success: function () {
          this.isExistError();
          this.rebindConfTab();
        }.bind(this),
        error: this.showError.bind(this),
      });
    },

    onCancelConfigDialog: function (oEvent) {
      oEvent.getSource().getParent().close();
      this.resetChanges();
    },

    onIconTabConfBarSelected: function (oEvent) {
      this.setStateProperty("/currentTab", oEvent.getSource().getSelectedKey());
    },

    onEditToggled: function (oEvent) {
      var bEditable = oEvent.getParameter("editable");
      this.setStateProperty(
        "/ConfigSTMode",
        bEditable ? "SingleSelectLeft" : "None"
      );
    },

    rebindConfTab: function (oEvent) {
      var oConf = this.getStateProperty("/smartTabConf");
      Object.keys(oConf).forEach(
        function (sKey) {
          this.getView().byId(oConf[sKey]).rebindTable();
        }.bind(this)
      );
    },
  });
});