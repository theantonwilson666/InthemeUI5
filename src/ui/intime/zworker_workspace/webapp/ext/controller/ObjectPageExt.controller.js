sap.ui.controller("intime.zworker_workspace.ext.controller.ObjectPageExt", {
  _UserObjectPageId: 'intime.zworker_workspace::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_WORKER_LIST',

  onInit: function () {

    if (this.getView().getId() === this._UserObjectPageId){
      this.uiExtension();
    }

  },

  uiExtension : function(){
    debugger;
  }


});
