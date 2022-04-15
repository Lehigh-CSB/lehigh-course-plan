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
      @addSem="addSem"
      @deleteSem="deleteSem"
    >
      <template #dd-card="{ cardData }">
        <custom-card
          :data="cardData"
          @completed="completedMarked"
          @grade-updated="gradeUpdated"
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
          season: 1,
          year: 1,
          children: [],
          totalCredits: 0,
          gpa: 0
        },
        {
          name: 'Spring 1',
          season: 3,
          year: 1,
          children: [],
          totalCredits: 0,
          gpa: 0
        },
        {
          name: 'Fall 2',
          season: 1,
          year: 2,
          children: [],
          totalCredits: 0,
          gpa: 0
        },
        {
          name: 'Spring 2',
          season: 3,
          year: 2,
          children: [],
          totalCredits: 0,
          gpa: 0
        },
        {
          name: 'Fall 3',
          season: 1,
          year: 3,
          children: [],
          totalCredits: 0,
          gpa: 0
        },
        {
          name: 'Spring 3',
          season: 3,
          year: 3,
          children: [],
          totalCredits: 0,
          gpa: 0
        },
        {
          name: 'Fall 4',
          season: 1,
          year: 4,
          children: [],
          totalCredits: 0,
          gpa: 0
        },
        {
          name: 'Spring 4',
          season: 3,
          year: 4,
          children: [],
          totalCredits: 0,
          gpa: 0
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
        Element.gpa = 0;
        let count = 0;
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

    gradeUpdated(data){
      console.log(data);
      this.getCredits(this.semesters);
    },

    originalBucketDropEvent(result) {
      console.log("Original: ", result);
    },

    destinationBucketDropEvent(columnName, result) {
      this.getCredits(this.semesters);
    },

    cancel() {
      console.log("Cancel hit");
    },

    addSem(received){
      if(this.checkInputSemester(received)){
        return;
      }
      this.semesters.sort()
      var contains = false;
      this.semesters.forEach(Element =>{
        if(Element.name == received.name+" "+received.year){
          contains = true;
        }
      })
      if(contains){
        alert("Semester already included!");
      }else{
        var newSeason;
        switch(received.name){
          case "Fall":
            newSeason =1;
            break;
          case "Winter":
            newSeason =2;
            break;
          case "Spring":
            newSeason =3;
            break;
          case "Summer":
            newSeason =4;
            break;
        }
        this.semesters.push({
          name: received.name+" "+received.year,
          season: newSeason,
          year: received.year,
          children: [],
          totalCredits: 0,
        });
        this.semesters.sort(this.compare);
      }
    },
    deleteSem(received){
      if(this.checkInputSemester(received)){
        return;
      }
      var i;
      var contains = true;
      for (i = this.semesters.length - 1; i >= 0; i -= 1) {
        if (this.semesters[i].name == received.name+" "+received.year) {
        this.semesters.splice(i, 1);
        contains = false;
        }
      }
      if(contains){
        alert("Semester not in plan!");
      }
    },
    checkInputSemester(received){
      if(received.name == undefined || received.year == undefined){
        alert("Please fill in both fields for semester");
        return true;
      }
      return false;
    },
    compare(a,b) {
      if(a.year < b.year){
        return -1;
      }
      if(a.year > b.year){
        return 1;
      }
      if(a.season < b.season){
        return -1;
      }
      if(a.season > b.season){
        return 1;
      }
      return 0;
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
