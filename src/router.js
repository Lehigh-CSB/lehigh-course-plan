import Vue from 'vue'
import Router from 'vue-router'

import Plan from './Plan.vue'
import Auth from './Auth.vue'

import {getAuth} from 'firebase/auth'

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '*',
            redirect: '/plan'
        },
        {
            path: '/',
            redirect: '/plan'
        },
        {
            path: '/auth',
            name: 'auth',
            component: Auth
        },
        {
            path: '/plan',
            name: 'plan',
            component: Plan,
            meta: {
                requiresAuth: true
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const currentUser = getAuth().currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if(requiresAuth && !currentUser) next('auth');
    else if (!requiresAuth && currentUser) next('plan');
    else next();
});

export default router;