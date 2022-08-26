sap.ui.define([
    'sap/ui/core/mvc/Controller',
	'sap/ui/core/Fragment',
    "sap/ui/core/Popup"
],
function (Controller, Fragment, Popup) {
    "use strict";

    return Controller.extend("intime.zholiday_report.controller.Main", {

        onInit:function(){
            this.byId('PC1').setStartDate(this.getFirstDateOnCurrentQuarter())
        },
        handleAppointmentSelect: function (oEvent) {
        // Set the element that will serve as 'within area' for all popups
			const   oButton = oEvent.getParameter('appointment'),
                    oView = this.getView();

			// Create popover
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
                    name: "intime.zholiday_report.view.fragment.Popover",
					controller: this
				}).then(function(oPopover) {
					oView.addDependent(oPopover);
                    oPopover.setModel(oButton.getModel());
					oPopover.setBindingContext(oButton.getBindingContext());
					return oPopover;
				});
			}else{
                this._pPopover.then(function(oPopover) {
					oView.addDependent(oPopover);
                    oPopover.setModel(oButton.getModel());
					oPopover.setBindingContext(oButton.getBindingContext());
					return oPopover;
                });
            }
			this._pPopover.then(function(oPopover) {
				oPopover.openBy(oButton);
			});
        },
        handleClosePress:function(oEvent){
            this.byId("myPopover").close();
        },

        handleSelectionFinish: function(oEvent) {
            const aSelectedKeys = oEvent.getSource().getSelectedKeys();
            this.byId("PC1").setBuiltInViews(aSelectedKeys);
        },
        onSearch:function(oEvent){
            const oData = oEvent.getSource().getFilterData();
            this.byId('PC1').getBinding('rows').filter(oEvent.getSource().getFilters());
            // this.byId('PC1').getBinding('rows').filter(oData);
        },
        getFirstDateOnCurrentQuarter: function(oDate){
            // For the US Government fiscal year
            // Oct-Dec = 1
            // Jan-Mar = 2
            // Apr-Jun = 3
            // Jul-Sep = 4
            oDate = oDate || new Date();
            let sMonth = Math.floor(oDate.getMonth() + 1);
            if(sMonth >= 0 && sMonth < 4){
                sMonth = 0;
            }
            else if(sMonth >= 4 && sMonth < 7){
                sMonth = 3;
            }
            else if(sMonth >= 7 && sMonth < 10){
                sMonth = 6;
            }
            else if(sMonth >= 10 && sMonth < 13){
                sMonth = 9;
            }
            return new Date(oDate.getFullYear(), sMonth, oDate.getDay(), 0);
        }

    });

});