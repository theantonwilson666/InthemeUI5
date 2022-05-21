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


sap.ui.controller("intime.zworker_workspace.ext.controller.ObjectPageExt", {
    _UserObjectPageId: 'intime.zworker_workspace::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_WORKER_LIST',

    onInit: function () {

        if (this.getView().getId() === this._UserObjectPageId) {
            this.uiExtension();
            this.uiExtensionPhoto();
        }



    },

    uiExtension: function () {
        this.extensionAPI.attachPageDataLoaded(function () {
            this.initDateIntervalSelection();
            this.updateVizFrame();
        }.bind(this))
        // this.addPhotoLoader();
    },

    initDateIntervalSelection: function () {
        var oDay = this.getDayParam(new Date());
        var oId = this.byId("_TimeSheetIntervalSelection-DateRangeSelection");
        if (oId) {
            oId.setDateValue(new Date(oDay.year, oDay.month, oDay.day - 7));
            oId.setSecondDateValue(new Date());
        }
    },

    getDayParam: function (oDate) {
        return {
            year: oDate.getFullYear(),
            month: oDate.getMonth(),
            day: oDate.getDate()
        }
    },


    onCreateTimeSheetButtonPress: function (oEvent) {
        var oUser = oEvent.getSource().getBindingContext().getObject();
        var oItem = this.byId("to_AssignedSubTask::com.sap.vocabularies.UI.v1.LineItem::responsiveTable").getSelectedContexts()[0].getObject();

        var oDialog = new TimeSheetDialog({
            title: `Списать время - ${oUser.Surname} ${oUser.Name}`,
            executorID: oUser.UserID,
            subTaskID: oItem.SubTaskID,
            contentWidth: "50%"
        });

        oDialog.open();

    },

    onCreateTimeSheetHeaderButtonPress: function (oEvent) {
        var oDialog = new TimeSheetDialog({
            title: `Списать время - ${oEvent.getSource().getBindingContext().getObject().Surname} ${oEvent.getSource().getBindingContext().getObject().Name}`,
            executorID: oEvent.getSource().getBindingContext().getObject().UserID,
            contentWidth: "50%"
        });
        oDialog.open();
    },


    updateVizFrame: function () {
        Format.numericFormatter(ChartFormatter.getInstance());
        var formatPattern = ChartFormatter.DefaultPattern;

        this.byId("_TimeSheet-VizFrame").destroyDataset()
        this.byId("_TimeSheet-VizFrame").destroyFeeds()

        this.byId("_TimeSheet-VizFrame").setVizProperties({

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


        this.byId("_TimeSheet-VizFrame").setDataset(oDataSet);

        this.byId("_TimeSheet-VizFrame").getDataset().getBinding('data').filter([
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


        this.byId("_TimeSheet-VizFrame").addFeed(oFeedValueAxis);
        this.byId("_TimeSheet-VizFrame").addFeed(oFeedCategoryAxis);

        var oPopOver = this.getView().byId("_TimeSheet-Popover");
        oPopOver.connect(this.byId("_TimeSheet-VizFrame").getVizUid());

        oPopOver.setCustomDataControl(function (data, test) {
            if (!data.data.val) {

                var sSelectedDate = data.target.__data__.DateSheet;
                this.getView().byId("_TimeSheet-Popover").close()

                var oUserData = this.getView().getBindingContext().getObject();

                var oDialog = new TimeSheetDialog({
                    title: `Списать время - ${oUserData.Surname} ${oUserData.Name}`,
                    executorID: oUserData.UserID,
                    dateSheet: this.parseDate(sSelectedDate),
                    contentWidth: "50%"
                });
                oDialog.open();

                oDialog.timeSheetSaveResult.then(function (oData) {
                    this.updateVizFrame();
                }.bind(this))

            } else {

                debugger;

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

    },

    parseDate: function (sDateString) {

        var sDay = sDateString.split('.')[0];
        var sMonth = parseInt(sDateString.split('.')[1]) - 1;
        var sYear = sDateString.split('.')[2];

        return new Date(sYear, sMonth, sDay, 4);

    },


    formatDate: function (oDate) {
        if (oDate) {
            return oDate.toLocaleDateString("ru-RU", { year: 'numeric', month: 'numeric', day: 'numeric' });
        };
    },

    onChangeDateRangeSelection: function (oEvent) {
        this.updateVizFrame();
    },

    uiExtensionPhoto: function () {
        this.addPhotoLoader();
    },
    addPhotoLoader: function () {
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

    onUploadFile: function (oEvent) {
        this.getFileContent(oEvent);
    },

    getFileContent: function (oEvent) {
        return new Promise(
            function (res, rej) {
                var oFile = oEvent.getSource().getFocusDomRef().files[0];
                if (oFile) {
                    var oReader = new FileReader();
                    oReader.onload = function (e) {
                        var vContent = e.currentTarget.result.replace(
                            "data:" + oFile.type + ";base64,",
                            ""
                        );

                        debugger;

                        this.getView().setBusy(true);

                        var sSurl = "/sap/opu/odata/sap/ZINT_UI_USERS_SRV/";
                        var oModal = new sap.ui.model.odata.v2.ODataModel(sSurl, {
                            defaultBindingMode: "TwoWay"
                        });
                        oModal.attachMetadataLoaded(function () {

                            oModal.createEntry("/UserPhotoSet", {
                                properties: {
                                    UserID: this.getView().getBindingContext().getObject().UserID,
                                    Content: vContent,
                                    FilePath: oFile.name
                                },

                                success: function (oData) {
                                    this.getView().setBusy(false);
                                    this.extensionAPI.refresh();
                                    this.clearFileUploader();

                                }.bind(this),

                                error: function () {
                                    this.getView().setBusy(false);
                                    this.clearFileUploader();

                                    debugger;

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

    clearFileUploader: function () {
        this.getView().getContent()[0].getHeaderTitle().getActions()[0].clear();
    }

});