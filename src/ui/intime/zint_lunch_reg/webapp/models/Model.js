sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},


		createDishModel: function () {
			let oModel = new JSONModel({
				dishType: [
					{
						typeId: "FC",
						typeText: "Первые блюда"
					},

					{
						typeId: "HD",
						typeText: "Горячее"
					},

					{
						typeId: "G",
						typeText: "Гарнир"
					},

					{
						typeId: "ST",
						typeText: "Закуски"
					}

			
				]
			});

			oModel.setDefaultBindingMode("OneWay");
			return oModel;


		}

	};
});