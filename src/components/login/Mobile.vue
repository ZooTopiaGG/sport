<template>
    <div class="mobile_login">
        <group>
            <x-input v-model="mobile" required keyboard="number" is-type="china-mobile" style="border-bottom:1px solid #D7D7D7 ;padding: 15px 0;" placeholder="手机号">
                <img slot="label" style="padding-right:20px;display:block;" src="../../../static/img/icon/shouji@2x.png" width="14" height="18">
            </x-input>

            <x-input ref="password" :required="false" :show-clear='false' type="password" v-model="password" style="border-bottom:1px solid #D7D7D7 ;padding: 15px 0;" placeholder="密码(最少6位)">
                <img slot="label" style="padding-right:10px;display:block;" src="../../../static/img/icon/mima@2x.png" width="11" height="17">
                <img slot="right" id="showpwd" @click="showpassword" style="padding-right:20px;display:block;" src="../../../static/img/icon/bukejian@2x.png" width="14" height="13">
            </x-input>
            <div class="forgetPWD">
                <router-link :to="'/forgetpwd'">忘记密码</router-link>
            </div>
            <x-button type="default" class="submit" @click.native="mobileLogin">登录</x-button>
        </group>
    </div>
</template>
<script>
import { Group, XButton, XInput, Loading } from 'vux'

export default {
    components: {
        Group,
        XInput,
        XButton,
        Loading
    },
    data() {
        return {
            mobile: '',
            password: '',
            showpwd: false
        }
    },
    methods: {
        showpassword() {
            this.showpwd = !this.showpwd;
            if (this.showpwd) {
                this.$refs.password.$el.querySelector('input').setAttribute('type', 'text')
                this.$refs.password.$el.querySelector('#showpwd').setAttribute('src', '../../../static/img/icon/kejian@2x.png')
            } else {
                this.$refs.password.$el.querySelector('input').setAttribute('type', 'password')
                this.$refs.password.$el.querySelector('#showpwd').setAttribute('src', '../../../static/img/icon/bukejian@2x.png')
            }
        },
        mobileLogin() {
            var self = this
            self.$vux.loading.show({
                text: 'loading...'
            })
            axios.post('/api/login', {
                mobile: self.mobile,
                password: self.password
            }).then(
                function(response) {
                    localStorage.setItem('token', response.data.token)
                    if (response.data.wechat) {
                        localStorage.setItem('openid', response.data.wechat.openid)
                    }
                    // let ua = window.navigator.userAgent.toLowerCase();
                    // if (window.isApp()) {
                    //     if (/iphone|ipad|ipod/.test(ua)) {
                    //         alert('开始调用ios方法传入用户')
                    //         window.webkit.messageHandlers.getUserInfo.postMessage(response.data);

                    //     } else if (/android/.test(ua)) {
                    //         alert('开始调用android方法传入用户')

                    //         window.JsToNative.jsMethodReturn(response.data);
                    //     }
                    // }
                    var redirect = localStorage.getItem('redirect')
                    self.$vux.loading.hide()
                    self.$router.push({
                        path: redirect
                    })
                }).catch(function(error) {
                    self.$vux.loading.hide()
                    console.log(error)
                    self.$vux.toast.text(error.response.data.message, 'middle')
                })
        }
    }
}
</script>
<style>
.mobile_login {
    flex-grow: 4.0625;
}

.mobile_login .forgetPWD {
    text-align: right;
    margin-top: 20px;
}

.mobile_login .forgetPWD a {
    font-size: 14px;
    color: #747373;
}
</style>