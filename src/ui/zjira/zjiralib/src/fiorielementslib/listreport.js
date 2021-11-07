sap.ui.define([], function () {
    'use strict';

    return {
        init: function (oEvent) {
            
            
            this.dellShareButton(oEvent);
            this.dellFilterButton(oEvent);
            this.uiExtensionTableAlignTextBegin(oEvent);
            this.uiExtensionShareBtn(oEvent);
            this.uiExtensionVisiblePinBtn(oEvent);
        },
        uiExtensionShareBtn: function (oEvent) {
            var oShareActionButton = oEvent.byId("template::Share");
            oShareActionButton.setVisible(false);
        },
        dellShareButton: function (oEvent) {
            oEvent.byId('listReport-btnExcelExport-internalSplitBtn').setVisible(false);
        },
        dellFilterButton: function (oEvent) {
            oEvent.byId("listReportFilter-btnFilters").setVisible(false);
        },
        uiExtensionTableAlignTextBegin: function (oEvent) {
            var aColumns = oEvent.byId("responsiveTable").getAggregation("columns");
            for (var i = 0; i < aColumns.length; i++) {
                aColumns[i].setHAlign("Begin");
            }
        },
        formatDateTime: function (oValue) {
            if (oValue) {
                return (oValue.getDay() + "/" + oValue.getMonth() + "/" + oValue.getFullYear());
            }
        },
        formatId: function (nId) {
            if (nId) return parseInt(nId, 10);
        },
        uiExtensionVisiblePinBtn: function (oEvent) {
            var oPinBtn = oEvent.byId("template:::ListReportPage:::DynamicPageHeader-pinBtn");
            if (oPinBtn) {
                oPinBtn.setVisible(false)
            }
        }
    }
})