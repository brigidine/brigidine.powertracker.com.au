var mainChartData = {};

function clickButton(range) {
  $(".getdatabtn").removeClass("btn-primary");
  $("#getdata" + range).addClass("btn-primary");
  getPTConsumption(range);
  getPTLastYear(range);
  getPTChartData(range);
  getSAChartData(range);
  mainChartData = { range: range };
}

function renderMain() {
  renderMainChart();
}

$(document).ready(function() {
  getPTLivePower();
  clickButton("day");
});

function engineeringNotation(number, units) {
  if (number == null) {
    return {
      value: "-",
      units: ""
    };
  }
  var exp = 0;
  while (number > 1000) {
    exp++;
    number = number / 1000;
  }
  if (number > 100) {
    number = number.toFixed(0);
  } else if (number > 10) {
    number = number.toFixed(1);
  } else {
    number = number.toFixed(2);
  }
  var prefixes = { 0: "", 1: "k", 2: "M", 3: "G" };
  return {
    value: number,
    units: prefixes[exp] + units
  };
}

function engineeringWeight(grams, units) {
  if (grams == null) {
    return {
      value: "-",
      units: ""
    };
  }
  var exp = 0;
  while (grams > 1000) {
    exp++;
    grams = grams / 1000;
  }
  if (grams > 100) {
    grams = grams.toFixed(0);
  } else if (grams > 10) {
    grams = grams.toFixed(1);
  } else {
    grams = grams.toFixed(2);
  }
  var prefixes = { 0: "g", 1: "kg", 2: "T", 3: "kT" };
  return {
    value: grams,
    units: prefixes[exp] + units
  };
}
