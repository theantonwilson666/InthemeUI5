sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox'
],
function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("intime.zholiday_report.controller.App", {
        handleAppointmentSelect: function (oEvent) {
            var oAppointment = oEvent.getParameter("appointment"),
                sSelected,
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
            var aSelectedKeys = oEvent.getSource().getSelectedKeys();
            this.byId("PC1").setBuiltInViews(aSelectedKeys);
        },
        onSearch:function(oEvent){
        //    return;
            // const oData = oEvent.getSource().getFilterData();
            
            // const oUserId = oData.UserID.ranges.map((item)=>item.value1);
            // const oDepartmentID = oData.DepartmentID.ranges.map((item)=>item.value1);
            // const oBranchID = oData.BranchID.ranges.map((item)=>item.value1);
            // const oPositionID = oData.PositionID.ranges.map((item)=>item.value1);

            // console.log(oUserId);
            // console.log(oDepartmentID);
            // console.log(oBranchID);
            // console.log(oPositionID);
            this.byId('PC1').getBinding('rows').filter(oEvent.getSource().getFilters());
        },
        bindingNewPlanningCalendar:function(){

        }

    });

});