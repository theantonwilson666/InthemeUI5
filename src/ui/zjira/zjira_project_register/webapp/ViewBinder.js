sap.ui.define([
    "sap/ui/base/Object",
    "intheme/zjira_project_register/ODataModelUtils"
], function (Object, ODataModelUtils) {

    return Object.extend("intheme.zjira_project_register.ViewBinder", {

        _view: null,
        _model: null,

        dataAlreadyLoaded: false,

        setView: function (oView) {
            this._view = oView;
        },

        setModel: function (oModel) {
            this._model = oModel;
        },

        getView: function () {
            return this._view;
        },

        getModel: function () {
            return this._model;
        },

        /**
        * Utility function for binding view against OData entity
        * 
        * @param {object}  mParameters map of parameters
        * @param {string}  mParameters.entitySet path to entity set
        * @param {string}  mParameters.keyParameters map of key parameters for the given entity 
        * @param {array}   mParameters.expand array of navigation properties to expand
        * @param {boolean} mParameters.dontShowBusy prevents busy indication for view while data is retrieving from OData service
        * 
        * @returns {Promise} promised entity data
        */
        bind: function (mParameters) {
            var oBindingParameters = this.createBindingParameters(mParameters);
            return this.getModel().metadataLoaded().then(function () {
                var sPath = this.createEntityPath(mParameters);
                return new Promise(function (resolve, reject) {
                    this.handleBusyIndication(mParameters);
                    this.dataAlreadyLoaded = true;
                    this.getView().bindElement({
                        path: sPath,
                        parameters: oBindingParameters,
                        events: this.createBindingEventHandlers(resolve, reject, mParameters.dontShowBusy)
                    });
                    /**
                     * If data was already loaded into a ODataModel then no callbacks (dataRequested, dataRecevied)
                     * will be invoked. Hence we have to determine weather or not request was actually sent by using
                     * flag 'dataAlreadyLoaded'. In case if remote request is sent 'dataRequested' callback invokes 
                     * immediately. So the flag is maintained correctly.
                     */
                    if (this.dataAlreadyLoaded) {
                        resolve(ODataModelUtils.retrieveAlreadyLoadedData({
                            model: this.getModel(),
                            path: sPath,
                            expand: mParameters.expand
                        }));
                    }
                }.bind(this))
                .then(function (oResponse) {
                    this.getView().setBusy(false);
                    return Promise.resolve(oResponse);
                }.bind(this))
                .catch(function (oErr) {
                    this.getView().setBusy(false);
                    throw oErr;
                }.bind(this));
            }.bind(this));     
        },

        refreshBinding: function () {
            return new Promise(function (resolve, reject) {
                this.handleBusyIndication({});
                var oElementBinding = this.getView().getElementBinding();
                var fnDataReceivedHandler = this.createDataRecievedHandler({
                    success: resolve,
                    error: reject
                });
                oElementBinding.attachEventOnce("dataReceived", fnDataReceivedHandler);
                oElementBinding.refresh(true);
            }.bind(this))
            .then(function (oData) {
                this.getView().setBusy(false);
                return Promise.resolve(oData);
            }.bind(this))
            .catch(function (oErr) {
                this.getView().setBusy(false);
                throw oErr;
            }.bind(this));
        },

        createBindingParameters: function (mParameters) {
            var oBindingParameters = {};
            this.appendExpand(oBindingParameters, mParameters);
            this.appendSelect(oBindingParameters, mParameters);
            return oBindingParameters;
        },

        appendExpand: function (oBindingParameters, mParameters) {
            var aExpand = mParameters.expand;
            if (Array.isArray(aExpand) && aExpand.length > 0) {
                oBindingParameters.expand = aExpand.join(",");
            }
        },

        appendSelect: function (oBindingParameters, mParameters) {
            var aSelect = mParameters.select;
            if (Array.isArray(aSelect) && aSelect.length > 0) {
                oBindingParameters.select = aSelect.join(",");
            }
        },

        createEntityPath: function (mParameters) {
            var oDataModel = this.getModel();
            var sEntitySet = mParameters.entitySet;
            var mKeyParameters = mParameters.keyParameters;
            return oDataModel.createKey(sEntitySet, mKeyParameters);
        },

        createBindingEventHandlers: function (fnSuccessHandler, fnErrorHandler, bDontShowBusy) {
            return {
                dataReceived: this.createDataRecievedHandler({
                    success: fnSuccessHandler,
                    error: fnErrorHandler
                }),
                dataRequested: this.createDataRequestedHandler(bDontShowBusy)
            };
        },

        createDataRecievedHandler: function (mParameters) {
            var that = this;
            return function (oEvent) {
                var oData = oEvent.getParameter("data");
                if (!oData) {
                    mParameters.error.call(that, oEvent);
                } else {
                    mParameters.success.call(that, oData);
                }
            };
        },

        createDataRequestedHandler: function () {
            var that = this;
            return function () {
                that.dataAlreadyLoaded = false;
            };
        },

        retrieveAlreadyLoadedData: function (sPath, aExpand) {
            var oDataModel = this.getModel();
            var oLoadedObject = oDataModel.getObject(sPath);
            if (!Array.isArray(aExpand)) {
                // eslint-disable-next-line no-param-reassign
                aExpand = [];
            }
            aExpand.forEach(function (sNavProp) {
                var aNestedObjectsPaths = oDataModel.getObject(sPath + "/" + sNavProp);
                oLoadedObject[sNavProp] = aNestedObjectsPaths.map(function (sNesteObjPath) {
                    return oDataModel.getObject("/" + sNesteObjPath);
                });
            }, {});
            return oLoadedObject;
        },

        handleBusyIndication: function (mParameters) {
            if (!mParameters.dontShowBusy) {
                this.getView().setBusy(true);
            }
        }

    });

});