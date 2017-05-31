<template>
    <div class="header">
        <div class="content-warrper">
            <div class="avatar">
                <img :src="seller.avatar" alt="" width="64" height="64">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div v-if="seller.supports" class="supports">
                    <span class="icon"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
        </div>
        <div class="bulletin-warrper"></div>
    </div>
</template>

<script>

export default {
    props : {
        seller : {
            type:Object
        }
    },
}

</script>

<style lang="scss" rel="stylesheet/scss">
    .header{
        color:#fff;
        background:#000;
        .content-warrper{
            padding:24px 12px 18px 24px;
            .avatar{
                display:inline-block;
            }
            .content{
                display:inline-block;
            }
        }
    }

</style>
