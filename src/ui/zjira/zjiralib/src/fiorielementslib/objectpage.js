sap.ui.define([], function () {
    'use strict';

    return {
        init: function (oEvent) {
            this.uiExtensionTablesAlignTextBegin(oEvent);
            this.uiExtensionShareBtn(oEvent);
            this.uiExtensionVisiblePinBtn(oEvent);
        },
        uiExtensionShareBtn: function (oEvent) {
            var oShareActionButton = oEvent.byId("template::Share");
            oShareActionButton.setVisible(false);
        },
        uiExtensionVisiblePinBtn: function (oEvent) {
            var oPinBtn = oEvent.byId("objectPage-OPHeaderContent-pinBtn");
            if (oPinBtn) {
                oPinBtn.setVisible(false)
            }
        },
        uiExtensionTablesAlignTextBegin: function (oEvent) {
            var aObjectPageSections = oEvent.byId("objectPage").getSections();
            for (var i = 0; i < aObjectPageSections.length; i++) {
                if (aObjectPageSections[i].getSubSections()[0].getAggregation("blocks")[0].getContent()[0].getMetadata().getElementName() == "sap.ui.comp.smarttable.SmartTable") {
                    var aColumns = aObjectPageSections[i].getSubSections()[0].getAggregation("blocks")[0].getContent()[0].getTable().getColumns();
                    for (var num = 0; num < aColumns.length; num++) {
                        aColumns[num].setHAlign();
                    }
                }
            }
        },
        uiExtensionRebindTableAfterExcel: function (that) {

            var aObjectPageSections = this.byId("objectPage").getSections();

            for (var i = 0; i < aObjectPageSections.length; i++) {

                if (aObjectPageSections[i].getSubSections()[0].getAggregation("blocks")[0].getContent()[0].getMetadata().getElementName() == "sap.ui.comp.smarttable.SmartTable") {

                    var aTable = aObjectPageSections[i].getSubSections()[0].getAggregation("blocks")[0].getContent()[0]

                    for (var num = 0; num < aTable.length; num++) {
                        aTable[num].rebindTable();
                    }
                }
            }
        }
    }

});