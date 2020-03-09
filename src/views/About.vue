<template>
  <div class="about">
    <h1>This is an about page</h1>

    <bar-chart />

  </div>
</template>

<script>
  // @ is an alias to /src
  import BarChart from "@/lib/charts/BarChart";

  export default {
    name: "About",
    components: {
      BarChart
    }
  };
</script>
