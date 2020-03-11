<template>
  <div class="col-sm">
    <div>
      <form class="form-inline">
        <label class="col-sm-1 col-form-label col-form-label-sm"
          >Interval:</label
        >
        <div class="input-group">
          <input
            class="form-control-sm"
            type="range"
            min="30"
            max="1440"
            step="30"
            v-model="spanInMinutes"
          />
          <div class="form-control-sm">
            <span>{{ spanHumanized }}</span>
          </div>
        </div>
      </form>
      <line-chart
        v-if="loaded"
        :chartData="chartData"
        :options="options"
        css-classes="chart-h200"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Watch, Prop } from 'vue-property-decorator';
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
  @Prop({ default: 'error_rate_martinus' })
  reportName!: string;
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
              autoSkip: true,
              maxTicksLimit: 12,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: 'white',
              beginAtZero: true,
              // Zaujimave, s tymto sa mozeme pohrat
              // suggestedMax: 1,
            },
          },
        ],
      },
      elements: {
        line: {
          fill: true,
          borderColor: '#f87979',
          borderWidth: 2,
        },
        point: {
          radius: 1,
        },
      },
      maintainAspectRatio: false,
      responsive: true,
      tooltips: {
        mode: 'nearest', // Toto je default, asi najlepsi pre nas.
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
      const startTime = filterTime.subtract(this.span, 'minute').unix();

      const reports = await getReports(
        this.$props.reportName,
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
      const startPoint = now.clone().subtract(this.span, 'minute');

      const endPoint = startPoint.clone();

      const pointsCount = this.span;
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
          values[minutes] = reportItems[key].report_value / 10;
        }
      }

      const label = `${this.$props.reportName} ${this.spanHumanized}`;
      this.chartData = {
        labels,
        datasets: [
          {
            spanGaps: false,
            lineTension: 0,
            label,
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
  get span(): number {
    return parseInt(this.$data.spanInMinutes, 10);
  }
  get spanHumanized() {
    return moment.duration(this.span, 'minute').humanize();
  }
}
</script>

<style scoped>
.chart-h200 {
  height: 200px;
}
</style>
