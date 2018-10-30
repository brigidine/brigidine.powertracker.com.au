/**
 * Solar Analytics API Interface
 */

var SAToken = null;

var siteId1 = 38963;
var siteId2 = 38959;

var rangeToGrainMap = {
  day: "hour",
  week: "day",
  monthto: "day",
  yearto: "month"
};

function getSAToken(callNext) {
  // console.log("getSAToken");
  var url = "https://portal.solaranalytics.com.au/api/v3/token";
  var AuthHeader =
    "Basic ZGV2ZWxvcG1lbnRAcG93ZXJ0cmFja2VyLmNvbS5hdToxa3Yxb2ZlbXAxODRTVjBhSzlJaA==";

  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    // crossDomain: true,
    // headers: {
    //   Authorization: "Basic " + AuthHeader
    // },
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", AuthHeader);
    },
    success: function(data) {
      // console.log("getSAToken", data);
      SAToken = data.token;
      callNext();
    }
  });
}

function extractSAChartData(range) {
  if (
    !store[range] ||
    !store[range].solaranalytics ||
    !store[range].solaranalytics[siteId1] ||
    !store[range].solaranalytics[siteId2]
  )
    return [];
  return store[range].labels.map(function(label) {
    var kW =
      ((store[range].solaranalytics[siteId1][label] || 0) +
        (store[range].solaranalytics[siteId1][label] || 0)) /
      1000;
    return kW < 0 ? 0 : kW; // no negative
  });
}

var formatDateMap = {
  day: "HH", // 2-digit hour "00" to "23"
  week: "s-MMM-YYYY ha", // formatted "24-Oct-2018 12am"
  monthto: "DD", // 2-digit dom "00" to "31"
  yearto: "MMM" // 3-char month "Jan" to "Dec"
};

function convertSAData(range, raw) {
  // convert raw data to a keyed object formatted based on the ramge
  // we will extract the values we want later when we have the labels
  var obj = {};
  var format = formatDateMap[range];
  raw.data.forEach(function(rec) {
    // var consumed = rec["energy_consumed"];
    var generated = rec["energy_generated"];
    var time = rec["t_stamp"];
    // console.log("generated", generated, time);
    var date = new Date(time);
    var key = dateFns.format(date, format);
    // console.log("time->date", time, date, key);
    obj[key] = generated;
  });
  // console.log("obj", obj);
  return obj;
}

function getSAChartDataSite(range, siteId) {
  if (
    store[range] &&
    store[range].solaranalytics &&
    store[range].solaranalytics[siteId]
  ) {
    // already have data
    // console.log("skip", siteId);
    renderMain();
  } else {
    // need to get data
    var url =
      "https://portal.solaranalytics.com.au/api/v2/site_data/" +
      siteId +
      "?gran=" +
      rangeToGrainMap[range];
    // console.log("getSAChartDataSite", range, siteId, url);
    $.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + SAToken);
      },
      success: function(data) {
        // console.log("getSAChartDataSite", range, data);
        if (!store[range]) store[range] = {};
        if (!store[range].solaranalytics) store[range].solaranalytics = {};
        store[range].solaranalytics[siteId] = convertSAData(range, data);
        renderMain();
      }
    });
  }
}

function getSAChartDataActual(range) {
  // console.log("getSAChartDataActual", range);
  return function() {
    // console.log("getSAChartDataActualInner", range);
    getSAChartDataSite(range, siteId1);
    getSAChartDataSite(range, siteId2);
  };
}

function getSAChartData(range) {
  // console.log("getSAChartData", range);
  if (SAToken === null) getSAToken(getSAChartDataActual(range));
  else getSAChartDataActual(range)();
}

function extractSATotal(range) {
  // console.log("getSolarTotal", store);
  if (
    !store[range] ||
    !store[range].solaranalytics ||
    !store[range].solaranalytics[siteId1] ||
    !store[range].solaranalytics[siteId2]
  )
    return "--";
  var total = 0;
  Object.keys(store[range].solaranalytics[siteId1]).forEach(function(key) {
    var value = store[range].solaranalytics[siteId1][key];
    total = total + (value < 0 ? 0 : value);
  });
  Object.keys(store[range].solaranalytics[siteId2]).forEach(function(key) {
    var value = store[range].solaranalytics[siteId2][key];
    total = total + (value < 0 ? 0 : value);
  });
  return ((total / 1000) * 0.23793).toFixed(2);
}

function renderSATotal() {
  // console.log("store", store);
  $("#currentsolarsavings").text(extractSATotal("yearto"));
}

function getSATotal() {
  getSAChartData("yearto");
}
