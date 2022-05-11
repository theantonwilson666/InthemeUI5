sap.ui.define(["sap/ui/core/Fragment", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"], function (Fragment, JSONModel, MessageToast) {

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

        byId: function(sId){
            return sap.ui.getCore().byId(sId);
        },
        
        showMessage: function (sText) {
            MessageToast.show(sText);
        },

        newJSONModel: function (oData) {
            return new JSONModel(oData);
        },

        isExistError: function () {
            return this.baseController.isExistError();
            // var aMassages = sap.ui
            //     .getCore()
            //     .getMessageManager()
            //     .getMessageModel()
            //     .getProperty("/");
            // if (aMassages.length > 0) {
            //     MessageDialog.showCurrentState();
            //     return true;
            // }
            // return false;
        },

        showError: function (oError) {

            debugger;

            return this.baseController.showError(oError);
            // if (oError && JSON.parse(oError.statusCode) === 500) {
            //     MessageDialog.showError.call(this, oError);
            //     return;
            // }
            // MessageDialog.showCurrentState();
        },
    };
});