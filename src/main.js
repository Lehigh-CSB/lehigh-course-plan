/* istanbul ignore file */
import Vue from 'vue'
import App from './App.vue'
import Auth from './Auth.vue'
import router from './router'
import { initializeApp } from "firebase/app"
import { getAuth } from 'firebase/auth';

let app = '';

var firebaseConfig = {
  apiKey: "AIzaSyAWrzYelgpTNzmRG2FffV4Cvo94_92ezbg",
  authDomain: "lehigh-course-plan.firebaseapp.com",
  projectId: "lehigh-course-plan",
  storageBucket: "lehigh-course-plan.appspot.com",
  messagingSenderId: "1006911833931",
  appId: "1:1006911833931:web:aa196b51684cf65165cace",
  measurementId: "G-037FB0XFH2"
};

// Initialize Firebase
initializeApp(firebaseConfig);

Vue.config.productionTip = false

getAuth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  }
});