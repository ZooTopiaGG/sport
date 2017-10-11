<template>
    <div>
        <div class="enroll_desc">
            <img :src="details.cover" alt="">
            <p class="enroll_desc_name">
                {{details.title}}
            </p>
            <div class="enroll_desc_price">
                <span>已报名
                    <i>{{details.users_count}}</i>/{{details.capacity_max}}</span>
                <span class="number">￥
                    <label>{{details.price*0.01}}</label>
                </span>
            </div>
        </div>
        <div class="join">
            <group>
                <x-input title="姓名" v-model="order.name" placeholder="请填写" :min="1" :show-clear="true" text-align="right" placeholder-align="right" required></x-input>
                <x-input title="手机" v-model="order.mobile" placeholder="请填写" name="mobile" keyboard="number" is-type="china-mobile" :show-clear="true" text-align="right" placeholder-align="right"></x-input>
                <selector direction="rtl" v-model="order.gender" value="男" title="性别" :options="['男','女']"></selector>
                <x-input title="年龄" v-model="order.age" placeholder="请填写" :min="1" name="age" type="text" text-align="right" placeholder-align="right" required></x-input>
                <x-input class="unmust" :required="false" title="备注" v-model="order.remark" placeholder="请填写" :min="1" :show-clear="true" text-align="right" placeholder-align="right"></x-input>
            </group>
        </div>
    
        <group class="s_b" style="background-color:transparent">
            <group-title slot="title">
                <i style="color:#FEC958;font-style:normal; ">*</i>为必填项目
            </group-title>
            <div class="submit_btn ">
                <x-button type="default " @click.native="submit ">提交</x-button>
            </div>
        </group>
    </div>
</template>
<script>
import {
    XInput,
    Group,
    XButton,
    Selector,
    GroupTitle, Toast,

    Cell
} from 'vux'
export default {
    components: {
        XInput,
        XButton,
        Group, GroupTitle,
        Selector, Toast,
        Cell
    },
    data() {
        return {
            order: {
                name: '',
                mobile: '',
                age: '20',
                gender: '男',
                remark: ''
            },
            details: {
                price: 0,
                images: [
                    {
                        id: '',
                        url: '',
                    }
                ]
            }
        }

    },
    mounted() {
        this.getDetails();
    },
    methods: {
        getDetails() {
            var self = this;
            axios.get('/api/trains/' + this.$route.params.id + '/detail').then(function (response) {
                self.details = response.data;
            }).catch(function (err) {
                self.$vux.toast.text('网络错误', 'top')
            });

        },
        submit() {
            var self = this;
            axios.post('/api/trains/' + this.$route.params.id + '/join', {
                token: localStorage.getItem('token'),
                name: this.order.name,
                age: this.order.age,
                mobile: this.order.mobile,
                gender: this.order.gender,
                remark: this.order.remark
            }).then(function (response) {
                self.$router.push({
                    path: '/orders/pay/' + response.data.id
                })
            }).catch(function (error) {
                self.$vux.toast.text(error.response.data.message, 'middle')
            });
        }
    }
}
</script>
<style>
.enroll_desc {
    background-color: #fff;
}

.enroll_desc img {
    width: 100%;
    height: 145px;
}

.enroll_desc_name {
    padding: 15px 10px;
    color: #424242;
    font-size: 14px;
}

.enroll_desc_price {
    color: #AEAEAE;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
}

.enroll_desc_price span {
    float: left;
    vertical-align: middle;
    line-height: 27px;
}

.enroll_desc_price span i {
    color: #414141;
    font-style: normal;
    font-size: 13px;
}

.enroll_desc_price .number {
    float: right;
    color: #FA342C;
    vertical-align: text-bottom;
}

.enroll_desc_price .number label {
    font-size: 17px;
}

.weui-label {
    font-size: 14px;
}

.weui-label::before {
    content: '*';
    color: #FEC958;
    margin-right: 5px;
    position: absolute;
    top: 14px;
    left: 0px;
}

.unmust .weui-label::before {
    content: '' !important;
}

.submit_btn {
    width: 70%;
    margin: 0 auto;
    background-color: transparent;
}

.submit_btn button {
    background-color: #FEC958;
    border-radius: 20px;
    color: #2E2C2F;
    border: none;
}

.submit_btn button::after {
    border: none;
}


.join {
    background-color: #fff;
    margin-top: 10px;
    padding: 0 10px;
}

.join .weui-cells {
    width: 100%;
    background-color: transparent !important;
}

.join .weui-cell {
    padding: 10px 8px;
}

.join .vux-selector.weui-cell_select-after {
    padding-left: 8px;
}

.s_b .weui-cells {
    background-color: transparent;
}
</style>