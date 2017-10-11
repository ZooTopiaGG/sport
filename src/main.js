import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import router from './router/index'
import { ToastPlugin, LoadingPlugin, AlertPlugin, ConfirmPlugin } from 'vux'

import 'mint-ui/lib/style.css'
import { Picker, Popup } from 'mint-ui'
import 'element-ui/lib/theme-default/index.css'
import { InputNumber } from 'element-ui'

Vue.component(InputNumber.name, InputNumber)

Vue.component(Picker.name, Picker)
Vue.component(Popup.name, Popup)

Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)





FastClick.attach(document.body)

Vue.config.productionTip = false


window.dateFormat = require('./assets/js/datef');
window.axios = require('../node_modules/axios');
window.pingpp = require('pingpp-js');



var token = ''
router.beforeEach((to, from, next) => {
    token = localStorage.getItem('token')
    if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
        if (token) { //获取当前的token是否存在
            next();
        } else {
            localStorage.setItem('redirect', to.fullPath)
            next({
                path: '/login',
            })
        }
    } else {
        next();
    }
})

axios.interceptors.request.use(
    config => {
        if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = `bearer ${token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    // localStorage.setItem('token', '')
                    router.replace({
                        path: '/login',
                        query: { redirect: router.currentRoute.fullPath }
                    })
            }
        }
        return Promise.reject(error) // 返回接口返回的错误信息
    });
/* eslint-disable no-new */



new Vue({
    router,
    render: h => h(App)
}).$mount('#app-box')