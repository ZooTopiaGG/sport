<template>
    <div>
        <ul class="order_top">
            <li>
                <span>
                    <label for="">订单号:</label>{{details.order_no}}</span>
            </li>
            <li>
                <span style="color:#FF6868">
                    <label for="">订单状态:</label>{{status [details.status]}}</span>
            </li>
            <li style="border-bottom: none">
                <span>
                    <label for="">创建时间:</label>{{created_at}}</span>
            </li>
        </ul>

        <div class="venue">
            <p class="venue_name">{{details.train.venue.name}}</p>
            <div class="venue_info">
                <img :src="details.train.venue.image" alt="">
                <div class="venue_info_right">
                    <h4>{{details.train.title}}</h4>
                    <span class="venue_time">{{details.train.start_date}} {{details.train.start_time}}开始</span>
                    <span class="venue_address">{{details.train.venue.address}}</span>
                </div>
            </div>
        </div>
        <div class="order_info">
            <div class="order_status">
                <span v-if="details.train.price>0">
                    ￥{{details.train.price*0.01}}
                </span>
                <span v-else>
                    免费体验
                </span>
                <span style="color:#FF6868">
                    {{status [details.status]}}
                </span>

            </div>
            <p>
                {{details.name}}({{details.mobile}}) </br>
                {{details.train.start_date}} {{details.train.start_time}}开始 </br>
                {{details.train.venue.address}}
            </p>
            <div class="action">
                <a style="border:1px solid #E9E9E9;background-color:#fff;color: #2E2C2F;" v-if="details.status<3 &&details.status>0" @click.stop="cancel(details.id)">申请退款</a>
                <a style="border:1px solid #E9E9E9;background-color:#fff;color: #2E2C2F;" v-if="details.status == '0'" @click.stop="cancel(details.id)">撤销订单</a>

                <router-link :to="{path:'/orders/comment/'+details.id}" v-if="details.status == '3'">去评价</router-link>
            </div>
        </div>
        <div class="price_num">
            <ul>
                <li>
                    <span>课程总价</span>
                    <span>￥{{details.train.price*0.01}}</span>
                </li>
                <li>
                    <span>优惠</span>
                    <span>-￥{{details.payment.discount*0.01}}</span>
                </li>
                <li style="border-bottom:none">
                    <span>订单实际支付金额</span>
                    <span style="color:#FF6868">￥{{details.payment.amount*0.01}}</span>
                </li>
            </ul>
        </div>
        <group style="margin-top:10px">
            <cell style="font-size:14px;padding:10px" :link="'/orders/detail/user/'+details.id" title="报名人信息" is-link>
                <div slot="value">
                    <span style="color:#2E2C2F">{{details.name}}({{details.mobile}})</span>
                </div>
            </cell>
        </group>
        <a v-if="details.status!=0" class="tel" @click="call(details.train.venue.phone)">
            <img src="../../assets/dianhua.png" width="21" height="21" alt=""> 联系主办方</a>
        <template v-if="details.status==0">
            <div class="pay_type">
                <group>
                    <radio v-model="channel" :options="pay_type"></radio>
                </group>
            </div>
            <div class="agreement" style="padding-bottom:120px">
                <img src="../../../static/img/icon/tongyi@2x.png" width="12" height="12"> 我已同意
                <a href="http://www.heermengsport.com/page/static/useragreement.html">荷尔蒙用户协议</a>
            </div>
            <div class="apply clearfix">
                <div class="tips">
                    <img src="../../../static/img/icon/tishi@2x.png" width="15" height="15"> 请在{{time}}分钟内完成付款，否则订单会自动取消
                </div>
                <span v-if="details.train.price>0" class="apply_price">
                    <span style="color:#000">合计</span>￥
                    <i>{{details.train.price*0.01}}</i>元
                </span>
                <span v-else class="apply_price">
                    <i>免费体验</i>
                </span>
                <a @click="pay">确认支付</a>
            </div>
        </template>

    </div>
</template>
<script>
import {
    Group, Cell, Radio
} from 'vux'
export default {
    components: {
        Group, Cell, Radio
    },
    data() {
        return {
            time: 10,
            nowTime: 600000,
            channel: 'alipay_wap',
            pay_type: [
                {
                    icon: '../../../static/img/icon/zhifubao@2x.png',
                    value: '支付宝支付',
                    key: 'alipay_wap'
                },
                {
                    icon: '../../../static/img/icon/weixn@2x.png',
                    value: '微信支付',
                    key: 'wx_wap'
                }
            ],
            details: {
                train: {
                    venue: {

                    }
                },

                payment: {
                    amount: 0,
                    discount: 0
                }
            },
            created_at: '',
            status: ['已创建', '已支付', '已接受', '已完成', '已评价', '已取消', '已拒绝', '退款中', '已退款']
            ,

        }
    },
    mounted() {
        this.getOrderDetail()
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            this.pay_type[1].key = 'wx_pub'
        }
        if (self.$route.query.code) {
            self.code = self.$route.query.code
            self.$vux.alert.show({
                title: '提示',
                content: '绑定成功',
                onHide() {

                }
            })
            axios.get('/api/oauth/weixin/info', { params: { code: self.code } }).then(res => {
                localStorage.setItem('openid', res.data.openId)
            }).catch(err => {
                console.log(err)
            })
        }
    },
    methods: {
        call(tel) {
            window.location.href = 'tel:' + tel
        },
        pay() {
            var self = this
            if (self.channel == 'wx_pub' && !localStorage.getItem('openid')) {
                self.$vux.confirm.show({
                    title: '提示',
                    content: '请绑定微信账号进行支付',
                    onCancel() {

                    },
                    onConfirm() {
                        window.location.href = 'http://120.77.43.178:8088/api/oauth/weixin/page?redirect_uri=http://www.heermengsport.com/page' + self.$route.fullPath
                    }
                })
            }
            if (self.details.train.price > 0) {
                axios.post('/api/charge/trains',
                    {
                        paymentable_id: self.details.id,
                        open_id: localStorage.getItem('openid') || '',
                        channel: self.channel,//wx_wap
                        success_url: 'http://www.heermengsport.com/page/orders/success/' + self.details.id
                    }
                ).then(function(response) {
                    pingpp.createPayment(response.data.charge, function(result, err) {
                        if (result == "fail") {
                            self.$vux.toast.text('支付失败，请从新支付', 'top')
                        }
                    });
                }).catch(function(error) {
                    self.$vux.toast.text(error.response.data.message, 'middle')
                })
            } else {
                axios.post('/api/orders/balance/pay/trains', {
                    paymentable_id: self.details.id,
                }).then(
                    function(res) {
                        window.location.href = 'http://www.heermengsport.com/page/orders/success/' + self.details.id
                    }
                    )
            }
        },
        timer() {
            var self = this
            self.nowTime = 10 * 60 * 1000 - (new Date().getTime() - self.details.created_at * 1000)
            if (self.nowTime > 0) {
                self.time = dateFormat.datef('mm:ss', self.nowTime)
            }
            else {
                self.$vux.alert.show({
                    title: '提示',
                    content: '订单已过期，请重新下单',
                    onHide() {
                        self.$router.push({
                            path: '/enroll/' + self.details.train.id
                        })
                    }
                })
            }
        },
        getOrderDetail() {
            var self = this
            self.$vux.loading.show({
                text: 'loading...'
            })
            axios.get('/api/orders/trains/' + self.$route.params.id + '/detail').then(
                function(response) {
                    self.details = response.data
                    self.created_at = dateFormat.datef('YYYY-MM-dd HH:mm', response.data.created_at * 1000)
                    self.details.train.start_date = dateFormat.datef('YYYY-MM-dd', response.data.train.start_date * 1000)
                    self.details.train.venue.start_time = response.data.train.start_time.slice(1, 5)
                    self.$vux.loading.hide()
                    if (self.details.status == 0)
                        self.timer()
                }
            ).catch(function(error) {
                self.$vux.loading.hide()
                self.$vux.toast.text(error.response.data.message, 'middle')
            });
        },
        cancel(id, name) {
            var self = this
            this.$vux.confirm.show({
                title: '提示',
                content: '是否确认取消订单',
                onCancel() {
                    return
                },
                onConfirm() {
                    axios.post('/api/orders/trains/' + id + '/cancel')
                        .then(function(response) {
                            self.$vux.toast.text('取消成功', 'middle')
                            setTimeout(function() {
                                self.$router.go(0)
                            }, 2000);
                        }).catch(function(error) {
                            self.$vux.toast.text(error.response.data.message, 'middle')
                        })
                }
            })
        },

    },
    watch: {
        details: {
            handler: function(val, oldVal) {
                if (!val.payment)
                    val.payment = oldVal.payment
            },
            deep: true
        },
        nowTime: function(val, oldVal) {
            var self = this
            if (val > 0) {
                var t = setTimeout(function() {
                    self.timer()
                }, 1000);
            }
            else {
                clearTimeout(t)
            }
        }
    }
}
</script>
<style scoped>
.order_top {
    margin-top: 10px;
    padding: 0 10px;
    background-color: #fff;
}

.order_top li {
    display: block;
    line-height: 42px;
    font-size: 13px;
    color: #2E2C2F;

    border-bottom: 1px solid #F5F5F5;
}

.order_top li label {
    color: #878787;
    display: inline-block;
    width: 70px;
    margin-right: 24px;
}

.venue {
    margin-top: 10px;
    background-color: #fff;
}

.venue p {
    line-height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #2E2C2F;
    font-size: 14px;
    border-bottom: 1px solid #F5F5F5;
    padding: 0 10px;
}

.venue_info {
    display: flex;
    justify-content: space-between;
    padding: 12px 10px;
}

.venue_info img {
    max-height: 62px;
    width: 25%;
    border-radius: 5px;
}

.venue_info_right {
    width: 72%;
    color: #2E2C2F;
    font-size: 14px;
    height: 64px;
    overflow: hidden;
}

.venue_info_right h4 {
    line-height: 16px;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    min-height: 32px;
}

.venue_info_right span {
    display: block;
    color: #A0A0A0;
    font-size: 12px;
    line-height: 1.4;
}

.order_info {
    height: 144px;
    margin: 10px 10px 0 15px;
    background-color: #fff;
    padding: 0 12px 0px 40px;
    position: relative;
    display: block;
}

.order_info::before {
    content: "";
    display: block;
    height: 100%;
    width: 1px;
    position: absolute;
    left: -5px;
    top: 0;
    border-left: 14px dotted #fff;
}

.order_status {
    width: 100%;
    display: flex;
    height: 35px;
    line-height: 35px;
    justify-content: space-between;
}

.order_info p {
    line-height: 22px;
}

.order_info .action {
    text-align: right;
}

.order_info .action a {
    display: inline-block;
    padding: 8px 13px;
    font-size: 14px;
    border-radius: 15px;
    line-height: 1;
    background-color: #FF6868;
    color: #fff;
}

.price_num {
    margin-top: 10px;
    background-color: #fff;
    padding: 0 10px;
}

.price_num li {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 37px;
}

.tel {
    display: block;
    text-align: center;
    line-height: 45px;
    margin-top: 10px;
    background-color: #fff;
    color: #2E2C2F;
}

.tel img {
    margin-right: 5px;
}
</style>