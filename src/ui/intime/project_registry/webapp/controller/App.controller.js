sap.ui.define([
        "sap/ui/core/mvc/Controller"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function(Controller) {
        "use strict";

        return Controller.extend("intime.zproject_registry.controller.App", {
            onInit: function() {},

            /*Транспортные зоны*/
            /*Просмотр*/
            onPressGoToTranspZone: function() {
                var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");

                var sLinkForwWindow = oCrossAppNav.hrefForExternal({
                    target: { semanticObject: "ztransp_zone", action: "display" }
                });

                window.open(sLinkForwWindow, true);
            },
            /*Стандартные маршруты*/
            /*Просмотр*/
            onPressStandardRoutesView: function() {
                var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");

                var sLinkForwWindow = oCrossAppNav.hrefForExternal({
                    target: { semanticObject: "RouteSchedule", action: "display" }
                });

                window.open(sLinkForwWindow, true);
            },
            /*Местоположение*/
            /*Просмотр*/
            onPressGoToLocation: function() {
                var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");

                var sLinkForwWindow = oCrossAppNav.hrefForExternal({
                    target: { semanticObject: "ztransp_loc", action: "display" }
                });

                window.open(sLinkForwWindow, true);
            },
            /*Транспю отношен*/
            /*Просмотр*/
            onPressGoToTranspLane: function() {
                var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");

                /*var sLinkForwWindow = oCrossAppNav.hrefForExternal({
                    target: { semanticObject: "ztransp_loc", action: "display" }
                });*/
                var sLinkForwWindow = "https://csrvapsaptmd.int.corp.phosagro.ru:8443/sap/bc/adt/businessservices/odatav2/feap?feapParams=nhasDDJIsi%5DshfUbgs%60UbY77h%C2%86u%C2%82%C2%87%60u%C2%82y77%C2%88%C2%83sh%C2%80u%C2%82yW%C2%83%C2%87%C2%88TT%C2%88%C2%83sh%C2%86%60u%C2%82y%5By%C2%82TT%C2%88%C2%83sh%C2%86%C2%81Wu%C2%86%C2%8677h%C2%80u%C2%82yW%C2%83%C2%87%C2%88TTh%C2%86u%C2%82%C2%87%60u%C2%82y%5By%C2%82TTh%C2%86%C2%81Wu%C2%86%C2%8677nhasDDJIsi%5DshfUbgs%60UbYsjUb77DDDE&sap-ui-language=RU&sap-client=150#/?sap-iapp-state--history=1&sap-iapp-state=2";

                window.open(sLinkForwWindow, true);
            },
            /*Вспомогательные справочники*/
            onLinkPress: function(oEvent) {
                var oLinkData = oEvent.getSource().getBindingContext().getObject();

                var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");

                var sLinkForwWindow = oCrossAppNav.hrefForExternal({
                    target: { semanticObject: "ZSM_30", action: "display" },
                    params: {
                        ViewName: oLinkData.ViewName
                    }
                });

                window.open(sLinkForwWindow, true);

            },

        });
    });
