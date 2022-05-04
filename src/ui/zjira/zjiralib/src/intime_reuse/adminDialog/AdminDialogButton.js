sap.ui.define([
    "sap/m/Button",
    "jira/lib/intime_reuse/ReuseIntimeLib"
], function (Button, ReuseLib) {
    "use strict";
    return Button.extend("jira.lib.intime_reuse.adminDialog.AdminDialogButton", {
        renderer: "sap.m.ButtonRenderer",
        metadata: {
            properties: {
                "entitySet": {
                    type: "string"
                },

                "groupID": {
                    type: "string"
                },

                "bindingPath": {
                    type: "string"
                },

                "dialogTitle": {
                    type: "string"
                },

                "title": {
                    type: "string"
                },

                "dialog": {
                    type: "object"
                }
            },

            events: {
                "onAccept": {}
            }
        },

        Lib: ReuseLib,

        constructor: function (oParam) {
            arguments[0].press = this._onPress;
            sap.m.Button.prototype.constructor.apply(this, arguments);
        },

        _onPress: function (oEvent) {

            this.Lib.loadDialog({
                sDialogName: "_adminDialog",
                sViewName: "jira.lib.intime_reuse.adminDialog.AdminDialog",
                controller: this
            }).then(function (oDialog) {

                this.setProperty("dialog", oDialog);

                oDialog.setModel(this.getModel());
                oDialog.setBindingContext(this.getBindingContext());

                oDialog.setModel(this.Lib.newJSONModel({
                    edit: false
                }), "control");

                oDialog.getModel("control").updateBindings(true);

                oDialog.setTitle(this.getProperty("dialogTitle"));

                var oTemplate = new sap.m.ColumnListItem(
                    {
                        vAlign: "Middle",
                        cells: [

                            new sap.ui.comp.smartfield.SmartField({
                                value: "{Username}",
                                editable: false//"{control>/edit}"
                            }),
                            new sap.m.Switch({
                                state: "{CreateEnabled}",
                                type: "AcceptReject",
                                enabled: "{control>/edit}"
                            }),

                            new sap.m.Switch({
                                state: "{UpdateEnabled}",
                                type: "AcceptReject",
                                enabled: "{control>/edit}"
                            }),

                            new sap.m.Switch({
                                state: "{DeleteEnabled}",
                                type: "AcceptReject",
                                enabled: "{control>/edit}"
                            })

                        ]
                    });

                oDialog.getContent()[0].bindItems(this.getBindingInfo("bindingPath").binding.sPath, oTemplate);
                oDialog.open();
            }.bind(this));
        },

        onAddPress: function (oEvent) {
            var oNewContext = this.getModel().createEntry("/" + this.getProperty("entitySet"), {
                groupId: this.getProperty("groupID")
            })

            var oItem = oEvent.getSource().getParent().getParent().getBindingInfo("items").template.clone();
            oItem.setBindingContext(oNewContext);
            oEvent.getSource().getParent().getParent().insertItem(oItem, 0);
        },

        getDialog: function () {
            return this.getProperty("dialog");
        },

        onOkButtonPress: function (oEvent) {

            this.getDialog().setBusy(true);

            this.getModel().submitChanges({
                groupId: this.getProperty("groupID"),
                success: function () {
                    this.getDialog().setBusy(false);
                    this.Lib.showMessage("Сохранено");
                    this.getDialog().close();
                    this.fireEvent("onAccept", {});
                }.bind(this),
                error: function (oError) {
                    this.Lib.showMessage("Ошибка");
                    this.getDialog().setBusy(false);

                }.bind(this),

            });
        },


        onEditPress: function (oEvent) {
            var oControlModel = oEvent.getSource().getModel("control");
            var oData = oControlModel.getData();
            oData.edit = !oData.edit;
            oControlModel.updateBindings(true);
            oEvent.getSource().setIcon(oData.edit === true ? "sap-icon://display" : "sap-icon://edit")
            oEvent.getSource().getParent().getParent().setMode(oData.edit === true ? "Delete" : "None");
        },

        onCancelButtonPress: function () {
            this.getDialog().close();
        }
    });
});