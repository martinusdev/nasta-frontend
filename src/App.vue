<template>
  <div id="app">
    <header class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
        </ul>
      </div>
    </header>
    <div class="container-fluid">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
@import "scss/superhero-variables.scss";
@import "~bootstrap";
@import "~bootstrap-vue";
@import "scss/superhero-bootstrap.scss";
</style>
