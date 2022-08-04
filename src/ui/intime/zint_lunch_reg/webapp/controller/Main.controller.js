sap.ui.define([

        "jira/lib/BaseController",
        'sap/ui/model/json/JSONModel',
        "sap/ui/core/Fragment",
        "sap/m/MessageBox"
    ],
    function(BaseController, JSONModel, Fragment, MessageBox) {
        "use strict";



        return BaseController.extend("intime.zint_lunch_reg.controller.Main", {

            onInit: function() {
                this.getRouter()
                    .getRoute("mainpage")
                    .attachPatternMatched(this._onRouteMatched, this)
            },


            onGoToAdminModeButtonPress: function() {
                this.setStateProperty('/adminMode', !this.getStateProperty('/adminMode'));
            },

            onDetailPress: function(oEvent) {
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



            onAddPress: function(oEvent, oModel) {
                debugger;
                this._oToolbar = oEvent.getSource().getParent();


                let sDishType = this._oToolbar.getBindingContext('dish').getObject().typeId;

                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        name: "intime.zint_lunch_reg.view.Dialog",
                        controller: this,
                        // stretch: true,

                    });
                }

                this.pDialog.then(function(oDialog) {

                    let oModel = this.getView().getModel();

                    var oContext = oModel.createEntry("/ZSNN_EMP_MENU", {
                        properties: { DISH_TYPE: sDishType, DISH_DESCR: "Новое блюдо", DISH_COMPOSITION: "", BranchId: "02", BranchText: "Чебоксары" }
                    });

                    oDialog.setModel(oModel);
                    oDialog.setBindingContext(oContext);
                    oDialog.open();
                }.bind(this));
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
            onFormPress: function(oEvent) {
                debugger;

            },

            _onRouteMatched: function() {
                // this.getView().getModel().setDeferredBatchGroups([])
                this._initDatePicker();
                this._setFilters();
            },


            onSelectDish: function(oEvent) {

                this._changedTile = oEvent.getSource();
                this._changedTile.setBusy(true);
                this.submitChanges({
                    groupId: "changes",
                    success: function() {

                        this._changedTile.setBusy(false);
                        this.isExistError()

                    }.bind(this),
                    error: function(oError) {

                        this._changedTile.setBusy(false);
                        this.showError(oError);
                    }.bind(this),
                });

            },


            onOKButtonPress: function(oEvent) {

                //const oGridList = this._oToolbar.getParent().getContent()[0];

                // oGridList.addItem(new sap.f.GridListItem({
                //     type: "Inactive",
                //     content: [
                //         new sap.m.HBox({
                //             items : [

                //             ]
                //         }).addStyleClass('sapUiSmallMargin')
                //     ]
                // }));


                // <f:GridListItem selected="{DishChoosen}"
                //         type="{= ${state>/adminMode} ? 'Detail' : 'Inactive' }"
                //         detailPress="onDetailPress">

                //         <HBox class="sapUiSmallMargin">
                //             <f:Avatar src="{/Speakers}"
                //                 displaySize="S"
                //                 displayShape="Square"
                //                 showBorder="true">
                //             </f:Avatar>
                //             <layoutData>
                //                 <FlexItemData growFactor="1"
                //                     shrinkFactor="0" />
                //             </layoutData>

                //             <VBox class="sapUiSmallMargin">
                //                 <Title text="{DISH_DESCR}"
                //                     wrapping="true" />
                //                 <Label text="{DISH_COMPOSITION}"
                //                     wrapping="true" />
                //             </VBox>
                //         </HBox>


                //         <OverflowToolbar visible="{state>/adminMode}">
                //             <ToolbarSpacer />
                //             <Button 
                //                 icon="sap-icon://delete"
                //                 press="onDeleteDishButtonPress"
                //                 type="Reject" />
                //         </OverflowToolbar>

                //     </f:GridListItem>

                oEvent.getSource().getParent().close();

            },

            onCloseDialog: function(oEvent) {
                oEvent.getSource().getModel().resetChanges([oEvent.getSource().getBindingContext().getPath()], undefined, true);
                oEvent.getSource().getParent().close();
            },


            onDateChange: function() {
                this._setFilters();
                // const oDate = oEvent.getSource().getModel('date').getData().dateValue;
            },


            _initDatePicker: function() {
                const oModel = new JSONModel();
                oModel.setData({
                    dateValue: new Date()
                });
                this.getView().setModel(oModel, 'date');
            },


            _getFilters: function(sDishType) {
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


            _setFilters: function() {

                let aPanels = this.byId('dishContainer').getItems();

                for (let i = 0; i < aPanels.length; i++) {
                    let oGridList = aPanels[i].getContent()[0];
                    oGridList.getBinding('items').filter(this._getFilters(oGridList.getBindingContext('dish').getObject().typeId));
                }

            },


            onSaveButtonPress: function(oEvent) {
                this.getView().setBusy(true);

                this.submitChanges({
                    groupId: "changes",
                    success: function() {
                        this.getView().setBusy(false);
                        this.isExistError()

                    }.bind(this),
                    error: function(oError) {
                        this.getView().setBusy(false);
                        this.showError(oError);
                    }.bind(this),
                });
            },


            onRejectButtonPress: function(oEvent) {
                this.getView().getModel().resetChanges();
                this.onGoToAdminModeButtonPress();
            },


            onDeleteDishButtonPress: function(oEvent) {
                const sDish = oEvent.getSource().getBindingContext().getObject().DISH_DESCR;
                const sPath = oEvent.getSource().getBindingContext().getPath();

                const oGridListItem = oEvent.getSource().getParent().getParent();

                MessageBox.warning(`Вы действительно хотите удалить блюдо - ${sDish}? `, {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: sAction => {
                        if (sAction === 'OK') {
                            this.getView().getModel().remove(sPath, {
                                groupId: "changes"
                            })
                            oGridListItem.addStyleClass('DeletedDish');

                        }
                    }
                });


            }
        });
       

    })
