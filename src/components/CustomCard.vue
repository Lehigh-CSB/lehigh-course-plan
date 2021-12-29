<template>
  <div class="cc-card">
    <h3 style="text-align:left;">
      {{data.title}}
    <span style="float:right;">
        {{data.credits}}
    </span>
    </h3>
  </div>
</template>

<script>
export default {
  name: 'CustomCard',
  props: ['data'],
  methods: {
    markDone() {
      this.$emit('done', this.data);
    }
  }
}

</script>

<style>
.cc-card {
  padding: 10px;
  text-align: left;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  margin: 5px;
  background-color: white;
  min-width: 200px;
  font-size: 0.8em;
}

.cc-card h3 {
  margin: 0px;
}

.cc-btn {
  background-color: #5cdb95;
  border: none;
  color: white;
  border-radius: 5px;
}
</style>
