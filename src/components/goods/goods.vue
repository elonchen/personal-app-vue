<template>
    <div class="goods">
        <div class="menu-warpper" ref="meunWarpper">
            <ul>
                <li v-for="(item,index) of goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)"> 
                    <span class="text">
                        <span v-show="item.type>-1" class="icon" :class="classMap[item.type]"></span>
                        {{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-warpper" ref="foodWarpper">
            <ul>
                <li v-for="item of goods" class="food-list food-list-hook">
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
                                    <span class="count">月售 {{food.sellCount}} 份</span><span> 好评率 {{food.rating}}% </span>
                                </div>
                                <div class="price">
                                    <span class="now">￥ {{food.price}} </span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}} </span>
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
import BScroll from 'better-scroll';

const ERR_OK = 0;

export default {
  data () {
      return {
          goods:[],
          listHeight:[],
          scrollY:0
      }
  },  
  props:{
      seller:{
          type:Object
      }
  },
  computed:{
      currentIndex () {
        for(let i=0;i<this.listHeight.length;i++){
            let height1 = this.listHeight[i];
            let height2 = this.listHeight[i+1];
            if(!height2 || (this.scrollY >= height1 && this.scrollY < height2) ){//因为最后一个i+1不存在，因此需要加上!height2进行判定
                return i;
            }
        }
        return 0;
      }//计算出要高亮的index，即是要高亮的meun-warpper的index,也就是在那个高度区间
  },
  created () {
      this.classMap = ['decrease','discount','special','invoice','guarantee'];//通过seller.supports[0].type映射对应的className
      this.$http.get('/api/goods').then(res=>{
          if(res.data.errno === ERR_OK){
            this.goods = res.data.data;
            this.$nextTick(()=>{
                this._initScroll();
                this._calculateHeight();
            })//因为重新渲染DOM是异步，因此需要使用$nextTick在下一个task来计算高度，初始化Better-scroll
          }else{
              console.log('has a error when get goods data');
          }
      })
  },
  methods :{
    _initScroll () {
        this.menuScroll = new BScroll(this.$refs.meunWarpper,{
            bounce: true,
            momentumLimitTime:200,
            bounceTime: 600,
            click:true 
        })
        this.foodScroll = new BScroll(this.$refs.foodWarpper,{
            probeType:3,
            bounce: true,
            momentumLimitTime:200,
            bounceTime: 300,
        })        
        this.foodScroll.on('scroll',(pos)=>{
            this.scrollY = Math.abs(Math.round(pos.y));
        })//Better-Sroll所携带事件，pos是Better-Scroll封装的对象
    },//初始化Better-scroll
    _calculateHeight () {
        let foodList = this.$refs.foodWarpper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for(let i=0;i<foodList.length;i++){
            height += foodList[i].clientHeight;
            this.listHeight.push(height);
        }
    },//计算每个不同产品类型的高度，并且存进listHeight用来做映射
    selectMenu (index,event) {
        if(!event._constructed){
            return;
        }
        let foodList = this.$refs.foodWarpper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodScroll.scrollToElement(el);
    }
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
                &.current{
                    position:relative;
                    margin-top:-1px;
                    z-index:10;
                    background:#fff;
                    font-weight:700;
                    .text{
                        @include border-none();
                    }
                }                
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
                        line-height:12px;
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
