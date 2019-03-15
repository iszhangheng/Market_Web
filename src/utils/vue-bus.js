const install = function(Vue) {
  const Bus = new Vue({
    methods: {
      emit(eventName, ...args) {
        this.$emit(eventName, ...args);
      },
      on(eventName, callback) {
        this.$on(eventName, callback);
      },
      off(eventName, callback) {
        this.$off(eventName, callback);
      }
    }
  });
  Vue.prototype.$bus = Bus;
};
export default install;
