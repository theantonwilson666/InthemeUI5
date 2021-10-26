// $.sap.require("jira/lib/fiorielementslib/fioriBaseController");
// var fioriBaseController = sap.ui.require(
//   "jira/lib/fiorielementslib/fioriBaseController"
// );




sap.ui.controller("zperson_card.ext.controller.ObjectPageExt", {
  onInit: function () {
    if (this.getView().sId == 'zperson_card::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_PERSON_ROOT') {

      this.uiExtensions();
    }
    else{
      debugger
    }
  
  
  },

  uiExtensions:function(){
    this.ImageUploader();
  },

  ImageUploader:function(){
  var oObjectPageHeader = this.byId("objectPageHeader");
  var oUpload = new sap.ui.unified.FileUploader({
    buttonOnly: true,
      id: "fileUploader",
      style: "Emphasized",
      name: "myFileUpload",
      mimeType:'image',
      buttonText: "ImageUpload",
      fileType: "png.jpeg,jpg,RAW,SVG,WebP",
      change: this.onUploadFile.bind(this),
      visible: {
        path: "ui>/editable",
      },
    });
    
    debugger
    oObjectPageHeader.insertAction(oUpload, 0);
  },
  

  onUploadFile: function (oEvent) {
    debugger
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
            var DbKey = this.getView().getBindingContext().getObject()['DbKey'];
            var mimeType = 'image'
            debugger
            this.getOwnerComponent().getModel().
            create('/PersonImageSet',{PersonKey:DbKey, Image:vContent, MimeType:mimeType})
            // this.callLoadFileAction(vContent);
          }.bind(this);

          oReader.readAsDataURL(oFile);
        }
      }.bind(this)
      
    );
  },

  

});
