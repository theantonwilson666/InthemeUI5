sap.ui.define([], function () {
  return {
    formatRowHighlight: function (oValue) {
      switch (oValue) {
        case "01":
          return "Error";
        case "02":
          return "Error";
        case "03":
          return "Warning";
        case "04":
          return "Success";
        case "05":
          return "Success";
      }
    },

    formatSumHours: function(oValue){
      debugger;
    },

  };
});
