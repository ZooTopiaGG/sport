import Vue from 'vue'
import Router from 'vue-router'
import ProductDetails from '@/components/ProductDetails'
// import Address from '@/components/Address'
const Address = resolve => require(['@/components/Address'], resolve)
import Enroll from '@/components/Enroll'
import Login from '@/components/login/Login'
import LoginIndex from '@/components/login/Loginindex'
import Register from '@/components/login/Register'
import Mobile from '@/components/login/Mobile'
import Forget from '@/components/login/Forget'
import Bind from '@/components/login/Bind'


import Orders from '@/components/orders/Index'
import Pay from '@/components/orders/Pay'
import Comment from '@/components/orders/Comment'
import Detail from '@/components/orders/Detail'
import Userinfo from '@/components/orders/Userinfo'
import Success from '@/components/orders/Paycallback'








Vue.use(Router)

export default new Router({
    mode: 'history',
    base: 'page',
    routes: [{
            path: '/',
            redirect: '/details/1'
        }, {
            path: '/details/:id',
            name: 'ProductDetails',
            component: ProductDetails
        },
        {
            path: '/details/address/:id',
            name: 'Address',
            component: Address
        },
        {
            path: '/enroll/:id',
            name: 'Enroll',
            component: Enroll,
            meta: {
                requireAuth: true,
            },
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            children: [{
                path: '/login',
                component: LoginIndex
            }, {
                path: '/register',
                component: Register
            }, {
                path: '/mobile',
                component: Mobile
            }, {
                path: '/forgetpwd',
                component: Forget
            }]
        },
        {
            path: '/bind',
            name: 'Bind',
            component: Bind,
            meta: {
                requireAuth: true,
            },
        },
        {
            path: '/orders',
            component: Orders,
            meta: {
                requireAuth: true,
            },
        },
        {
            path: '/orders/pay/:id',
            component: Pay,
            meta: {
                requireAuth: true,
            },
        },
        {
            path: '/orders/success/:id',
            component: Success,
            meta: {
                requireAuth: true,
            },
        },
        {
            path: '/orders/Detail/:id',
            component: Detail,
            meta: {
                requireAuth: true,
            },
        },
        {
            path: '/orders/detail/user/:id',
            component: Userinfo,
            meta: {
                requireAuth: true,
            },
        },
        {
            path: '/orders/comment/:id',
            component: Comment,
            meta: {
                requireAuth: true,
            },
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    }

})