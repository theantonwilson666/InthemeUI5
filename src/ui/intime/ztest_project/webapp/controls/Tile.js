sap.ui.define([
    "sap/m/GenericTile"
], function(GenericTile) {
    "use strict";
    return GenericTile.extend("intime.ztest_project.controls.Tile", {
        metadata: {
            dnd: {
                draggable: true
            }
        },
        renderer: {}
    });
});