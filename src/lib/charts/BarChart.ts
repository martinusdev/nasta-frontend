import Vue from "vue";
import { Bar } from "vue-chartjs";
import Component, { mixins } from "vue-class-component";
import { Prop } from "vue-property-decorator";
import {ChartData, ChartOptions} from "chart.js";

@Component
export default class BarChart extends mixins(Vue, Bar) {
  @Prop({ default: null })
  chartdata: ChartData;

  @Prop({ default: null })
  options: ChartOptions;

  // props: [
  //   chartdata: {
  //     type: Object;
  //     default: null;
  //   };
  //   options: {
  //     type: Object;
  //     default: null;
  //   };
  // ];

  mounted() {
    // Overwriting base render method with actual data.
    // this.renderChart(
    //   {
    //     labels: [
    //       "January",
    //       "February",
    //       "March",
    //       "April",
    //       "May",
    //       "June",
    //       "July",
    //       "August",
    //       "September",
    //       "October",
    //       "November",
    //       "December"
    //     ],
    //     datasets: [
    //       {
    //         label: "GitHub Commits",
    //         backgroundColor: "#f87979",
    //         data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
    //       }
    //     ]
    //   },
    //   undefined
    // );

    this.renderChart(this.chartdata, this.options);
  }
}
