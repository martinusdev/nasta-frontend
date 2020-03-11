<template>
  <div class="row about">
    <error-rate-chart reportName="error_rate_martinus" />
    <error-rate-chart reportName="error_rate_admin" />
    <error-rate-chart reportName="error_rate_background_jobs" />
    <error-rate-chart reportName="response_time_pda" chartType="bar" />
  </div>
</template>

<script>
// @ is an alias to /src
import ErrorRateChart from '@/components/ErrorRateChart.vue';

export default {
  name: 'Home',
  components: {
    ErrorRateChart,
  },
};
</script>
