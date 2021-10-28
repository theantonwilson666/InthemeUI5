sap.ui.loader.config({
    paths: {
        "jira/lib": "/sap/bc/ui5_ui5/sap/zjiralib"
    }
});

sap.ui.define(['sap/suite/ui/generic/template/lib/AppComponent'], function (AppComponent) {
    return AppComponent.extend("zperson_card.Component", {
        metadata: {
            manifest: "json"
        }
    });
});