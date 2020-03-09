<template>
  <div class="about">
    <h1>Chart test</h1>
    <test-chart-container />
  </div>
</template>

<script>
// @ is an alias to /src
import TestChartContainer from "@/components/TestChartContainer.vue";

export default {
  name: "Home",
  components: {
    TestChartContainer
    // BarChart
  }
};
</script>
