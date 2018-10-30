/**
 * Draw the Chart
 *
 * - data from Power Tracker and Solar Analytics
 */

function renderMainChart() {
  // console.log("renderMainChart", store);
  if (!store[store.range] || !store[store.range].labels) {
    return;
  }

  $("#mainChart").replaceWith('<canvas id="mainChart" height="400"></canvas>');
  var ctx = document.getElementById("mainChart");
  var data = {
    labels: store[store.range].labels,
    datasets: [
      {
        data: extractPTChartData(store.range),
        borderColor: "rgba(1102,161,101,1)",
        borderWidth: 1,
        // fill: false,
        backgroundColor: "rgba(102,161,101,0.4)"
        // yAxisID: "y-axis-1"
      },
      {
        data: extractSAChartData(store.range),
        borderColor: "rgb(12,210,215,1)",
        borderWidth: 1,
        backgroundColor: "rgba(12,210,215,0.4)"
        // fill: false,
        // yAxisID: "y-axis-2"
      }
    ]
  };
  var options = {
    responsive: true,
    maintainAspectRatio: false,
    // stacked: false,
    title: {
      display: true,
      text: "Production vs Consumption"
    },
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
          id: "y-axis-1",
          type: "linear",
          display: true,
          position: "left",
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: "Consumption (kWh)"
          }
        },
        {
          id: "y-axis-2",
          type: "linear",
          display: false,
          position: "right",
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: "Production (kWh)"
          }
          //   gridLines: {
          //     drawOnChartArea: false
          //   }
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
