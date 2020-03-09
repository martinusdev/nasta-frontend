<template>
  <div class="home">
    <AboutComponent
      msg="I haven't deleted this because there are useful links."
    />
  </div>
</template>

<script>
// @ is an alias to /src
import AboutComponent from '@/components/AboutComponent.vue';

export default {
  name: 'About',
  components: {
    AboutComponent,
  },
};
</script>
