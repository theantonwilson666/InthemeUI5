sap.ui.define([
    "jira/lib/BaseController",
    'sap/ui/core/Fragment'
],
    function (BaseController, Fragment) {
        "use strict";

        return BaseController.extend("intime.zpartners_registry.controller.App", {
            onInit: function () { },

            OnEdit: function () {
                this.changeEditMode();
                this.changeColor();
            },

            changeColor: function() { 

            var isChangeMode = this.isChangeMode();

                if ( isChangeMode === true ) { 
                     document.getElementById("application-zpartners_registry-display-component---App--page-cont").style.backgroundColor = "#DEDDD8";
                } else {
                     document.getElementById("application-zpartners_registry-display-component---App--page-cont").style.backgroundColor = "#fafafa";
                }
            },

            isChangeMode: function () {
                return this.getStateProperty("/editMode") ? true : false;
            },

            changeEditMode: function () {
                this.setStateProperty("/editMode", !this.getStateProperty("/editMode"));
            },

            OnDisplay: function () {
                this.changeEditMode();
                this.changeColor();
            },

            onTilePress: function() {
                var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");

                var sLinkForwWindow = oCrossAppNav.hrefForExternal({
                    target: { semanticObject: "ztest_project", action: "display" }
                });

                window.open(sLinkForwWindow, true);
            },

            OpenDialog: function (oEvent) {

                var isChangeMode = this.isChangeMode();

                if ( isChangeMode === true ) {

                    this.loadDialog
                    .call(this, {
                        sDialogName: "EditParnterDialog",
                        sViewName: "intime.zpartners_registry.view.fragment.EditParnterDialog"
                    })
                    .then(
                        function(oDialog) {
                            oDialog.open();
                        }.bind(this)
                    );
                } else {
                    var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("detail");
                }
            },

            onOkPartnerDialog: function () {

            },

            onCancelPartnerDialog: function (oEvent) {
                oEvent.getSource().getParent().close();
            },

            onCreatePartnerButtonPress: function () {
                this.loadDialog
                    .call(this, {
                        sDialogName: "Dialog",
                        sViewName: "intime.zpartners_registry.view.fragment.EditParnterDialog"
                    })
                    .then(
                        function (oDialog) {
                            
                            debugger;

                            var oPartnerContext = this.getModel().createEntry("/ZSNN_PARTNER_ROOT");
                            oDialog.setBindingContext(oPartnerContext);
                            oDialog.open();
                        }.bind(this)
                    );

            }


        });
    });
