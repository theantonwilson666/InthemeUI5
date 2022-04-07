sap.ui.define([
    "sap/m/GenericTile"
], function(GenericTile) {
    "use strict";
    return GenericTile.extend("intime.zpartners_registry.controls.Tile", {
        metadata: {
            dnd: {
                draggable: true
            }
        },
        renderer: {}
    });
});