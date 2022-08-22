sap.ui.define(
  [
    "jira/lib/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
  ],
  function (BaseController, JSONModel, Fragment, MessageBox, Filter) {
    "use strict";

    return BaseController.extend("intime.zint_lunch_reg.controller.Main", {
      onInit: function () {
        this.getRouter()
          .getRoute("mainpage")
          .attachPatternMatched(this._onRouteMatched, this);

        this.getView().setBusy(true);
      },

      onFilterSelect: function (oEvent) {
        debugger;

        let sKey = oEvent.getParameter("key"),
          aFilters = [],
          oCombinedFilter;

        this._setFilters(sKey);


        // if (sKey === "01") {
        //   oCombinedFilter = new Filter(("MenuType", "EQ", sKey), true);
        //   aFilters.push(new Filter(oCombinedFilter, false));
        // } else if (sKey === "02") {
        //   oCombinedFilter = new Filter(("MenuType", "EQ", sKey), true);
        //   aFilters.push(new Filter(oCombinedFilter, false));
        // }

        // //TODO : Обновлять биндинг у страницы
        // this.byId("_MenuType-IconTabBar").getBinding("items").filter(aFilters);
        // debugger;
      },

      getNumberOfSelectedDish: function (oEvent) {
        const oModel = this.getView().getModel();
        // var oModel = new sap.ui.model.odata.v2.ODataModel(
        //   "/sap/opu/odata/sap/ZINT_UI_MAIN_REQ_SRV"
        // );

        const oFilter = [];
        oFilter.push(
          new sap.ui.model.Filter({
            path: "REQ_DATE",
            operator: "EQ",
            value1: this.getView().byId("DP1").getDateValue(),
          })
        );
        oFilter.push(
          new sap.ui.model.Filter({
            path: "DishChoosen",
            operator: "EQ",
            value1: true,
          })
        );
        oModel.read("/ZSNN_EMP_MENU", {
          filters: oFilter,
          urlParameters: {
            $inlinecount: "allpages",
          },
          success: function (oData, oResponse) {
            this.setStateProperty("/numberOfDishChoosen", oData.__count);
          }.bind(this),
          error: function (oError) {
            MessageBox(oError);
          },
        });
      },

      onGoToAdminModeButtonPress: function () {
        this.setStateProperty(
          "/adminMode",
          !this.getStateProperty("/adminMode")
        );
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

        this.pDialog.then(function (oDialog) {
          oDialog.setModel(oDishDescr.getModel());
          oDialog.setBindingContext(oDishDescr.getBindingContext());
          oDialog.open();
        });
      },

      onAddPress: function (oEvent, oModel) {
        this._oToolbar = oEvent.getSource().getParent();

        let sDishType = this._oToolbar
          .getBindingContext("dish")
          .getObject().typeId;

        if (!this.pDialog) {
          this.pDialog = Fragment.load({
            name: "intime.zint_lunch_reg.view.Dialog",
            controller: this,
          });
        }

        this.pDialog.then(
          function (oDialog) {
            let oModel = this.getView().getModel();

            var oContext = oModel.createEntry("/ZSNN_EMP_MENU", {
              properties: {
                DISH_TYPE: sDishType,
                DISH_DESCR: "Новое блюдо",
                DISH_COMPOSITION: "",
                BranchId: "02",
                BranchText: "Чебоксары",
              },
            });

            oDialog.setModel(oModel);
            oDialog.setBindingContext(oContext);
            oDialog.open();
          }.bind(this)
        );
      },
      onFormPress: function (oEvent) {},

      onFileUploadChange: function (oEvent) {
        const aFileOnSave = this.getStateProperty("/_createImg");
        aFileOnSave.push(oEvent.getSource());

        this.setStateProperty("/_createImg", aFileOnSave);
      },

      onFileUploadChange: function (oEvent) {
        const aFileOnSave = this.getStateProperty("/_createImg");
        aFileOnSave.push(oEvent.getSource());

        this.setStateProperty("/_createImg", aFileOnSave);
      },

      _onRouteMatched: function () {
        this._initDatePicker();

        this.getNumberOfSelectedDish();

        this._adminVisibleButton();

        this.byId("_MenuType-IconTabBar")
          .getBinding("items")
          .attachDataReceived((oData) => {
            debugger;
            if (oData.getParameter("data")) {
              this._setFilters(oData.getParameter("data").results[0].MenuType);
            }
          });
      },

      _adminVisibleButton: function () {
        this.getModel().callFunction("/getAdminButtonVisible", {
          method: "POST",
          success: (oData) => {
            debugger;

            const bAdmin = oData["getAdminButtonVisible"].AdminVis;
            this.getView().setBusy(false);
            if (bAdmin === false) {
              this.byId("admin").setVisible(false);

              this.byId("_MenuType-IconTabBar")
                .getBinding("items")
                .filter(
                  new sap.ui.model.Filter({
                    path: "MenuActual",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: true,
                  })
                );
              this.byId("IconTabFilter").setVisible(false);
              //todo : Скрыть IconTabBar если не админ
            }
          },
          error: (oError) => {
            this.getView().setBusy(false);
            this.showError(oError);
          },
        });
      },

      onSelectDish: function (oEvent) {
        this._changedTile = oEvent.getSource();
        this._changedTile.setBusy(true);
        this.submitChanges({
          groupId: "changes",
          success: function () {
            this._changedTile.setBusy(false);
            this.isExistError();

            // TODO : get number of selected dish
            this.getNumberOfSelectedDish();
          }.bind(this),
          error: function (oError) {
            this._changedTile.setBusy(false);
            this.showError(oError);
          }.bind(this),
        });
      },

      onOKButtonPress: function (oEvent) {
        oEvent.getSource().getParent().close();
      },

      onCloseDialog: function (oEvent) {
        oEvent
          .getSource()
          .getModel()
          .resetChanges(
            [oEvent.getSource().getBindingContext().getPath()],
            undefined,
            true
          );
        oEvent.getSource().getParent().close();
      },

      onDateChange: function () {

        //
        this._setFilters();
        this.getNumberOfSelectedDish();

        // const oDate = oEvent.getSource().getModel('date').getData().dateValue;
      },

      _initDatePicker: function () {
        const oModel = new JSONModel();
        oModel.setData({
          dateValue: new Date(),
        });
        this.getView().setModel(oModel, "date");
      },

      _getFilters: function (oParam) {
        // sDishType, sMenuType
        const aFilter = [];
        this.getView().byId("DP1").getDateValue().setHours(3);

        aFilter.push(
          new sap.ui.model.Filter({
            path: "DISH_TYPE",
            operator: "EQ",
            value1: oParam.dishType,
          })
        );

        aFilter.push(
          new sap.ui.model.Filter({
            path: "REQ_DATE",
            operator: "EQ",
            value1: this.getView().byId("DP1").getDateValue(),
          })
        );

        //TODO : filter by menu type
        aFilter.push(
          new sap.ui.model.Filter({
            path: "MenuType",
            operator: "EQ",
            value1: oParam.menuType,
          })
        );

        return aFilter;
      },

      _setFilters: function (sMenuType) {
        // debugger;

        // if (!sMenuType){
        //   sMenuType = ''
        // }

        let aPanels = this.byId("dishContainer").getItems();

        for (let i = 0; i < aPanels.length; i++) {
          let oGridList = aPanels[i].getContent()[0];

          debugger;

          oGridList.getBinding("items").filter(
            this._getFilters({
              dishType: oGridList.getBindingContext("dish").getObject().typeId,
              menuType: sMenuType,
            })
          );
        }

        // const oModel = this.getView().getModel();
        // let aMenuType = oData.getParameter('data').results[0].MenuType
      },

      fileSaveProcessHandling: function () {
        return new Promise((res, rej) => {
          const aFileOnSave = this.getStateProperty("/_createImg");

          if (aFileOnSave) {
            const aPromises = [];

            for (let i = 0; i < aFileOnSave.length; i++) {
              const oFile = aFileOnSave[i].getFocusDomRef().files[0];
              const oDishData = aFileOnSave[i].getBindingContext().getObject();

              if (oFile) {
                aPromises.push(this.saveImg(oFile, oDishData));
              }
            }

            Promise.all(aPromises).then(() => {
              res(true);
            });
          } else {
            res(true);
          }
        });
      },

      saveImg: function (oFile, oDishData) {
        return new Promise((res, rej) => {
          var oReader = new FileReader();
          oReader.onload = (e) => {
            var vContent = e.currentTarget.result.replace(
              "data:" + oFile.type + ";base64,",
              ""
            );

            this.getView()
              .getModel()
              .createEntry("/DishImgSet", {
                groupId: "changes",
                properties: {
                  DishID: oDishData.DISH_ID,
                  BranchID: oDishData.BranchId,
                  ImgContent: vContent,
                  MimeCode: oFile.type,
                },
              });

            res(true);
          };

          oReader.readAsDataURL(oFile);
        });
      },

      onGetExcelReportButtonPress: function (oEvent) {
        // const sBranch =  this.byId('_ExcelBranch-Select').getSelectedItem().getKey();
        const oDate = this.byId("DP1").getDateValue();

        const oModel = this.getModel();
        const sServiceUrl = oModel.sServiceUrl;

        const sPath = oModel.createKey("/ExcelReportSet", {
          Branch: "02",
          Date: oDate,
        });

        const sUrl = sServiceUrl + sPath + "/$value";

        sap.m.URLHelper.redirect(sUrl, true);

        oEvent.getSource().getParent().close();
      },

      onCloseExcelDialog: function (oEvent) {
        oEvent.getSource().getParent().close();
      },

      onSaveButtonPress: function (oEvent) {
        this.getView().setBusy(true);

        this.fileSaveProcessHandling().then(() => {
          this.submitChanges({
            groupId: "changes",
            success: function () {
              this.getView().setBusy(false);
              this.isExistError();
              this._postDeleteHandling();
            }.bind(this),
            error: function (oError) {
              this.getView().setBusy(false);
              this.showError(oError);
            }.bind(this),
          });
        });
      },

      onRejectButtonPress: function (oEvent) {
        this.getView().getModel().resetChanges();
        this.onGoToAdminModeButtonPress();
      },

      onDeleteDishButtonPress: function (oEvent) {
        const sDish = oEvent
          .getSource()
          .getBindingContext()
          .getObject().DISH_DESCR;
        const sPath = oEvent.getSource().getBindingContext().getPath();

        const oGridListItem = oEvent.getSource().getParent().getParent();

        MessageBox.warning(
          `Вы действительно хотите удалить блюдо - ${sDish}? `,
          {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            onClose: (sAction) => {
              if (sAction === "OK") {
                this.getView().getModel().remove(sPath, {
                  groupId: "changes",
                });
                oGridListItem.addStyleClass("DeletedDish");

                this._addDeletedDishes(oGridListItem);
              }
            },
          }
        );
      },

      _addDeletedDishes: function (oDelDish) {
        const aDelDishes = this.getStateProperty("/_preDeletedDishes");
        aDelDishes.push(oDelDish);
        this.setStateProperty("/_preDeletedDishes", aDelDishes);
      },

      _addDeletedDishes: function (oDelDish) {
        const aDelDishes = this.getStateProperty("/_preDeletedDishes");
        aDelDishes.push(oDelDish);
        this.setStateProperty("/_preDeletedDishes", aDelDishes);
      },

      _postDeleteHandling: function () {
        const aDelDishes = this.getStateProperty("/_preDeletedDishes");

        aDelDishes.forEach((oDish) => {
          oDish.removeStyleClass("DeletedDish");
        });

        this.setStateProperty("/_preDeletedDishes", []);
      },
    });
  }
);
