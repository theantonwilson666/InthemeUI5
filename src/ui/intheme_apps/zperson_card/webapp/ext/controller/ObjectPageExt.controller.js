
$.sap.require("jira/lib/fiorielementslib/fioriBaseController");
var fioriBaseController = sap.ui.require(
    "jira/lib/fiorielementslib/fioriBaseController"
);

$.sap.require("sap/ui/core/BusyIndicator");
var BusyIndicator = sap.ui.require("sap/ui/core/BusyIndicator");
$.sap.require("sap/m/MessageToast");
var MessageToast = sap.ui.require("sap/m/MessageToast");

sap.ui.controller("zperson_card.ext.controller.ObjectPageExt", {
    onInit: function() {
        if (
            this.getView().sId ==
            "zperson_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_PERSON_ROOT"
        ) {
            this.uiExtensions();
        } else {
            debugger;
        }
    },

    uiExtensions: function() {
        this.uiExtensionAddUploader();
    },


    onUploadFile: function(oEvent) {
        debugger;
        this.getFileContent(oEvent);
    },

    getFileContent: function(oEvent) {
        return new Promise(
            function(res, rej) {
                var oFile = oEvent.getSource().getFocusDomRef().files[0];
                this.byId('objectPageHeader').getActions()[0].destroy();
                this.uiExtensionAddUploader()
                if (oFile) {
                    var oReader = new FileReader();
                    oReader.onload = function(e) {
                        BusyIndicator.show(0);
                        var vContent = e.currentTarget.result.replace(
                            "data:" + oFile.type + ";base64,",
                            ""
                        );
                        var DbKey = this.getView().getBindingContext().getObject()["DbKeyString"];
                        this.getOwnerComponent()
                            .getModel()
                            .create(
                                "/PersonImageSet", {
                                    PersonKey: DbKey,
                                    Image: vContent,
                                    MimeType: oFile.type,
                                    FileName: oFile.name,
                                }, {
                                    success: function() {
                                        BusyIndicator.hide()
                                        var msg = 'Изображение успешно загружено';
                                        MessageToast.show(msg);
                                        debugger
                                    },

                                    error: function(oErr) {
                                        BusyIndicator.hide();
                                        var msg = 'Загрузка изображения не удалась';
                                        MessageToast.show(msg);
                                        debugger;
                                    },
                                }
                            );
                        // this.callLoadFileAction(vContent);
                    }.bind(this);

                    oReader.readAsDataURL(oFile);
                }
            }.bind(this)
        );

    },

    uiExtensions: function() {
        this.uiExtensionAddUploader();
    },

    uiExtensionAddUploader: function() {
        var sExcelButtonText = fioriBaseController.getTextFromI18n(
            this,
            "ImageUpload"
        );
        var oObjectPageHeader = this.byId("objectPageHeader");
        var oUpload = new sap.ui.unified.FileUploader({
            buttonOnly: true,
            id: "fileUploader",
            style: "Emphasized",
            name: "myFileUpload",
            buttonText: sExcelButtonText,
            fileType: "png.jpeg,jpg",
            change: this.onUploadFile.bind(this),
            visible: {
                path: "ui>/editable",
            },
        });

        oObjectPageHeader.insertAction(oUpload, 0);
    },

    onUploadFile: function(oEvent) {
        this.getFileContent(oEvent);
    }

});

