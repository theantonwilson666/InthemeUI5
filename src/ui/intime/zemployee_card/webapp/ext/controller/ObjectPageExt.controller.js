$.sap.require("jira/lib/MessageDialog");
var MessageDialog = sap.ui.require(
    "jira/lib/MessageDialog"
);

$.sap.require("sap/ui/core/format/NumberFormat");
var NumberFormat = sap.ui.require(
    "sap/ui/core/format/NumberFormat"
);

$.sap.require("intime/zemployee_card/ext/formatter/formatter");
var Formatter = sap.ui.require("intime/zemployee_card/ext/formatter/formatter");


sap.ui.controller("intime.zemployee_card.ext.controller.ObjectPageExt", {

    formatter: Formatter,

    _UserObjectPageId: 'intime.zemployee_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_EMPLOYEE_CARD',

    onInit: function() {

        this.getStatus();

    },

    getStatus: function() {

        this.extensionAPI.attachPageDataLoaded(function(){
            debugger;
            var oDismissedDate = sap.ui.getCore().byId('intime.zemployee_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_EMPLOYEE_CARD--objectPageHeader').getBindingContext().getObject().DismisseStartDate;
            var oVacationDate = sap.ui.getCore().byId('intime.zemployee_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_EMPLOYEE_CARD--objectPageHeader').getBindingContext().getObject().VacationEndDate;
            var oSickLeaveDate = sap.ui.getCore().byId('intime.zemployee_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_EMPLOYEE_CARD--objectPageHeader').getBindingContext().getObject().SickLeaveEndDate;
            var oItem = sap.ui.getCore().byId('intime.zemployee_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_EMPLOYEE_CARD--objectPageHeader').getBindingContext().getObject().UserStatus;
            var oType = sap.ui.getCore().byId('intime.zemployee_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_EMPLOYEE_CARD--objectPageHeader').getBindingContext().getObject().UserStatusType;
            if (oType === '000') {
             sap.ui.getCore().byId('intime.zemployee_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_EMPLOYEE_CARD--objectPageHeader').setObjectTitle(oItem);
            } else if (oType === '006') {
             sap.ui.getCore().byId('intime.zemployee_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_EMPLOYEE_CARD--objectPageHeader').setObjectTitle(oItem + " " + oDismissedDate.toLocaleDateString());
            } else if (oType === '001') {
             sap.ui.getCore().byId('intime.zemployee_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_EMPLOYEE_CARD--objectPageHeader').setObjectTitle(oItem + " " + "до" + " " + oVacationDate.toLocaleDateString());
            } else if (oType === '002') {
             sap.ui.getCore().byId('intime.zemployee_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_EMPLOYEE_CARD--objectPageHeader').setObjectTitle(oItem + " " + "до" + " " + oSickLeaveDate.toLocaleDateString());
            }
         });

    }

});