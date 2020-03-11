<template>
  <div class="row about">
    <div class="col-sm">
      <error-rate-chart />
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
