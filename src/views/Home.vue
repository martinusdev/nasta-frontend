<template>
  <div class="row home charts-container">
    <nasta-chart reportName="error_rate_martinus" />
    <nasta-chart reportName="error_rate_admin" span="180" />
    <nasta-chart reportName="error_rate_background_jobs" />
    <nasta-chart reportName="response_time_pda" chartType="bar" />
    <f-c-p-homepage-chart />
  </div>
</template>

<script>
// @ is an alias to /src
import NastaChart from '@/components/NastaChart.vue';
import FCPHomepageChart from '@/components/FCPHomepageChart';

export default {
  name: 'Home',
  components: {
    FCPHomepageChart,
    NastaChart,
  },
};
</script>

<style scoped>
.charts-container {
  padding-top: 20px;
}
</style>
