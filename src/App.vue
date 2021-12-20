<template>
  <div id="app">
    
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
          @completed="completedMarked"
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
          title: 'BUS 001',
          description: 'Foundations of Business',
          credits: '1',
          completed: false
        },
        {
          title: 'ECO 001',
          description: 'Principles of Economics',
          credits: '4',
          completed: false
        },
        {
          title: 'CSE 007',
          description: 'Introduction to Programming',
          credits: '4',
          completed: false
        },
        {
          title: 'MATH 021',
          description: 'Calculus I',
          credits: '4',
          completed: false
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
      ]
    }
  },

  methods:{
    save(received){
      console.log("Received:", received)
    },

    completedMarked(data) {
      if(data.completed == true){
        data.completed = false;
      }
      else{
        data.completed = true;
      }
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
  margin-top: 60px;
}
</style>
