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
      path: '/dashboard',
      name: 'dashboard',
      component: dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      redirect: '/login',
    }
  ],
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('user');

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if ((to.path === '/login') && isLoggedIn) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
