<template>
    <div :class="customClass">
        <label class="left-text">{{labelTitle}}</label>
        <v-switch v-model="switchInput" :label="switchTitle" @change="switchChangeHandler"></v-switch>
    </div>
</template>

<script>
export default {
    name: 'switch-component',
    props: {
        labelTitle: {
            default: 'default label',
            required: false
        },
        switchTitle: {
            default: 'default title',
            required: false
        },
        // custom class should be accessible globally 
        customClass: {
            default: '',
            required: false
        }
    },
    data() {
        return {
            switchInput: false
        }
    },
    methods: {
        switchChangeHandler() {
            this.$emit('switchChangeHandler', this.switchInput)
        }
    },
}
</script>

<style scoped>
.goal-type-wrap.reminder-type-switch {
    left: 140px !important;
}
</style>