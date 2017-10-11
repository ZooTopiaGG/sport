<template>
    <div class="comment">
        <div class="comment_title">
            <h4>{{comment[score-1].text}}</h4>
            <div class="star">
                <span v-for="index in 5" :key="index">
                    <i @click="changeTage(index)" :class="{ select : index<=score }"></i>
                </span>
            </div>
        </div>
        <div class="comment_tag">
            <span class="comment_tag_title">请选择标签</span>
            <div class="tag_list" :class="{tag_item_no :score <3}">
                <div class="tag_item" :class="{selected :item.selected}" @click="addTag(item)" v-for="( item,index) in tag">
                    <span class="tag_img">
                    </span>
                    <span>{{item.text}}</span>
                </div>
            </div>
        </div>
        <div style="padding:0 0px">
            <span class="comment_tag_title">意见建议</span>
            <textarea maxlength='160' class="content" v-model='content' placeholder="建议内容"></textarea>
            <span class="cont">160字以内</span>
        </div>
    
        <group class="s_b" style="background-color:transparent;margin-top:10px;padding-bottom:20px;">
            <div class="submit_btn">
                <x-button type="default" @click.native="submit">提交</x-button>
            </div>
        </group>
    </div>
</template>
<script>
import {
    Group,
    XButton
} from 'vux'
export default {
    components: {
        Group,
        XButton
    },
    data() {
        return {
            comment: [{
                score: 1,
                text: '非常不满意，各方面都很差',
            }, {
                score: 2,
                text: '不满意，比较差',
            }, {
                score: 3,
                text: '一般，需要改善',
            }, {
                score: 4,
                text: '较满意，可以做得更好',
            }, {
                score: 5,
                text: '非常满意，下次再来',
            }],
            tagList: [{
                id: 1,
                selected: false,
                text: '训练条件差'
            }, {
                id: 2,
                selected: false,
                text: '教练不专业'
            }, {
                id: 3,
                selected: false,
                text: '课时不足'
            }, {
                id: 4,

                selected: false,
                text: '受训人数过多'
            }, {
                id: 5,

                selected: false,
                text: '训练条件棒'
            }, {
                id: 6,

                selected: false,
                text: '教练负责任'
            }, {
                id: 7,

                selected: false,
                text: '培训效果好'
            }, {
                id: 8,
                selected: false,
                text: '授课方式新颖'
            }

            ],
            score: 5,
            tag: [],
            selected_arr: [],
            content: ''
        }
    },
    methods: {
        addTag(val) {
            var arr = [],
                self = this
            val.selected = !val.selected
            for (var i in self.tag) {
                if (self.tag[i].selected)
                    arr.push(self.tag[i].text);
            }
            self.selected_arr = arr
        },
        changeTage(index) {
            this.score = this.comment[index - 1].score
            this.tag = this.score < 3 ? this.tagList.slice(0, 4) : this.tagList.slice(4)
            this.selected_arr = []
        },
        submit() {
            var self = this
            axios.post('/api/orders/trains/' + self.$route.params.id + '/comment', {
                content: self.content,
                score: self.score,
                tags: self.selected_arr
            }).then(function () {
                self.$router.push({
                    path: '/orders'
                })
            }).catch(function (error) {
                self.$vux.toast.text(error.response.data.message, 'middle')
            });
        }
    },
    mounted() {
        this.tag = this.tagList.slice(4)

    },
    watch: {
        content: function (val, old) {
            if (old.length > 160)
                val = old.substring(0, 160)

        }
    }

}
</script>
<style>
.comment_title {
    background-color: #fff;
    color: #2E2C2F;
    padding: 46px 0;
    text-align: center;
}

.comment_title h4 {
    font-size: 17px;
    line-height: 2;
}

.comment_title .start {
    display: flex;
    justify-content: space-around;
}

.comment_title .star span {
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url('../../assets/xing2.png') no-repeat;
    background-size: 100%;
    margin: 0 14px;
}

.comment_title .star span i {
    display: inline-block;
    width: 30px;
    height: 30px;
}

.comment_title .star span .select {
    background: url('../../assets/xing.png') no-repeat;
    background-size: 100%;
}

.tag_list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 10px 10px 0;
}

.comment_tag_title {
    display: block;
    text-align: center;
    margin-top: 23px;
}

.tag_list .tag_item {
    width: 38%;
    background-color: #fff;
    margin: 8px 0;
    padding: 10px 14px;
    color: #2E2C2F;
    box-shadow: 0 2px 2px #eee;
}

.tag_list .selected {
    background-color: #FEC958;
    color: #fff;
}

.tag_item_no .tag_item .tag_img {
    background: url('../../../static/img/icon/zan2@2x.png') no-repeat !important;
    background-size: 20px 100% !important;
    ;
}

.tag_list .tag_item .tag_img {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: bottom;
    padding-right: 5px;
    border-right: 2px solid #000;
    background: url('../../../static/img/icon/zan@2x.png') no-repeat;
    background-size: 20px 100%;
}

.tag_list .selected .tag_img {
    background: url('../../../static/img/icon/zan.@2x.png') no-repeat;
    background-size: 20px 100%;
    border-right: 2px solid #fff;
}

.content {
    display: block;
    border: none;
    width: 100%;
    height: 160px;
    line-height: 1.5;
    background-color: #fff;
    text-indent: 2em;
}

.content:focus {
    outline: none;
}

.cont {
    display: block;
    color: #A9A9A9;
    text-align: right;
    line-height: 2;
    background-color: #fff;
}
</style>