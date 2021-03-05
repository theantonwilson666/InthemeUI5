sap.ui.define([], function () {

    return {

        retrieveAlreadyLoadedData: function (mParameters) {
            var oDataModel = mParameters.model;
            var sPath = mParameters.path;
            var aExpand = mParameters.expand;
            var oLoadedObject = oDataModel.getObject(sPath);
            if (!Array.isArray(aExpand)) {
                aExpand = [];
            }
            aExpand.forEach(function (sNavProp) {
                var aNestedObjectsPaths = oDataModel.getObject(sPath + "/" + sNavProp);
                if (aNestedObjectsPaths) {
                    if ($.isArray(aNestedObjectsPaths)) {
                        oLoadedObject[sNavProp] =  aNestedObjectsPaths.map(function (sNesteObjPath) {
                            return oDataModel.getObject("/" + sNesteObjPath);
                        });
                    } else {
                        oLoadedObject[sNavProp] = aNestedObjectsPaths;
                    }
                }
            }, {});
            oLoadedObject.isAlreadyLoaded = true;
            return oLoadedObject;
        }
    };

});