sap.ui.loader.config({ paths: { "jira/lib": "/sap/bc/ui5_ui5/sap/zjiralib" } });


sap.ui.define([
    "sap/m/VBox",
    "jira/lib/intime_reuse/ReuseIntimeLib"
], function(VBox, ReuseLib) {
    "use strict";
    return VBox.extend("jira.lib.intime_reuse.timeSheet.Attachments", {
        renderer: "sap.m.VBoxRenderer",
        metadata: {
            properties: {
                "DocumentID": {
                    type: "string"
                },

                "DocumentType": {
                    type: "string"
                }
            },

            events: {
                "success": {},
                "error": {
                    parameters: {
                        error: { type: "object" }
                    }
                }
            }
        },

        Lib: ReuseLib,

        ODataModel: null,
        ODataUrl: '/sap/opu/odata/sap/ZINT_UI_ATTACHMENT_SRV/',


        constructor: function(oParam) {
            arguments[0].modelContextChange = this._modelContextChange;
            sap.m.VBox.prototype.constructor.apply(this, arguments);

            this._getModel().metadataLoaded().then(function() {
                // this.setBindingContext(this.getParent().getBindingContext());
                this._loadAttacmhentFragment();
            }.bind(this));
        },


        _modelContextChange: function(oEvent) {

            if ((this._getSmartTable()) && this.getDocumentID()) {
                this._getSmartTable().rebindTable();
            }
        },

        _getSmartTable: function() {
            return this.getItems()[0];
        },

        _loadAttacmhentFragment: function() {
            this.Lib.loadDialog.call(this, {
                sDialogName: "_AttachmentFragment",
                sViewName: "jira.lib.intime_reuse.attachments.Attachments",
                controller: this
            }).then(function(oSmartTable) {
                oSmartTable.setModel(this._getModel());
                oSmartTable.attachBeforeRebindTable(this._beforeRebindTable.bind(this));
                this.addItem(oSmartTable);
            }.bind(this));
        },

        _onAttachemntPress: function(oEvent) {
            var oAttach = oEvent.getSource().getBindingContext().getObject();

            if (oAttach.isUrl) {
                window.open(oAttach.Url, '_blank');
                return;
            }

            if (oAttach.isFile) {
                var sGetFileUrl = this._getModel().sServiceUrl + "/" + oEvent.getSource().getBindingContext().getPath() + "/$value"
                sap.m.URLHelper.redirect(sGetFileUrl, true);
                return;
            }
        },

        _onDeleteAttachmentPress: function(oEvent) {
            this._deletedAttach = oEvent.getParameter('listItem').getBindingContext();

            sap.m.MessageBox.warning("Удалить вложение?", {
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                emphasizedAction: sap.m.MessageBox.Action.OK,
                onClose: function(sAction) {
                    if (sAction === 'OK') {

                        this._getSmartTable().setBusy(true);

                        this._getModel().remove(this._deletedAttach.getPath(), {
                            success: this._onSuccessNewAttachment.bind(this),
                            error: this._onErrorDeleteAttachment.bind(this)
                        });
                    }
                }.bind(this)
            });
        },

        _beforeRebindTable: function(oEvent) {
            oEvent.getParameter('bindingParams').filters.push(
                new sap.ui.model.Filter("DocumentID", 'EQ', this.getDocumentID())
            );
        },

        _onAddNewAttachment: function(oEvent) {
            this.Lib.loadDialog.call(this, {
                sDialogName: "_NewAttachmentDialog",
                sViewName: "jira.lib.intime_reuse.attachments.NewAttachDialog",
                controller: this
            }).then(function(oDialog) {

                oDialog.setModel(this._getModel());

                oDialog.setModel(new sap.ui.model.json.JSONModel({
                    description: "",
                    URL: "",
                    selectedType: "01"
                }), "control");

                oDialog.open();

            }.bind(this));
        },


        _getFileUploader: function() {
            return this["_NewAttachmentDialog"].getContent()[0].getItems()[5]; // ???
        },

        _onSuccessNewAttachment: function() {
            this["_NewAttachmentDialog"].setBusy(false);
            this.fireSuccess();
            this._getFileUploader().clear();
            this["_NewAttachmentDialog"].close();
            this._getSmartTable().rebindTable();
        },

        _onSuccessDeleteAttachment: function() {
            this._getSmartTable().setBusy(false);
        },

        _onErrorDeleteAttachment: function(oError) {
            this._getSmartTable().setBusy(false);
            this.fireError(oError);
        },

        _onErrorNewAttachment: function(oError) {
            this["_NewAttachmentDialog"].setBusy(false);
            this.fireError(oError);
            this._getFileUploader().clear();
        },

        _onOkNewAttachmentButtonPress: function(oEvent) {

            var oControlData = this._getFileUploader().getModel("control").getData();
            if (oControlData.selectedType === '01') {
                var oFile = this._getFileUploader().getFocusDomRef().files[0];

                if (oFile) {
                    var oReader = new FileReader();


                    oEvent.getSource().getParent().setBusy(true);
                    oReader.onload = function(e) {

                        var vContent = e.currentTarget.result.replace(
                            "data:" + oFile.type + ";base64,",
                            ""
                        );
                        var oControlData = this._getFileUploader().getModel("control").getData()

                        this._getModel().create("/ZSNN_INTIME_ATTACHMENT", {
                            FileContent: vContent,
                            FileName: oFile.name,
                            Description: oControlData.description,
                            Url: oControlData.URL,
                            isUrl: oControlData.selectedType === '02' ? true : false,
                            isFile: oControlData.selectedType === '01' ? true : false,
                            DocumentID: this.getDocumentID(),
                            DocumentType: this.getDocumentType()
                        }, {
                            success: this._onSuccessNewAttachment.bind(this),
                            error: this._onErrorNewAttachment.bind(this)
                        })

                    }.bind(this)
                    oReader.readAsDataURL(oFile);
                }

            } else {
                oEvent.getSource().getParent().setBusy(true);

                this._getModel().create("/ZSNN_INTIME_ATTACHMENT", {
                    FileContent: "",
                    FileName: "",
                    Description: oControlData.description,
                    Url: oControlData.URL,
                    isUrl: oControlData.selectedType === '02' ? true : false,
                    isFile: oControlData.selectedType === '01' ? true : false,
                    DocumentID: this.getDocumentID(),
                    DocumentType: this.getDocumentType()
                }, {
                    success: this._onSuccessNewAttachment.bind(this),
                    error: this._onErrorNewAttachment.bind(this)
                })
            }

        },

        _onCancelNewAttachmentButtonPress: function(oEvent) {
            oEvent.getSource().getParent().close();
        },

        _getModel: function() {
            if (!this.ODataModel) {
                this.ODataModel = new sap.ui.model.odata.v2.ODataModel(this.ODataUrl, {
                    defaultBindingMode: "TwoWay",
                    annotationURI: "/sap/bc/ui5_ui5/sap/zjiralib/intime_reuse/attachments/localService/annotations.xml"
                });
            }
            return this.ODataModel;

        }
    });
});