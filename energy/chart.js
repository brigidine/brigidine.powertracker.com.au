/**
 * Draw the Chart
 *
 * - data from Power Tracker and Solar Analytics
 */

function renderMainChart() {
  console.log("renderMainChart", mainChartData);

  if (mainChartData.powertracker === null) {
    return;
  }

  $("#mainChart").replaceWith('<canvas id="mainChart" height="400"></canvas>');
  var ctx = document.getElementById("mainChart");
  var data = {
    labels: mainChartData.powertracker["labels"],
    datasets: [
      {
        label: "# of Values",
        data: mainChartData.powertracker["values"],
        backgroundColor: "rgba(102,161,101,0.4)",
        borderColor: "rgba(1102,161,101,1)",
        borderWidth: 1
      }
    ]
  };
  var options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
      position: "right",
      labels: {
        fontColor: "#FFFFFF"
      }
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: "Energy (Wh)"
          }
        }
      ]
    }
  };
  var myChart = new Chart(ctx, {
    type: "line",
    data: data,
    options: options
  });
}
