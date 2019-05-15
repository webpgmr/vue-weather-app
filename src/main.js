/**
 * Created by andre on 10.12.15.
 */

// load vue object
Vue = require('vue');
// load vue plugins
Vue.use(require('vue-resource'));

// load main component
var App = require('./phone.vue');

// create vue instance and assign main component
new Vue({
    el: 'body',
    components: {
        app: App
    }
});