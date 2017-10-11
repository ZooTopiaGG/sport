<template>
    <div class="login_container">
        <div class="logo" style="flex-direction:column">
            <img src="../../../static/img/icon/bangding@2x.png" alt="">
            <div style="margin-top:10px">绑定手机号，让账号更安全</div>
        </div>
        <div class="mobile_login">
            <group>
                <x-input v-model="mobile" required keyboard="number" is-type="china-mobile" style="border-bottom:1px solid #D7D7D7 ;padding: 15px 0;" placeholder="手机号">
                    <img slot="label" style="padding-right:20px;display:block;" src="../../../static/img/icon/shouji@2x.png" width="14" height="18">
                </x-input>
                <x-input v-model="sms_code" class="weui-vcode" style="border-bottom:1px solid #D7D7D7 ;padding: 15px 0;" placeholder="验证码">
                    <img slot="label" style="padding-right:10px;display:block;" src="../../../static/img/icon/yanzhengma@2x.png" width="15" height="15">
                    <x-button @click.native="sendMsg" slot="right" :disabled="waiting" :text="waiting ?waiting_text:'发送验证码'" type="default" mini></x-button>
                </x-input>
                <x-button type="default" class="submit" @click.native="submit">下一步</x-button>
            </group>
        </div>
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
            sms_code: '',
            waiting_text: '(60s)后重试',
            waiting: false
        }
    },
    methods: {
        sendMsg() {
            console.log('aaaaaaaaaaaaaaaaaaaaaaaa')

            var self = this
            if (self.mobile == null) {
                self.$vux.toast.text('请输入手机号', 'middle')
            } else {
                this.waiting = !this.waiting
                var smsTime = 60
                axios.post('/api/sms', { mobile: self.mobile, }).then(
                    function(res) {
                        var timer = setInterval(function() {
                            self.waiting_text = '(' + smsTime + 's)后重试'
                            smsTime--
                            if (smsTime < 0) {
                                clearInterval(timer)
                                self.waiting = !this.waiting
                            }
                        }, 1000);
                    }
                )
            }
        },
        submit() {
            var self = this
            axios.post('/api/user/bind', {
                mobile: self.mobile,
                sms_code: self.sms_code
            }).then(function(res) {
                var redirect = localStorage.getItem('redirect')
                self.$vux.toast.text('绑定成功', 'middle')
                setTimeout(function() {
                    self.$router.push({
                        path: redirect
                    })
                }, 1500);

            }).catch(function(err) {
                self.$vux.toast.text(err.response.data.message, 'top')
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
