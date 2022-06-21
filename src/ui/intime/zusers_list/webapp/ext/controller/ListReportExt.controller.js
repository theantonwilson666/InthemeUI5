$.sap.require("sap/ui/core/Fragment");
var Fragment = sap.ui.require("sap/ui/core/Fragment");

sap.ui.controller("intime.zusers_list.ext.controller.ListReportExt", {

  onInit: function () {
    // this.uiExtensions();
  },

  onInitSmartFilterBarExtension: function (oEvent) {
  },

  loadDialog: function (oParams) {
    if (!this[oParams.sDialogName]) {
      return Fragment.load({
        id: this.getView().sId,
        type: "XML",
        name: oParams.sViewName,
        controller: (oParams.controller) ? oParams.controller : this
      }).then(function (oDialog) {
        this[oParams.sDialogName] = oDialog;
        if (oParams.sPath) { this[oParams.sDialogName].bindElement(oParams.sPath); }
        if (oParams.bAddDependent === undefined || oParams.bAddDependent === true) {
          this.getView().addDependent(this[oParams.sDialogName]);
        }
        if (!$.isArray(this[oParams.sDialogName])) { this[oParams.sDialogName].setBusyIndicatorDelay(0); }
        return this[oParams.sDialogName];
      }.bind(this));
    } else {
      return new Promise(function (res) {
        res(this[oParams.sDialogName]);
      }.bind(this));
    }
  },

  onSeeMorePress: function (oEvent) {
    debugger;
    this.oObject = oEvent.getSource();

    var oSelectedItemObject = oEvent.getSource().getParent().getBindingContext().getPath();

    if (this._SeeMorePopover) {
      this._SeeMorePopover.bindElement(oSelectedItemObject);
    }

    this.loadDialog
      .call(this, {
        sDialogName: "_SeeMorePopover",
        sViewName: "intime.zusers_list.view.fragment.SeeMorePopover",
        sPath: oSelectedItemObject
      })
      .then(
        function (oPopover) {
          oPopover.openBy(this.oObject);
        }.bind(this)
      );
  }

});

