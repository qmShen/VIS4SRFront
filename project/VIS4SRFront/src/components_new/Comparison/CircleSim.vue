<template>
    <circle fill="red" fill-opacity='0.1' r="2"></circle>
</template>

<script>
export default {
    name: "CircleSim",
    props:['props'],
    mounted(){
        console.log('created', this.props)
    }
}
</script>

<style scoped>

</style>