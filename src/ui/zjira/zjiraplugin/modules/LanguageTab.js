sap.ui.define([], function () {

    return {
        
        addLanguageMenu: function (oRender) {
            oRender.addHeaderEndItem(
                "sap.ushell.ui.shell.ShellHeadItem",
                {
                  id: "headerEnd",
                  icon: "sap-icon://world",
                  press: this.showLanguageMenu.bind(this),
                },
                true,
                false
              );
          },

        showLanguageMenu: function (oEvent) {
            var oButton = oEvent.getSource();
            if (!this._oMenu) {
              this._oMenu = this._createMenu();
            }
    
            this._oMenu.openBy(oButton);
          },
    
          createMenu: function () {
            var oMenu = new sap.m.ActionSheet({
              showCancelButton: false,
              buttons: [
                new sap.m.Button({
                  text: "English",
                  press: function () {
                    window.location.search = "sap-language=EN";
                  },
                }),
                new sap.m.Button({
                  text: "Russian",
                  press: function () {
                    window.location.search = "sap-language=RU";
                  },
                }),
              ],
            });
            return oMenu;
          },
    };

});