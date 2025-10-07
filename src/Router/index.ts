import { createRouter, createWebHistory } from 'vue-router'
import login from "../components/login.vue";
import dashboard from "../components/dashboard.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: login,
            meta: { requiresAuth: false },
        },
        {
            path: '/',
            name: 'home',
            component: dashboard,
        }

    ],
})

// verification de l'authentification avant chaque changement de route
// router.beforeEach((to, from, next) => {
//     const isAuthPage = ['/login', '/otp'].includes(to.path)
//    // const isLoggedIn = !!localStorage.getItem('admin_jwt')
//     if (isAuthPage && isLoggedIn) {
//         return next('/')
//     }
//     if (!isAuthPage && !isLoggedIn) {
//         // If not logged in, redirect to login (except for auth pages)
//         return next('/login')
//     }
//     next()
// })

export default router
