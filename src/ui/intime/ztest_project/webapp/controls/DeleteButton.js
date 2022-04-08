sap.ui.define([
    "sap/m/Button"
], function(Button) {
    "use strict";
    return Button.extend("intime.ztest_project.controls.DeleteButton", {
        metadata: {
            dnd: {
                droppable: true
            }
        },
        renderer: {}
    });
});