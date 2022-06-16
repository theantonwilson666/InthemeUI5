sap.ui.controller("intime.zworker_workspace.ext.controller.ListReportExt", {

  onInit: function () {
    // this.uiExtensions();
  },

  onInitSmartFilterBarExtension: function (oEvent) {
    this.getSmartTable().attachBeforeRebindTable(this.onBeforeRebindSmartTable.bind(this));
    this.getSmartTable().rebindTable();
  },


  getSmartTable: function(){
    return this.byId("intime.zworker_workspace::sap.suite.ui.generic.template.ListReport.view.ListReport::ZSNN_WORKER_LIST--listReport");
  },


  onBeforeRebindSmartTable: function(oEvent){
    oEvent.getParameter('bindingParams').events["dataReceived"] = this.onDataRecieved.bind(this);
  },

  onDataRecieved: function(oData){
    var oUser = oData.getParameter('data').results[0];
    this.getOwnerComponent().getRouter().navTo("ZSNN_WORKER_LIST", {
      keys1 : `'${oUser.UserID}'`
    }, true);
  }
});

