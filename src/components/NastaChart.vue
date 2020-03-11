<template>
  <div class="col-sm-4">
    <div class="single-chart-container">
      <form class="form-inline">
        <label class="col-sm-2 col-form-label col-form-label-sm">
          <small>Interval:</small>
        </label>
        <div class="input-group">
          <input
            class="form-control-sm"
            type="range"
            min="30"
            max="1440"
            step="30"
            v-model="span"
          />
          <div class="form-control-sm">
            <span>{{ spanHumanized }}</span>
          </div>
        </div>
      </form>
      <v-component
        :is="chartComponent"
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
import { getReportsByRowName } from '@/lib/data/api.ts';
import { ReportItem } from '@/lib/data/types.ts';
import LineChart from '@/lib/charts/LineChart';
import BarChart from '@/lib/charts/BarChart';

enum ChartType {
  'bar',
  'line',
}

@Component({
  components: {
    LineChart,
    BarChart,
  },
})
export default class NastaChart extends Vue {
  @Prop({ default: 'error_rate_martinus' })
  reportName!: string;
  @Prop({ default: 'line' })
  chartType!: ChartType;
  @Prop({ default: 60 })
  span!: number;
  @Prop({ default: 'minute' })
  spanUnit!: string;
  // Toto su data
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
          borderWidth: 1,
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
  created() {
    this.$props.span = parseInt(this.$props.span, 10);
  }
  async mounted() {
    this.loadData();

    setInterval(() => {
      this.loadData();
    }, 60000);
  }
  async loadData() {
    try {
      const filterTime = moment();
      const endTime = filterTime.unix();
      const startTime = filterTime
        .subtract(this.$props.span, this.$props.spanUnit)
        .unix();
      const labels: string[] = [];
      const values: number[] = [];

      let now = moment();
      now = now.minute(Math.round(now.minute() / 5) * 5);
      const startPoint = now
        .clone()
        .subtract(this.$props.span, this.$props.spanUnit);
      const endPoint = startPoint.clone();

      const reports = await getReportsByRowName(
        this.$props.reportName,
        'report_time between :starttime and :endtime',
        {
          ':starttime': { N: `${startTime}` },
          ':endtime': { N: `${endTime}` },
        },
      );

      const pointsCount = this.$props.span;
      for (let i = 0; i < pointsCount; i++) {
        values.push(NaN);
        labels.push(endPoint.add(1, 'minute').format('HH:mm'));
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
  @Watch('span')
  onPropertyChanged() {
    this.$props.span = parseInt(this.$props.span, 10);
    this.loadData();
  }
  get spanHumanized() {
    return moment.duration(this.$props.span, this.$props.spanUnit).humanize();
  }
  get chartComponent() {
    return `${this.$props.chartType}-chart`;
  }
}
</script>

<style scoped>
.chart-h200 {
  height: 200px;
}
.single-chart-container {
  margin-bottom: 20px;
}
</style>
