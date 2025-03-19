<template>
    <div class="container" style="background: #f2f7f8">
      <div>
        <logo />
        <h1 class="title">
          HSE
        </h1>

        <h2 class="subtitle">
          There is no more space in the storage, please purchase an addon
      </h2>
       
      
      </div>
    </div>
  </template>
  
  <script>
    import Logo from '~/components/Logo.vue';
  
    export default {
      components: {
        Logo
      }
    };
  </script>
  
  <style>
    .title {
      font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      display: block;
      font-weight: 300;
      font-size: 100px;
      color: #35495e;
      letter-spacing: 1px;
    }
  
    .subtitle {
      font-weight: 300;
      font-size: 42px;
      color: #526488;
      word-spacing: 5px;
      padding-bottom: 15px;
    }
  
    .links {
      padding-top: 15px;
    }
  </style>
  
  