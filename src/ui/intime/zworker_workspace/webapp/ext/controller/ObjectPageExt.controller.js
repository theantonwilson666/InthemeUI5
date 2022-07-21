$.sap.require("sap/viz/ui5/format/ChartFormatter");
var ChartFormatter = sap.ui.require(
    "sap/viz/ui5/format/ChartFormatter"
);

$.sap.require("sap/viz/ui5/api/env/Format");
var Format = sap.ui.require(
    "sap/viz/ui5/api/env/Format"
);

$.sap.require("jira/lib/intime_reuse/timeSheet/TimeSheetDialog");
var TimeSheetDialog = sap.ui.require(
    "jira/lib/intime_reuse/timeSheet/TimeSheetDialog"
);

// $.sap.require("jira/lib/intime_reuse/timeSheet/ChangeStatusDialog");
// var ChangeTaskStatusDialog = sap.ui.require(
//     "jira/lib/intime_reuse/timeSheet/ChangeStatusDialog"
// );

$.sap.require("jira/lib/MessageDialog");
var MessageDialog = sap.ui.require(
    "jira/lib/MessageDialog"
);

sap.ui.controller("intime.zworker_workspace.ext.controller.ObjectPageExt", {
    _UserObjectPageId: 'intime.zworker_workspace::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_WORKER_LIST',

    onInit: function() {

        if (this.getView().getId() === this._UserObjectPageId) {
            this.uiExtension();
            this.uiExtensionPhoto();
        }
        
        // debugger;
        var oModel = this.getOwnerComponent().getModel();
        if(oModel) {
            oModel.attachRequestCompleted(function(oEvent) { 
                switch (oEvent.getParameter('method')) {
                    case 'DELETE':
                        oModel.refresh();
                        break;
                    case 'MERGE':
                        oModel.refresh();
                        break;
                    // case 'GET':
                    //     this.byId("to_TimeSheet::com.sap.vocabularies.UI.v1.LineItem::responsiveTable").getParent().rebindTable();
                    default:
                        break;
                }
             }, this);
        }
    },

    uiExtension: function() {
        this.extensionAPI.attachPageDataLoaded(function() {
                this.initDateIntervalSelection();
                this.updateVizFrame();
                this.addTimeSheetDateInterval();

            }.bind(this))
            // this.addPhotoLoader();
    },


    addTimeSheetDateInterval: function() {
        var oDay = this.getDayParam(new Date());

        this._oDateRangeSelection = new sap.m.DateRangeSelection("timeSheetDateRange-DateRangeSelection", {
            dateValue: new Date(oDay.year, oDay.month, oDay.day - 7),
            secondDateValue: new Date(),
            width: "15%"
        });

        this._oDateRangeSelection.attachChange(function() {
            debugger;
            this.byId("to_TimeSheet::com.sap.vocabularies.UI.v1.LineItem::responsiveTable").getParent().rebindTable();
            // this.byId("intime.zworker_workspace::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_WORKER_ASSIGNED_SUBTASK--to_TimeSheet::com.sap.vocabularies.UI.v1.LineItem::Table").getParent().rebindTable();
        }.bind(this))


        this.byId("to_TimeSheet::com.sap.vocabularies.UI.v1.LineItem::responsiveTable").getHeaderToolbar().addContent(this._oDateRangeSelection);
        this.byId("to_TimeSheet::com.sap.vocabularies.UI.v1.LineItem::responsiveTable").getParent().attachBeforeRebindTable(function(oEvent) {
            var oDateFrom = this._oDateRangeSelection.getDateValue();
            var oDateTo = this._oDateRangeSelection.getSecondDateValue();

            if ((oDateFrom) && (oDateTo)) {
                oEvent.getParameter('bindingParams').filters.push(new sap.ui.model.Filter("DateSheet", 'BT', oDateFrom, oDateTo));
            }

        }.bind(this))
        debugger;
        this.byId("to_TimeSheet::com.sap.vocabularies.UI.v1.LineItem::responsiveTable").getParent().rebindTable();
        // this.byId("intime.zworker_workspace::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_WORKER_ASSIGNED_SUBTASK--to_TimeSheet::com.sap.vocabularies.UI.v1.LineItem::Table").getParent().rebindTable();
    },

    onChartDateClick: function(day, month, year) {
        debugger;

        sap.ui.getCore().byId('timeSheetDateRange-DateRangeSelection').setDateValue(new Date(year, month, day, 23, 59, 59));
        sap.ui.getCore().byId('timeSheetDateRange-DateRangeSelection').setSecondDateValue(new Date(year, month, day, 23, 59, 59));
        
        debugger;
        this.byId("to_TimeSheet::com.sap.vocabularies.UI.v1.LineItem::responsiveTable").getParent().rebindTable();
        // this.byId("intime.zworker_workspace::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_WORKER_ASSIGNED_SUBTASK--to_TimeSheet::com.sap.vocabularies.UI.v1.LineItem::Table").getParent().rebindTable();
    },

    initDateIntervalSelection: function() {
        var oDay = this.getDayParam(new Date());
        var oId = this.byId("_TimeSheetIntervalSelection-DateRangeSelection");
        if (oId) {
            oId.setDateValue(new Date(oDay.year, oDay.month, oDay.day - 7));
            oId.setSecondDateValue(new Date());
        }
    },

    getDayParam: function(oDate) {
        return {
            year: oDate.getFullYear(),
            month: oDate.getMonth(),
            day: oDate.getDate()
        }
    },

    onChangeTaskStatusPress: function(oEvent) {

        var oUser = oEvent.getSource().getBindingContext().getObject();
        var oItem = this.byId("to_AssignedSubTask::com.sap.vocabularies.UI.v1.LineItem::responsiveTable").getSelectedContexts()[0].getObject();

        sap.m.MessageToast.show("Функционал не реализован");

    },


    onCreateTimeSheetButtonPress: function(oEvent) {
        var oUser = oEvent.getSource().getBindingContext().getObject();
        var oItem = this.byId("to_AssignedSubTask::com.sap.vocabularies.UI.v1.LineItem::responsiveTable").getSelectedContexts()[0].getObject();

        var oDialog = new TimeSheetDialog({
            title: `Списать время - ${oUser.Surname} ${oUser.Name}`,
            executorID: oUser.UserID,
            subTaskID: oItem.SubTaskID,
            contentWidth: "100%"
        });

        oDialog.timeSheetSaveResult.then(function(oSuccess) {
                this.extensionAPI.refresh();
                this.updateVizFrame();
            }.bind(this),
            function(oError) {
                MessageDialog.isExistError();
            }.bind(this)
        );

        oDialog.open();

    },

    onCreateTimeSheetHeaderButtonPress: function(oEvent) {
        var oDialog = new TimeSheetDialog({
            title: `Списать время - ${oEvent.getSource().getBindingContext().getObject().Surname} ${oEvent.getSource().getBindingContext().getObject().Name}`,
            executorID: oEvent.getSource().getBindingContext().getObject().UserID,
            contentWidth: "100%"
        });

        oDialog.timeSheetSaveResult.then(function(oSuccess) {
                this.extensionAPI.refresh();
                this.updateVizFrame();
            }.bind(this),
            function(oError) {
                MessageDialog.isExistError();
            }.bind(this)
        );

        oDialog.open();
    },

    onCreateTimeSheetSubTaskPageButtonPress: function(oEvent) {
        debugger;
        var oItem = this.byId("to_TimeSheet::com.sap.vocabularies.UI.v1.LineItem::SubSection").getBindingContext().getObject();
        var oDialog = new TimeSheetDialog({
            title: `Списать время - ${oEvent.getSource().getBindingContext().getObject().Executor}`,
            executorID: oEvent.getSource().getBindingContext().getObject().Executor,
            subTaskID: oItem.SubTaskID,
            contentWidth: "100%"
        });

        oDialog.timeSheetSaveResult.then(function(oSuccess) {
                // this.extensionAPI.refresh();
                var oModel = this.getOwnerComponent().getModel();
                if(oModel) {
                    oModel.refresh();
                }
                this.updateVizFrame();
            }.bind(this),
            function(oError) {
                MessageDialog.isExistError();
            }.bind(this)
        );

        oDialog.open();
    },


    updateVizFrame: function() {
        Format.numericFormatter(ChartFormatter.getInstance());
        var formatPattern = ChartFormatter.DefaultPattern;

        var oVizFrame = this.byId("_TimeSheet-VizFrame");

        if(oVizFrame) {
            oVizFrame.destroyDataset()
            oVizFrame.destroyFeeds()
    
            oVizFrame.setVizProperties({
    
                interaction: {
                    selectability: {
                        // plotLassoSelection : false
                        mode: "EXCLUSIVE" //only one data point can be selected at a time
                    }
                },
    
                title: {
                    text: "Диаграмма списания",
                },
                plotArea: {
                    dataLabel: {
                        formatString: formatPattern.SHORTFLOAT_MFD2,
                        visible: false,
                    },
    
                    dataPointStyle: {
                        "rules": [{
                                "dataContext": { "SpendHours": { "min": 0, "max": 8 } },
                                "properties": {
                                    "color": "sapUiChartPaletteSemanticCriticalLight3"
                                },
                                "displayName": "0-8"
                            },
    
                            {
                                "dataContext": { "SpendHours": { "min": 8, "max": 9 } },
                                "properties": {
                                    "color": "sapUiChartPaletteSemanticGood"
                                },
                                "displayName": "8-9"
                            },
    
                            {
                                "dataContext": { "SpendHours": { "min": 9, "max": 10 } },
                                "properties": {
                                    "color": "sapUiChartPaletteSemanticCritical"
                                },
                                "displayName": "9-10"
                            },
    
                            {
                                "dataContext": { "SpendHours": { "min": 10 } },
                                "properties": {
                                    "color": "sapUiChartPaletteSemanticBad"
                                },
                                "displayName": "10+"
                            }
    
    
                        ]
                    }
                },
                valueAxis: {
                    title: {
                        text: "Списанные часы",
                        visible: true,
                    },
                },
                categoryAxis: {
                    title: {
                        text: "Дата",
                        visible: true,
                    },
                },
            });
    
            var oDataSet = new sap.viz.ui5.data.FlattenedDataset({
                dimensions: [{
                    name: "DateSheet",
                    value: { path: "DateSheet", formatter: this.formatDate }
                }],
                measures: [{
                    name: "SpendHours",
                    value: "{SpendHours}"
                }],
                data: {
                    path: this.getView().getBindingContext().getPath() + "/to_SpendHours"
                },
            });
    
    
            oVizFrame.setDataset(oDataSet);
    
            oVizFrame.getDataset().getBinding('data').filter([
                new sap.ui.model.Filter("DateSheet", 'BT', this.byId("_TimeSheetIntervalSelection-DateRangeSelection").getDateValue(), this.byId("_TimeSheetIntervalSelection-DateRangeSelection").getSecondDateValue())
            ]);
    
            var oFeedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                "uid": "valueAxis",
                "type": "Measure",
                "values": ["SpendHours"]
            });
    
            oFeedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                "uid": "categoryAxis",
                "type": "Dimension",
                "values": ["DateSheet"]
            });
    
    
            oVizFrame.addFeed(oFeedValueAxis);
            oVizFrame.addFeed(oFeedCategoryAxis);
    
            var oPopOver = this.getView().byId("_TimeSheet-Popover");
            oPopOver.connect(oVizFrame.getVizUid());
    
            oPopOver.setCustomDataControl(function(data, test) {
                if (!data.data.val) {
                    var sSelectedDate = data.target.__data__.DateSheet;
    
                    this.getView().byId("_TimeSheet-Popover").close();
    
    
                    var oUserData = this.getView().getBindingContext().getObject();
    
                    var oDialog = new TimeSheetDialog({
                        title: `Списать время - ${oUserData.Surname} ${oUserData.Name}`,
                        executorID: oUserData.UserID,
                        dateSheet: this.parseDate(sSelectedDate),
                        contentWidth: "100%"
                    });
    
    
                    oDialog.open();
    
                    oDialog.timeSheetSaveResult.then(function(oData) {
                        this.extensionAPI.refresh();
                        this.updateVizFrame();
                    }.bind(this), function(oError) {
                        MessageDialog.isExistError();
                    }.bind(this))
    
                } else {
    
                    var sDate = data.target.__data__.DateSheet;
                    this.onChartDateClick(sDate.split('.')[0], sDate.split('.')[1] - 1, sDate.split('.')[2]);
    
                    var oList = new sap.m.List({
                        includeItemInSelection: true
                    });
    
                    oList.setModel(this.getView().getModel());
    
                    oList.bindItems({
                        path: this.getView().getBindingContext().getPath() + "/to_TimeSheet",
                        template: new sap.m.StandardListItem({
                            title: "{TaskName}",
                            description: "{SubTaskName}",
                            icon: "{PartnerImageURL}",
                            // counter : {
                            //      path : "TimeSpent",
                            //      formatter : function (sTimeSpent){
    
                            //         debugger;
    
                            //         if (sTimeSpent){
                            //             return parseInt(sTimeSpent);
                            //         }
                            //      }
                            //     },
                            info: "{TimeSpent} {TimeSpentUText}"
                        }),
                        filters: [
                            new sap.ui.model.Filter("DateSheet", "EQ", this.parseDate(data.data.val[0].value))
                        ]
                    })
    
                    return oList;
                }
            }.bind(this));
        }
    },

    parseDate: function(sDateString) {

        var sDay = sDateString.split('.')[0];
        var sMonth = parseInt(sDateString.split('.')[1]) - 1;
        var sYear = sDateString.split('.')[2];

        return new Date(sYear, sMonth, sDay, 4);

    },


    formatDate: function(oDate) {
        if (oDate) {
            return oDate.toLocaleDateString("ru-RU", { year: 'numeric', month: 'numeric', day: 'numeric' });
        };
    },

    onChangeDateRangeSelection: function(oEvent) {
        this.updateVizFrame();
    },

    uiExtensionPhoto: function() {
        this.addPhotoLoader();
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

                        this.getView().setBusy(true);

                        var sSurl = "/sap/opu/odata/sap/ZINT_UI_USERS_SRV/";
                        var oModal = new sap.ui.model.odata.v2.ODataModel(sSurl, {
                            defaultBindingMode: "TwoWay"
                        });
                        oModal.attachMetadataLoaded(function() {

                            oModal.createEntry("/UserPhotoSet", {
                                properties: {
                                    UserID: this.getView().getBindingContext().getObject().UserID,
                                    Content: vContent,
                                    FilePath: oFile.name
                                },

                                success: function(oData) {
                                    this.getView().setBusy(false);
                                    this.extensionAPI.refresh();
                                    this.clearFileUploader();
                                    // this.byId("page").getBinding('content').refresh();

                                }.bind(this),

                                error: function() {
                                    this.getView().setBusy(false);
                                    this.clearFileUploader();

                                }.bind(this)
                            });
                            oModal.submitChanges();
                        }, this);
                    }.bind(this);

                    oReader.readAsDataURL(oFile);
                }
            }
            .bind(this)
        );
    },

    clearFileUploader: function() {
        this.getView().getContent()[0].getHeaderTitle().getActions()[0].clear();
    },

    onChangeTaskStatusPress: function (oEvent) {

        var oUser = oEvent.getSource().getBindingContext().getObject();
        var oItem = this.byId("to_AssignedSubTask::com.sap.vocabularies.UI.v1.LineItem::responsiveTable").getSelectedContexts()[0].getObject();

        var oDialog = new ChangeTaskStatusDialog({
            title: `Сменить статус`,
            executorID: oUser.UserID,
            subTaskID: oItem.SubTaskID,
            contentWidth: "100%"
        });

        oDialog.timeSheetSaveResult.then(function (oSuccess) {
            this.extensionAPI.refresh();
            this.updateVizFrame();
        }.bind(this),
            function (oError) {
                MessageDialog.isExistError();
            }.bind(this)
        );

        oDialog.open();

    },

});