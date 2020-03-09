<template>
  <div class="about">
    <h1>Chart test</h1>

    <bar-chart />
  </div>
</template>

<script>
  // @ is an alias to /src
  import BarChart from "@/lib/charts/BarChart";

  export default {
    name: "Home",
    components: {
      BarChart
    }
  };
</script>
