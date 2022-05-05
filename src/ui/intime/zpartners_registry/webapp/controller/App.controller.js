sap.ui.define([
    "jira/lib/BaseController",
    'sap/ui/core/Fragment',
    'sap/m/MessageBox',
    'sap/m/Button'
],
    function (BaseController, Fragment, MessageBox, Button) {
        "use strict";

        return BaseController.extend("intime.zpartners_registry.controller.App", {
            onInit: function () { },

            OnEdit: function () {
                this.changeEditMode();
                this.changeColor();
            },

            changeColor: function () {

                var isChangeMode = this.isChangeMode(),
                    oPage = this.byId("page");

                if (isChangeMode === true) {
                    oPage.addStyleClass("backColor");
                } else {
                    oPage.removeStyleClass("backColor");
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

            onTilePress: function () {
                var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");

                var sLinkForwWindow = oCrossAppNav.hrefForExternal({
                    target: { semanticObject: "ztest_project", action: "display" }
                });

                window.open(sLinkForwWindow, true);
            },

            OpenDialog: function (oEvent) {
                this.setStateProperty('/editablePartner', oEvent.getSource().getBindingContext());

                var isChangeMode = this.isChangeMode();
                if (isChangeMode === true) {

                    this.loadDialog
                        .call(this, {
                            sDialogName: "EditParnterDialog",
                            sViewName: "intime.zpartners_registry.view.fragment.EditParnterDialog"
                        })
                        .then(
                            function (oDialog) {
                                oDialog.setBindingContext(this.getStateProperty("/editablePartner"));
                                oDialog.open();
                            }.bind(this)
                        );
                } else {
                    // var oRouter = this.getOwnerComponent().getRouter();
                    // oRouter.navTo("project");

                    var oParams = {
                        PartnerId: oEvent.getSource().getBindingContext().getObject().PartnerId
                    };

                    this.navTo("project", { query: oParams }, false);

                }
            },



            clearFileUploader: function () {
                this.byId("logoUploader").clear();
            },

            onOkPartnerDialog: function (oEvent) {
                oEvent.getSource().getParent().setBusy(true);

                var oFile = this.byId("logoUploader").getFocusDomRef().files[0];
                if (oFile) {
                    var oReader = new FileReader();
                    oReader.onload = function (e) {

                        var vContent = e.currentTarget.result.replace(
                            "data:" + oFile.type + ";base64,",
                            ""
                        );

                        debugger;

                        this.getModel().setProperty(this.getStateProperty('/editablePartner').getPath() + "/LogoTechValue", vContent);
                        this.getModel().setProperty(this.getStateProperty('/editablePartner').getPath() + "/FilePath", oFile.name);

                        this.savePartnerChanges(vContent);

                    }.bind(this);

                    oReader.readAsDataURL(oFile);
                } else {
                    this.savePartnerChanges();
                }

            },


            savePartnerChanges: function (sUpdateLogoBase64) {
                this.submitChanges({
                    success: function (oData) {
                        this.byId("partnerDialog").setBusy(false);

                        if (!this.isExistError()) {
                            this.clearFileUploader();
                        }
                    }.bind(this),

                    error: function (oError) {
                        this.byId("partnerDialog").setBusy(false);
                        this.showError(oError);
                        this.clearFileUploader();
                    }.bind(this)
                })
            },

            onDeletePartnerDrop: function (oEvent) {
                this.deletePartner(oEvent.getParameter('draggedControl').getBindingContext());
            },

            deletePartner: function (oContext) {
                this._deletedPartnerContext = oContext;

                MessageBox.confirm("Удалить контрагента - " + oContext.getObject().PartnerName, {
                    onClose: function (sAction) {
                        if (sAction === 'OK') {
                            this.getView().setBusy(true);
                            this.getModel().remove(this._deletedPartnerContext.getPath(), {
                                success: function (oData) {
                                    this.isExistError();
                                    this.getView().setBusy(false);
                                }.bind(this),
                                error: function (oError) {
                                    this.getView().setBusy(false);
                                    this.showError(oError);
                                }.bind(this)
                            });
                        }
                    }.bind(this)
                });
            },

            onCancelPartnerDialog: function (oEvent) {
                oEvent.getSource().getParent().close();
            },

            onCreatePartnerButtonPress: function () {
                this.loadDialog
                    .call(this, {
                        sDialogName: "EditParnterDialog",
                        sViewName: "intime.zpartners_registry.view.fragment.EditParnterDialog"
                    })
                    .then(
                        function (oDialog) {

                            var oPartnerContext = this.getModel().createEntry("/ZSNN_PARTNER_ROOT", {
                                groupId: "changes"
                            });

                            this.setStateProperty('/editablePartner', oPartnerContext);

                            oDialog.setBindingContext(oPartnerContext);
                            oDialog.open();
                        }.bind(this)
                    );

            }


        });
    });