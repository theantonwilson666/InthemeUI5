sap.ui.define([], function () {
    return {
      createToolArea: function (oRender) {
        that = this;
        that.oRender = oRender;
  
        sap.ushell.Container.getServiceAsync("LaunchPage").then(
          function (LaunchPage) {
            LaunchPage.getCatalogs().done(function (aCatalogs) {
              aCatalogs.forEach(function (oCatalog) {
                oCatalog.tiles.forEach(function (oTile) {
                  if (oTile.getChip().isStub()) {
                    oTile.getChip().load(
                      function () {
                        that.addTile(this);
                      }.bind(oTile)
                    );
                  } else {
                    that.addTile(oTile);
                  }
                });
              });
            });
          }.bind(that)
        );
  
        this.showToolArea(oRender);
      },
  
      addTile: function (oTile) {
        var sTitle = oTile
          .getChip()
          .getBag("tileProperties")
          .getText("display_title_text");
        var oConf = JSON.parse(
          oTile.getConfigurationParameter("tileConfiguration")
        );
  
        that.oRender.addToolAreaItem(
          {
            id:
              oConf.navigation_semantic_object +
              "-" +
              oConf.navigation_semantic_action,
            text: sTitle,
            icon: oConf.display_icon_url,
            layoutData: new sap.ui.layout.FixFlex({
              fixContentSize : 10
            }),
            press: function (oEvent) {
              debugger;
              that.goToApp(
                oConf.navigation_semantic_object,
                oConf.navigation_semantic_action
              );
            },
          },
          true,
          false,
          ["app", "home"]
        );
      },
  
      showToolArea: function (oRenderer) {
        oRenderer.showToolArea("app", true);
        oRenderer.showToolArea("home", true);
        oRenderer.showToolAreaItem("testButton", false, ["home", "app"]);
      },
  
      goToApp(sSemanticObj, sAction) {
        var oCrossAppNavigator = sap.ushell.Container.getService(
          "CrossApplicationNavigation"
        );
  
        var sHash =
          (oCrossAppNavigator &&
            oCrossAppNavigator.hrefForExternal({
              target: {
                semanticObject: sSemanticObj,
                action: sAction,
              },
            })) ||
          "";
        //Generate a  URL for the second application
        var url = window.location.href.split("#")[0] + sHash;
        //Navigate to second app
        sap.m.URLHelper.redirect(url, false);
      },
    };
  });
  