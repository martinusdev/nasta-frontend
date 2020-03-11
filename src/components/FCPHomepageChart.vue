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
            min="1"
            max="14"
            step="1"
            v-model="spanInDays"
          />
          <div class="form-control-sm">
            <span>{{ spanHumanized }}</span>
          </div>
        </div>
      </form>
      <bar-chart
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
import { Watch } from 'vue-property-decorator';
import Vue from 'vue';
import moment from 'moment';
import { ChartData, ChartOptions } from 'chart.js';
import { getReports } from '@/lib/data/api.ts';
import { ReportItem } from '@/lib/data/types.ts';
import BarChart from '@/lib/charts/BarChart';
import { BarChartData } from '@/lib/data/types';

@Component({
  components: {
    BarChart,
  },
})
export default class FCPHomepageChart extends Vue {
  loaded: boolean;
  chartData: ChartData;
  options: ChartOptions;
  spanInDays: number;
  defaultSpanInDays: number;
  constructor() {
    super();

    this.loaded = false;
    this.chartData = {};
    this.defaultSpanInDays = 1;
    this.spanInDays = this.defaultSpanInDays;

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
  async mounted() {
    this.loadData();

    setInterval(() => {
      this.loadData();
    }, 60000);
  }
  async loadData() {
    try {
      const filterTime = moment();
      const endTime = filterTime
        .clone()
        .hour(23)
        .minute(59)
        .unix();
      const startTime = filterTime
        .subtract(this.span, 'days')
        .hour(0)
        .minute(0)
        .unix();

      const reportNames = [':rn1', ':rn2', ':rn3'];

      const reports = await getReports(
        'report_name IN (' +
          reportNames.toString() +
          ') and report_time between :starttime and :endtime',
        {
          ':starttime': { N: `${startTime}` },
          ':endtime': { N: `${endTime}` },
          ':rn1': { S: 'fcp_home_page_tablet' },
          ':rn2': { S: 'fcp_home_page_desktop' },
          ':rn3': { S: 'fcp_home_page_mobile' },
        },
      );

      const labels: string[] = [];
      const values: BarChartData[] = [
        {
          label: 'HP Tablet',
          backgroundColor: '#00aa00',
          data: [],
        },
        {
          label: 'HP Desktop',
          backgroundColor: '#d37778',
          data: [],
        },
        {
          label: 'HP Mobile',
          backgroundColor: '#5e7cff',
          data: [],
        },
      ];

      const now = moment();
      const startPoint = now.clone().subtract(this.span, 'days');

      const endPoint = startPoint.clone();

      const pointsCount = this.span;
      for (let i = 0; i < pointsCount; i++) {
        labels.push(endPoint.add(1, 'day').format('DD.MM.'));
      }

      const reportItems: ReportItem[] = reports.Items;
      for (const key in reportItems) {
        const days: number = moment
          .unix(reportItems[key].report_time)
          .diff(startPoint, 'days');

        const reportName = reportItems[key].report_name;
        if (days >= 0) {
          switch (reportName) {
            case 'fcp_home_page_tablet':
              values[0].data[days] = reportItems[key].report_value;
              break;
            case 'fcp_home_page_desktop':
              values[1].data[days] = reportItems[key].report_value;
              break;
            case 'fcp_home_page_mobile':
              values[2].data[days] = reportItems[key].report_value;
              break;
          }
        }
      }

      this.chartData = {
        labels,
        datasets: values,
      };

      this.loaded = true;
    } catch (e) {
      // console.error(e);
    }
  }
  @Watch('spanInDays')
  onPropertyChanged() {
    this.loadData();
  }
  get span(): number {
    return parseInt(this.$data.spanInDays, 10);
  }
  get spanHumanized() {
    return moment.duration(this.span, 'days').humanize();
  }
}
</script>

<style scoped>
.chart-h200 {
  height: 200px;
}
</style>
