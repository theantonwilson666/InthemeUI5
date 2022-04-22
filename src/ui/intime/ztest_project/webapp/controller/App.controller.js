sap.ui.define([
        "jira/lib/BaseController",
        'sap/ui/core/Fragment',
        "sap/ui/model/json/JSONModel"

    ],
    function(BaseController, JSONModel) {
        "use strict";

        return BaseController.extend("intime.ztest_project.controller.App", {
            onInit: function() {
                // var oModel = new JSONModel(sap.ui.require.toUrl("sap/f/sample/GridListBasic/model/items.json"));
                // this.getView().setModel(oModel);
            },


        });
    });