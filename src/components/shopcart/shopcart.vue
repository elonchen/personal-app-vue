<template>
  <div>
    <div class="shopcart">
        <div class="content" >
            <div class="content-left">
                <div class="logo-warpper" @click="toggleList">
                    <div class="logo" :class="{'highlight':getTotalCount>0}" @click="testcon">
                        <i class="icon-shopping_cart" :class="{'highlight':getTotalCount>0}"></i>
                    </div>
                    <div class="num" v-show="getTotalCount>0"> {{getTotalCount}} </div>
                </div>
                <div class="price" :class="{'highlight':getTotalPrice>0}"> ￥{{getTotalPrice}} </div>
                <div class="desc"> 另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <div class="content-right" @click="pay">
                <div class="pay" :class="payClass" >
                    {{payDesc}}
                </div>
            </div>
            <div class="ball-container" >
                <div v-for="ball of balls">
                    <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
                        <div class="ball" v-show="ball.show" >
                            <div class="inner inner-hook"></div>
                        </div>
                    </transition>
                </div>    
            </div>
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="empty">清空</span>
                    </div>
                    <div class="list-content" ref="listContent">
                        <ul>
                            <li class="food" v-for="(food,index) of getSelectFoods">
                                <span class="name"> {{food.name}} </span>
                                <div class="price">
                                    <span>￥{{food.price*food.count}}</span>
                                </div>
                                <div class="cartcontrol-warpper">
                                    <cartcontrol :food="food" @add="drop"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>    
        </div>
    </div>
    <transition name="fade">
        <div class="list-mask" v-show="listShow" @click="drop"></div>  
    </transition>
  </div>  

</template>

<script>
  import cartcontrol from 'components/cartcontrol/cartcontrol'  
  import BScroll from 'better-scroll';
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
          ],//存储可以被开始动画的小球，false的才能开始将其转变为true开始动画！而transition动画只对v-if，v-show和v-for有效
          dropBalls :[],//存储已经进入运动的小球，待小球运动完，将其style.display设置为none
          selectFoods :[],
          fold:true//折叠
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
        },
        getSelectFoods () {
            this.selectFoods = this.$store.state.Selectfoods;
            return this.selectFoods
        },
        listShow () {
            if(!this.getTotalCount){//如果this.getTotalCount===0
                this.fold = true;
                return false;
            }
            let show = !this.fold;
            if(show){
                this.$nextTick(()=>{
                    if(!this.scroll){
                        this.scroll = new BScroll(this.$refs.listContent,{
                            click:true
                        })                        
                    }else{
                        this.scroll.refresh();
                    }
                })
            }
            return show;
        }
    },
    methods : {
        drop (el) {
            console.log(el);
            for (let i=0;i<this.balls.length;i++){//取得按钮的element，然后遍历
                let ball = this.balls[i];
                if(!ball.show){
                    ball.show = true,//当show设为true的时候，动画就开始了，步骤beforeDrop ==> dropping ==> afterDrop(通过JS动画钩子)
                    ball.el = el;
                    this.dropBalls.push(ball);
                    return;
                }
            }
        },//小球动画，存储取得的Element元素
        beforeDrop (el) {
            let count = this.balls.length;
            while (count--){
                let ball = this.balls[count];
                if(ball.show){
                    let rect = ball.el.getBoundingClientRect();//Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。
                    let x = rect.left - 36;//算出小球从哪个横坐标出发
                    let y = -(window.innerHeight - rect.top - 36);//算出小球从那个纵坐标出发，哪位什么要用window.innerHeight减呢？
                    //y坐标是相对于小球的位置，即是小球原来translate3d(0,0,0)的位置，因此需要用window.innerHeight-rect.top-36去得出，小球
                    //原来的位置，到点击按钮的y坐标的距离。。
                    el.style.display = '';
                    el.style.webkitTransform = `translate3d(0,${y}px,0)`;//兼容webkit渲染引擎，因为直接写transfrom，webkit引擎没有出现效果
                    el.style.transfrom = `translate3d(0,${y}px,0)`;
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = `translate3d(${x}px,0,0)`;//兼容webkit渲染引擎，因为直接写transfrom，webkit引擎没有出现效果
                    inner.style.transfrom = `translate3d(${x}px,0,0)`;
                }
            }
        },
        dropping (el) {
            let rf = el.offsetHeight;//用来做浏览器重绘
            this.$nextTick(()=>{
                    el.style.webkitTransform = `translate3d(0,0,0)`;//兼容webkit渲染引擎，因为直接写transfrom，webkit引擎没有出现效果
                    el.style.transfrom = `translate3d(0,0,0)`;
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = `translate3d(0,0,0)`;//兼容webkit渲染引擎，因为直接写transfrom，webkit引擎没有出现效果
                    inner.style.transfrom = `translate3d(0,0,0)`;                
            })
        },
        afterDrop (el) {
            let ball = this.dropBalls.shift();
            if(ball){
                ball.show = false;
                el.style.display = 'none';
            }
        },
        testcon () {
            console.log(this.getSelectFoods);
        },//测试用的
        toggleList () {
            if(!this.getTotalCount){
                return
            }
            this.fold = !this.fold;
        },
        empty () {
            this.$store.commit('empty')
        },
        hideList () {
            this.fold = true;
        },
        pay () {
            if(this.getTotalPrice < this.minPrice){
                return;
            }
            window.alert(`支付${this.getTotalPrice}元`);
        }
    },
    components : {
        cartcontrol
    }
  }

</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../common/scss/mixin.scss';
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
        .ball-container{
            .ball{
                position:fixed;
                left:32px;
                bottom:22px;
                z-index:200;
                transition:all .4s cubic-bezier(.48,0,.95,.49) ;
                .inner{
                    width:16px;
                    height:16px;
                    border-radius:50%;
                    background:rgb(0,160,220);
                    transition:all .4s linear;
                }
            }
        }
        .shopcart-list{
            position:absolute;
            top:0;
            left:0;
            z-index:-1;
            width:100%;
            transform:translate3d(0,-100%,0);
            &.fold-enter-active, &.fold-leave-active{
                transition: all .5s;
            }
            &.fold-enter, &.fold-leave-active{
                transform: translate3d(0, 0, 0);
            }
            .list-header{
                height:40px;
                line-height:40px;
                padding:0 18px;
                background:#f3f5f7;
                border-bottom:1px solid rgba(7,17,27,0.1);
                .title{
                    float:left;
                    font-size:14px;
                    color:rgb(7,17,27);
                }
                .empty{
                    float:right;
                    font-size:12px;
                    color:rgb(0,160,220);
                }
            }
            .list-content{
                padding:0 18px;
                max-height:217px;
                background:#fff;
                overflow:hidden;
                .food{
                    position:relative;
                    padding:12px 0;
                    box-sizing:border-box;
                    @include border-1px(rgba(7,17,27,0.1));
                    .name{
                        line-height:24px;
                        font-size:14px;
                        color:rgb(7,17,27);
                    }
                    .price{
                        position:absolute;
                        right:90px;
                        bottom:12px;
                        line-height:24px;
                        font-size:14px;
                        font-weight:700;
                        color:rgb(240,20,20);
                    }
                    .cartcontrol-warpper{
                        position:absolute;
                        right:0;
                        bottom:6px;
                    }
                }
            }
        }
    }
    .list-mask{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:40;
        background: rgba(7, 17, 27, 0.6);
        filter: blur(5px);
        opacity:1;
        &.fade-enter-active,&.fade-leave-active{
            transition: all 0.5s;
        }
        &.fade-enter,&.fade-leave-active{
            opacity:0;
        }
    }
</style>
