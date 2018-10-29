var serial = "id26191";

function getLivePower() {
  var url =
    "https://www.powertracker.com.au/query/sys/sensor/" +
    serial +
    "/power/public";
  console.log("getLivePower", url);
  $.ajax({
    url: url,
    dataType: "json",
    success: function(data) {
      console.log("getLivePower", data);
      eng = engineeringNotation(data.power.value, "W");
      $("#livepowervalue").text(eng.value);
      $("#livepowerunits").text(eng.units);
    }
  });
}

function getConsumption(range) {
  var url =
    "https://www.powertracker.com.au/query/sys/range/" +
    serial +
    "/power/" +
    range +
    "/now/public";
  console.log("getConsumption", range, url);
  $.ajax({
    url: url,
    dataType: "json",
    success: function(data) {
      console.log("getConsumption", data);
      var eng;

      // Consumption
      eng = engineeringNotation(data.power.hourly, "Wh");
      console.log("Consumption", eng);
      $("#consumptionvalue").text(eng.value);
      $("#consumptionunits").text(eng.units);

      // Green House
      eng = engineeringWeight(data.power.hourly * 1.444, "CO<sub>2</sub>");
      console.log("Green house", eng);
      $("#greenhousevalue").text(eng.value);
      $("#greenhouseunits").html(eng.units);

      // Text under widgit
      console.log("range", range);

      switch (range) {
        case "day":
          $("#greenhousetext").text("Carbon Emissions for Today");
          break;
        case "week":
          $("#greenhousetext").text("Carbon Emissions for the Week");
          break;
        case "monthto":
          $("#greenhousetext").text("Carbon Emissions for the Month");
          break;
        case "yearto":
          $("#greenhousetext").text("Carbon Emissions for the Year");
          break;
      }

      // Money
      // $("#money").text(Math.round(data.power.hourly / 4000, 2));

      // Target
      var targetarr = {
        day: 6160,
        week: 43270,
        monthto: 187500,
        year: 2250000
      };
      var target = targetarr[range];
      var portion = data.power.hourly / target;
      $("#target").text(portion.toFixed(0) + "%");

      // Chart
      if (portion > 100) portion = 100;
      var ctx = document.getElementById("chart");
      var data = {
        datasets: [
          {
            data: [100 - portion, portion],
            backgroundColor: ["#000000", "#50864D"],
            label: "Monthly Target" // for legend
          }
        ],
        labels: ["Shortfall", "Achieved"]
      };
      var options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        }
      };
      var myDoughnutChart = new Chart(ctx, {
        type: "doughnut",
        data: data,
        options: options
      });
    }
  });
}

function getLastYear(range) {
  var url =
    "https://www.powertracker.com.au/query/sys/range/" +
    serial +
    "/power/" +
    range +
    "/-1 year/public";
  console.log("getLastYear", range, url);
  $.ajax({
    url: url,
    dataType: "json",
    success: function(data) {
      console.log("getLastYear", data);
      var eng;

      // Green House
      eng = engineeringWeight(data.power.hourly * 1.444, "CO<sub>2</sub>");
      console.log("Green house", eng);
      $("#lastyearvalue").text(eng.value);
      $("#lastyearunits").html(eng.units);
    }
  });
}

function getChartData(range) {
  var url =
    "https://www.powertracker.com.au/query/sys/chart/" +
    serial +
    "/power/hourly/" +
    range +
    "/now/public";
  console.log("drawChart", url);
  $.ajax({
    url: url,
    dataType: "json",
    success: function(response) {
      // remove null values as they cause a chart error
      for (var i in response.values) {
        //console.log('loop', i, response.values[i]);
        if (response.values[i] == null) response.values[i] = 0;
      }
      console.log("drawChart", response);
      mainChartData = mainChartData || {};
      mainChartData.powertracker = response;
      console.log("mainChartData", mainChartData);
      renderMainChart();
    }
  });
}
