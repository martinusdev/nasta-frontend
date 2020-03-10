<template>
  <line-chart v-if="loaded" :chartData="chartData" :options="options" />
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { ChartData, ChartOptions } from 'chart.js';
import { getReports, ReportItem } from '@/lib/data/db.ts';
import LineChart from '@/lib/charts/LineChart';
import moment from 'moment';

@Component({
  components: {
    LineChart,
  },
})
export default class ErrorRateChart extends Vue {
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
      const filterTime = moment('2020-03-09 08:20:00');
      const endTime = filterTime.unix();
      const startTime = filterTime.subtract(1, 'hour').unix();
      console.log(filterTime);

      const reports = await getReports(
        'nr_error_rate_martinus',
        'report_time between :starttime and :endtime',
        {
          ':starttime': startTime,
          ':endtime': endTime,
        },
      );

      console.log(reports);

      const labels: string[] = [];
      const values: number[] = [];

      let now = moment();
      now = now.minute(Math.round(now.minute() / 5) * 5);
      now = now.subtract(60, 'minute');

      for (let i = 0; i < 12; i++) {
        values.push(NaN);

        labels.push(now.add(5, 'minute').format('HH:mm'));
      }

      const reportItems: ReportItem[] = reports.Items;
      for (const key in reportItems) {
        const minutes: number = +moment
          .unix(reportItems[key].report_time)
          .format('m');

        console.log(Math.round(minutes / 5) * 5);

        values[Math.round(minutes / 5)] = reportItems[key].report_value;
      }

      console.log(values);

      this.chartData = {
        labels: labels,
        datasets: [
          {
            spanGaps: false,
            lineTension: 0,
            label: 'Error rate',
            backgroundColor: '#f87979',
            data: values,
          },
        ],
      };

      this.options = {
        elements: {
          line: {
            fill: false,
            borderColor: '#f87979',
            borderWidth: 2,
          },
          point: {
            radius: 0,
          },
        },
      };

      this.loaded = true;
    } catch (e) {
      console.error(e);
    }
  }
}
</script>
