import Vue from "vue";
import { Line } from "vue-chartjs";
import Component, { mixins } from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { ChartData, ChartOptions } from "chart.js";

@Component
export default class LineChart extends mixins(Vue, Line) {
  @Prop({ default: null })
  chartData!: ChartData;

  @Prop({ default: null })
  options!: ChartOptions;

  mounted() {
    this.renderChart(this.chartData, this.options);
  }
}
