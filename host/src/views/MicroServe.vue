<template>
    <div></div>
</template>

<script>
export default {
  name: 'ms-iframe',
  props: {
    path: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // name: route.name || route.path.replace(/\//g, "-"),
      webSrc: '/' + this.path.replace(/#hash$/, window.location.hash.replace(/^[^?]*/, ''))
    }
  },
  methods: {},
  mounted() {
    this.$unicom('ms_move_to', this.webSrc)
  },
  destroyed() {
    this.$unicom('ms_move_end')
  }
}
</script>