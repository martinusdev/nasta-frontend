<template>
  <div class="row about">
    <error-rate-chart reportName="error_rate_martinus" />
    <error-rate-chart reportName="response_time_pda" />
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
