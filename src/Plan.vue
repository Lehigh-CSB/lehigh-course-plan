<template>
  <div id="plan">
    <header>Lehigh Course Plan Manager</header>
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
import { getDatabase, ref, set, child, get } from "firebase/database";
import courses from './courses.json';

export default {
  name: 'app',
  components: {
    DragDrop,
    CustomCard,
    Auth,
    courseData: courses
  },

  beforeCreate(){
    console.log('beforeCreate called inside plan.vue');
    const dbRef = ref(getDatabase());
    const auth = getAuth();
    const user = auth.currentUser;
    get(child(dbRef, `users/${user.email.split("@")[0]}`)).then((snapshot) => {
      if (snapshot.exists()) {
        this.semesters = JSON.parse(snapshot.val().semesters)
        console.log(this.semesters);
        
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  },

  data() {
    return{
      courses,
      semesters: [
        {
          name: 'Fall 1',
          children: [],
          totalCredits: 0,
          gpa: 0.0
        },
        {
          name: 'Spring 1',
          children: [],
          totalCredits: 0,
          gpa: 0.0
        },
        {
          name: 'Fall 2',
          children: [],
          totalCredits: 0,
          gpa: 0.0
        },
        {
          name: 'Spring 2',
          children: [],
          totalCredits: 0,
          gpa: 0.0
        },
        {
          name: 'Fall 3',
          children: [],
          totalCredits: 0,
          gpa: 0.0
        },
        {
          name: 'Spring 3',
          children: [],
          totalCredits: 0,
          gpa: 0.0
        },
        {
          name: 'Fall 4',
          children: [],
          totalCredits: 0,
          gpa: 0.0
        },
        {
          name: 'Spring 4',
          children: [],
          totalCredits: 0,
          gpa: 0.0
        }
      ],
    }
  },

  //These are methods for the drag and drop group
  methods:{

    writeUserData(email, name) {
        const db = getDatabase();
        set(ref(db, 'users/' + email), {
            name: name,
            email: email,
            // semesters: this.semesters,
            semesters: JSON.stringify(this.semesters),
        });
    },

    getUserInfo(){
        const auth = getAuth();
        auth.onAuthStateChanged(function(user) {
            if (user) {
            // User is signed in.
            alert("Name: " + user.displayName + "\nEmail: " + user.email);
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
      console.log("getCredits called");
      semesters.forEach(Element => {
        Element.totalCredits = 0;
        Element.gpa = 0.0;
        count = 0;
        Element.children.forEach(Element1 => {
          Element.totalCredits = Element1.credits + Element.totalCredits;
          count = count + 1;
          if(Element1.grade == "A"){
            Element.gpa = 4.0 + Element.gpa;
          }
          else if(Element1.grade == "A-"){
            Element.gpa = 3.7 + Element.gpa;
          }
          else if(Element1.grade == "B+"){
            Element.gpa = 3.3 + Element.gpa;
          }
          else if(Element1.grade == "B"){
            Element.gpa = 3.0 + Element.gpa;
          }
          else if(Element1.grade == "B-"){
            Element.gpa = 2.7 + Element.gpa;
          }
          else if(Element1.grade == "C+"){
            Element.gpa = 2.3 + Element.gpa;
          }
          else if(Element1.grade == "C"){
            Element.gpa = 2.0 + Element.gpa;
          }
          else if(Element1.grade == "C-"){
            Element.gpa = 1.7 + Element.gpa;
          }
          else if(Element1.grade == "D+"){
            Element.gpa = 1.3 + Element.gpa;
          }
          else if(Element1.grade == "D"){
            Element.gpa = 1.0 + Element.gpa;
          }
          else if(Element1.grade == "D-"){
            Element.gpa = 0.7 + Element.gpa;
          }
          else if(Element1.grade == "F"){
            Element.gpa = 0.0 + Element.gpa;
          }
          else {
            Element.gpa = 0.0 + Element.gpa;
          }
          // console.log(Element.totalCredits);
        })
        Element.gpa = Element.gpa / count;
      })
    },

    addSemester(semesters,nameSem){
      semesters
    },

    save(received){
        const auth = getAuth();
        const user = auth.currentUser;
        console.log("Received:", received);
        console.log(JSON.stringify(this.semesters));
        this.writeUserData(user.email.split("@")[0], user.displayName);
        alert("Saved!");
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
      this.getCredits(this.semesters);
      this.addSemester(this.semesters, 'test');
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
