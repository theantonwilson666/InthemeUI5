sap.ui.define([
    "jira/lib/BaseController",
    'sap/ui/model/json/JSONModel',
    "sap/ui/core/Fragment"
],
    function (BaseController, JSONModel, Fragment) {
        "use strict";


        return BaseController.extend("intime.zint_lunch_reg.controller.Main", {

            onInit: function () {
                this.getRouter()
                    .getRoute("mainpage")
                    .attachPatternMatched(this._onRouteMatched, this)
            },


            onGoToAdminModeButtonPress: function(){
                this.setStateProperty('/adminMode', !this.getStateProperty('/adminMode'));
            },

            onDetailPress: function (oEvent) {
                debugger;
                let oDishDescr = oEvent.getSource();
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        name: "intime.zint_lunch_reg.view.Dialog",
                        controller: this,
                    });
                } 

                this.pDialog.then(function(oDialog) {

                    oDialog.setModel(oDishDescr.getModel());
                    oDialog.setBindingContext(oDishDescr.getBindingContext());

                    // oDialog.bindContext(oDishDescr.getBindingContext().getPath());
                    // oDialog.bindElement(oDishDescr.getBindingContext().getPath());
                    oDialog.open();
                });
            },


            onAddPress: function(oEvent, oModel){
                debugger;
                let oDishDescr = oEvent.getSource();
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        name: "intime.zint_lunch_reg.view.Add",
                        controller: this,
                        // stretch: true,
                        
                    });
                } 
                
                this.pDialog.then(function(oDialog) {

                    oDialog.setModel(oDishDescr.getModel());
                    oDialog.setBindingContext(oDishDescr.getBindingContext());
                    oDialog.open();
                });
                // var oContext = oModel.createEntry("/Z_MENU_MAIN_SET", {
                //     properties : {DISH_TYPE: "", DISH_DESCR: "", DISH_COMPOSITION: ""}
                // });
                // onformdata.setBindingContext(oContext);

                // oModel.submitChanges({success: mySuccessHandler, error: myErrorHandler});

                // oContext.created().then(
                //     function () {},
                //     function () {}
                // );
                // oModel.resetChanges([oContext.getPath()], undefined, true);

                
            },
            onFormPress:function(oEvent){
                debugger;
                
            },

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


            onCloseDialog : function (oEvent) {
                debugger;
                oEvent.getSource().getParent().close();
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