<template>
  <div id="plan">
    <header>CSB Course Manager</header>
    <h2>Course management and planning allows to make the most out of your available credits at Lehigh!</h2>
    <h2>Remember that course plans are fluid and subject to change, you should update your plan as your academic career evolves</h2>

    <button class="actionBtn" @click="logout">Logout</button>
    <button class="actionBtn "@click="getUserInfo">Get User Info</button>
    
    <drag-drop
      :dropzones="semesters"
      :dropzonesTitle="'XYZ Company Teams'"
      :originalData="courses"
      :originalTitle="'LU Course Plan'"
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
import Auth from './Auth.vue';
import {getAuth} from 'firebase/auth';

export default {
  name: 'app',
  components: {
    DragDrop,
    CustomCard,
    Auth,
  },
  data() {
    return{
      courses: [
        {
          title: 'BUS 001',
          description: 'Foundations of Business',
          credits: 1,
          designation: 'BUS',
          completed: false,
          used: false,
        },
        {
          title: 'ECO 001',
          description: 'Principles of Economics',
          credits: 4,
          designation: 'BUS',
          completed: false,
          used: false,
        },
        {
          title: 'CSE 007',
          description: 'Introduction to Programming',
          credits: 4,
          designation: 'CS',
          completed: false,
          used: false,
        },
        {
          title: 'MATH 021',
          description: 'Calculus I',
          credits: 4,
          designation: 'MATH',
          completed: false,
          used: false,
        },
        {
          title: 'PHY 011',
          description: 'Introduction to Physics I',
          credits: 4,
          designation: 'NS',
          completed: false,
          used: false,
        },
        {
          title: 'CSE 017',
          description: 'Programming and Data Structures',
          credits: 3,
          designation: 'CS',
          completed: false,
          used: false,
        },
      ],

      semesters: [
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

    getUserInfo(){
        const auth = getAuth();
        auth.onAuthStateChanged(function(user) {
            if (user) {
            // User is signed in.
            console.log(user);
            } else {
            // No user is signed in.
            }
        });
    },

    logout(){
      getAuth().signOut().then(() => {
        this.$router.replace('/auth');
      })
    },

    getCredits(semesters){
      semesters.forEach(Element => {
        console.log(Element);
        Element.totalCredits = 0;
        Element.children.forEach(Element1 => {
          Element.totalCredits = Element1.credits + Element.totalCredits;
        })
      })
    },

    save(received){
      console.log("Received:", received);
      console.log(JSON.stringify(this.semesters));
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
      this.getCredits(this.semesters);
    },

    cancel() {
      console.log("Cancel hit");
    }
  }
}
</script>

<style>
#plan {
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
.actionBtn {
  margin: 20px;
  padding: 10px;
  font-size: 16px;
}
</style>
