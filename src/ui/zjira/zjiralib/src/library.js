/*globals tms*/
/*!
 * ${copyright}
 * Initialization Code and shared classes of library TMS
 */
sap.ui.define([
	"sap/ui/core/library"
], function() {
	"use strict"

	/**
	 * Lib Description
	 *
	 * @namespace
	 * @name SAP_JIRA
	 * @author Anton Vilson TGRM @AntonVilson
	 * @version ${version}
	 * @public
	 */

	// delegate further initialization of this library to the Core
	return sap.ui.getCore().initLibrary({
		name: "jira.lib",
		noLibraryCSS: true,
		dependencies: [
			"sap.ui.core"
		],
		version: "${version}",
		types: [],
		interfaces: [],
		controls: [],
		elements: []
	});

	/* eslint-disable */
	return jira.lib;
	/* eslint-enable */


}, /* bExport= */ false);
