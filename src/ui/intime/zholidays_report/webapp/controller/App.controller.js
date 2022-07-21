sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox'
],
function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("intime.zholiday_report.controller.App", {

        onInit: function () {
            // create model
            var oModel = new JSONModel();
            oModel.setData({
                startDate: new Date("2017", "0", "15", "8", "0"),
                
                people: [{
                    pic: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/8d/8d19edb05990defafc555a2011a94dde8c90698e_medium.jpg",
                    name: "Artem Pavlov",
                    role: "Чебоксары",
                    appointments: [
                        {
                            start: new Date("2017", "0", "8", "08", "30"),
                            end: new Date("2017", "0", "8", "09", "30"),
                            title: "Meet Max Mustermann",
                            type: "Type02",
                            tentative: false
                    }
                ]
            }]
            });

            // this.getView().setModel(oModel);

        },

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
        }

    });

});