sap.ui.define(
  [
    "intime/zpartners_registry/controller/App.controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/Button",
    "sap/ui/table/Row",
    "jira/lib/fiorielementslib/fioriBaseController",
  ],
  function (
    AppController,
    Fragment,
    MessageBox,
    Button,
    TableRow,
    fioriBaseController
  ) {
    "use strict";

    return AppController.extend("intime.zpartners_registry.controller.Detail", {
      buttonId: null,
      onInit: function () {
        this.getRouter()
          .getRoute("project")
          .attachPatternMatched(this._onRouteMatched, this);
        this.byId("projectSmartTable").attachBeforeRebindTable(function (
          oEvent
        ) {
          var oSorter = new sap.ui.model.Sorter("StageNo", true);
          oEvent.getParameter("bindingParams").sorter.push(oSorter);
        });
      },

      _onRouteMatched: function (oEvent) {
        var oArr = oEvent.getParameter("arguments")["?query"];
        this.getView().bindObject(`/ZSNN_PARTNER_ROOT('${oArr.PartnerId}')`);
        this.setFaviconIconByPartner(oArr.PartnerId);
        this.setStateProperty("/projectSelection", false);
        this.setStateProperty("/stageSelection", false);

        // this.getView().getModel().setDeferredGroups(["changes"])
      },

      onSelectRow: function (oEvent) {
        
        this._selectedRowContext = oEvent.getParameter("rowContext");
        var oRowData = this._selectedRowContext.getObject();

        console.log('Created:');
        console.log(this._selectedRowContext.bCreated);
        console.log(this._selectedRowContext.getObject());

        debugger;

        this.bindSections({
          ID: oRowData.ID,
        });

        //Проект
        if (oRowData.HierLevel === 0) {
          this.setProjectSelection();

          //Этап
        } else if (oRowData.HierLevel === 1) {
          this.setStageSelection();
        }

        this.refreshAdminSection();
        this.setStateProperty("/editProjectMode", false);
      },

      onDeleteSelection: function (oEvent) {
        sap.m.MessageBox.warning(
          `Вы уверены, что хотите удалить ${
            this._selectedRowContext.getObject().Name
          }`,
          {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            onClose: function (sAction) {
              switch (sAction) {
                case MessageBox.Action.OK:
                  this.getModel().remove(this._selectedRowContext.getPath());

                  break;
                case MessageBox.Action.CANCEL:
                  sap.m.MessageToast.show("Операция отменена");
                default:
                  break;
              }
            }.bind(this),
          }
        );
      },

      onEditProject: function (oEvent) {
        var bEdit = oEvent.getParameter("editable");

        if (bEdit) {
        } else {
        }
      },

      refreshAdminSection: function () {
        var oTable = this.byId("_ProjectAdmins-Table");

        var oTemplate = new sap.m.ColumnListItem({
          vAlign: "Middle",
          cells: [
            new sap.ui.comp.smartfield.SmartField({
              value: "{UserName}",
              editable: "{state>/editProjectMode}",
              configuration: new sap.ui.comp.smartfield.Configuration({
                displayBehaviour: "descriptionAndId",
              }),
            }),

            new sap.ui.comp.smartfield.SmartField({
              value: "{Role}",
              editable: "{state>/editProjectMode}",
              configuration: new sap.ui.comp.smartfield.Configuration({
                controlType: "dropDownList",
              }),
            }),
            // .bindProperty('editable', {
            //     path: 'state>/editProjectMode'
            // })
          ],
        });

        oTable.bindItems("to_Admins", oTemplate);
      },

      onDeleteAdminPress: function (oEvent) {
        var oDeletedContext = oEvent
          .getParameter("listItem")
          .getBindingContext();
        this.byId("_ProjectAdmins-Table").setBusy(true);
        this.getModel().remove(oDeletedContext.getPath(), {
          success: function (oData) {
            this.byId("_ProjectAdmins-Table").setBusy(false);
          }.bind(this),
          error: function (oError) {
            this.byId("_ProjectAdmins-Table").setBusy(false);
            this.showError(oError);
          }.bind(this),
        });
      },

      onAddAdminPress: function (oEvent) {
        var oProjectData = oEvent.getSource().getBindingContext().getObject();

        var oNewContext = this.getModel().createEntry(
          oEvent.getSource().getBindingContext().getPath() + "/to_Admins",
          {
            groupId: "changes",
            properties: {
              ID: oProjectData.ID,
              Type: oProjectData.HierLevel === 0 ? "project" : "stage",
            },
          }
        );

        var oItem = oEvent
          .getSource()
          .getParent()
          .getParent()
          .getBindingInfo("items")
          .template.clone();
        oItem.setBindingContext(oNewContext);
        oEvent.getSource().getParent().getParent().insertItem(oItem, 0);
      },

      onEditAdminPress: function (oEvent) {
        this.setStateProperty(
          "/editProjectMode",
          !this.getStateProperty("/editProjectMode")
        );
        oEvent
          .getSource()
          .getParent()
          .getParent()
          .setMode(
            this.getStateProperty("/editProjectMode") === true
              ? "Delete"
              : "None"
          );
      },

      bindSections: function (oKey) {
        var aItems = this.byId("iconTabBar").getItems();
        for (var i = 0; i < aItems.length; i++) {
          var oItem = aItems[i];
          oItem.unbindObject();
          oItem.bindObject(`/ZSNN_INT_PROJECT('${oKey.ID}')`);
        }
      },

      setProjectSelection: function () {
        this.setStateProperty("/projectSelection", true);
        this.setStateProperty("/stageSelection", false);
        
        if (
          !this.byId("projectTab").getContent()[0].getBindingContext().bCreated
        ) {
          this.byId("ProjectChangeDocumentSmartTable").rebindTable();
        }
      },

      setStageSelection: function () {
        this.setStateProperty("/projectSelection", false);
        this.setStateProperty("/stageSelection", true);

        if (
          !this.byId("stageTab").getBindingContext().bCreated
        ) {
          this.byId("stageChangeDocumentSmartTable").rebindTable();
          this.byId("_JiraGroup-SmartFormGroup").setVisible(true);
        } else {
          this.byId("_JiraGroup-SmartFormGroup").setVisible(false);
        }

      },

      isSelected: function (ID) {
        this.buttonId = `${ID}`;
      },

      onDeletePartnerButtonPress: function (oEvent) {
        this.deletePartner(oEvent.getSource().getBindingContext());
      },

      onSaveProjectButtonPress: function (oEvent) {
        this.setStateProperty("/projectSelection", false);
        this.setStateProperty("/stageSelection", false);

        this.byId("projectPage").setBusy(true);

        this.submitChanges({
          groupId: "changes",
          success: function () {
            this.byId("projectPage").setBusy(false);

            if (!this.isExistError()) {
            }
          }.bind(this),
          error: function (oError) {
            this.byId("projectPage").setBusy(false);
            // this.byId("projectForm").updateBindings(true);
            // this.byId("stageForm").updateBindings(true);
            this.showError(oError);
          }.bind(this),
        });
      },

      onRejectButtonPress: function () {
        this.getView().getModel().resetChanges();
        this.setStateProperty("/editProjectMode", false);
      },

      onAddNewProjectButtonPress: function (oEvent) {
        debugger;

        this.getView().getModel().resetChanges();

        this.getModel().callFunction("/GetCreatedProject", {
          method: "POST",
          urlParameters: {
            PartnerID: this.getView().getBindingContext().getObject().PartnerId,
          },

          success: function (oData) {
            this.isExistError();

            var oNewEntryContext = this.getView()
              .getModel()
              .createEntry(this.getBindingPath() + "/to_Project", {
                properties: oData,
                groupId: "changes",
              });

            this.byId("projectTab")
              .getContent()[0]
              .setBindingContext(oNewEntryContext);

            this.setProjectSelection();

            this.setStateProperty("/editProjectMode", true);

            this.byId("projectForm").focus();
          }.bind(this),

          error: function (oError) {
            this.showError(oError);
          }.bind(this),
        });
      },

      onPressSyncJiraStageButtonPress: function (oEvent) {
        this.getView().setBusy(true);

        this.getModel().callFunction("/SyncJiraStage", {
          method: "POST",
          urlParameters: {
            StageID: oEvent.getSource().getBindingContext().getObject()
              .ProjectStageID,
          },

          success: function (oData) {
            this.getView().setBusy(false);
            this.isExistError();
          }.bind(this),

          error: function (oError) {
            this.getView().setBusy(false);
            this.showError(oError);
          }.bind(this),
        });
      },

      onAddNewProjectStageButtonPress: function (oEvent) {
        this.getModel().callFunction("/GetCreatedProjectStage", {
          method: "POST",
          urlParameters: {
            ProjectID: this._selectedRowContext.getObject().ID
          },

          success: function (oData) {
            this.isExistError();
            var oNewEntryContext = this.getView()
              .getModel()
              .createEntry(this.getBindingPath() + "/to_Project", {
                properties: oData,
                groupId: "changes",
              });

            this.byId("stageTab").unbindObject();
            this.byId("stageTab").setBindingContext(oNewEntryContext);

            this.setStageSelection();
            this.setStateProperty("/editProjectMode", true);
            this.byId("stageForm").focus();
          }.bind(this),

          error: function (oError) {
            this.showError(oError);
          }.bind(this),
        });
      },

      getSmartTable: function () {
        return this.byId("projectSmartTable");
      },

      onDocumentNavigate: function (oEvent) {
        var oLinkData = oEvent.getSource().getBindingContext().getObject();

        var oCrossAppNav = sap.ushell.Container.getService(
          "CrossApplicationNavigation"
        );

        var sLinkForWinow = oCrossAppNav.hrefForExternal({
          target: { semanticObject: "zissues_workspace", action: "display" },
          params: {
            PartnerId: oLinkData.PartnerId,
            PartnerName: oLinkData.PartnerName,
          },
        });
        window.open(sLinkForWinow, true);
      },

      onCreateJiraProjectButtonPress: function (oEvent) {
        this.getView().setBusy(true);

        this.getModel().callFunction("/CreateJiraProject", {
          method: "POST",
          urlParameters: {
            JiraStage: oEvent.getSource().getBindingContext().getObject()
              .JiraProjectStage,
            StageID: oEvent.getSource().getBindingContext().getObject()
              .ProjectStageID,
            JiraProjectID: oEvent.getSource().getBindingContext().getObject()
              .JiraProjectID,
          },

          success: function (oData) {
            this.getView().setBusy(false);
            this.isExistError();

            this.getModel().setProperty(
              this.byId("stageForm").getBindingContext().getPath() +
                "/JiraProjectID",
              oData.CreateJiraProject.JiraProjectID
            );
            this.getModel().setProperty(
              this.byId("stageForm").getBindingContext().getPath() +
                "/JiraProjectName",
              oData.CreateJiraProject.JiraProjectName
            );
            this.getModel().setProperty(
              this.byId("stageForm").getBindingContext().getPath() +
                "/JiraProjectStage",
              oData.CreateJiraProject.JiraProjectStage
            );
          }.bind(this),

          error: function (oError) {
            this.getView().setBusy(false);
            this.showError(oError);
            this.byId("stageForm").updateBindings(true);
          }.bind(this),
        });
      },

      onErrorAttachment: function (oEvent) {
        this.showError(oEvent.mParameters);
      },
    });
  }
);
