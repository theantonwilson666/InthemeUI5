sap.ui.define([], function() {
    "use strict";
    return {
        timestampDDMMYYHHDDFormatter: function(sValue) {
            var yyyy = sValue.getFullYear();
            var mm = sValue.getMonth() + 1;
            var dd = sValue.getDate();
            var hh = sValue.getHours();
            var min = sValue.getMinutes();
            if (min.toString().length == 1) {
                min = '0' + min.toString()
            }
            if (mm.toString().length == 1) {
                mm = '0' + mm.toString()
            }
            if (dd.toString().length == 1) {
                dd = '0' + dd.toString()
            }

            return dd + '.' + mm + '.' + yyyy + " " + hh + ':' + min;
        },

        timestampDDMM_DDMMFormatter: function(sValue1, sValue2) {
            debugger;
            if (sValue1 && sValue2 != null) {
                // return sValue1.toLocaleDateString() + " " + "-" + " " + sValue2.toLocaleDateString();
                return sValue1.toString() + " " + "-" + " " + sValue2.toString();
            } else {
                return " ";
            }
        },

        percentagesTwoNbFormatter: function(sValue1, sValue2) {
            var fValue1 = parseFloat(sValue1),
                fValue2 = parseFloat(sValue2);
            if (fValue1 && fValue1 >= 0 &&
                fValue2 && fValue2 >= 0 &&
                fValue1 > fValue2) {
                return Math.round(fValue2 / fValue1 * 100);
            } else {
                return 0;
            }
        },
    };
});