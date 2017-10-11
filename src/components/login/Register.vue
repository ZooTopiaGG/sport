<template>
    <div class="register">
        <group>
            <x-input v-model="mobile" required keyboard="number" is-type="china-mobile" style="border-bottom:1px solid #D7D7D7 ;padding: 15px 0;" placeholder="手机号">
                <img slot="label" style="padding-right:10px;display:block;" src="../../../static/img/icon/shouji@2x.png" width="14" height="18">
            </x-input>
            <x-input v-model="sms_code" class="weui-vcode" style="border-bottom:1px solid #D7D7D7 ;padding: 15px 0;" placeholder="验证码">
                <img slot="label" style="padding-right:10px;display:block;" src="../../../static/img/icon/yanzhengma@2x.png" width="15" height="15">
                <x-button @click.native="sendMsg" slot="right" :disabled="waiting" :text="waiting ?waiting_text:'发送验证码'" type="default" mini></x-button>
            </x-input>
            <x-input ref="password" :required="false" :show-clear='false' type="password" v-model="password" style="border-bottom:1px solid #D7D7D7 ;padding: 15px 0;" placeholder="密码(最少6位)">
                <img slot="label" style="padding-right:10px;display:block;" src="../../../static/img/icon/mima@2x.png" width="11" height="17">
                <img slot="right" id="showpwd" @click="showpassword" style="padding-right:20px;display:block;" src="../../../static/img/icon/bukejian@2x.png" width="14" height="13">
            </x-input>
            <x-input ref="password2" v-model="password2" type="password" :equal-with="password" style="border-bottom:1px solid #D7D7D7 ;padding: 15px 0;" placeholder="确认密码">
                <img slot="label" style="padding-right:10px;display:block;" src="../../../static/img/icon/mima@2x.png" width="11" height="17">
            </x-input>
            <x-button type="default" class="submit" @click.native="register">提交</x-button>
        </group>
    </div>
</template>
<script>
import { Group, XInput, XButton, Loading } from 'vux'
export default {
    components: {
        Group, XInput, XButton, Loading
    },
    data() {
        return {
            sms_code: '',
            mobile: null,
            password: '',
            password2: '',
            showpwd: false,
            waiting_text: '(60s)后重试',
            waiting: false
        }
    },
    methods: {
        showpassword() {
            this.showpwd = !this.showpwd;
            if (this.showpwd) {
                this.$refs.password.$el.querySelector('input').setAttribute('type', 'text')
                this.$refs.password2.$el.querySelector('input').setAttribute('type', 'text')

                this.$refs.password.$el.querySelector('#showpwd').setAttribute('src', '../../../static/img/icon/kejian@2x.png')
            }
            else {
                this.$refs.password.$el.querySelector('input').setAttribute('type', 'password')
                this.$refs.password.$el.querySelector('#showpwd').setAttribute('src', '../../../static/img/icon/bukejian@2x.png')
                this.$refs.password2.$el.querySelector('input').setAttribute('type', 'password')

            }
        },
        sendMsg() {
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
        register() {
            var self = this;
            if (self.password !== self.password2) {
                self.$vux.toast.text('两次密码不一致', 'middle')
                return
            }
            axios.post('/api/register', { mobile: self.mobile, password: self.password, sms_code: self.sms_code }).then(function(response) {
                self.$vux.loading.show({
                    text: '注册成功,即将跳转'
                })
                setTimeout(() => {
                    self.$vux.loading.hide()
                    self.$router.go(-1)
                }, 3000)
            }).catch(function(error) {
                self.$vux.toast.text(error.response.data.message, 'middle')
            });
        }
    }

}
</script>
<style >
.weui-cells {
    margin-top: 0 !important;
}

.weui-cells:before,
.weui-cells:after,
.weui-cell:before,
.weui-cell:after {
    border: none !important;
}

.register {
    flex-grow: 7.5;
    padding-left: 10px
}

.weui-vcode button {
    border-radius: 2px;
    padding: 0px 5px;
    margin-right: 10px;
    color: #2B2B2B;
    border: 1px solid #2B2B2B;
}

.weui-vcode button::after {
    border-radius: 2px;
}

.submit {
    width: 80% !important;
    margin-top: 20px;
    line-height: 47px !important;
    border-radius: 23px !important;
    background-color: #2E2C2F;
    color: #fff;
}
</style>
