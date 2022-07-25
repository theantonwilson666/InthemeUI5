sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageBox'
],
function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("intime.zholiday_report.controller.App", {

        onInit:function(){
            this.byId('PC1').setStartDate(this.getFirstDateOnCurrentQuarter())
        },
        handleAppointmentSelect: function (oEvent) {
            const oAppointment = oEvent.getParameter("appointment");
            let sSelected,
                aAppointments,
                sValue;
            if (oAppointment) {
                sSelected = oAppointment.getSelected() ? "selected" : "deselected";
                MessageBox.show("'" + oAppointment.getTitle() + "' " + sSelected + ". \n Selected appointments: " + this.byId("PC1").getSelectedAppointments().length);
            } else {
                aAppointments = oEvent.getParameter("appointments");
                sValue = aAppointments.length + " Appointments selected";
                MessageBox.show(sValue);
            }
        },

        handleSelectionFinish: function(oEvent) {
            const aSelectedKeys = oEvent.getSource().getSelectedKeys();
            this.byId("PC1").setBuiltInViews(aSelectedKeys);
        },
        onSearch:function(oEvent){
            const oData = oEvent.getSource().getFilterData();
            this.byId('PC1').getBinding('rows').filter(oEvent.getSource().getFilters());
        },
        getFirstDateOnCurrentQuarter: function(oDate){
            // For the US Government fiscal year
            // Oct-Dec = 1
            // Jan-Mar = 2
            // Apr-Jun = 3
            // Jul-Sep = 4
            oDate = oDate || new Date();
            let sMonth = Math.floor(oDate.getMonth() + 1);
            if(sMonth >= 0 && sMonth < 4){
                sMonth = 0;
            }
            else if(sMonth >= 4 && sMonth < 7){
                sMonth = 3;
            }
            else if(sMonth >= 7 && sMonth < 10){
                sMonth = 6;
            }
            else if(sMonth >= 10 && sMonth < 13){
                sMonth = 9;
            }
            return new Date(oDate.getFullYear(), sMonth, oDate.getDay(), 0);
        }

    });

});