sap.ui.define(["jira/lib/BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("intheme.zworker_schedule.controller.Main", {
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

      this.navTo("DetailRoute", { query: oParams }, false);
    },

    _onRouteMatched: function (oEvent) {
      this.startButtonHide();
      this.checkIsAdmin();
      var oSmartTable = this.byId("workerSmartTable");
      this.setStateProperty("/layout", "OneColumn");

      if (oSmartTable) {
        oSmartTable.getTable().removeSelections();
      }
    },

    startButtonHide:function(){
      var WrenchButton = this.getView().byId("__xmlview0--WrenchButton")
      var excel_attachmentButton = this.getView().byId("__xmlview0--excel-attachmentButton")
      if(WrenchButton){
        WrenchButton.setVisible(false);
        excel_attachmentButton.setVisible(false);
      }
    },
    checkIsAdmin:function(){
        this.getModel().callFunction('/isAdmin',{
          method: "GET",
          success: function(oData){
            if(oData.isAdmin.Admin){
            this.showAdminButton();
            }
          }.bind(this)
        }) 
    },
      
    showAdminButton:function(){
      setTimeout(() => {
        this.getView().byId("__xmlview0--WrenchButton").setVisible(true);
         this.getView().byId("__xmlview0--excel-attachmentButton").setVisible(true);
      }, 0);


    },

    onPressDownloadExcel: function (oEvent) {
      this.loadDialog
      .call(this, {
        sDialogName: "_oDownloadScheduleDialog",
        sViewName:
          "intheme.zworker_schedule.view.dialogs.DownloadSchedule",
      })
      .then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    onValueHelpRequest: function(oEvent){
      delete this._oDirectDialog;
      debugger;

      var fnHandleConfirm = function (oEvent) {
        var oSelectedType = oEvent.getParameter('selectedItems')[0].getBindingContext().getObject();
        this.byId("scheduleTypeInput").setSelectedItem(new sap.ui.core.Item({
          key: oSelectedType.Type,
          text: oSelectedType.TypeDescr
        }));
      }

      var fnCancelSearch = function () {
				// this.getView().byId('registryView').setBusy(false);
			};

			var fnHandleSearch = function (oEvent) {
				var sQuery = oEvent.getParameter("value");
				this._oDirectDialog.bindAggregation("items", {
					path: '/ScheduleTypeSHSet',
					template: new sap.m.StandardListItem({
						title: '{TypeDescr}',
            description: '{Type}',
						type: "Active"
					})
				});
			};


      this._oDirectDialog = new sap.m.SelectDialog({
				title: '{i18n>ScheduleType}',
				confirm: fnHandleConfirm.bind(this),
				search: fnHandleSearch.bind(this),
				cancel: fnCancelSearch.bind(this),
			});

			this._oDirectDialog.bindAggregation("items", {
				path: '/ScheduleTypeSHSet',
				template: new sap.m.StandardListItem({
					title: '{TypeDescr}',
          description: '{Type}',
					type: "Active"
				})
			});

			this.getView().addDependent(this._oDirectDialog);
			this._oDirectDialog.open();
    },

    onCloseDialog: function(oEvent){
      oEvent.getSource().getParent().close();
    },

    onDownloadSchedule: function(oEvent){

      var oModel = this.getModel();
      var sServiceUrl = oModel.sServiceUrl;

      var oFilter = {
        type : this.byId("scheduleTypeInput").getSelectedKey(),
        date : {
          from : this.byId("SchedulePeriod").getFrom(),
          to : this.byId("SchedulePeriod").getTo()
        }
      };

      var sPath = oModel.createKey("/DownloadExcelSet", {
        EntitySet: "WorkerRegisterSet",
        Filter: JSON.stringify(oFilter)
      });
      var sUrl = sServiceUrl + sPath + "/$value";
      sap.m.URLHelper.redirect(sUrl, true);
      
      oEvent.getSource().getParent().close();
      
    },

    onPressConfig: function(oEvent){
      this.loadDialog
      .call(this, {
        sDialogName: "_oConfSettingDialog",
        sViewName:
          "intheme.zworker_schedule.view.fragments.Config",
      })
      .then(
        function (oDialog) {
          oDialog.open();
          this.getView().byId("PositionConfST").rebindTable();
          this.getView().byId("WorkerConfST").rebindTable();
        }.bind(this)
      );
    },

    onSaveConfigDialog: function(oEvent){
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

    onCancelConfigDialog: function(oEvent){
      oEvent.getSource().getParent().close();
      this.resetChanges();
    },

    onIconTabConfBarSelected: function(oEvent){
      this.setStateProperty(
        "/currentTab",
        oEvent.getSource().getSelectedKey()
      );
    },

    onEditToggled: function (oEvent) {
      var bEditable = oEvent.getParameter("editable");
      this.setStateProperty(
        "/ConfigSTMode",
        bEditable ? "SingleSelectLeft" : "None"
      );
    },

    rebindConfTab: function(oEvent){
      var oConf = this.getStateProperty("/smartTabConf");
      Object.keys(oConf).forEach(
        function (sKey) {
          this.getView().byId(oConf[sKey]).rebindTable();
        }.bind(this)
      );
    }

  });
});
