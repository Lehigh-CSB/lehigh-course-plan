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
          credits: 1,
        },
        {
          title: 'Bus 003',
          description: 'Business Communications Class',
          credits: 1.5,
        },
        {
          title: 'ECO 001',
          description: 'Intro Econ Class',
          credits: 4,
        },
        {
          title: 'CSE 007',
          description: 'Intro Computer Science Class',
          credits: 4,
        }
      ],

      dropGroups: [
        {
          name: 'Semester 1',
          children: [],
          totalCredits: 0,
        },
        {
          name: 'Semester 2',
          children: [],
          totalCredits: 0,
        },
        {
          name: 'Semester 3',
          children: [],
          totalCredits: 0,
        },
        {
          name: 'Semester 4',
          children: [],
          totalCredits: 0,
        }
      ],
    }
  },

  //These are methods for the drag and drop group
  methods:{

    getCredits(dropGroups){
      dropGroups.forEach(Element => {
        Element.totalCredits = 0;
        Element.children.forEach(Element1 => {
          Element.totalCredits = Element1.credits + Element.totalCredits;
        })
      })
    },
    save(received){
      console.log("Received:", received);
      console.log(JSON.stringify(this.dropGroups));
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
      this.getCredits(this.dropGroups);
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
