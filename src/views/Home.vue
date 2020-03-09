<template>
  <div class="about">
    <div class="row">
      <div class="col-sm">
        <test-chart-container />
      </div>
      <div class="col-sm">
        <test-line-chart-container />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { listReports } from "@/lib/data/db.ts";
import TestChartContainer from "@/components/TestChartContainer.vue";
import TestLineChartContainer from "@/components/TestLineChartContainer.vue";

export default {
  name: "Home",
  components: {
    TestChartContainer,
    TestLineChartContainer
  },
  async mounted() {
    const reports = await listReports();
    console.log(reports);
  }
};
</script>
