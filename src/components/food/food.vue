<template>
  <transition  name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
            <img :src="food.image" alt="">
            <div class="back" @click="hide">
                <i class="icon-arrow_lift"></i>
            </div>
        </div>
        <div class="content">
            <h1 class="title"> {{food.name}} </h1>
            <div class="detail">
                <span class="sell-count">月售{{food.sellCount}}</span>
                <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
                <span class="now">￥{{food.price}}</span>
                <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="cartcontrol-warpper">
                <cartcontrol :food="food" @add="addFood"></cartcontrol>
            </div>
            <transition name="fade">
                <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFrist($event)">加入购物车</div>
            </transition>            
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
            <h1 class="title">商品信息</h1>
            <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
            <h1 class="title">商品评价</h1>
            <ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings" @select="selectRating" @toggle="toggleContent">
            </ratingselect>
            <div class="rating-warpper">
                <ul v-show="food.ratings && food.ratings.length"><!--当有评论时才会出现评论内容，即是评论框-->
                    <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                        <div class="user">
                            <span class="name">{{rating.username}}</span>
                            <img class="avatar" width="12" height="12" alt="" :src="rating.avatar">
                        </div>
                        <div class="time">{{rating.rateTime | formatDate}}</div>
                        <p class="text">
                            <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                            {{rating.text}}
                        </p>
                    </li>
                </ul>
                <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div><!--当没有有评论时才会出现-->
            </div>
        </div>
      </div>  
    </div>
  </transition >
</template>

<script>
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import ratingselect from 'components/ratingselect/ratingselect'
  import split from 'components/split/split'
  import Vue from 'vue';
  import {formatDate} from '../../common/js/date.js';

  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props:{
        food:{
            type:Object
        }
    },
    data () {
        return {
            showFlag:false,//控制food组件的show和hide
            selectType:ALL,//选择要看的评论的类型
            onlyContent:true,//控制评论是只看内容还是看内容和评价
            desc:{
                all:'全部',
                positive:'推荐',
                negative:'吐槽'
            }
        }
    },
    methods : {
        show () {
            this.showFlag = true;//初始化showFlag
            this.selectType = ALL;//初始化selectType
            this.onlyContent = true;//初始化onlyContent
            this.$nextTick(() => {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.food, {
                    click: true
                    });
                } else {
                    this.scroll.refresh();
                }
            })
        },
        hide () {
            this.showFlag = false;
        },
        addFrist(event) {
            if(!event._constructed){
                return;
            }
            this.$emit('add',event.target);
            Vue.set(this.food,'count',1);
            this.dealStore();
        },
        dealStore () {
            let totalCount = this.food.count;
            let totalPrice = this.food.price;
            this.$store.commit('addPrice',totalPrice);
            this.$store.commit('addCount',totalCount);
            this.$store.commit('selectFoods',[this.food]);
        },
        addFood (el) {
            this.$emit('add',el);
        },//cartcontrol组件发射的事件通过food组件发射add事件给goods
        needShow(type,text){
            if(this.onlyContent && !text){
                return false;
            }
            if(this.selectType === ALL){
                return true;
            }else{
                return type === this.selectType;
            }
        },
        selectRating (type) {
            this.selectType = type;
            this.$nextTick(()=>{
                this.scroll.refresh();
            })
        },
        toggleContent (onlyContent) {
            this.onlyContent = onlyContent;
            this.$nextTick(()=>{
                this.scroll.refresh();
            })
        }
    },
    filters:{
        formatDate(time){
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd hh:mm')//引入common模块的JS方法
        }
    },
    components :{
        cartcontrol,
        split,
        ratingselect
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../common/scss/mixin.scss';

    .food{
        position: fixed;
        left: 0;
        top: 0;
        bottom: 48px;
        z-index: 30;
        width: 100%;
        background: #fff;
        transform: translate3d(0, 0, 0);
        &.move-enter-active, &.move-leave-active{
            transition: all .2s linear;
        }
        &.move-enter, &.move-leave-active{
            transform: translate3d(100%, 0, 0); 
        }
            .image-header{
                position:relative;
                width:100%;
                height:0;
                padding-top:100%;
                img{
                    position:absolute;
                    top:0;
                    left:0;
                    width:100%;
                    height:100%;
                }
                .back{
                    position:absolute;
                    top:10px;
                    left:0;
                    .icon-arrow_lift{
                        display:block;
                        padding:10px;
                        font-size:20px;
                        color:#fff;
                    }
                }
            }
            .content{
                position: relative;
                padding: 18px;
                .title{
                    line-height:14px;
                    margin-bottom:8px;
                    font-size:14px;
                    font-weight:700;
                    color:rgb(7,17,27);
                }
                .detail{
                    margin-bottom:18px;
                    line-height:10px;
                    height:10px;
                    font-size:0;
                }
                .sell-count,.rating{
                    font-size:10px;
                    color:rgb(147,153,159);
                }
                .sell-count{
                    margin-right:12px;
                }
                .price{
                    font-weight:700;
                    line-height:24px;
                    .now{
                        margin-right:8px;
                        font-size:14px;
                        color:rgb(240,20,20);
                    }
                    .old{
                        text-decoration:line-through;
                        font-size:10px;
                        color:rgb(147,153,159);
                    }
                }
                .cartcontrol-warpper{
                    position: absolute;
                    right: 12px;
                    bottom: 12px;
                }
                .buy{
                    position: absolute;
                    right: 18px;
                    bottom: 18px;
                    z-index: 10;
                    height: 24px;
                    line-height: 24px;
                    padding: 0 12px;
                    box-sizing: border-box;
                    border-radius: 12px;
                    font-size: 10px;
                    color: #fff;
                    background: rgb(0, 160, 220);
                    opacity: 1;
                }
                .fade-enter-active,.fade-leave-active{
                    transition: all .2s
                }
                .fade-enter,.fade-leave-active{
                    opacity:0;
                }                        
            }
            .info {
                padding:18px;
                .title{
                    line-height:14px;
                    margin-bottom:6px;
                    font-size:14px;
                    color:rgb(7,17,27);
                    font-weight: 700;
                }
                .text{
                    line-height:24px;
                    padding:0 8px;
                    font-size:12px;
                    color:rgb(77,85,93);
                }

            }
            .rating{
                padding-top:18px;
                .title{
                    line-height:14px;
                    margin-left:18px;
                    font-size:14px;
                    color:rgb(7,17,27);
                    font-weight: 700;
                }
                .rating-warpper{
                    padding:0 18px;
                    .rating-item{
                        position:relative;
                        padding:16px 0;
                        @include border-1px(rgba(7,17,27,0.1));
                        .user{
                            position:absolute;
                            right:0;
                            top:16px;
                            line-height:12px;
                            font-size:0;
                            .name{
                                display:inline-block;
                                margin-right:6px;
                                vertical-align:top;
                                font-size:10px;
                                color:rgb(147,153,159);
                            }
                            .avatar{
                                border-radius:50%;
                            }                            
                        }
                        .time{
                            margin-bottom:6px;
                            line-height:12px;
                            font-size:10px;
                            color:rgb(147,153,159);
                        }
                        .text{
                            line-height:16px;
                            font-size:12px;
                            color:rgb(7,17,27);
                            .icon-thumb_down,.icon-thumb_up{
                                margin-right:4px;
                                line-height:16px;
                                font-size:12px;
                            }
                            .icon-thumb_down{
                                color:rgb(0,160,220);
                            }
                            .icon-thumb_up{
                                color:rgb(147,153,159);
                            }
                        }
                    }
                    .no-rating{
                        padding:16px;
                        font-size:12px;
                        color:rgb(147,153,159);
                    }
                }
            }            
    }
</style>
