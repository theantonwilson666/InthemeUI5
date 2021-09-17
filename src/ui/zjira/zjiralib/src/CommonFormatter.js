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

    formatSumHours: function (oValue) {
      debugger;
    },

    formatFloat: function (value) {
      return parseFloat(value);
    },

    formatSecondToHours: function (iSecond) {
      var iHours = iSecond / 3600;

      var precision = (a) => {
        if (!isFinite(a)) return 0;
        var e = 1,
          p = 0;
        while (Math.round(a * e) / e !== a) {
          e *= 10;
          p++;
        }
        return p;
      };
      return precision(iHours) != 0 ? iHours.toFixed(2) : iHours;
    },
    showIcon: function (error, time) {
      if (error !== null && time !== null) {
        if (!error || !time)
          return null
        if (error === true && time.ms === 0)
          return "sap-icon://alert"
      }
      // if (icon !== null) {
      //   if (!icon)
      //     return null
      //   if (icon.ms === 0)
      //     return "sap-icon://alert"
      // }

    },
    errorDay: function (error) {
      if (error === true)
        return '1'
      else
        return null
    },
    formatTime: function (data) {
      if (data) {
        return `${this.underTen(data.getHours())}:${this.underTen(data.getMinutes())}:${this.underTen(data.getSeconds())}`
      }
    }
  };
});