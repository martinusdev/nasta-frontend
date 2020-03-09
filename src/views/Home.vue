<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { listReports } from "@/lib/data/db.ts";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  async mounted() {
    const reports = await listReports();
    console.log(reports);
  }
};
</script>
