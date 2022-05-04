sap.ui.define(["sap/ui/core/Fragment", "sap/ui/model/json/JSONModel"], function (Fragment, JSONModel) {
    return {
        loadDialog: function (oParams) {
            if (!this[oParams.sDialogName]) {
                return Fragment.load({
                    type: "XML",
                    name: oParams.sViewName,
                    controller: oParams.controller ? oParams.controller : this,
                }).then(
                    function (oDialog) {
                        this[oParams.sDialogName] = oDialog;
                        if (oParams.sPath) {
                            this[oParams.sDialogName].bindElement(oParams.sPath);
                        }
                        if (!$.isArray(this[oParams.sDialogName])) {
                            this[oParams.sDialogName].setBusyIndicatorDelay(0);
                        }
                        return this[oParams.sDialogName];
                    }.bind(this)
                );
            } else {
                return new Promise(
                    function (res) {
                        res(this[oParams.sDialogName]);
                    }.bind(this)
                );
            }
        },

        newJSONModel :function(oData){
            return new JSONModel(oData);
        }
    };
});