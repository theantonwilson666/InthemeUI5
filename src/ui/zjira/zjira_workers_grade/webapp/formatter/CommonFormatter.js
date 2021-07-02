sap.ui.define([], function() {

    return {
        rowHighlight: function(oRed, oYellow) {
            if (oRed) return "Error"
            else {
                if (oYellow) return "Warning"
                else return "noColor"
            }
        },

        formatDateTime: function(oDate) {
            if (oDate != null) {
                return oDate.getDay() + '/' + oDate.getMonth() + '/' + oDate.getFullYear()
            }
        }
    }
});