<template>
  <line-chart v-if="loaded" :chartData="chartData" :options="options" />
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import moment from 'moment';
import { ChartData, ChartOptions } from 'chart.js';
import { getReports } from '@/lib/data/db.ts';
import { ReportItem } from '@/lib/data/types.ts';
import LineChart from '@/lib/charts/LineChart';

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

    this.options = {
      legend: {
        labels: {
          fontColor: 'white',
        },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: 'white',
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: 'white',
            },
          },
        ],
      },
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
  }
  async mounted() {
    this.loadData();

    setInterval(() => {
      this.loadData();
    }, 5000);
  }
  async loadData() {
    // TODO Este toto cele by sme mali zabalit do nejakej funkcie
    try {
      // const filterTime = moment('2020-03-09 08:20:00');
      const filterTime = moment();
      const endTime = filterTime.unix();
      const startTime = filterTime.subtract(1, 'hour').unix();

      const reports = await getReports(
        'nr_error_rate_martinus',
        'report_time between :starttime and :endtime',
        {
          ':starttime': startTime,
          ':endtime': endTime,
        },
      );

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

        values[Math.round(minutes / 5)] = reportItems[key].report_value;
      }

      this.chartData = {
        labels: labels,
        datasets: [
          {
            spanGaps: false,
            lineTension: 0,
            label: 'Error rate ' + now.format('YYYY-MM-DD HH:mm:ss'),
            backgroundColor: '#f87979',
            data: values,
          },
        ],
      };

      this.loaded = true;
    } catch (e) {
      // console.error(e);
    }
  }
}
</script>
