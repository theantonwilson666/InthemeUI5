sap.ui.define(["jira/lib/BaseController"], function (Controller) {
  "use strict";

  return Controller.extend("zorg_hierarchy.ProcessFlow", {
    onOrgDataRecieved: function (oEvent) {
      if (!this.getStateProperty("/pathHandle")) {
        this.rendering(oEvent.getParameters("data").data.results);
      }
    },

    rendering: function (oData) {
      var aNodes = this.getView().byId("processflow").getNodes();
      var i = 0;

      oData.forEach((oOrg) => {
        if (oOrg.ChildrenList) {
          var childrenArr = oOrg.ChildrenList.split(",");
          aNodes[i].setProperty("children", childrenArr);
          i++;
        }
      });

      this.setStateProperty("/pathHandle", true);
      this.getView().byId("processflow").updateModel();
    },

    onNodePress: function (oEvent) {
      var oDialogFragment = this.getDialog(
        "zorg_hierarchy.fragments.dialogWorkers"
      );
      oDialogFragment.open();
    },
    onDialogCancelPress: function (oEvent) {
      var oDialog = oEvent.getSource().getParent();
      oDialog.close();
    },

    onAddOrgButtonPress: function (oEvent) {
      this.loadDialog
        .call(this, {
          sDialogName: "_CreatedOrgDialog",
          sViewName: "zorg_hierarchy.fragments.createNewOrg",
        })
        .then(
          function (oDialog) {
            var oModel = this.getModel();
            var oNewOrg = oModel.createEntry("OrgHierarchySet");
            oDialog.setBindingContext(oNewOrg);
            oDialog.open();
          }.bind(this)
        );
    },

    getDialog: function (sDialogPath) {
      return sap.ui.xmlfragment(sDialogPath, this.getView().getController());
    },

    onCreateOrgSave: function (oEvent) {
      this.showBusyDialog();

      this.submitChanges({
        success: function () {
          if (!this.isExistError()) {
            this.closeBusyDialog();
          } else {
            this.closeBusyDialog();
          }
        }.bind(this),
        error: function (oError) {
          this.closeBusyDialog();
          this.showError(oError);
        }.bind(this),
      });
    },

    onDeleteOrgButtonPressed: function(oEvent){
      
    }
  });
});
