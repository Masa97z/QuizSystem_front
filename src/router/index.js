import { createRouter, createWebHistory } from 'vue-router'
import ContestantView from '../views/ContestantView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ContestantView
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/DashboardView.vue')
      },
      {
        path: 'quizzes',
        name: 'AdminQuizzes',
        component: () => import('../views/admin/QuizzesView.vue')
      },
      {
        path: 'quiz-details/:id',
        name: 'AdminQuizDetails',
        component: () => import('../views/admin/QuizDetailsView.vue'),
        props: true
      },
      {
        path: 'create',
        name: 'AdminCreateQuiz',
        component: () => import('../views/admin/CreateQuizView.vue')
      },
      {
        path: 'edit/:id',
        name: 'AdminEditQuiz',
        component: () => import('../views/admin/EditQuizView.vue'),
        props: true
      },
      {
        path: 'participants',
        name: 'AdminParticipants',
        component: () => import('../views/admin/ParticipantsView.vue')
      },
      {
        path: 'winners',
        name: 'AdminWinners',
        component: () => import('../views/admin/WinnersView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
