sap.ui.define([
	"sap/ui/core/ComponentContainer"
], function (ComponentContainer) {
	"use strict";
	new ComponentContainer({
		name: "intime.zholiday_report",
		settings : {
			id: "lessonsOne"
		},
		async : true
	}).placeAt("container");
});