### Vue.js2.0 仿制Vue社区热门项目（饿了么App）

<h2>前言</h2>
</hr>
初学vue时曾在网上搜索vue的实战项目源码，无奈大部分都是简单的demo,对于进一步熟悉和学习vue没有太大的帮助。最后在Vue社区看见比较热门的Vue进阶项目，Vue版本的饿了么App，由于找的大多数demo都是Vue1.0，而在现在Vue1.0已经略显过时，因此本人决定使用Vue2.0+Vue全家桶(Axios,Vue-router,Vuex)对前人项目进行重构。**图片和数据是从Vue社区原来Vue1.0项目哪里获取**

<h2>技术栈</h2>
<h4>Vue2.0：使用最新版本Vue，也是现在较为流行的Vue2.0</h4>
<h4>Axios：尤老大推荐使用axios去处理HTTP请求</h4>
<h4>vue-router：Vue官方路由器</h4>
<h4>vuex：Vue官方的状态管理</h4>
<h4>webpack2.0：现在非常流行的打包工具</h4>
<h4>ES6/7：采用ES6/7语法，拥抱未来，拥抱趋势</h4>
<h4>scss：个人喜好，个人比较喜欢使用scss风格的方式编写css</h4>
</hr>

<h2>效果图</h2>
</hr>

![效果一](./static/img/ele1.gif)

![效果二](./static/img/ele2.gif)

<h2>运行</h2>
</hr>

```
step1:
git clone git@github.com:PeterCheng1/personal-app-vue.git

step2:
git install

step3:
npm run dev
```

<h2>总结</h2>
</hr>
这个项目虽然不太复杂，但是对于一些了解Vue，可以用做一些东西的童鞋是非常不错的：
1：我们可以从这个项目去学习到如果更好地去抽象一个组件，那些组件是需要我们去抽象。
2：之前我对移动端的认识，只是停留在理论层面，这次这个饿了么的开发，能加大我对移动端的认识，例如border-1px flex布局 stick-footer布局 viewport 不同dpr要使用media属性进行处理等等知识。
3：vuex的使用，之前自己去写的项目没有使用过vuex这个神器，虽然原来的Vue1.0饿了么也没有使用vuex，因此我对这个项目进行重构的使用着重使用vuex去对（总价格，选择产品总数，被选中产品）进行状态管理。个人感觉vuex相比于redux，是比较容易入手的，当然redux只需要理解它的运行方式也不太难。

<h2>问题</h2>
</hr>
1：当对小球的动画效果进行开发的时候，一开始使用各种api去对小球的开始坐标进行计算，后来看了看原来的项目，原来还存在getBoundingClientRect这个api去获取元素相对于视口的位置。
