sap.ui.define([
    "sap/f/GridListItem"
], function (GridListItem) {
    "use strict";
    return GridListItem.extend("intime.zissues_workspace.controls.GridListStatus", {
        metadata: {
            dnd: {
                droppable: true
            }
        },
        renderer: {}
    });
});