import Vue from 'vue';
import { Bar, mixins as VueChartMixins } from 'vue-chartjs';
import Component, { mixins as componentMixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ChartOptions } from 'chart.js';

@Component
export default class BarChart extends componentMixins(
  Vue,
  Bar,
  VueChartMixins.reactiveProp,
) {
  @Prop({ default: null })
  options!: ChartOptions;

  mounted() {
    this.renderChart(this.chartData, this.options);
  }
}
