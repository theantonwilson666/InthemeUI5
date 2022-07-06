$.sap.require("jira/lib/MessageDialog");
var MessageDialog = sap.ui.require(
    "jira/lib/MessageDialog"
);

sap.ui.controller("intime.zemployee_card.ext.controller.ObjectPageExt", {

    _UserObjectPageId: 'intime.zemployee_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_EMPLOYEE_CARD',

    onInit: function() {

        // if (this.getView().getId() === this._UserObjectPageId) {

        // }

    },

    onAfterRendering: function() {
        debugger;
        this.roundFlout();
    },

    roundFlout: function() {
        // var oitem = this.byId("intime.zemployee_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_EMPLOYEE_CARD--objectPage-OPHeaderContent").getBindingContext().getObject();

        // if (typeof oitem === "undefined" ) return

        // var Birthday = oitem.Birthday;
        // var PositionTime = oitem.PositionTime;

        // if (typeof Birthday === "undefined" && PositionTime === "undefined"){
        // var FinallyBirthday = Math.trunc(Birthday / 365);
        // var FinallyPositionTime = Math.floor((PositionTime * 100) / 100 );
        // } else return

        // this.byId('intime.zemployee_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_EMPLOYEE_CARD--header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::InfoHeader::Birthday::Field').setValue(FinallyBirthday);
        // this.byId('intime.zemployee_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_EMPLOYEE_CARD--header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::CorpInfo::PositionTime::Field').setValue(FinallyPositionTime)
    }

});