<template>
  <div class="cc-card">
    <h3 class="inline_element">{{data.title}} {{data.credits}}</h3>
    <div class="inline_element" style="border-radius: 0.3rem">
      <v-select
        v-model="data.grade"
        @input="updateGrade"
        placeholder="None"
        :options="['None', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']"
        append-to-body
      >
      </v-select>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  name: 'CustomCard',
  props: ['data'],
  components: {
    vSelect
  },
  methods: {
    markCompleted() {
      this.$emit('completed', this.data);
    },

    updateGrade(grade) {
      this.data.grade = grade;
      this.$emit('grade-updated', this.data);
    }
  }
}

</script>

<style>

.inline_element {
  flex-basis: 100%;
}

.cc-card {
  display: flex;
  padding: 10px;
  text-align: left;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  margin: 2px;
  background-color: white;
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
