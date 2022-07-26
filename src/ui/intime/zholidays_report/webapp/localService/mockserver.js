sap.ui.define(['sap/ui/core/util/MockServer', 'sap/base/util/UriParameters'], function (MockServer, UriParameters) {
    'use strict';
    var oMockServer,
        _sAppModulePath = 'course.lessonsOne/',
        _sJsonFilesModulePath = _sAppModulePath + 'localService/mockdata';

    return {
        /**
         * Initializes the mock server.
         * You can configure the delay with the URL parameter "serverDelay".
         * The local mock data in this folder is returned instead of the real data for testing.
         * @public
         */

        init: function () {
            // create
            var oMockServer = new MockServer({
                rootUri: "/sap/opu/odata/sap/ZINT_UI_HOLIDAYS_SRV/"
            });

            var oUriParameters = new UriParameters(window.location.href);

            // configure mock server with a delay
            MockServer.config({
                autoRespond: true,
                autoRespondAfter: oUriParameters.get("serverDelay") || 500
            });

            // simulate
            var sPath = sap.ui.require.toUrl("intime/zholiday_report/localService");
            oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mockdata");

            // start
            oMockServer.start();
        },

        /**
         * @public returns the mockserver of the app, should be used in integration tests
         * @returns {sap.ui.core.util.MockServer}
         */
        getMockServer: function () {
            return oMockServer;
        }
    };
});
