sap.ui.define([
    "sap/f/GridListItem"
], function(GridListItem) {
    "use strict";
    return GridListItem.extend("intime.zissues_workspace.controls.GridListTask", {
        metadata: {
            dnd: {
                draggable: true
            }
        },
        renderer: {}
    });
});