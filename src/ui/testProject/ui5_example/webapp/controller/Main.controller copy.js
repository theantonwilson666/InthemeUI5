sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/m/MessageBox'
],
function (Controller, JSONModel, MessageBox) {
  "use strict";

  var PageController = Controller.extend("sap.m.sample.PlanningCalendar.Page", {

    onInit: function () {
      // create model
      var oModel = new JSONModel();
      oModel.setData({
        startDate: new Date("2021", "10", "1", "8", "0"),
        people: [{
          name: "name",
          role: "Разработчик К1.0",
          appointments: [{
          start: new Date("2021", "10", "3", "0", "0"),
          end: new Date("2021", "10", "3", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "4", "0", "0"),
          end: new Date("2021", "10", "4", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "1", "0", "0"),
          end: new Date("2021", "10", "1", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "5", "0", "0"),
          end: new Date("2021", "10", "5", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "2", "0", "0"),
          end: new Date("2021", "10", "2", "23", "59"),
          title: "Учеба",
          info: "10:00 - 14:00",
          type: "Type01",
          tentative: false
          },
          {
          start: new Date("2021", "10", "2", "0", "0"),
          end: new Date("2021", "10", "2", "23", "59"),
          title: "Офис",
          info: "09:00 - 20:00",
          type: "Type08",
          pic: "sap-icon://sap-ui5",
          tentative: false
          },
          {
          start: new Date("2021", "10", "8", "0", "0"),
          end: new Date("2021", "10", "8", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "9", "0", "0"),
          end: new Date("2021", "10", "9", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "10", "0", "0"),
          end: new Date("2021", "10", "10", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "11", "0", "0"),
          end: new Date("2021", "10", "11", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "12", "0", "0"),
          end: new Date("2021", "10", "12", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "15", "0", "0"),
          end: new Date("2021", "10", "15", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "16", "0", "0"),
          end: new Date("2021", "10", "16", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "17", "0", "0"),
          end: new Date("2021", "10", "17", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "18", "0", "0"),
          end: new Date("2021", "10", "18", "23", "59"),
          title: "Учеба",
          info: "14:00 - 16:00",
          type: "Type01",
          tentative: false
          },
          {
          start: new Date("2021", "10", "18", "0", "0"),
          end: new Date("2021", "10", "18", "23", "59"),
          title: "Офис",
          info: "09:00 - 20:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "19", "0", "0"),
          end: new Date("2021", "10", "19", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "22", "0", "0"),
          end: new Date("2021", "10", "22", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "23", "0", "0"),
          end: new Date("2021", "10", "23", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "24", "0", "0"),
          end: new Date("2021", "10", "24", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "25", "0", "0"),
          end: new Date("2021", "10", "25", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "26", "0", "0"),
          end: new Date("2021", "10", "26", "23", "59"),
          title:
          "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "29", "0", "0"),
          end: new Date("2021", "10", "29", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          {
          start: new Date("2021", "10", "30", "0", "0"),
          end: new Date("2021", "10", "30", "23", "59"),
          title: "Офис",
          info: "09:00 - 18:00",
          type: "Type08",
          tentative: false
          },
          ]
        }]});


        if(this.byId('PC1'))
      this.byId('PC1').setModel(oModel);


      var oModelSingle = new JSONModel();
			oModelSingle.setData({
        startDate: new Date("2021", "10", "1", "8", "0"),
					appointments: [
            {
              start: new Date("2021", "10", "1", "0", "0"),
              end: new Date("2021", "10", "1", "23", "59"),
              title: "Офис",
             
              type: "Type08",
          },
          {
              start: new Date("2021", "10", "2", "0", "0"),
              end: new Date("2021", "10", "2", "23", "59"),
              title: "Офис",
             
              type: "Type08",
             
          },
          {
              start: new Date("2021", "10", "3", "0", "0"),
              end: new Date("2021", "10", "3", "23", "59"),
              title: "Офис",
             
              type: "Type08",
          }]})

          if(this.byId('SPC1'))
          this.byId('SPC1').setModel(oModelSingle);


    
      var oDataSelect =     {
				"ProductCollection": [
					{
						
						"Name": "Дом"
					},
					{
						
						"Name": "Учеба"
					},
					{
						
						"Name": "Офис"
					},
					{
						
						"Name": "Отпуск"
					},
        ]
      }
      var oModelS = new JSONModel(oDataSelect);
       
      if(this.byId("selectTypeDay"))
      this.byId("selectTypeDay").setModel(oModelS)
    },

    handleAppointmentSelect: function (oEvent) {
      var oAppointment = oEvent.getParameter("appointment"),
        sSelected;
      if (oAppointment) {
        sSelected = oAppointment.getSelected() ? "selected" : "deselected";
        MessageBox.show("'" + oAppointment.getTitle() + "' " + sSelected + ". \n Selected appointments: " + this.byId("PC1").getSelectedAppointments().length);
      } else {
        var aAppointments = oEvent.getParameter("appointments");
        var sValue = aAppointments.length + " Appointments selected";
        MessageBox.show(sValue);
      }
    },

    handleSelectionFinish: function(oEvent) {
      var aSelectedKeys = oEvent.getSource().getSelectedKeys();
      this.byId("PC1").setBuiltInViews(aSelectedKeys);
    }

  });

  return PageController;

});




