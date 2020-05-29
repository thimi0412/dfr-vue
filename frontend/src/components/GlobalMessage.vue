<template>
  <!-- メッセージエリア -->
  <div id="message">
    <b-alert variant="danger" show v-show="messege.error" class="mb-0">
      {{ messege.error }}
    </b-alert>
    <b-alert variant="warning" show v-show="message.warnings.length > 0" class="mb-0">
      <p v-for="(warning, key) in message.warnings" :key="key" class="mb-0">{{ warning }}</p> 
    </b-alert>
    <b-alert variant="info" show v-show="message.info" class="mb-0">
      {{message.info}} 
    </b-alert> 
  </div>
</template>

<script>
export default {
  computed: {
    message: function() {
      return this.$store.state.message
    }
  }
}
</script>