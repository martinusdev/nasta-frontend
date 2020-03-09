<template>
  <bar-chart v-if="loaded" :chartData="chartData" :options="options" />
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import BarChart from "@/lib/charts/BarChart";
import { ChartData, ChartOptions } from "chart.js";
import Axios from "axios";

@Component({
  components: {
    BarChart
  }
})
export default class TestChartContainer extends Vue {
  loaded: boolean;
  chartData: ChartData;
  options: ChartOptions;

  constructor() {
    super();

    this.loaded = false;
    this.chartData = {};
    this.options = {};
  }

  async mounted() {
    this.loaded = false;
    try {
      // TODO load data from API or whatever
      // const { userlist } = await fetch('/api/userlist');

      Axios.get("https://api.coindesk.com/v1/bpi/currentprice.json").then(
        response => {
          const data = response.data;
          console.log(data);

          const labels: string[] = [];
          const values: number[] = [];
          for (const key in data.bpi) {
            labels.push(key);
            values.push(data.bpi[key].rate_float);
          }

          this.chartData = {
            labels: labels,
            // labels: [
            //   "January",
            //   "February",
            //   "March",
            //   "April",
            //   "May",
            //   "June",
            //   "July",
            //   "August",
            //   "September",
            //   "October",
            //   "November",
            //   "December"
            // ],
            datasets: [
              {
                label: data.chartName,
                backgroundColor: "#f87979",
                // data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
                data: values
              }
            ]
          };
          this.loaded = true;
        }
      );
    } catch (e) {
      // console.error(e);
    }
  }
}
</script>
