<template>
    <div class="login_content">
        <div class="center_btn">
            <router-link :to="{path:'/mobile'}" class="mobile_login">手机号登陆</router-link>
            <router-link :to="{path:'/register'}" class="register">注册</router-link>
        </div>
        <div class="other">
            <divider>其他快捷登录方式</divider>
            <div class="other_row">
                <div class="other_btn">
                    <img src="../../../static/img/icon/qq@2x.png" @click="qqlogin" alt="">
                    <!-- <img src="../../../static/img/icon/weibo@2x.png" alt=""> -->
                    <a href="http://www.heermengsport.com/api/oauth/weixin/page?redirect_uri=http://www.heermengsport.com/page/login">
                        <img src="../../../static/img/icon/weixin@2x.png" alt="">
                    </a>

                </div>
            </div>

        </div>
    </div>
</template>
<script>
import {
    Divider
} from 'vux'
import getid from '../../assets/js/getQQid.js'
export default {
    components: {
        Divider

    },
    data() {
        return {
            openid: '',
            redirect: '',
            code: ''
        }
    },
    mounted() {
        this.$nextTick(function() {
            var self = this
            self.redirect = localStorage.getItem('redirect')
            if (QC.Login.check()) {
                QC.Login.getMe(function(openId, accessToken) {
                    self.openid = openId
                    self.loginOk(self.openid, 'qq')
                })
            }
            if (self.$route.query.code) {
                self.wechatlogin(self.$route.query.code)
            }

        })

    },
    methods: {
        qqlogin() {
            var self = this

            var oOpts = {
                appId: "1106301038",
                redirectURI: "http://www.heermengsport.com/page/login"
            }
            QC.Login.showPopup(oOpts)
        },
        wechatlogin(code) {
            var self = this
            if (QC.Login.check()) {
                QC.Login.signOut()
            }
            axios.get('/api/oauth/weixin/info', {
                params: {
                    code: code
                }
            }).then(function(res) {
                self.openid = res.data.openId
                self.loginOk(self.openid, 'wechat')
            }).catch(err => {
                self.$vux.toast.text(err.response.data.message, 'top')
            })
        },
        loginOk(openid, type) {
            var self = this
            axios.post('/api/oauth', { type: type, openid: openid }).then(function(res) {
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('openid', res.data.wechat.openid || '')

                // let ua = window.navigator.userAgent.toLowerCase();
                // if (window.isApp()) {
                //     if (/iphone|ipad|ipod/.test(ua)) {
                //         window.webkit.messageHandlers.getUserInfo.postMessage(response.data);

                //     } else if (/android/.test(ua)) {
                //         window.JsToNative.jsMethodReturn(response.data);
                //     }
                // }
                if (res.data.mobile) {
                    self.$router.push({
                        path: self.redirect
                    })
                } else {
                    self.$vux.confirm.show({
                        title: '提示',
                        content: '是否绑定手机号码？',
                        onCancel() {
                            self.$router.push({
                                path: self.redirect
                            })
                        },
                        onConfirm() {
                            self.$router.push({ path: '/bind' })
                        }
                    })
                }

            })
        }
    }
}
</script>
<style>
.login_content {
    flex-grow: 4;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}

.center_btn {
    flex-grow: 5;
}

.center_btn a {
    display: block;
    width: 90%;
    margin: 0 auto;
    line-height: 45px;
    text-align: center;
    height: 45px;
    border: 1px solid #2E2C2F;
    border-radius: 23px;
    margin-bottom: 12px;
    font-size: 17px;
    color: #2E2C2F;
}

.center_btn a:first-child {
    background-color: #2E2C2F;
    color: #fff;
}

.other {
    flex-grow: 3;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}

.other_row {
    flex-grow: 2;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.other_btn {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    justify-content: center;
    margin-top: 20px;
    /* 注意 */
}

.other_btn img {
    width: 42px;
    height: 42px;
    margin: 0 20px;
}
</style>