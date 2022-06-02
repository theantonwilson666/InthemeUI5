$.sap.require("jira/lib/MessageDialog");
var MessageDialog = sap.ui.require(
    "jira/lib/MessageDialog"
);

sap.ui.controller("intime.zusers_list.ext.controller.ObjectPageExt", {

    _UserObjectPageId: 'intime.zusers_list::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_INTIME_USER',

    onInit: function() {


        if (this.getView().getId() === this._UserObjectPageId) {
            this.uiExtension();
        }

    },

    uiExtension: function() {
        this.addPhotoLoader();

        this.extensionAPI.attachPageDataLoaded(this.pageDataLoaded.bind(this))
    },

    pageDataLoaded: function() {
        var oObject = this.getView().getBindingContext().getObject();


        if (oObject.JiraID !== "") {
            this.byId("action::createJiraUser").setVisible(false);
        } else {
            this.byId("action::createJiraUser").setVisible(true);
        }
    },

    addPhotoLoader: function() {
        var oObjectPageHeader = this.byId("objectPageHeader");
        var oUpload = new sap.ui.unified.FileUploader({
            buttonOnly: true,
            id: "_UserPhoto-FileUploader",
            style: "Emphasized",
            name: "myFileUpload",
            buttonText: 'Загрузить фотографию',
            fileType: "jpg,png,jpeg,ico",
            change: this.onUploadFile.bind(this)
        });

        oObjectPageHeader.insertAction(oUpload, 0);;
    },

    onUploadFile: function(oEvent) {
        this.getFileContent(oEvent);
    },

    getFileContent: function(oEvent) {
        return new Promise(
            function(res, rej) {
                var oFile = oEvent.getSource().getFocusDomRef().files[0];
                if (oFile) {
                    var oReader = new FileReader();
                    oReader.onload = function(e) {
                        var vContent = e.currentTarget.result.replace(
                            "data:" + oFile.type + ";base64,",
                            ""
                        );

                        debugger;

                        this.getView().setBusy(true);

                        this.getView().getModel().createEntry("/UserPhotoSet", {
                            properties: {
                                UserID: this.getView().getBindingContext().getObject().UserID,
                                Content: vContent,
                                FilePath: oFile.name
                            },

                            success: function(oData) {
                                this.getView().setBusy(false);
                                this.extensionAPI.refresh();
                                this.clearFileUploader();

                            }.bind(this),

                            error: function() {
                                this.getView().setBusy(false);
                                this.clearFileUploader();

                                debugger;

                            }.bind(this)
                        });



                        // this.callLoadFileAction(vContent);
                    }.bind(this);

                    oReader.readAsDataURL(oFile);
                }
            }.bind(this)
        );
    },

    clearFileUploader: function() {
        this.getView().getContent()[0].getHeaderTitle().getActions()[0].clear();
    },

    onCreateJiraUserButtonPress: function() {
        this.getView().setBusy(true);

        this.getView().getModel().callFunction("/CreateJiraUser", {
            method: "POST",
            urlParameters: {
                UserID: this.getView().getBindingContext().getObject().UserID
            },

            success: function() {
                this.getView().setBusy(false);
                this.extensionAPI.refresh();

            }.bind(this),

            error: function() {
                this.getView().setBusy(false);
            }.bind(this)

        });

        //   this.getModel().callFunction("/GetCreatedProject", {
        //     method: "POST",
        //     urlParameters: {
        //         PartnerID: this.getView().getBindingContext().getObject().PartnerId
        //     },

        //     success: function(oData) {

        //         this.isExistError();

        //         var oNewEntryContext = this.getView().getModel().createEntry(this.getBindingPath() + "/to_Project", {
        //             properties: oData,
        //             groupId: "changes"
        //         }
        //         );

        //         this.setProjectSelection();
        //         this.byId("projectTab").getContent()[0].setBindingContext(oNewEntryContext);
        //         this.setStateProperty("/editProjectMode", true);
        //         this.byId("projectForm").focus();


        //     }.bind(this),

        //     error: function(oError) {
        //         debugger;
        //         this.showError(oError);
        //     }.bind(this)
        // });


    },

    onSyncJiraData: function(oEvent) {
        this.getView().setBusy(true);

        this.getView().getModel().callFunction("/SyncJiraData", {
            method: "POST",
            urlParameters: {
                UserID: this.getView().getBindingContext().getObject().UserID
            },

            success: function() {
                this.getView().setBusy(false);
                this.extensionAPI.refresh();

            }.bind(this),

            error: function() {
                this.getView().setBusy(false);
            }.bind(this)

        });
    },

    onSync1CData: function(oEvent) {
        this.getView().setBusy(true);

        this.getView().getModel().callFunction("/Sync1CData", {
            method: "POST",
            urlParameters: {
                UserID: this.getView().getBindingContext().getObject().UserID
            },

            success: function() {
                this.getView().setBusy(false);
                this.extensionAPI.refresh();

            }.bind(this),

            error: function() {
                this.getView().setBusy(false);
            }.bind(this)

        });
    }

});