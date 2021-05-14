import GraphLayout from "./GraphLayout";
import { Bar } from "react-chartjs-2";

export default function TopPlaces({ dataValue }) {
  const labels = new Array();
  Object.keys(dataValue).forEach((element) => {
    labels.push(`${element.substring(0, 3)} - ${element.substring(3)}`);
  });
  dataValue = Object.values(dataValue);
  const data = {
    labels: labels,
    datasets: [
      {
        data: dataValue,
        backgroundColor: [
          "#ffd76e",
          "#72c904",
          "#ff9f40",
          "#ff6384",
          "#1ec099",
        ],
        borderColor: ["#ffd76e", "#72c904", "#ff9f40", "#ff6384", "#1ec099"],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    scales: {
      xAxis: {
        grid: {
          display: false,
        },
      },
      yAxis: {
        grid: {
          display: false,
        },
        ticks: {
          callback: function (label, index, labels) {
            // when the floored value is the same as the value we have a whole number
            if (Math.floor(label) === label) {
              return label;
            }
          },
        },
      },
    },

    plugins: {
      legend: {
        labels: {
          color: "white", //set your desired color
        },
      },
    },
  };
  return (
    <GraphLayout>
      <p>Recent activity</p>
      <Bar data={data} options={options} />
    </GraphLayout>
  );
}
