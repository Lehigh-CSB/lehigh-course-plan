<template>
  <div id="app">
  <header>CSB Course Manager</header>
  <h2>Course management and planning allows to make the most out of your available credits at Lehigh!</h2>
  <h2>Remember that course plans are fluid and subject to change, you should update your plan as your academic career evolves</h2>
    
    <drag-drop
      :dropzones="dropGroups"
      :dropzonesTitle="'XYZ Company Teams'"
      :originalData="stories"
      :originalTitle="'Tasks to be distributed'"
      :inPlace="true"
      :enableSave="true"
      :enableCancel="true"
      @dropInOriginalBucket="originalBucketDropEvent"
      @dropInDestinationBucket="destinationBucketDropEvent"
      @save="save"
      @cancel="cancel"
    >
      <template #dd-card="{ cardData }">
        <custom-card
          :data="cardData"
          @done="doneMarked"
        />
      </template>
    </drag-drop>
  </div>
</template>

<script>
/* istanbul ignore file */
import DragDrop from './vue-drag-n-drop.vue';
import CustomCard from './components/CustomCard.vue';

export default {
  name: 'app',
  components: {
    DragDrop,
    CustomCard
  },
  data() {
    return{
      stories: [
        {
          title: 'Bus 001',
          description: 'Intro to Business School',
        },
        {
          title: 'Bus 003',
          description: 'Business Communications Class',
        },
        {
          title: 'ECO 001',
          description: 'Intro Econ Class',
        },
        {
          title: 'CSE 007',
          description: 'Intro Computer Science Class',
        }
      ],

      dropGroups: [
        {
          name: 'Semester 1',
          children: []
        },
        {
          name: 'Semester 2',
          children: []
        },
        {
          name: 'Semester 3',
          children: []
        },
        {
          name: 'Semester 4',
          children: []
        }
      ],
    }
  },

  methods:{
    save(received){
      console.log("Received:", received)
    },

    doneMarked(data) {
      data.done = true;
      alert(data.title);
    },

    originalBucketDropEvent(result) {
      console.log("Original: ", result);
    },

    destinationBucketDropEvent(columnName, result) {
      console.log("Destination: ", columnName, result)
    },

    cancel() {
      console.log("Cancel hit");
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
header {
  font-size: 30px;
}
h2 {
  font-size: 16px;
}
</style>
