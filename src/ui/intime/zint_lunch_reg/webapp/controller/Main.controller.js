sap.ui.define([
    "jira/lib/BaseController"

],
    function (BaseController) {
        "use strict";

        return BaseController.extend("intime.zint_lunch_reg.controller.Main", {
            onInit: function () {
                this.getRouter()
                    .getRoute("mainpage")
                    .attachPatternMatched(this._onRouteMatched, this);

            },


            _onRouteMatched: function () {
                this._setFilters();
            },


            _setFilters: function () {
                //Первые блюда
                this.byId('_Soup-GridList').getBinding('items').filter([
                    new sap.ui.model.Filter({
                        path: "DishType",
                        operator: "EQ",
                        value1: "FC"
                    })
                ]),
                 //Горячее
                this.byId('_Hot-GridList').getBinding('items').filter([
                            new sap.ui.model.Filter({
                                path: "DishType",
                                operator: "EQ",
                                value1: "HD"
                            })
                        ]),
                //Гарнир
                this.byId('_Garnish-GridList').getBinding('items').filter([
                            new sap.ui.model.Filter({
                                path: "DishType",
                                operator: "EQ",
                                value1: "G"
                           })
                        ]),
                //Закуски
                this.byId('_Snacks-GridList').getBinding('items').filter([
                            new sap.ui.model.Filter({
                                path: "DishType",
                                operator: "EQ",
                                value1: "ST"
                                   })
                                ]);

                debugger;
            },
            // _setFilters: function () {
            //     //Горячее
            //     this.byId('_Hot-GridList').getBinding('items').filter([
            //         new sap.ui.model.Filter({
            //             path: "DishType",
            //             operator: "EQ",
            //             value1: "HD"
            //         })
            //     ]);
            //     debugger;
            // },
            // _setFilters: function () {
            //     //Гарнир
            //     this.byId('_Garnish-GridList').getBinding('items').filter([
            //         new sap.ui.model.Filter({
            //             path: "DishType",
            //             operator: "EQ",
            //             value1: "G"
            //         })
            //     ]);
            //     debugger;
            // }
        });
    });