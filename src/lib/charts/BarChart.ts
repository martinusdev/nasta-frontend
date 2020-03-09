import Vue from 'vue';
import { Bar } from 'vue-chartjs';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ChartData, ChartOptions } from 'chart.js';

@Component
export default class BarChart extends mixins(Vue, Bar) {
  @Prop({ default: null })
  chartData!: ChartData;

  @Prop({ default: null })
  options!: ChartOptions;

  mounted() {
    this.renderChart(this.chartData, this.options);
  }
}
