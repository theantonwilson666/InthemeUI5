sap.ui.define([
        "jira/lib/BaseController",
        'sap/ui/model/json/JSONModel'

    ],
    function(BaseController, JSONModel) {
        "use strict";

        return BaseController.extend("intime.zint_lunch_reg.controller.Main", {
            onInit: function() {
                // create model
			
                this.getRouter()
                    .getRoute("mainpage")
                    .attachPatternMatched(this._onRouteMatched, this)
                    
                    // const oModel = new JSONModel();
                    // oModel.setData({
                    //     dateValue: new Date()
                    // });
                    // this.getView().setModel(oModel);
                    // this.byId("DP1").setDateValue(new Date());

            },
            // onDateChange: function(){
            //     debugger;
            // },

            _onRouteMatched: function() {
                debugger;
                this._setFilters();
                debugger;
                this._setValue();
                
            },

            _setValue: function() {
                debugger;
                const oModel = new JSONModel();
                    oModel.setData({
                        dateValue: new Date()
                    });
                    this.getView().setModel(oModel);
                    this.byId("DP1").setDateValue(new Date());
               
            },

            _setFilters: function() {
                debugger;
                //Первые блюда
                this.byId('_Soup-GridList').getBinding('items').filter([
                        new sap.ui.model.Filter({
                            path: "DISH_TYPE",
                            operator: "EQ",
                            value1: "FC"
                        })
                    ]),
                    //Горячее
                    this.byId('_Hot-GridList').getBinding('items').filter([
                        new sap.ui.model.Filter({
                            path: "DISH_TYPE",
                            operator: "EQ",
                            value1: "HD"
                        })
                    ]),
                    //Гарнир
                    this.byId('_Garnish-GridList').getBinding('items').filter([
                        new sap.ui.model.Filter({
                            path: "DISH_TYPE",
                            operator: "EQ",
                            value1: "G"
                        })
                    ]),
                    //Закуски
                    this.byId('_Snacks-GridList').getBinding('items').filter([
                        new sap.ui.model.Filter({
                            path: "DISH_TYPE",
                            operator: "EQ",
                            value1: "ST"
                        })
                    ]);

                debugger;
            },
    
        });
    });