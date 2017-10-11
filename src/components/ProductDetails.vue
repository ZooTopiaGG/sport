<template>
    <div style=" padding-bottom:60px">
        <div v-if="download" class="download">
            <img src="../../static/img/icon/logo@2x.png" alt="">
            <a href="http://a.app.qq.com/o/simple.jsp?pkgname=haha.client">下载app</a>
        </div>
        <swiper v-if="details.images" height="140px" :interval='5000' :duration='1000' dots-class='training_tips_btn' loop auto>
            <swiper-item v-for="(item, index) in details.images" :key="index">
                <img style="width:100%;" :src="item.url">
            </swiper-item>

        </swiper>
        <div class="training_tips">
            <img slot="icon" src="../assets/gou.png">
            <span slot="title" style="color:#EDA031;font-size:12px">课程开始前24小时可退</span>
        </div>
        <div class="address_desc">
            <flexbox :gutter='10'>
                <flexbox-item :span="1/3">
                    <div class="address_img">
                        <template v-if="details.venue.images[0]">
                            <img class="address_img" @click="showImg" :src="details.venue.images[0].url" alt="">
                        </template>
                        <template v-else>
                            <img class="address_img" @click="showImg" src="../../static/img/def.png" alt="">
                        </template>
                        <div v-transfer-dom>
                            <previewer ref="previewer" :options="options" :list="list"></previewer>
                        </div>
                        <i class="img_len">{{details.venue.images.length}}</i>
                    </div>
                </flexbox-item>
                <flexbox-item :span="2/3">
                    <div class="address_info">
                        <p>{{details.venue.name}}</p>
                        <a @click="call(details.venue.phone)">
                            <img src="../assets/dianhua.png" alt="">
                        </a>
                        <div class="rater">
                            <span v-for="index in 5">
                                <i :class='{ y : index<=Math.round(details.venue.score) }'></i>
                            </span>
                        </div>
                    </div>
                </flexbox-item>
            </flexbox>
        </div>
        <div class="address">
            <img slot="icon" src="../assets/dizhi.png">
            <span slot="title" style="color:#7D7D7D;">
                <span style="vertical-align:middle;">
                    <router-link :to="{path:'/details/address/'+details.id,query: { longitude: details.longitude,latitude:details.latitude }}" style="color:#7D7D7D"> {{ details.venue.address}}</router-link>
                </span>
            </span>
        </div>
        <div class="training_direction">
            <div class="training_direction_title">课程须知</div>
            <div class="training_direction_item">
                课程安排
                <p>
                    {{details.start_date }}至 {{details.end_date }}
                </p>
            </div>
            <div class="training_direction_item">
                上课周期
                <p>
                    <span style="margin-right:5px" v-for="index in details.cycles">星期{{index.day_of_week}}</span>
                </p>
                <p>
                    {{details.start_time }}-{{details.end_time }}
                </p>
            </div>
            <div class="training_direction_item">
                报名人数（已报名{{details.users_count}}人）
                <p>
                    {{details.capacity_max}}人
                </p>
            </div>
            <div class="training_direction_item">
                适用年龄
                <p>
                    {{details.age}} - {{details.age_max}}岁
                </p>
            </div>
        </div>
        <div class="training_direction">
            <div class="training_direction_title">课程详情</div>
            <div v-html="details.description" class="training_direction_desc" v-bind:class="{  showmore: showMore,  'unshow': !showMore}">

            </div>

        </div>
        <div class="user_list" v-if="details.users_count">
            <span class="user_list_title">已报名{{details.users_count}}人</span>
            <flexbox :gutter="0">
                <flexbox-item :span="1/7" v-for="(item, index)  in details.users" :key="index">
                    <div class="user_list_item">
                        <img slot="icon" :src="item.avatar?item.avatar:'../../static/img/icon/weidenglu@2x.png'">
                        <span v-text="item.nickname? item.nickname :'匿名'"></span>
                    </div>
                </flexbox-item>
            </flexbox>
        </div>
        <div class="recommend" v-if="details.recommend.length">
            <divider>为你推荐</divider>
            <div class="recommend_list">
                <div class="recommend_item" v-for="item in details.recommend">
                    <img :src="item.cover" @click="go(item.id)" alt="">
                    <div class="recommend_item_desc">
                        <h4>{{item.title}}</h4>
                        <span> {{details.start_date.substr(-5)}} {{details.start_time.substr(-3)}} 开始</span>
                        <div class="recommend_item_price clearfix">
                            <span class="recommend_item_address">{{item.area}}</span>
                            <span class="recommend_item_number">
                                <i>￥</i>{{item.price*0.01}}
                                <i>起</i> </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="service">
            <divider style="line-height:2">荷尔蒙服务保障</divider>
            <flexbox :gutter="0">
                <flexbox-item :span='1/3'>
                    <img src="../../static/img/icon/pinzhi@2x.png" alt="">
                    <p>品质保障</p>
                </flexbox-item>
                <flexbox-item :span='1/3'>
                    <img src="../../static/img/icon/jiage@2x.png" alt="">
                    <p>更低价格</p>
                </flexbox-item>
                <flexbox-item :span='1/3'>
                    <img src="../../static/img/icon/gaitui@2x.png" alt="">
                    <p>支持退改</p>
                </flexbox-item>
            </flexbox>
        </div>

        <div class="apply ">
            <span class="apply_price">
                <i>￥{{details.price*0.01}}</i>元
            </span>
            <a @click="enrolls">立即报名</a>
        </div>
        <span @click="gotoOrders" class="gotoorders">订单</span>
        <mt-popup
          v-model="popupVisible"
          popup-transition="popup-fade"
          position="bottom">
          <div class="title">吴山明健儿羽毛球培训班</div>
          <div class="classes">
              <div class="classes-title">
                  可选课程
              </div>
              <ul class="classes-list">
                  <li v-for="(item, index) in classesLists" :class="{checked:ischecked}" :key="index" @click='checkIt(item, index)'>
                      <span>1课时</span>&nbsp;&nbsp;
                      <span class="li-people">1人</span>
                      <s>原价100元</s>&nbsp;&nbsp;
                      <span>¥200</span>
                  </li>
              </ul>
              <div class="check-num">
                  <span>选择人数</span>
                  <span>(剩余9个名额)</span>
                  <div class="min">-</div>
                  <div class="num">1</div>
                  <div class="max">+</div>
              </div>
              <div class="apply apply2">
                <span class="apply_price">
                    <i>￥{{details.price*0.01}}</i>元
                </span>
                <a @click="enroll">确认购买</a>
            </div>
          </div>
        </mt-popup>
    </div>
</template>

<script>
import {
    Swiper,
    SwiperItem,
    Cell,
    Flexbox,
    Toast,
    FlexboxItem,
    Tabbar,
    TabbarItem,
    Grid,
    Divider,
    GridItem,
    Loading,
    Previewer,
    TransferDom,
    Group
} from 'vux'
export default {
    directives: {
        TransferDom
    },
    components: {
        Swiper,
        SwiperItem,
        Tabbar,
        TabbarItem,
        Previewer,
        Toast,
        Cell,
        Flexbox,
        FlexboxItem,
        Grid,
        Divider,
        GridItem,
        Loading,
        Group
    },
    data() {
        return {
            ischecked: false,
            num1: 1,
            popupVisible: false,
            classesList: [
                {name: 1 },
                {name: 2 },
                {name: 3 },
                {name: 4 }
            ],
            download: true,
            list: [],
            options: {
                getThumbBoundsFn(index) {
                    let thumbnail = document.querySelectorAll('.address_img')[0]
                    let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                    let rect = thumbnail.getBoundingClientRect()
                    return {
                        x: rect.left,
                        y: rect.top + pageYScroll,
                        w: rect.width
                    }

                }
            },
            score: '',
            showMore: false,
            details: {
                start_date: 0,
                end_date: 0,
                start_time: 0,
                end_time: 0,
                price: 0,
                images: [{
                    id: '',
                    url: '',
                }],
                venue: {
                    images: [{
                        url: ''
                    }],
                },
                cycles: [{
                    id: '',
                    day_of_week: ''
                }],
                recommend: []
                ,
                users: {
                    nickname: '',
                    avatar: ''
                }
            }
        }
    },
    mounted() {
        if (window.isApp()) {
            this.download = false
            if (this.$route.query.token) {
                localStorage.setItem('token', this.$route.query.token)
            }
        }       
        this.getDetails();
    },
    computed: {
        classesLists () {
            var arr = []
            this.classesList.map(x => {
                arr.push({
                    name:x.name,
                    ischecked:false
                })
            })
            return arr
            console.log(arr)
        }
    },
    methods: {
        checkIt (item, index) {
            if(item.ischecked){
                this.$set(item,'ischecked',false);
            }else{
                this.$set(item,'ischecked',true);
            }
        },
        handleChange (value) {
            console.log(value)
        },
        // 下单？
        getOrders () {

        },
        call(tel) {
            window.location.href = 'tel:' + tel
        },
        gotoOrders() {
            this.$router.push({
                path: '/orders'
            })
        },
        go(id) {
            this.$router.push({
                name: 'ProductDetails',
                params: {
                    id: id
                }
            })
            window.location.reload();
        },
        getDetails() {
            var self = this
            self.$vux.loading.show()
            axios.get('/api/trains/' + this.$route.params.id + '/detail')
                .then(function(response) {
                    self.details = response.data;
                    self.users = response.data.users.slice(-1, -7);
                    self.details.start_date = dateFormat.datef('YYYY-MM-dd', response.data.start_date * 1000)
                    self.details.end_date = dateFormat.datef('YYYY-MM-dd', response.data.end_date * 1000)
                    if (response.data.venue.images) {
                        for (var i = 0; i < response.data.venue.images.length; i++) {
                            self.list.push({
                                src: response.data.venue.images[i].url
                            })
                        }
                    }
                    self.$vux.loading.hide()
                }).catch(function(err) {
                    self.$vux.toast.text('网络错误', 'top')
                    self.$vux.loading.hide()
                });
        },
        enrolls () {
            this.popupVisible = true
        },
        enroll() {
            this.$router.push({
                name: 'Enroll',
                params: {
                    id: this.details.id
                }
            })
        },
        showImg() {
            this.$refs.previewer.show(0)
        }
    },
    watch: {
        '$route': 'getDetails'
    }
}
</script>

<style scoped>
    .check-num{
        height: 40pt;
        padding: 0 16pt;
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
    }
    .check-num>span:nth-child(1){
        font-size: 14pt;
        line-height: 40pt;
    }
    .check-num>span:nth-child(2){
        font-size: 10pt;
        line-height: 40pt;
        flex:1;
    }
    .check-num>div{
        font-size: 16pt;
        color: #414141;
        margin-top: 8pt;
    }
    .check-num .num{
        margin: 9pt 15pt 0;
    }
   .check-num .min,.check-num .max{
        width: 23pt;
        height: 23pt;
        font-size: 23pt;
        text-align: center;
        border: 1px solid #414141;
        border-radius:100%;
        line-height: 20pt;
    }
    .title{
        font-size: 16pt;
        text-align: center;
        padding: 20pt 0;
        border-bottom: 1px solid #DDDDDD;
    }
    .classes-title{
        font-size: 14pt;
        padding: 10pt 16pt;
    }
    .classes-list{
        padding: 0 16pt;
        border-bottom: 1px solid #DDDDDD;
    }
    .classes-list li{
        height: 40pt;
        padding: 0 18pt;
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        font-size: 13pt;
        border: 1px solid #414141;
        border-radius: 40pt;
        line-height: 40pt;
        margin-bottom: 10pt;
        color: #414141;
    }
    .classes-list li:nth-child(1){
        margin-top: 0;
    }
    .classes-list li span:last-child{
        color:#FF6868;
    }
    .li-people{
        flex:1;
    }
    .classes-list li.checked{
        border: 1px solid #FF6868;
    }
    .classes-list li.checked span:nth-child(1), li.checked span:nth-child(2){
        color:#FF6868;
    }
</style>
<style>
body{
    touch-action: none
}

.mint-popup-bottom{
    width:100%;
}
.training_tips_btn .active {
    background-color: #FEC958 !important;
}

.weui-cells:before,
.weui-cells:after,
.weui-cell:before,
.weui-cell:after {
    border: none !important;
}

.training_tips {
    padding: 10px;
    background-color: #FFFFFF;
    border-bottom: 10px solid #efeff4;
}

.training_tips img {
    width: 15px;
    margin-right: 7px;
    vertical-align: middle;
}

.address_desc {

    padding: 10px;
    background-color: #FFFFFF;
    border-bottom: 10px solid #efeff4;
}

.address_desc .address_img {
    position: relative;
    font-size: 0;
}

.address_desc .address_img img {
    width: 100%;
    height: 70px;
    border-radius: 4px;
}

.address_desc .img_len {
    position: absolute;
    display: inline-block;
    font-style: normal;
    background-color: #2E2C2F;
    width: .390625rem;
    height: .390625rem;
    color: #fff;
    font-size: 12px;
    text-align: center;
    line-height: .390625rem;
    right: 0;
    bottom: 0;
    transform: translate(-1px, -1px);
}

.address_desc .address_info {
    height: 70px;
    position: relative;
}

.address_info {
    padding-right: 15px;
}

.address_info p {
    font-size: 14px;
    float: left;
    width: 87%;
    margin-right: 1%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

.address_info img {
    width: 12%;
    height: auto;
}

.address {
    background-color: #fff;
    border-bottom: 10px solid #efeff4;
    padding: 10px 10px;
}

.address img {
    width: 12px;
    margin-right: 7px;
    vertical-align: middle;
}

.rater {
    position: absolute;
    bottom: 0;
    right: 15px;
    line-height: 18px;
}

.rater span {
    display: inline-block;
}

.rater span i {
    display: inline-block;
    margin-left: .203125rem;
    width: .4375rem;
    height: .4375rem;
    background: url('../assets/xing2.png') no-repeat;
    background-size: 100%;
}

.rater .y {
    background: url('../assets/xing.png') no-repeat;
    background-size: 100%;
}

.training_direction {
    border-bottom: 10px solid #efeff4;
    background-color: #fff;
    color: #7D7D7D;
    padding: 0 15px;
    position: relative;
}

.training_direction .training_direction_title {
    line-height: .65625rem;
    text-align: center;
    font-size: 16px;
    padding: 10px 0;
}


.training_direction .showmore {
    max-height: auto;
    overflow: inherit;
}

.training_direction .training_direction_desc img {
    max-width: 100%;
}

.training_direction .training_direction_desc h1,
h2,
h3,
h4,
h5 {
    font-size: auto;
}

.training_direction .training_direction_item {
    line-height: 2;
    font-size: 14px;
}

.training_direction .training_direction_item p {
    text-indent: 1em;
    color: #515151;
}

.more_desc {
    position: absolute;
    bottom: 0;
    left: 10px;
    width: calc(100% - 20px);
    text-align: center;
    color: #f9b524;
    line-height: 2.5;
    background-color: rgba(254, 201, 87, .3);
}

.user_list {
    background-color: #fff;
    margin-top: 10px;
    color: #8C8882;
}

.user_list_title {
    display: block;
    padding: 0 10px 10px;
    background-color: #fbf9fe;
}

.user_list_item {
    text-align: center;
    padding: 8px 0;
}

.user_list_item img {
    border-radius: 50%;
    width: 85%;
    height: 12.14vw;
}

.user_list_item span {
    font-size: 12px;
    width: 100%;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.recommend {
    padding: 0 10px;
    background-color: #efeff4;
}

.vux-divider {
    margin: 0 auto;
    line-height: 2;
}

.vux-divider:after,
.vux-divider:before {
    width: 36% !important;
}

.recommend_list {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    justify-content: space-between;
    margin-bottom: -10px;
}

.recommend_item {
    width: 48.5%;
    margin-bottom: 10px;
    background-color: #fff;
    box-shadow: 0 1px 1px 2px rgba(234, 230, 230, 0.69);
    border-radius: 5px;
}

.recommend_item img {
    width: 100%;
    height: 95px;
}

.recommend_item .recommend_item_desc {
    line-height: 25px;
    padding: 0 8px;
    background-color: #fff;
    color: #8C8882;
}

.recommend_item .recommend_item_desc h4 {
    font-size: 14px;
    color: #1C1C1C;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.recommend_item_address {
    float: left;
    max-width: 60%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.recommend_item_number {
    color: #FA342C;
    float: right;
    font-size: 18px;
}

.recommend_item_number i {
    font-style: normal;
    font-size: 12px;
}

.service {
    margin-top: 10px;
    padding: 0 10px;
    background-color: #efeff4;
}

.service .vux-flexbox-item {
    text-align: center;
    color: #A3A3A3;
}

.service img {
    width: .96rem;
}

.service .vux-flexbox-item p {
    line-height: .56rem;
}

.apply {
    position: -webkit-sticky;
    position: sticky;
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px 0;
    bottom: 0px;
    background-color: #fff;
    z-index: 1102;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-transform: translateZ(0);
}
.apply2{
    position: static;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 16pt 0;
    background-color: #fff;
    z-index: 1102;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-transform: translateZ(0);
}

.apply span {
    line-height: 38px;
    height: 38px;
    display: inline-block;
    color: #FF6868;
    margin-left: 10px;
}

.apply span i {
    font-size: 20px;
    font-style: normal;
}

.apply a {
    display: inline-block;
    float: right;
    background-color: #FF6868;
    padding: .18rem .56rem;
    color: #fff;
    font-size: 16px;
    border-radius: .6rem;
    margin-right: 10px;
}

.download {
    display: flex;
    position: sticky;
    position: fixed;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    z-index: 1111;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.8);
}

.download img {
    height: 35px;
    width: auto;
    margin-left: 10px;
}

.download a {
    margin-right: 10px;
    padding: 5px 15px;
    border-radius: 15px;
    background-color: #2E2C2F;
    color: #fff;
}

.gotoorders {
    display: inline-block;
    width: 45px;
    height: 45px;
    background-color: #fff;
    text-align: center;
    line-height: 45px;
    color: #2E2C2F;
    border: 1px solid #eee;
    border-radius: 50%;
    position: fixed;
    right: 16px;
    bottom: 73px;
    z-index: 102;
}
</style>