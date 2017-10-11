<template>
     <div class="userinfo">
         <ul>
             <li><label for="">项目名称</label><span>{{user.train.title}}</span></li>
             <li><label for="">姓名</label><span>{{user.name}}</span></li>
             <li><label for="">手机</label><span>{{user.mobile}}</span></li>
             <li><label for="">性别</label><span>{{user.gender}}</span></li>
             <li><label for="">年龄</label><span>{{user.age}}</span></li>
         </ul>
         <div class="remark">
             <label for="">备注</label>
             <p>
                 <span v-if="!user.remark">无</span>
                 {{user.remark}}
             </p>
         </div>
     </div> 
</template>
<script>
    export default {
        data() {
            return {
                user: {}
            }
        },
        mounted() {
            var self = this
            axios.get('/api/orders/trains/' + this.$route.params.id + '/detail').then(
                function(response) {
                    self.user = response.data
                }
            )
        }
    }
</script>
<style>
    .userinfo label {
        color: #929292;
    }
    
    .userinfo ul li {
        display: flex;
        justify-content: space-between;
        line-height: 52px;
        padding: 0 20px;
        color: #2E2C2F;
    }
    
    .userinfo ul li:first-child {
        border-bottom: 1px solid #eee;
    }
    
    .remark {
        padding: 0 20px;
    }
    
    .remark label {
        line-height: 52px;
    }
    
    .remark p {
        word-break: break-all;
        text-indent: 2em;
    }
</style>