sap.ui.define([
    "intheme/zjira_workers_grade/localService/mockserver"
], function (mockserver) {
    "use strict";

    mockserver.init()

    sap.ui.require(["sap/ui/core/ComponentSupport"])
});