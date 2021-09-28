sap.ui.define(["jira/lib/BaseController"], function (Controller) {
  "use strict";

  var sIdNode;
  var sIdOrg;

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
      sIdNode = oEvent.getParameters().getNodeId();
      var oData = oEvent.getParameters().getModel().oData;
      Object.keys(oData).forEach((key) => {
        if (key.includes("OrgHierarchySet") && oData[key].NodeID === sIdNode) {
          sIdOrg = oData[key].OrgID;
        }
      });
      this.loadDialog
        .call(this, {
          sDialogName: "_ListEmployeesDialog",
          sViewName: "zorg_hierarchy.fragments.dialogWorkers",
        })
        .then(
          function (oDialog) {
            var oModel = this.getModel();
            var oNewOrg = oModel.createEntry("WorkerSHSet");
            oDialog.setBindingContext(oNewOrg);
            oDialog.open();
          }.bind(this)
        );
    },
    onDialogCancelPress: function (oEvent) {
      var oDialog = oEvent.getSource().getParent();
      oDialog.close();
    },
    onPressDelete: function () {
      var oTable = sap.ui.getCore().byId("__table0");
      var aSelectedItems = oTable.getSelectedItems();

      for (var i = 0; i < aSelectedItems.length; i++) {
        oTable.removeItem(aSelectedItems[i]);
      }
    },

    getDialog: function (sDialogPath) {
      return sap.ui.xmlfragment(sDialogPath, this.getView().getController());
    },

    onCreateOrgSave: function (oEvent) {
      this.showBusyDialog();
      var sParentBranchId = oEvent
        .getSource()
        .getParent()
        .mAggregations.content[0].getGroups()[0]
        .getFormElements()[0]
        .getElements()[0]
        .getContent()
        .getEnteredValue();
      var sNameNewBranch = oEvent
        .getSource()
        .getParent()
        .mAggregations.content[0].getGroups()[0]
        .getFormElements()[1]
        .getElements()[0]
        .getContent()
        .getValue();
      debugger;
      var sBranchType = oEvent
        .getSource()
        .getParent()
        .mAggregations.content[0].getGroups()[0]
        .getFormElements()[2]
        .getElements()[0]
        .getContent()
        .getValue();
      var oDialog = oEvent.getSource().getParent();
      this.getModel().callFunction("/CreateBranch", {
        method: "POST",
        urlParameters: {
          ParentBranch: sParentBranchId,
          BranchName: sNameNewBranch,
          BranchType: sBranchType,
        },
        success: function () {
          if (!this.isExistError()) {
            this.closeBusyDialog();
            oDialog.close();
          } else {
            this.closeBusyDialog();
          }
        }.bind(this),
        error: function (oError) {
          console.log("error");
        }.bind(this),
      });

      this.getView().byId("processflow").updateModel();

      // this.submitChanges({
      //   success: function () {
      //     if (!this.isExistError()) {
      //       this.closeBusyDialog();
      //     } else {
      //       this.closeBusyDialog();
      //     }
      //   }.bind(this),
      //   error: function (oError) {
      //     this.closeBusyDialog();
      //     this.showError(oError);
      //   }.bind(this),
      // });
    },

    onDeleteOrgButtonPressed: function (oEvent) {
      var oDialog = oEvent.getSource().getParent();
      this.getModel().callFunction("/DeleteBranch", {
        method: "POST",
        urlParameters: {
          BranchId: sIdOrg,
        },
        success: function () {
          if (!this.isExistError()) {
            console.log("окно удаления закрыто");
            oDialog.close();
            this.closeBusyDialog();
          } else {
            this.closeBusyDialog();
          }
        }.bind(this),
        error: function (oError) {
          console.log("error");
        }.bind(this),
      });
    },
    onAddEmployeeOrgButtonPressed: function () {
      var oDialog = oEvent.getSource().getParent();
      sIdNode = +sIdNode + 1;
      sIdNode = "000" + sIdNode;
      this.getModel().callFunction("/AssignWorkerToBranch", {
        method: "POST",
        urlParameters: {
          BranchId: sIdNode,
          WorkerId: 1,
        },
        success: function () {
          if (!this.isExistError()) {
            console.log("окно закрыто");
            oDialog.close();
            this.closeBusyDialog();
          } else {
            this.closeBusyDialog();
          }
        }.bind(this),
        error: function (oError) {
          console.log("error");
        }.bind(this),
      });
    },

    onAddEmployeesButtonPress: function () {
      this.loadDialog
        .call(this, {
          sDialogName: "_AddEmployeesDialog",
          sViewName: "zorg_hierarchy.fragments.dialogAddEmployees",
        })
        .then(
          function (oDialog) {
            var oModel = this.getModel();
            var oNewOrg = oModel.createEntry("WorkerAdd");
            oDialog.setBindingContext(oNewOrg);
            oDialog.open();
          }.bind(this)
        );
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
    onDeleteSelectRow: function (oEvent) {
      var oTable = sap.ui.getCore().byId("__table0");
      var aSelectedItems = oTable.getSelectedItems();

      for (var i = 0; i < aSelectedItems.length; i++) {
        oTable.removeItem(aSelectedItems[i]);
      }
    },
    onDetailOrgButtonPress: function () {
      this.loadDialog
        .call(this, {
          sDialogName: "_DetailDialog",
          sViewName: "zorg_hierarchy.fragments.dialogDetail",
        })
        .then(
          function (oDialog) {
            var oModel = this.getModel();
            var oNewOrg = oModel.createEntry("WorkerSHSet");
            oDialog.setBindingContext(oNewOrg);
            oDialog.open();
          }.bind(this)
        );
    },
    onChangePlace: function (oEvent) {
      this.loadDialog
        .call(this, {
          sDialogName: "_ChangeDialog",
          sViewName: "zorg_hierarchy.fragments.dialogСhange",
        })
        .then(
          function (oDialog) {
            var oModel = this.getModel();
            var oNewOrg = oModel.createEntry("WorkerSHSet");
            oDialog.setBindingContext(oNewOrg);
            oDialog.open();
          }.bind(this)
        );
      oEvent.getSource().getParent().getParent().getSelectedContextPaths();
    },
  });
});
