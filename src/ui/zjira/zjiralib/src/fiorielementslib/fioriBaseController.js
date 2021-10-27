sap.ui.define([], function () {
    'use strict';

    return {
        init: function () { },

        getModel: function (that, sName) {
            return that.getOwnerComponent().getModel(sName);
        },

        getTextFromI18n: function (that, sTranslatableText, mParameters) {
            var oThatResourceBundle = this.getModel(that, 'i18n').getResourceBundle();
            if (mParameters) {
                return oThatResourceBundle.getText(sTranslatableText, mParameters);
            } else {
                return oThatResourceBundle.getText(sTranslatableText);
            }
        },
        getStateProperty: function (that, sPath) {
            return this.getModel(that, 'state').getProperty(sPath);
        },
        setStateProperty: function (that, sPath, oValue, oContext, bAsyncUpdate) {
            return this.getModel(that, 'state').setProperty(
                sPath,
                oValue,
                oContext,
                bAsyncUpdate
            );
        },
        uiExtensionInvokeAction: function (that, sFunctionName, oContext, mParameters, fnSuccess, fnError) {
            // that          = параметр, определяющий контроллер, для которого выполняется действие
            // sFunctionName = параметр, определяющий название функционального импорта (Function Import)
            //                  пример: 'FunctionImport'
            // oContext      = параметр, определяющий контекст, для которого выполняется действие
            // mParameters?  = параметр, определяющий структуру параметров, которые нужны для функционального импорта (Function Import)
            // fnSuccess?    = параметр, определяющий функцию, которая должна выполняться при успешном выполнении функционального импорта (Function Import)
            // fnError?      = параметр, определяющий функцию, которая должна выполняться при ошибке в выполнении функционального импорта (Function Import)

            var bSuccessIsFn = typeof fnSuccess === typeof Function;
            var bErrorIsFn = typeof fnError === typeof Function;
            var sFunctionImportFullName = this.getFunctionFullName(that, sFunctionName);
            if (bSuccessIsFn && bErrorIsFn) {
                that.extensionAPI.invokeActions(sFunctionImportFullName, oContext, mParameters)
                    .then(fnSuccess.bind(that))
                    .catch(fnError.bind(that));
            } else if (!bSuccessIsFn && !bErrorIsFn) {
                that.extensionAPI.invokeActions(sFunctionImportFullName, oContext, mParameters);
            } else if (bSuccessIsFn) {
                that.extensionAPI.invokeActions(sFunctionImportFullName, oContext, mParameters)
                    .then(fnSuccess.bind(that));
            } else if (bErrorIsFn) {
                that.extensionAPI.invokeActions(sFunctionImportFullName, oContext, mParameters)
                    .catch(fnError.bind(that));
            }
        },
        getFunctionFullName: function (that, sFunctionName) {
            // that          = параметр, определяющий контроллер, для которого выполняется действие
            // sFunctionName = параметр, определяющий название функционального импорта (Function Import)
            //                  пример: 'FunctionImport'

            var oServiceMetadataSchema = this.getModel(that).getServiceMetadata().dataServices.schema[0];
            var sService = oServiceMetadataSchema.namespace;
            var sEntityContainer = oServiceMetadataSchema.entityContainer[0].name;
            return sService + '.' + sEntityContainer + "/" + sFunctionName;

        },

        setTableColumnsWidth: function (that, sSmartTableId, sCSSWidth) {
            var oSmartTable = that.byId(sSmartTableId);
            if(oSmartTable) {
                var sTableColumnsLength = oSmartTable.getTable().getColumns().length;
                for (var i = 0; i < sTableColumnsLength; i++) {
                    oSmartTable.getTable().getColumns()[i].setWidth(sCSSWidth);
                }
            }
        },

        toggleFilterVisibleByName: function (that, aFiltersName, bVisible) {
            var oFilterBar = that.getSmartFilterBar();
            aFiltersName.forEach(sFilterName => {
                var oFilter = oFilterBar._getFilterItemByName(sFilterName);
                oFilter.setVisible(bVisible);
            });
        },
    }
})