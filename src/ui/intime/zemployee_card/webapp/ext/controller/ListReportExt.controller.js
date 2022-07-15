$.sap.require("sap/ui/core/Fragment");
var Fragment = sap.ui.require("sap/ui/core/Fragment");

$.sap.require("intime/zemployee_card/ext/formatter/formatter");
var Formatter = sap.ui.require("intime/zemployee_card/ext/formatter/formatter");

sap.ui.controller("intime.zemployee_card.ext.controller.ListReportExt", {
    formatter: Formatter,

    onInit: function() {
        
    },

    onSeeMorePress: function (oEvent) {
        debugger;
        this.oObject = oEvent.getSource();
    
        var oSelectedItemObject = oEvent.getSource().getParent().getBindingContext().getPath();
    
        if (this._PositionTimePopover) {
          this._PositionTimePopover.bindElement(oSelectedItemObject);
        }
    
        this.loadDialog
          .call(this, {
            sDialogName: "_PositionTimePopover",
            sViewName: "intime.zemployee_card.view.fragment.PositionTimePopover",
            sPath: oSelectedItemObject
          })
          .then(
            function (oPopover) {
              oPopover.openBy(this.oObject);
            }.bind(this)
          );
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

      onSpendHoursPress: function (oEvent) {
        this.oObject = oEvent.getSource();
    
        var oSelectedItemObject = oEvent.getSource().getParent().getBindingContext().getPath();
    
        if (this._PositionTimePopover) {
          this._PositionTimePopover.bindElement(oSelectedItemObject);
        }
    
        this.loadDialog
          .call(this, {
            sDialogName: "_SpendTimePopover",
            sViewName: "intime.zemployee_card.view.fragment.SpendTimePopover",
            sPath: oSelectedItemObject
          })
          .then(
            function (oPopover) {
              oPopover.bindElement(oSelectedItemObject);
              oPopover.openBy(this.oObject);
            }.bind(this)
          );
      },

      onBeforeRebindTable: function (oEvent) {
        var oBindingParams = oEvent.getParameter( "bindingParams" );
        if (!oBindingParams.sorter.length){
          oBindingParams.sorter.push(new sap.ui.model.Sorter("DateSheet", true))
        }
      }




});