<template>
  <div class="shopcart">
    <div class="content">
        <div class="content-left">
            <div class="logo-warpper">
                <div class="logo" :class="{'highlight':getTotalCount>0}">
                    <i class="icon-shopping_cart" :class="{'highlight':getTotalCount>0}"></i>
                </div>
                <div class="num" v-show="getTotalCount>0"> {{getTotalCount}} </div>
            </div>
            <div class="price" :class="{'highlight':getTotalPrice>0}"> ￥{{getTotalPrice}} </div>
            <div class="desc"> 另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
            <div class="pay" :class="payClass" >
                {{payDesc}}
            </div>
        </div>
        <div class="ball-container" >
            <div v-for="ball of balls">
                <transition name="drop">
                    <div class="ball" v-show="ball.show">
                        <div class="inner inner-hook"></div>
                    </div>
                </transition>
            </div>    
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
          balls : [
              {
                show:false
              },
              {
                show:false
              },
              {
                show:false
              },
              {
                show:false
              },
              {
                show:false
              }                                                        
          ]
      }
    },     
    props:{
        deliveryPrice: {
            type:Number,
            default:0
        },
        minPrice : {
            type:Number,
            default:0
        }
    },
    computed:{
        getTotalPrice () {
            return this.$store.state.totalPrice
        },//通过vuex来获取总价
        getTotalCount () {
            return this.$store.state.totalCount 
        },
        payDesc () {
            if(this.$store.state.totalPrice === 0){
                return `￥${this.minPrice}元起送`;
            }else if(this.$store.state.totalPrice < this.minPrice){
                let diff = this.minPrice - this.$store.state.totalPrice;
                return `还差￥${diff}起送`;
            }else{
                return '去结算';
            }
        },
        payClass () {
            if(this.$store.state.totalPrice < this.minPrice){
                return 'not-enough';
            }else{
                return 'enough';
            }
        }
    },
  }

</script>

<style lang="scss" rel="stylesheet/scss">
    .shopcart{
        position:fixed;
        left:0;
        bottom:0;
        z-index:50;
        width:100%;
        height:48px;
        background:gray;
        .content{
            display:flex;
            background:#141d27;
            .content-left{
                flex:1;
                font-size:0;
                .logo-warpper{
                    display:inline-block;
                    position:relative;
                    top:-10px;
                    margin: 0 12px;
                    padding:6px;
                    width:56px;
                    height:56px;
                    box-sizing:border-box;
                    vertical-align:top;
                    border-radius:50%;
                    background:#141d27;
                    .logo{
                        width:100%;
                        height:100%;
                        border-radius:50%;
                        background:#2b343c;
                        text-align:center;
                        &.highlight{
                            background:rgb(0,160,220);
                        }
                        .icon-shopping_cart{
                            line-height:44px;
                            font-size:24px;
                            color:#80858a;
                             &.highlight{
                                 color:#fff;
                             }
                        }
                    }
                }
                .num{
                    position:absolute;
                    top:0;
                    right:0;
                    width:24px;
                    height:16px;
                    line-height:16px;
                    text-align:center;
                    border-radius:16px;
                    font-size:9px;
                    font-weight:700;
                    color:#fff;
                    background:rgb(240,20,20);
                    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
                }
                .price{
                    display:inline-block;
                    vertical-align:top;
                    margin-top:12px;
                    line-height:24px;
                    padding-right:12px;
                    box-sizing:border-box;
                    border-right:1px solid rgba(255,255,255,0.1);
                    font-size:16px;
                    font-weight:700;
                    color:rgba(255,255,255,0.4);
                    &.highlight{
                        color:#fff;
                    }
                }
                .desc{
                    display:inline-block;
                    vertical-align:top;
                    line-height:24px;
                    margin:12px 0 0 12px;
                    color:rgba(255,255,255,0.4);
                    font-size:10px;
                }
            }
            .content-right{
                flex:0 0 105px;
                width:105px;
                .pay{
                    height:48px;
                    line-height:48px;
                    text-align:center;
                    font-size:12px;
                    color:rgba(255,255,255,0.4);
                    font-weight:700;
                    &.not-enough{
                         background:#2b333b;
                    }
                    &.enough{
                        background:#00b43c;
                        color:#fff;
                    }
                }
            }
        }
    }

</style>
