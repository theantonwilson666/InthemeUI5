sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel) {

    debugger;

    var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("jira.lib");

    var oMessageView = new sap.m.MessageView({
        items: {
            path: "/",
            template: new sap.m.MessageItem({
                type: "{type}",
                title: "{message}",
                description: "{description}",
                subtitle: "{code}"
            })
        }
    });

    var oDialog = new sap.m.Dialog({
        resizable: false,
        contentHeight: "300px",
        contentWidth: "500px",
        verticalScrolling: false,
        content: oMessageView,
        beginButton: new sap.m.Button({
            text: oResourceBundle.getText("CLOSE_DIALOG"),
            press: function () {
                oDialog.close();
            }
        }),
        afterClose: function (oEvent) {
            oEvent.getSource().getContent()[0].navigateBack();
            sap.ui.getCore().getMessageManager().removeAllMessages();
        }
    });

    var oPopover = new sap.m.ResponsivePopover({
        verticalScrolling: false,
        contentHeight: "300px",
        contentWidth: "500px",
        content: oMessageView
    });

    var oMessageModel = sap.ui.getCore().getMessageManager().getMessageModel();
    oDialog.setModel(oMessageModel);
    oPopover.setModel(oMessageModel);

    return {

        showError: function (oError) {
            this.oErrorDialog = new sap.m.Dialog({
                title: "Error",
                type: "Message",
                state: "Error",
                content: [
                    new sap.m.VBox({
                        items: [
                            new sap.m.Text({
                                text: "500: HTTP request failed"
                            }),
                            new sap.m.Link({
                                text: "See more",
                                visible: "{= !${libState>/visible500TextArea} }",
                                press: function () {
                                    this.getModel("libState").setProperty("/visible500TextArea", true);
                                }.bind(this)
                            }).addStyleClass("sapUiTinyMarginTop"),
                            new sap.m.TextArea({
                                value: "{libState>/500TextArea}",
                                visible: "{libState>/visible500TextArea}",
                                editable: false,
                                cols: 50,
                                rows: 4
                            }).addStyleClass("sapUiTinyMarginTop")
                        ]
                    })

                ],
                beginButton: new sap.m.Button({
                    text: oResourceBundle.getText("CLOSE_DIALOG"),
                    press: function () {
                        this.oErrorDialog.close();
                    }.bind(this)
                }),
                afterClose: function () {
                    this.getModel("libState").setProperty("/visible500TextArea", false);
                }.bind(this)
            });
            this.getModel("libState").setProperty("/500TextArea", JSON.stringify(oError));
            this.getView().addDependent(this.oErrorDialog);
            this.oErrorDialog.open();
        },

        show: function (sTitleArg) {
            var sTitle = this._getTitle(sTitleArg);
            oDialog.removeAllContent();
            oDialog.addContent(oMessageView);
            oDialog.setTitle(sTitle);
            if (!oDialog.isOpen()) {
                oDialog.open();
            }
        },

        checkAndShow: function (sTitleArg) {
            if (this.hasMessages()) {
                this.show(sTitleArg);
            }
        },

        showCurrentState: function (sTitleArg) {
            this.show(sTitleArg);
            var aMessages = oMessageModel.getProperty("/");
            var oTempModel = new JSONModel(aMessages);
            oDialog.setModel(oTempModel);
            oDialog.getBeginButton().attachEventOnce("press", function () {
                oDialog.setModel(oMessageModel);
            });
        },

        showAsPopover: function (oSourceControl, sTitleArg) {
            var sTitle = this._getTitle(sTitleArg);
            oPopover.removeAllContent();
            oPopover.addContent(oMessageView);
            oPopover.setTitle(sTitle);
            oPopover.openBy(oSourceControl);
        },

        hasMessages: function () {
            var aMessages = oMessageModel.getProperty("/");
            return aMessages.length > 0;
        },

        _getTitle: function (sTitleArg) {
            var sTitle = oResourceBundle.getText("DEFAULT_MESSAGE_DIALOG_TITLE");
            if (sTitleArg) {
                sTitle = sTitleArg;
            }
            return sTitle;
        }
    };
});