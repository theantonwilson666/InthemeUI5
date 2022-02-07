
sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/Fragment',
  'sap/m/MessageBox',
  'sap/m/MessageToast'
],
  function (Controller, JSONModel, Fragment, MessageBox, MessageToast) {
    "use strict";

    var PageController = Controller.extend("sap.m.sample.PlanningCalendar.Page", {

      onInit: function () {






        // var oPlaningCalendarRow = sap.ui.getCore().byId('__row0-__component0---Worklist--PC1-0-CalRow')




        // create model
        var oModel = new JSONModel();
        oModel.setData({
          startDate: this.getFirstMondayCurrentMonth(),
          people: [
            {
              WORKER: "bsahearwgvaewr8ghreiugh9234h2",
              SCHEDULE: [

              ]
            }
          ]
        })


        if (this.byId('PC1'))
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
            }
          ]
        })

        if (this.byId('SPC1'))
          this.byId('SPC1').setModel(oModelSingle);



        var oDataSelect = {
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

        if (this.byId("selectTypeDay"))
          this.byId("selectTypeDay").setModel(oModelS)
      },

      getFirstMondayCurrentMonth: function () {
        var iYear = new Date().getFullYear();
        var iMonth = new Date().getMonth() - 1;
        var firstMondayDate = (iYear, iMonth) => {
          var firstDate = new Date(`${iYear}`, `${iMonth}`, '1', '0', '0')
          while (firstDate.getDay() != 1) {
            firstDate = new Date(`${iYear}`, `${iMonth}`, `${firstDate.getDate() + 1}`, '0', '0')
          }
          return firstDate.getDate()
        }
        return new Date(`${iYear}`, `${iMonth}`, `${firstMondayDate(iYear, iMonth)}`, "0", "0")
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

      handleSelectionFinish: function (oEvent) {
        var aSelectedKeys = oEvent.getSource().getSelectedKeys();
        this.byId("PC1").setBuiltInViews(aSelectedKeys);
      },

      setStateProperty: function (sPath, oValue, oContext, bAsyncUpdate) {
        return this.getModel("state").setProperty(
          sPath,
          oValue,
          oContext,
          bAsyncUpdate
        );
      },

      getStateProperty: function (sPath, oContext) {
        return this.getModel("state").getProperty(sPath, oContext);
      },

      getModel: function (sName) {
        return (
          this.getOwnerComponent().getModel(sName) ||
          this.getView().getModel(sName)
        );
      },

      loadXMLFragment: function (oParams) {
        if (!this[oParams.sDialogName]) {

          return Fragment.load({
            name: oParams.sViewName,
            type: "XML",
            controller: this,
          }).then(
            function (oDialog) {

              this[oParams.sDialogName] = oDialog;
              if (oParams.sPath) {
                this[oParams.sDialogName].bindElement(oParams.sPath);
              }

              if (!$.isArray(this[oParams.sDialogName])) {
                this[oParams.sDialogName].setBusyIndicatorDelay(0);
              }
              return this[oParams.sDialogName];
            }.bind(this)
          );
        } else {
          return new Promise(
            function (res) {
              res(this[oParams.sDialogName]);
            }.bind(this)
          );
        }
      },


      viewCustomContextMenu: function (s) {

        // if(s){
        //   s = document.getElementById(s.sId)
        //   s.addEventListener('contextmenu',e=>{ 
        //   e.preventDefault()
        //   var element = sap.ui.getCore().byId(e.target.id.split('-')[0]);
        //     if(element){

        //       element.destroy()
        //     }
        //   this.loadXMLFragment
        //   .call(this, {
        //     // oView: this.getMainDialog(),
        //     sDialogName: "popoverCustomContextMenu",
        //     sViewName: "intheme.zui5_example.fragments.popoverCustomContextMenu",
        //   })
        //   .then(
        //     function (oDialog) {

        // }.bind(this))
        //     },{once:true})

        //  }
      },


      ChangeDefaultValues: function () {
        var PlanningCalendar = this.byId('PC1');
        if (PlanningCalendar) {
          sap.ui.getCore().byId('__row0-__component0---Worklist--PC1-0-CalRow').mEventRegistry.intervalSelect = []
          var Title = this.byId('selectTypeDay').getSelectedItem().getText()
          var Type = () => {
            switch (Title) {
              case "Офис":
                return "Type08"

              case "Дом":
                return "Type06"

              case "Учеба":
                return "Type01"

              default:
                break;
            }
          }
          var DateFromDatePicker = (DatePicker) => DatePicker.getValue().split('').splice(0, 5).join('')



          var Text = `${DateFromDatePicker(this.byId('TP1'))} - ${DateFromDatePicker(this.byId('TPd1'))}`
          // this.setStateProperty(this,'/type','Type08')
          // this.setStateProperty(this,'/title','Офис')
          // this.setStateProperty(this,'/text',"09:00 - 18:00")

          sap.ui.getCore().byId('__row0-__component0---Worklist--PC1-0-CalRow').
            attachIntervalSelect(function (el) {
              var year = el.mParameters.startDate.getFullYear()
              var month = el.mParameters.startDate.getMonth()
              var day = el.mParameters.startDate.getDate()
              var StartDate = new Date(`${year}`, `${month}`, `${day}`, '0', '0')
              var EndDate = new Date(`${year}`, `${month}`, `${day}`, '23', '59')
              this.byId('PC1').getRows()[0].addAppointment(new sap.ui.unified.CalendarAppointment(
                {
                  startDate: StartDate,
                  endDate: EndDate,
                  // title:this.setStateProperty(this,'/title'),
                  // type:this.setStateProperty(this,'/type'),
                  // text:this.setStateProperty(this,'/text')
                  title: Title,
                  type: Type(),
                  text: Text
                }
              ))
            }.bind(this))
        }
      },

      callFITest: function (el) {

        var aAppointments = this.byId('PC1').getRows()[0].getAppointments()

        if (aAppointments.length == 0) {
          MessageToast.show('Заполните календарь');
        } else {

          var SCHEDULE = []
          var INTERVALS = []
          var dateDivide = []

          for (let i = 0; i < aAppointments.length; i++) {

            var INTERVAL_TYPE = aAppointments[i].getType().split('').splice(-2, 2).join('')
            var TIME_BEGIN = this.beginEndTypeFormatter(aAppointments[i], 'START')
            var TIME_END = this.beginEndTypeFormatter(aAppointments[i], 'END')

            var DATE = aAppointments[i].getStartDate().getFullYear() + ''
              + this.checkCorrectDate(aAppointments[i].getStartDate().getMonth() + 1 + '')
              + this.checkCorrectDate(aAppointments[i].getStartDate().getDate() + '')

            // debugger
            var intervalItem = {
              INTERVAL_TYPE: INTERVAL_TYPE,
              TIME_BEGIN: TIME_BEGIN,
              TIME_END: TIME_END
            }


            if (dateDivide.length > 0 && DATE != dateDivide[dateDivide.length - 1]) {

              if (dateDivide.find((el) => el == DATE)) {
                SCHEDULE.find((el) => el.DATE == DATE).INTERVALS = SCHEDULE.find((el) => el.DATE == DATE).INTERVALS.concat(...INTERVALS)

              }
              else {
                var scheduleItem = {
                  "DATE": dateDivide[dateDivide.length - 1],
                  "DATE_TYPE": "test",
                  "INTERVALS": INTERVALS
                }
                SCHEDULE.push(scheduleItem)
              }
              INTERVALS = []

              // debugger
            }
            INTERVALS.push(intervalItem)

            if (i == aAppointments.length - 1) {
              if (dateDivide.find((el) => el == DATE)) {
                SCHEDULE.find((el) => el.DATE == DATE).INTERVALS = SCHEDULE.find((el) => el.DATE == DATE).INTERVALS.concat(...INTERVALS)

              }
              else {
                var scheduleItem = {
                  "DATE": DATE,
                  "DATE_TYPE": "test",
                  "INTERVALS": INTERVALS
                }
                SCHEDULE.push(scheduleItem)
              }
              debugger
            }

            dateDivide.push(DATE)
          }

          var result = {
            "WORKER": 'bsahearwgvaewr8ghreiugh9234h2',
            "MONTH": '02',
            "YEAR": '2022',
            "SCHEDULE": SCHEDULE
          }
          debugger
          var jsonRes = JSON.stringify(result)


          this.getModel().callFunction("/RecalcScheduleTable", {
            // headers:result,
            // urlParameters:jsonRes,
            method: "POST",
            success: function (oData) {
              debugger
            },
            error: function (oData) {
              debugger
            }.bind(this),
          });

        }
      },

      beginEndTypeFormatter: function (aAppointment, sFlag) {

        if (sFlag == "START") {
          var massBegin = aAppointment.getText().split('').splice(0, 5)
          massBegin.splice(2, 1)
          return massBegin.join('')
        }
        else {
          var massBegin = aAppointment.getText().split('').splice(8)
          massBegin.splice(2, 1)
          return massBegin.join('')
        }
      },

      checkCorrectDate: function (date) {
        if (date < 10) {
          return `0${date}`
        }
        else {
          return date
        }

      },

      onAfterRendering: function () {



        var oPlaningCalendarRow = sap.ui.getCore().byId('__component0---Worklist--PC1')
        this.viewCustomContextMenu(oPlaningCalendarRow);
        oPlaningCalendarRow.attachViewChange((el) => {
          var sViewKey = el.getSource().getViewKey();
          var iTodaye = this.byId('PC1').getStartDate().getDate()
          var iMonth = this.byId('PC1').getStartDate().getMonth()
          var iYear = this.byId('PC1').getStartDate().getFullYear()
          sViewKey == 'even' ?
            this.byId('PC1').setStartDate(new Date(iYear + "", iMonth + "", iTodaye + 7 + "", "0", "0")) :
            this.byId('PC1').setStartDate(new Date(iYear + "", iMonth + "", iTodaye - 7 + "", "0", "0"))


          // debugger
        })

        var TimeLine = sap.ui.getCore().byId('__row0-__component0---Worklist--PC1-0-CalRow')
        if (TimeLine) {

          TimeLine.setHeight('17em')

          TimeLine.attachSelect((el) => {
            el.getSource().getAppointments().find((el) => el.getSelected()).destroy()
          })


          this.ChangeDefaultValues()
          this.byId('TPd1').attachChange(() => {
            this.ChangeDefaultValues()
          })
          this.byId('TP1').attachChange(() => {
            this.ChangeDefaultValues()
          })
          this.byId('selectTypeDay').attachChange(() => {
            this.ChangeDefaultValues()
          })
        }
      }

    });

    return PageController;

  });


