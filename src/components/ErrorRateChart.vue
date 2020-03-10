<template>
  <div>
    <small>
      Interval:
      <input type="range" min="30" max="1440" v-model="spanInMinutes" />
      {{ spanInMinutes }} minutes
    </small>
    <line-chart v-if="loaded" :chartData="chartData" :options="options" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
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
  spanInMinutes: number;
  defaultSpanInMinutes: number;
  constructor() {
    super();

    this.loaded = false;
    this.chartData = {};
    this.defaultSpanInMinutes = 60;
    this.spanInMinutes = this.defaultSpanInMinutes;

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
    }, 60000);
  }
  async loadData() {
    // TODO Este toto cele by sme mali zabalit do nejakej funkcie
    try {
      // const filterTime = moment('2020-03-09 08:20:00');
      const filterTime = moment();
      const endTime = filterTime.unix();
      const startTime = filterTime
        .subtract(this.$data.spanInMinutes, 'minute')
        .unix();

      const reports = await getReports(
        'error_rate_martinus',
        'report_time between :starttime and :endtime',
        {
          ':starttime': startTime,
          ':endtime': endTime,
        },
      );

      const labels: string[] = [];
      const values: number[] = [];

      const startingPoint = moment().subtract(
        // Tu bacha lebo das opacne tieto argumenty a spravi string concat.
        // Asi som mu nepovedal dost dobre, ze spanInMinutes je number.
        // A mozno mu to je jedno.
        (moment().minute() % 5) + parseInt(this.$data.spanInMinutes, 10),
        'minute',
      );
      console.log('Graf od ', startingPoint.format());

      // Toto 12 je len proste 12 labels na x-ovej osi?
      const pointsCount = 12;
      const minutesIncrement = Math.round(
        parseInt(this.$data.spanInMinutes, 10) / pointsCount,
      );
      console.log(minutesIncrement);
      for (let i = 0; i < pointsCount; i++) {
        values.push(NaN);

        labels.push(
          startingPoint.add(minutesIncrement, 'minute').format('HH:mm'),
        );
      }

      const reportItems: ReportItem[] = reports.Items;
      for (const key in reportItems) {
        const minutes: number = +moment
          .unix(reportItems[key].report_time)
          .format('m');

        values[Math.round(minutes / minutesIncrement)] =
          reportItems[key].report_value;
      }

      this.chartData = {
        labels,
        datasets: [
          {
            spanGaps: false,
            lineTension: 0,
            label: 'Error rate ' + startingPoint.format('YYYY-MM-DD HH:mm:ss'),
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
  @Watch('spanInMinutes')
  onPropertyChanged() {
    this.loadData();
  }
}
</script>
