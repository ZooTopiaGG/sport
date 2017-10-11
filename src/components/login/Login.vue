<template>
  <div class="login_container">
    <div class="logo">
      <img src="../../../static/img/icon/logo@2x.png" alt="">
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {

}
</script>
<style>
.login_container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 0 10px;
  height: 100vh;
  background-color: #fff;
}

.logo {
  flex-grow: 3;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo img {
  max-width: 80%;
  height: auto;
}
</style>
