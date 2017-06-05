<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block positive" :class="{'active':selectType===2}" @click="select(2,$event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" :class="{'active':selectType===0}" @click="select(0,$event)">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
      <span class="block negative" :class="{'active':selectType===1}" @click="select(1,$event)">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent}" @click="toggleContent($event)">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props : {
      ratings:{
        type:Array,
        default () {
          return [];
        }
      },//评论数
      selectType :{
        type :Number,
        default : ALL //默认显示全部  全部 推荐 吐槽 或者 全部 满意 不满意
      },//选择需要显示的评论类型
      onlyContent : {
        type : Boolean,
        default : false
      },
      desc : {
        type : Object,
        default () {
          return {
            all : '全部',
            positive : '满意',
            negative : '不满意'
          };
        }
      }
    },
    computed:{
      positive() {
        return this.ratings.filter(rating=>{
          return rating.rateType === POSITIVE;
        })
      },//用来控制3个正方形小方块的是否出于active状态
      negative() {
        return this.ratings.filter(rating=>{
          return rating.rateType === NEGATIVE;
        })//用来控制3个正方形小方块的是否出于active状态
      }
    },
    data () {
      return {}
    },
    methods : {
      select(type,event){
        if(!event._constructed){
          return;
        }
        this.selectType = type;
        this.$emit('select',type);
      },
      toggleContent (event) {
        if(!event._constructed){
          return;
        }
        this.onlyContent = !this.onlyContent;
        this.$emit('toggle',this.onlyContent);
      }
    }
  }

</script>

<style lang="scss" rel="stylesheet/scss">
  @import '../../common/scss/mixin.scss';

    .ratingselect{
      .rating-type{
        padding:18px 0;
        margin: 0 18px;
        @include border-1px(rgba(7,17,27,0.1));
        font-size:0;
        .block{
          display:inline-block;
          padding:8px 12px;
          margin-right:8px;
          border-radius:2px;
          font-size:12px;
          line-height:16px;
          color:rgb(77,75,93);
          &.active{
            color:#fff;
          }
          .count{
            margin-left:2px;
            font-size:8px;
          }
          &.positive{
            background:rgba(0,160,220,0.2);
            &.active{
              background:rgba(0,160,220,1);
            }
          }
          &.negative{
            background:rgba(77,85,93,0.2);
            &.active{
              background:rgba(77,85,93,1);
            }
          }
        }
      }
      .switch{
        padding:12px 18px;
        line-height:24px;
        border-bottom:1px solid rgba(7,17,27,0.1);
        color:rgb(147,153,159);
        font-size:0;
        &.on{
          .icon-check_circle{
            color:#00c850;
          }
        }
        .icon-check_circle{
          display:inline-block;
          vertical-align:top;
          margin-right:4px;
          font-size:24px;
        }
        .text{
          display:inline-block;
          vertical-align:top;
          font-size:12px;
        }
      }
    }
</style>
