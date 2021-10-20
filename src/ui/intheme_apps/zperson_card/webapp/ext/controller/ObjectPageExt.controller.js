$.sap.require("jira/lib/fiorielementslib/fioriBaseController");
var fioriBaseController = sap.ui.require(
  "jira/lib/fiorielementslib/fioriBaseController"
);




sap.ui.controller("zperson_card.ext.controller.ObjectPageExt", {
  onInit: function () {
    if (this.extensionAPI.getViewId() == 'zperson_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_PERSON_ROOT') {
      this.uiExtensions();
    }
  },

  uiExtensions: function () {
    this.uiExtensionAddUploader();
  },

  uiExtensionAddUploader: function () {
    var sExcelButtonText = fioriBaseController.getTextFromI18n(
      this,
      "ImageUpload"
    );
    var oObjectPageHeader = this.byId("objectPageHeader");
    var oUpload = new sap.ui.unified.FileUploader({
      buttonOnly: true,
      id: "fileUploader",
      style: "Emphasized",
      name: "myFileUpload",
      buttonText: sExcelButtonText,
      fileType: "png",
      change: this.onUploadFile.bind(this),
      visible: {
        path: "ui>/editable",
      },
    });

    oObjectPageHeader.insertAction(oUpload, 0);
  },

  onUploadFile: function (oEvent) {
    this.getFileContent(oEvent);
  },

  getFileContent: function (oEvent) {
    return new Promise(
      function (res, rej) {
        var oFile = oEvent.getSource().getFocusDomRef().files[0];
        if (oFile) {
          var oReader = new FileReader();
          oReader.onload = function (e) {
            var vContent = e.currentTarget.result.replace(
              "data:" + oFile.type + ";base64,",
              ""
            );
            
            this.callLoadFileAction(vContent);
          }.bind(this);

          oReader.readAsDataURL(oFile);
        }
      }.bind(this)
    );
  },

  

});
