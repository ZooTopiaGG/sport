<template>
    <div style="background-color: #efeff4;">
        <header style="position:fixed;width:100%;top:0;">
            <tab :line-width=2 active-color='#FEC957'>
                <tab-item class="vux-center" :selected="selected === item.value" v-for="(item, index) in list" @on-item-click="getOrderList(item.id)" :key="index">{{item.value}}</tab-item>
            </tab>
        </header>
        <div class="orders_list">
            <p v-if="!orderList.length" style="text-align:center">暂无数据</p>
            <div class="order_item" @click.stop="go(item.id,'detail')" v-for="(item, index) in orderList" :key='index'>
                <div class="order_title">
                    <span class="name">{{item.title}}</span>
                    <span class="state">{{status [item.status]}}</span>
                </div>
                <div class="order_info">
                    <span>
                        <label>开始时间</label>{{item.start_date}}
                    </span>
                    <span style="text-align:right">
                        <label>报名人</label>{{item.name}}
                    </span>
                    <span>
                        <label>订单号</label>{{item.order_no}}
                    </span>
                </div>
                <div class="order_footer">
                    <span>
                        <label>金额</label> ￥{{item.price*0.01}}
                    </span>
                    <div class="action">
                        <a v-if="item.status == '0'" @click.stop="cancel(item.id)">撤销订单</a>
                        <a v-if="item.status == '0'" @click.stop="go(item.id,'pay')">立即支付</a>
                        <a v-if="item.status =='3'" @click.stop="go(item.id,'comment')">立即评价</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    Tab,
    TabItem
} from 'vux'
var list = () => [{
    id: '',
    value: '全部'
}, {
    id: 'unstarted',
    value: '未开始'
}, {
    id: 'unpayed',
    value: '未支付'
}, {
    id: 'uncommented',
    value: '未评论'
}]
export default {
    components: {
        Tab,
        TabItem,
    },
    data() {
        return {
            list: list(),
            status: ['已创建', '已支付', '已接受', '已完成', '已评价', '已取消', '已拒绝', '退款中', '已退款']
            ,
            selected: '全部',
            orderList: []
        }
    },
    mounted() {
        this.getOrderList()
    },
    methods: {
        getOrderList(name) {
            var self = this;
            self.$vux.loading.show({
                text: 'loading...'
            })
            name = name ? '/' + name : ''
            axios.post('/api/orders/trains' + name).then(function (response) {
                self.orderList = response.data;
                self.orderList.forEach(function (item) {
                    item.start_date = dateFormat.datef('YYYY-MM-dd', item.start_date * 1000)
                }, this);
                self.$vux.loading.hide()
            })
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
                        .then(function (response) {
                            self.$vux.toast.text('取消成功', 'middle')
                            setTimeout(function () {
                                self.getOrderList(name)
                            }, 2000);
                        }).catch(function (error) {
                            self.$vux.toast.text(error.response.data.message, 'middle')
                        })
                }
            })
        },
        go(id, type) {
            this.$router.push({ path: '/orders/' + type + '/' + id })
        },
    }
}
</script>
<style>
.orders_list {
    padding: 10px;
    margin-top: 44px;
}

.order_item {
    height: 200px;
    padding: 0 24px;
    margin-bottom: 10px;
    background: url('../../../static/img/icon/dingdan@2x.png') no-repeat;
    background-size: 100% 220px;
}

.order_title {
    line-height: 48px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
}

.order_title .name {
    color: #2E2C2F;
}

.order_title .name::before {
    content: '培训';
    display: inline-block;
    line-height: 15px;
    padding: 2px;
    background-color: #FF6868;
    color: #fff;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 18px;
}

.state {
    color: #FF6868;
}

.order_info {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.order_info span {
    display: inline-block;
    font-size: 14px;
    line-height: 45px;
    color: #2E2C2F;
}

.order_info span label {
    color: #A3A3A3;
    font-size: 12px;
    margin-right: 4px;
}

.order_footer {
    display: flex;
    line-height: 60px;
    justify-content: space-between;
}

.order_footer span {
    font-size: 16px;
    color: #2E2C2F;
    display: inline-block;
    max-width: 44%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.order_footer span label {
    font-size: 12px;
    color: #A3A3A3;
    vertical-align: bottom;
}

.order_footer .action a {
    display: inline-block;
    padding: 8px 13px;
    font-size: 14px;
    border-radius: 15px;
    line-height: 1;
    border: 1px solid #FF6868;
    color: #FF6868;
}

.order_footer .action a:last-child {
    color: #fff;
    background-color: #ff6868;
}

.weui-dialog__btn_primary {
    color: #FEC957 !important;
}

@media screen and (max-width:321px) {
    .order_item {
        padding: 0 10px;
    }
    .order_footer .action a {
        padding: 8px 8px;
    }
}
</style>