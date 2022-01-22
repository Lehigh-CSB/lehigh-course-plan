<template>
    <div id="auth">
        <header>CSB Course Manager</header>
        <h2>Course management and planning allows to make the most out of your available credits at Lehigh!</h2>
        <h2>Remember that course plans are fluid and subject to change, you should update your plan as your academic career evolves</h2>

        <div>
            <button @click="googleSignIn">
                Sign In with Google
            </button>
        </div>
    
    </div>
</template>

<script>
    import { initializeApp } from "firebase/app"
    import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
    export default {
        name: "auth",
        methods: {
            googleSignIn: function() {
            // We'll create functionality here
            let provider = new GoogleAuthProvider();
            const auth = getAuth();
            signInWithPopup(auth, provider)
                    .then((result) => {
                        // This gives you a Google Access Token. You can use it to access the Google API.
                        const credential = GoogleAuthProvider.credentialFromResult(result);
                        const token = credential.accessToken;
                        // The signed-in user info.
                        const user = result.user;
                        // console.log(user);
                        this.$router.replace('/');
                    })
                    .catch((error) => {
                        // Handle Errors here.
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        // The email of the user's account used.
                        const email = error.email;
                        // The AuthCredential type that was used.
                        const credential = GoogleAuthProvider.credentialFromError(error);
                        console.log(error);
                    });
            }
        },
    };
</script>

<style>
#auth {
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