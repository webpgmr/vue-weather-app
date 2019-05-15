<style scoped>
    .active {
        border-color: darkorange;
        background-color: lightgoldenrodyellow;
    }

    .phoneEntry {
        transition: border-color .5s, background-color .5s;
    }
</style>

<template>
    <div class="phoneEntry" :class="{'active': entry.isFavored}" @dblclick="highlight">
        <slot name="header"></slot>
        <p>Name: {{ entry.name }}</p>

        <p>Number: {{ entry.number }}</p>
        <button @click="deleteEntry">X</button>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            id: {
                type: Number,
                required: true
            },
            entry: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                fooBar: false
            };
        },
        methods: {
            deleteEntry () {
                this.$dispatch('phonenumber-delete', this.entry);
            },
            highlight () {
                this.entry.isFavored = !this.entry.isFavored;
                // always dispatch events after the actual work in the method is done because
                // dispatching will trigger event listeners asynchronously
                this.$dispatch('modified', this.entry);
            }
        }
    }
</script>
