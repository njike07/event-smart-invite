import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/login-marie',
    name: 'LoginMarie',
    component: () => import('../views/LoginMarieView.vue')
  },
  {
    path: '/register-marie',
    name: 'RegisterMarie',
    component: () => import('../views/RegisterMarieView.vue')
  },
  {
    path: '/login-photographe',
    name: 'LoginPhotographe',
    component: () => import('../views/LoginPhotographeView.vue')
  },
  {
    path: '/register-photographe',
    name: 'RegisterPhotographe',
    component: () => import('../views/RegisterPhotographeView.vue')
  },
  {
    path: '/dashboard-admin',
    name: 'DashboardAdmin',
    component: () => import('../views/DashboardAdminView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard-marie',
    name: 'DashboardMarie',
    component: () => import('../views/DashboardMarieView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard-photographe',
    name: 'DashboardPhotographe',
    component: () => import('../views/DashboardPhotographeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invites',
    name: 'Invites',
    component: () => import('../views/InvitesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invitations',
    name: 'Invitations',
    component: () => import('../views/InvitationsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/rsvp/:code',
    name: 'RSVP',
    component: () => import('../views/RSVPView.vue')
  },
  {
    path: '/invite-members-view/:code',
    name: 'PublicLanding',
    component: () => import('../views/PublicLandingView.vue')
  },
  {
    path: '/photos',
    name: 'Photos',
    component: () => import('../views/GalerieView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/galerie',
    name: 'Galerie',
    component: () => import('../views/GalerieView.vue')
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: () => import('../views/WishlistView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/wishlist-public',
    name: 'WishlistPublic',
    component: () => import('../views/WishlistPublicView.vue')
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: () => import('../views/TimelineView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/timeline-public',
    name: 'TimelinePublic',
    component: () => import('../views/TimelinePublicView.vue')
  },
  {
    path: '/guestbook',
    name: 'Guestbook',
    component: () => import('../views/GuestbookView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/guestbook-public',
    name: 'GuestbookPublic',
    component: () => import('../views/GuestbookPublicView.vue')
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('../views/AnalyticsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/table-plan',
    name: 'TablePlan',
    component: () => import('../views/TablePlanView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/table-finder',
    name: 'TableFinder',
    component: () => import('../views/TableFinderView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  // Désactivation temporaire de l'auth pour visualiser les pages
  next();
  
  // Code original (à réactiver plus tard)
  // const authStore = useAuthStore();
  // if (to.meta.requiresAuth && !authStore.isAuthenticated) {
  //   next('/');
  // } else if ((to.path === '/login' || to.path === '/login-marie' || to.path === '/login-photographe') && authStore.isAuthenticated) {
  //   next('/dashboard');
  // } else {
  //   next();
  // }
});

export default router;
