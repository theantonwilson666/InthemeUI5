sap.ui.define([
    "jira/lib/BaseController",
    'sap/ui/model/json/JSONModel',
    "sap/m/Dialog"


],
    function (BaseController, JSONModel, Dialog) {
        "use strict";


        return BaseController.extend("intime.zint_lunch_reg.controller.Main", {

            onInit: function () {
                this.getRouter()
                    .getRoute("mainpage")
                    .attachPatternMatched(this._onRouteMatched, this)
            },


            onGoToAdminModeButtonPress: function(){
                debugger;
                this.setStateProperty('/adminMode', !this.getStateProperty('/adminMode'));
                if(this.byId("GL1").getType() == 'Detail')
                {
                    this.byId("GL1").setType("Inactive");
                }else{
                    this.byId("GL1").setVisible(true);
                    this.byId("GL1").setType("Detail");
                    
                }
            },


            
            onPressB:function(){
                debugger;
                if (!this.oPressB) {
                    this.oPressB = new Dialog({
                        type: DialogType.Message,
                        title: "Default Message",
                        content: new Text({ text: "Build enterprise-ready web applications, responsive to all devices and running on the browser of your choice. That's OpenUI5." }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                this.oPressB.close();
                            }.bind(this)
                        })
                    });
                }
    
                this.oPressB.open();
            },

            // onDefaultMessageDialogPress: function(){
            //     debugger;
            //     if (!this.oDefaultMessageDialog) {
            //         this.oDefaultMessageDialog = new Dialog({
            //             type: DialogType.Message,
            //             title: "Default Message",
            //             content: [ new smartForm()],
            //             beginButton: new Button({
            //                 type: ButtonType.Emphasized,
            //                 text: "OK",
            //                 press: function () {
            //                     this.oDefaultMessageDialog.close();
            //                 }.bind(this)
            //             })
            //         });
            //     }
    
            //     this.oDefaultMessageDialog.open();
            // },


            _onRouteMatched: function () {

                

                // this.getView().getModel().setDeferredBatchGroups([])

                this._initDatePicker();

                this._setFilters();

            },

            onSelectDish: function (oEvent) {

                this._changedTile = oEvent.getSource();
                this._changedTile.setBusy(true);

                this.submitChanges({
                    groupId: "changes",
                    success: function () {
                        
                        this._changedTile.setBusy(false);
                        this.isExistError()

                    }.bind(this),
                    error: function (oError) {

                        this._changedTile.setBusy(false);
                        this.showError(oError);
                    }.bind(this),

                });

            },

            onDateChange: function () {
                this._setFilters();
                // const oDate = oEvent.getSource().getModel('date').getData().dateValue;


            },

            _initDatePicker: function () {
                const oModel = new JSONModel();
                oModel.setData({
                    dateValue: new Date()
                });

                this.getView().setModel(oModel, 'date');
            },


            _getFilters: function (sDishType) {
                const aFilter = [];

                this.getView().byId('DP1').getDateValue().setHours(3);

                aFilter.push(new sap.ui.model.Filter({
                    path: "DISH_TYPE",
                    operator: "EQ",
                    value1: sDishType
                }));

                aFilter.push(new sap.ui.model.Filter({
                    path: "REQ_DATE",
                    operator: "EQ",
                    value1: this.getView().byId('DP1').getDateValue()
                }));

                return aFilter;
            },


            _setFilters: function () {
                //Первые блюда
                this.byId('_Soup-GridList').getBinding('items').filter(this._getFilters('FC'));

                //Горячее
                this.byId('_Hot-GridList').getBinding('items').filter(this._getFilters('HD'));

                //Гарнир
                this.byId('_Garnish-GridList').getBinding('items').filter(this._getFilters('G'));

                //Закуски
                this.byId('_Snacks-GridList').getBinding('items').filter(this._getFilters('ST'));
            },
        });
    });