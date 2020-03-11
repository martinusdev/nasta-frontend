<template>
  <div class="col-sm">
    <form>
      <div class="form-group row">
        <label class="col-sm-1 col-form-label col-form-label-sm">Interval:</label>
        <div class="col-sm-4">
          <div class="input-group mb-2">
            <input
              class="form-control-sm"
              type="range"
              min="30"
              max="1440"
              step="30"
              v-model="spanInMinutes"
            />
            <div class="form-control-sm">
              <span>{{ spanInMinutes }} minutes</span>
            </div>
          </div>
        </div>
      </div>
      <line-chart v-if="loaded" :chartData="chartData" :options="options" />
    </form>
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

      let now = moment();
      now = now.minute(Math.round(now.minute() / 5) * 5);
      const startPoint = now
        .clone()
        .subtract(this.$data.spanInMinutes, 'minute');

      const endPoint = startPoint.clone();

      const pointsCount = Math.round(this.$data.spanInMinutes / 5);
      for (let i = 0; i < pointsCount; i++) {
        values.push(NaN);

        labels.push(endPoint.add(5, 'minute').format('HH:mm'));
      }

      const reportItems: ReportItem[] = reports.Items;
      for (const key in reportItems) {
        const minutes: number = moment
          .unix(reportItems[key].report_time)
          .diff(startPoint, 'minutes');

        if (minutes >= 0) {
          values[Math.round(minutes / 5)] = reportItems[key].report_value;
        }
      }

      this.chartData = {
        labels,
        datasets: [
          {
            spanGaps: false,
            lineTension: 0,
            label: 'Error rate ' + endPoint.format('YYYY-MM-DD HH:mm:ss'),
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
