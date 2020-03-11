<template>
  <div class="row about">
    <error-rate-chart />
    <error-rate-chart />
    <div class="col-sm">
      <test-line-chart-container />
    </div>
    <div class="col-sm">
      <test-line-chart-container />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ErrorRateChart from '@/components/ErrorRateChart.vue';
import TestLineChartContainer from '@/components/TestLineChartContainer.vue';

export default {
  name: 'Home',
  components: {
    ErrorRateChart,
    TestLineChartContainer,
  },
};
</script>
