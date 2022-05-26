sap.ui.controller("intime.ts_report.ext.controller.ListReportExt", {
    onInit: function () {
        // this.byId("template::SmartFilterBar").setUseDateRangeType(true)


        this.byId("_DateSheet-Selection").setModel(this._getFilterModel(), "filter");

    },

    _getFilterModel: function () {
        var oToday = new Date();

        var iYear = oToday.getFullYear();
        var iMonth = oToday.getMonth();

        return new sap.ui.model.json.JSONModel({
            dateFirst: new Date(iYear, iMonth, 1),
            dateSecond: new Date(iYear, iMonth + 1, 0)
        })

    },


    onInitSmartFilterBarExtension: function (oEvent) {
        // the custom field in the filter bar might have to be bound to a custom data model
        // if a value change in the field shall trigger a follow up action, this method is the 
        // place to define and bind an event handler to the field
        // Example:
        var oSmartFilterBar = oEvent.getSource();

        // oSmartFilterBar.getControlByKey("DateSheet").attachSelectionChange(function (oChangeEvent) {
        //     //code
        // }, this);

        // debugger;

        // jQuery.sap.log.info("onInitSmartFilterBarExtension initialized");
    },

    onBeforeRebindTableExtension: function (oEvent) {
        // usually the value of the custom field should have an effect on the selected data in the table. 
        // So this is the place to add a binding parameter depending on the value in the custom field.

        var aFilters = oEvent.getParameter("bindingParams").filters;
        aFilters.push(this._getDateFilter())

    },
    onBeforeRebindChartExtension: function (oEvent) {
        // usually the value of the custom field should have an effect on the selected data in the chart. 
        // So this is the place to add a binding parameter depending on the value in the custom field.

        var aFilters = oEvent.getParameter("bindingParams").filters;
        aFilters.push(this._getDateFilter())

    },

    _getDateFilter: function () {
        var oDates = this.byId("_DateSheet-Selection").getModel("filter").getData();

        var oFirstDate = oDates.dateFirst;
        var oSecondDate = oDates.dateSecond;

        var fnDateConvert = function (oDate) {
            var iYear = oDate.getFullYear();
            var iMonth = oDate.getMonth();
            var iDate = oDate.getDate();
            return `${iYear}${(iMonth + 1).toString().padStart(2, "0")}${iDate.toString().padStart(2, "0")}`
        };

        debugger;

        return new sap.ui.model.Filter("DateSheet", "BT", fnDateConvert(oFirstDate), fnDateConvert(oSecondDate));
    },
});

