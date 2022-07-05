$.sap.require("sap/ui/core/Fragment");
var Fragment = sap.ui.require("sap/ui/core/Fragment");

$.sap.require("intime/zemployee_card/ext/formatter/formatter");
var Formatter = sap.ui.require("intime/zemployee_card/ext/formatter/formatter");

sap.ui.controller("intime.zemployee_card.ext.controller.ListReportExt", {
    formatter: Formatter,

    onInit: function() {
        // this.uiExtensions();
    },



});