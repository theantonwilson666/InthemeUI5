
sap.ui.loader.config({ paths: { "jira/lib": "/sap/bc/ui5_ui5/sap/zjiralib" } });


sap.ui.define([
    "sap/m/Dialog",
    "jira/lib/intime_reuse/ReuseIntimeLib"
], function (Dialog, ReuseLib) {
    "use strict";
    return Dialog.extend("jira.lib.intime_reuse.timeSheet.TimeSheetDialog", {
        renderer: "sap.m.DialogRenderer",
        metadata: {
            properties: {
                "subTaskID": {
                    type: "string"
                },

                "executorID": {
                    type: "string"
                },

                "dateSheet" : {
                    type : "object"
                }
            }
            // ,
            // events: {
            //     "onAccept": {}
            // }
        },

        Lib: ReuseLib,

        ODataModel: null,
        ODataUrl: '/sap/opu/odata/sap/ZINT_UI_TIMESHEET_SRV/',


        timeSheetSaveResult : null,


        constructor: function (oParam) {
            arguments[0].afterOpen = this._onAfterOpen;
            arguments[0].afterClose = this._afterClose;
            sap.m.Dialog.prototype.constructor.apply(this, arguments);

            this.timeSheetSaveResult = new Promise(function (res, rej){
                this._ODataSaveResolve = res;
                this._ODataSaveReject = rej;
            }.bind(this))
        },

        _loadTimeSheetDialogContent: function () {
            this.Lib.loadDialog({
                sDialogName: "_timeSheetDialog",
                sViewName: "jira.lib.intime_reuse.timeSheet.TimeSheetDialogContent",
                controller: this
            }).then(function (oDialogContent) {

                debugger;

                oDialogContent.setModel(this._getModel());
                this.addContent(oDialogContent);

                var oCreatedTimeSheetContext = this._getModel().createEntry("/ZSNN_INTIME_TIMESHEET", {
                    properties: {
                        Executor: this.getExecutorID(),
                        SubTaskID: this.getSubTaskID(),
                        DateSheet: this.getDateSheet() ? this.getDateSheet() : new Date()
                    },
                    success: function (oData) {
                        this._ODataSaveResolve('success');
                    }.bind(this),

                    error: function (oError) {
                        this._ODataSaveReject(oError);
                        // this.Lib.showError(oError);
                    }.bind(this)
                });

                this.getContent()[0].setBindingContext(oCreatedTimeSheetContext);


                if (this.getExecutorID()) {
                    this.Lib.byId("_Executor-SmartField").setEditable(false);
                    this._readUser(this.getExecutorID());
                }


                if (this.getExecutorID() && this.getSubTaskID()) {
                    this.Lib.byId("_SubTask-SmartField").setEditable(false);
                    this.Lib.byId("_SubTaskName-Text").setVisible(false);
                    this._readAssignedTask(this.getExecutorID(), this.getSubTaskID());
                }

                if (this.getDateSheet()){
                    this.Lib.byId("_DateSheet-SmartField").setEditable(false);
                }

                if (this.getButtons().length === 0) {
                    this.addButton(new sap.m.Button({ text: 'OK', type: 'Emphasized', press: this._onOkButtonPress.bind(this) }));
                    this.addButton(new sap.m.Button({ text: 'Отмена', type: 'Reject', press: this._onCancelButtonPress.bind(this) }));
                }



            }.bind(this));
        },

        _onOkButtonPress: function (oEvent) {

            this.setBusy(true);
            
            this._getModel().submitChanges({
                success: function () {
                    this.setBusy(false);
                    this.close();
                    
                }.bind(this),

                error: function (oError) {
                    
                    this.setBusy(false);

                
                    // debugger;
                    // this.Lib.showError(oError);

                }.bind(this)
            });

        },



        _onCancelButtonPress: function (oEvent) {
            this._getModel().resetChanges();
            oEvent.getSource().getParent().close();
        },


        _afterClose: function (oEvent) {
            this.getContent()[0].destroy();
            delete this.Lib._timeSheetDialog; // !!
        },

        _onAfterOpen: function () {
            this._getModel().metadataLoaded().then(function () {
                this._loadTimeSheetDialogContent();
            }.bind(this));
        },


        _readUser: function (sUserID) {

            this.setBusy(true);
            this._getModel().read(`/ZSNN_INTIME_USER('${sUserID}')`,
                {
                    success: function (oUserEntry) {

                        this.setBusy(false);
                        var sPath = this.getContent()[0].getBindingContext().getPath() + "/ExecutorName";
                        this._getModel().setProperty(sPath, oUserEntry.FullName);

                    }.bind(this)
                }
            )
        },

        _readAssignedTask: function (sUserID, sSubTaskId) {

            this.setBusy(true);
            this._getModel().read(`/ZSNN_WORKER_ASSIGNED_SUBTASK(Executor='${sUserID}',SubTaskID='${sSubTaskId}')`,
                {
                    success: function (oSubTaskEntry) {
                        this.setBusy(false);
                        var sPath = this.getContent()[0].getBindingContext().getPath();
                        this._getModel().setProperty(sPath + "/SubTaskName", oSubTaskEntry.SubTaskName);
                        this._getModel().setProperty(sPath + "/TaskName", oSubTaskEntry.TaskName);
                        this._getModel().setProperty(sPath + "/StageName", oSubTaskEntry.StageName);
                        this._getModel().setProperty(sPath + "/ProjectName", oSubTaskEntry.ProjectName);
                        this._getModel().setProperty(sPath + "/PartnerName", oSubTaskEntry.PartnerName);

                        this.setIcon(oSubTaskEntry.PartnerImageURL);


                    }.bind(this)
                }
            )
        },

        _getModel: function () {
            if (!this.ODataModel) {
                this.ODataModel = new sap.ui.model.odata.v2.ODataModel(this.ODataUrl, {
                    defaultBindingMode : "TwoWay",
                    annotationURI: "/sap/bc/ui5_ui5/sap/zjiralib/intime_reuse/timeSheet/localService/annotations.xml"
                });
            }

            return this.ODataModel;

        }
    });
});