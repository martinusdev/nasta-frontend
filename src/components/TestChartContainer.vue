<template>
  <bar-chart v-if="loaded" :chartData="chartData" :options="options" />
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import BarChart from '@/lib/charts/BarChart';
import { ChartData, ChartOptions } from 'chart.js';
import { listReports } from '@/lib/data/db.ts';

@Component({
  components: {
    BarChart,
  },
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
    this.loadData();
  }
  async loadData() {
    // TODO Este toto cele by sme mali zabalit do nejakej funkcie
    try {
      const reports = await listReports();
      const labels: string[] = [];
      const values: number[] = [];
      // Potom by sa to aj hodilo niekam presunut, tu to urcite nema byt.
      interface ReportItem {
        Name: string;
        Value: number;
        Timestamp: number;
      }
      const reportItems: ReportItem[] = reports.Items;
      for (const key in reportItems) {
        labels.push(reportItems[key].Name);
        values.push(reportItems[key].Value);
      }
      this.chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Values',
            backgroundColor: '#f87979',
            data: values,
          },
        ],
      };
      this.loaded = true;
    } catch (e) {
      console.error(e);
    }
  }
}
</script>
