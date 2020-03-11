<template>
  <div class="row about">
    <error-rate-chart reportName="error_rate_martinus" />
    <error-rate-chart reportName="error_rate_admin" />
    <error-rate-chart reportName="error_rate_background_jobs" />
    <error-rate-chart reportName="response_time_pda" chartType="bar" />
    <f-c-p-homepage-chart />
    <f-c-p-detail-chart />
  </div>
</template>

<script>
// @ is an alias to /src
import ErrorRateChart from '@/components/ErrorRateChart.vue';
import FCPHomepageChart from '@/lib/charts/FCPHomepageChart';
import FCPDetailChart from '@/lib/charts/FCPDetailChart';

export default {
  name: 'Home',
  components: {
    FCPHomepageChart,
    FCPDetailChart,
    ErrorRateChart,
  },
};
</script>
