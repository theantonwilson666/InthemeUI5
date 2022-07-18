sap.ui.controller("znotif_reg.ext.controller.ObjectPageExt", {

    _TextEditorModel: null,

    onInit: function () {
        this.extensionAPI.attachPageDataLoaded(this.pageDataLoaded.bind(this))
    },

    pageDataLoaded: function () {
        
        debugger;

        var sPath = this.getView().getBindingContext().getPath() + "/to_HtmlTemplate";
        this.byId('RtePanel').bindElement(sPath);//getRTE().bindElement(sPath)
        // this._TextEditorModel = new sap.ui.model.json.JSONModel();
        // this.byId('_TemplateEditor').setModel(this._TextEditorModel, "textEditor");
    },

    getRTE: function () {
        
        debugger;

        return this.byId('RteContainer').getItems()[0];
    },

    getRTEApi: function () {
        return this.getRTE().getNativeApi();
    },

    execCommand: function (sCommand, sParams) {
        this.getRTEApi().execCommand(sCommand, false, sParams);
    },

    onParamButtonPress: function () {
        this.execCommand('mceInsertContent', 'My new content');
    }


});