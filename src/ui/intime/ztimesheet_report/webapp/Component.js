sap.ui.loader.config({
    paths: {
        "fa/lib": "/sap/bc/ui5_ui5/sap/zfalib"
    }
});

sap.ui.define(['sap/suite/ui/generic/template/lib/AppComponent'], function (AppComponent) {
    return AppComponent.extend("intime.ts_report.Component", {
        metadata: {
            manifest: "json"
        }
    });
});