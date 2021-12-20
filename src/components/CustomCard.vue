<template>
  <div class="cc-card">
    <h3>{{data.title}}</h3>
    <p>
      {{data.description}}
    </p>
    <p>
      Credits: {{data.credits}}
    </p>
    <button v-if="!data.completed" class="cc-btn-not-completed" @click="markCompleted()">
      Not Completed
    </button>
    <button v-else class="cc-btn-completed" @click="markCompleted()">
      Completed
    </button>
  </div>
</template>

<script>
export default {
  name: 'CustomCard',
  props: ['data'],
  methods: {
    markCompleted() {
      this.$emit('completed', this.data);
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

.cc-btn-completed {
  background-color: #5cdb95;
  border: none;
  color: white;
  border-radius: 5px;
}

.cc-btn-not-completed {
  background-color: #5cdb95;
  border: none;
  color: white;
  border-radius: 5px;
  opacity: 0.5;
}
</style>
