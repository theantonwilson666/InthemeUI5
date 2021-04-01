sap.ui.define(["jira/lib/BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend(
    "intheme.zjira_worker_register.controller.Main",
    {
      onInit: function () {},

      onBeforeBindingTab: function (oEvent) {
        var mBindingParams = oEvent.getParameter("bindingParams");
        mBindingParams.events = {
          dataRequested: function (oEvent) {
            this.setStateProperty(
              "/worker_filter",
              this.getView().byId("workerFilterBar").getFilterDataAsString()
            );
          }.bind(this),
        };
      },

      onViewWorker: function (oEvent) {
        var oTable = this.byId("workerSmartTable").getTable();
        var sPath = oTable.getSelectedItem().getBindingContext().getPath();
        this.loadDialog
          .call(this, {
            sDialogName: "_oClosedIssueDialog",
            sViewName:
              "intheme.zjira_worker_register.view.dialogs.ClosedIssue",
          })
          .then(
            function (oDialog) {
              oDialog.setBusy(true);
              oDialog.open();
              oDialog.bindElement({
                path: sPath + "/WorkerClosedIssues",
                parameters: {
                  custom: {
                    Filter: this.getStateProperty("/worker_filter")
                  }
                },
                events: {
                  dataReceived: function(oEvent) {
                    if (!oEvent.getParameter("data")) {
                      // this.showError();
                      oDialog.close();
                    } else {
                      oDialog.setBusy(false);
                    }
                  }.bind(this)
                }
              });
            }.bind(this)
          );
      },
    }
  );
});
