

sap.ui.controller("intime.zusers_list.ext.controller.ObjectPageExt", {

  _UserObjectPageId: 'intime.zusers_list::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSNN_INTIME_USER',

  onInit: function () {

    
    if (this.getView().getId() === this._UserObjectPageId) {
      this.uiExtension();
    }

  },

  uiExtension: function () {
    this.addPhotoLoader();
  },

  addPhotoLoader: function () {
    var oObjectPageHeader = this.byId("objectPageHeader");
    var oUpload = new sap.ui.unified.FileUploader({
      buttonOnly: true,
      id: "_UserPhoto-FileUploader",
      style: "Emphasized",
      name: "myFileUpload",
      buttonText: 'Загрузить фотографию',
      fileType: "jpg,png,jpeg,ico",
      change: this.onUploadFile.bind(this)
    });

    oObjectPageHeader.insertAction(oUpload, 0);;
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

            debugger;

            this.getView().setBusy(true);

            this.getView().getModel().createEntry("/UserPhotoSet", {
              properties: {
                UserID: this.getView().getBindingContext().getObject().UserID,
                Content: vContent,
                FilePath: oFile.name
              },

              success: function (oData) {
                this.getView().setBusy(false);
                this.extensionAPI.refresh();
                this.clearFileUploader();

              }.bind(this),

              error: function () {
                this.getView().setBusy(false);
                this.clearFileUploader();

                debugger;

              }.bind(this)
            });



            // this.callLoadFileAction(vContent);
          }.bind(this);

          oReader.readAsDataURL(oFile);
        }
      }.bind(this)
    );
  },

  clearFileUploader: function () {
    this.getView().getContent()[0].getHeaderTitle().getActions()[0].clear();
  }

});
