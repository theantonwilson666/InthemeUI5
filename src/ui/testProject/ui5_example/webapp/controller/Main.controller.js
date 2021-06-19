sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator",
  ],
  function (Controller, MessageToast, BusyIndicator) {
    "use strict";

    return Controller.extend("intheme.zui5_example.controller.Main", {
      onInit: function () {
        this.getRouter()
          .getRoute("WorklistRoute")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },

      onViewDetail: function (oEvent) {
        var oBindingObject = oEvent
          .getParameter("listItem")
          .getBindingContext()
          .getObject();

        var oParams = {
          ProjectID: oBindingObject.ProjectID,
        };

        this.navTo("DetailRoute", { query: oParams }, false);
      },

      onPressColumnListItem: function (oEvent) {
        var oBindingObject = oEvent.getSource().getBindingContext().getObject();

        var oParams = {
          MaterialID: oBindingObject.MaterialID,
        };
        this.setStateProperty("/currentRow", oBindingObject);
        this.setStateProperty("/currentPath", oEvent.getSource().getBindingContext().getPath())

        this.navTo("DetailRoute", { query: oParams }, false);
      },

      _onRouteMatched: function (oEvent) {
        debugger;
        var oSmartTable = this.byId("userSmartTab");
        this.setStateProperty("/layout", "OneColumn");

        if (oSmartTable) {
          oSmartTable.getTable().removeSelections();
        }
      },

      bindView: function (mParameters) {
        this._initViewBinder();
        return this.viewBinder.bind(mParameters);
      },

      _initViewBinder: function () {
        var ViewBinderClass = this.getOwnerComponent()
          .getViewBinder()
          .getMetadata()
          .getClass();
        this.viewBinder = new ViewBinderClass();
        this.viewBinder.setModel(this.getModel());
        this.viewBinder.setView(this.getView());
      },

      getViewBinder: function () {
        return this.viewBinder;
      },

      getStateProperty: function (sPath, oContext) {
        return this.getModel("state").getProperty(sPath, oContext);
      },

      setStateProperty: function (sPath, oValue, oContext, bAsyncUpdate) {
        return this.getModel("state").setProperty(
          sPath,
          oValue,
          oContext,
          bAsyncUpdate
        );
      },

      getModel: function (sName) {
        return (
          this.getOwnerComponent().getModel(sName) ||
          this.getView().getModel(sName)
        );
      },

      onDataRequested: function (oEvent) {},

      onFireSearchAfterSelectSmartVariant: function (sFilterBarId) {
        if (typeof sFilterBarId === "string" && sFilterBarId.length > 0) {
          this.byId(sFilterBarId).fireSearch();
          return true;
        }

        return false;
      },

      navTo: function (sName, oParameters, bReplace) {
        this.getRouter().navTo(sName, oParameters, bReplace);
      },

      onSelectionLine: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("listItem");
        var oBindingContext = oSelectedItem.getBindingContext();
        if (!this._oDialog) {
          this._oDialog = sap.ui.xmlfragment("demo.Adress", this);
        }
        this._oDialog.setBindingContext(oBindingContext);
        this._oDialog.open();
      },

      getLineItem: function (i) {
        return this.getView()
          .byId("userSmartTab")
          .getTable()
          .getAggregation("items")
          [i].getBindingContext()
          .getObject();
      },

      getSmartTable: function () {
        return this.getView().byId("materialSmartTab");
      },

      onEditToggled: function (oEvent) {
        this.setStateProperty("/editMode", true);
      },

      onCancel: function (oEvent) {
        this.setStateProperty("/editMode", false);
      },

      rebindTable: function (oEvent) {
        this.getSmartTable().rebindTable();
      },

      submitChanges: function (oEvents) {
        return this.getModel().submitChanges(oEvents);
      },
      

      onSaveChanges: function (oEvent) {
        BusyIndicator.show();

        var oTable = this.getSmartTable().getTable();
        var mItems = oTable.getItems();
        mItems.forEach(
          function (oItem) {
            if (oItem.getBindingContext().bCreated) {
              oTable.removeItem(oItem);
            }
          }.bind(this)
        );

        this.submitChanges({
          success: function () {
            MessageToast.show(this.i18n("SaveSuccess"));
            BusyIndicator.hide();
          }.bind(this),
          error: function () {
            MessageToast.show(this.i18n("SaveError"));
            BusyIndicator.hide();
          }.bind(this),
        });
      },


      onPressUpdateToday: function(oEvent){
        debugger;

        this.getModel().callFunction("/GetCurrentDate", {
          method: "GET",
          // urlParameters: { SourceID: this.getStateProperty("/currentTab") },
          success: function (returnData) {
            if (returnData.GetCurrentDate.DateCurrent) {
              this.getView().byId("todayField").setDateValue(returnData.GetCurrentDate.DateCurrent)
            }
          }.bind(this),
          error: function (oData) {
          }.bind(this),
          refreshAfterChange: false,
        });
      }
    });
  }
);
