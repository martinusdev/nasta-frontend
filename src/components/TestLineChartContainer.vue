<template>
  <line-chart v-if="loaded" :chartData="chartData" :options="options" />
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import LineChart from "@/lib/charts/LineChart";
import { ChartData, ChartOptions } from "chart.js";
import Axios from "axios";

@Component({
  components: {
    LineChart
  }
})
export default class TestLineChartContainer extends Vue {
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
      this.chartData = {
        labels: [1, 2, 3, 4],
        datasets: [
          {
            label: "Ciara",
            backgroundColor: "#ff0000",
            borderColor: "#ff0000",
            data: [
              {
                x: 1,
                y: 5
              },
              {
                x: 2,
                y: 7
              },
              {
                x: 3,
                y: 10
              },
              {
                x: 4,
                y: 15
              }
            ]
          }
        ]
      };

      this.options = {
        elements: {
          line: {
            fill: false
          }
        }
      };
      this.loaded = true;
    } catch (e) {
      // console.error(e);
    }
  }
}
</script>
