<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">
      Page not found
    </h1>
    <h1 v-else>
      An error occurred
    </h1>
    <nuxt-link to="/home">
      Home page
    </nuxt-link>
  </div>
</template>
<script>
  export default {
    props: {
      error: {
        type: Object,
        default: new Object()
      }
    }
  };
</script>
