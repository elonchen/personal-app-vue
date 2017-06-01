<template>
    <div class="goods">
        <div class="menu-warpper">
            <ul>
                <li v-for="item of goods" class="menu-item">
                    <span class="text">
                        <span v-show="item.type>-1" class="icon" :class="classMap[item.type]"></span>
                        {{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-warpper">
            <ul>
                <li v-for="item of goods" class="food-list">
                    <h1 class="title"> {{item.name}} </h1>
                    <ul>
                        <li v-for="food of item.foods" class="food-item border-1px">
                            <div class="icon">
                                <img :src="food.icon" width="57" height="57">
                            </div>
                            <div class="content">
                                <h2 class="name"> {{food.name}} </h2>
                                <p class="desc"> {{food.description}} </p>
                                <div class="extra">
                                    <span class="count">月售 {{food.sellCount}} 份</span>
                                    <span> 好评率 {{food.rating}}% </span>
                                </div>
                                <div class="price">
                                    <span class="now">￥ {{food.price}} </span>
                                    <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}} </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>    
    </div>
</template>

<script>
const ERR_OK = 0;

export default {
  data () {
      return {
          goods:[]
      }
  },  
  props:{
      seller:{
          type:Object
      }
  },
  created () {
      this.classMap = ['decrease','discount','special','invoice','guarantee'];//通过seller.supports[0].type映射对应的className
      this.$http.get('/api/goods').then(res=>{
          if(res.data.errno === ERR_OK){
            this.goods = res.data.data;
          }else{
              console.log('has a error when get goods data');
          }
      })
  }
}

</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../common/scss/mixin';

    .goods{
        display:flex;
        position:absolute;
        top:174px;
        bottom:46px;
        width:100%;
        overflow:hidden;
        .menu-warpper{
            flex:0 0 80px;
            width:80px;
            background:#f3f5f7;
            .menu-item{
                display:table;
                height:54px;
                width:56px;
                line-height:14px;
                padding:0 12px;
                .icon{
                    display:inline-block;
                    vertical-align:top;
                    width:12px;
                    height:12px;
                    margin-right:2px;
                    background-size:12px 12px;
                    background-repeat:no-repeat;
                        &.decrease{
                            @include bg-image(decrease_3);
                        }
                        &.discount{
                            @include bg-image(discount_3);
                        }
                        &.guarantee{
                            @include bg-image(guarantee_3);
                        }
                        &.invoice{
                             @include bg-image(invoice_3);
                        }
                        &.special{
                             @include bg-image(special_3);
                        }                                        
                }
                .text{
                    font-size:12px;
                    display:table-cell;
                    width:56px;
                    vertical-align:middle;
                    @include border-1px(rgba(7,17,27,0.1));
                }
            }
        }
        .foods-warpper{
            flex:1;
            .title{
                padding-left:14px;
                height:26px;
                line-height:26px;
                border-left:2px solid #d9dde1;
                font-size:12px;
                color:rgb(147,153,159);
                background:#f3f5f7;
            }
            .food-item{
                display:flex;
                margin:18px;
                padding-bottom:18px;
                @include border-1px(rgba(7,17,27,0.1));
                &:last-child{
                   @include border-none();
                   margin-bottom:0;
                }
                .icon{
                    flex :0 0 57px;
                    margin-right:10px;
                }
                .content{
                    flex:1;
                    .name{
                        margin:2px 0 8px 0;
                        height:14px;
                        line-height:14px;
                        font-size:14px;
                        color:rgb(7,17,27);
                    }
                    .desc,.extra{
                        margin-bottom:8px;
                        line-height:10px;
                        font-size:10px;
                        color:rgb(147,153,159);
                    }
                    .desc{
                        margin-bottom:8px;
                    }
                    .extra{
                        .count{
                            margin-right:12px;
                        }
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
                }
            }
        }
    }


</style>
