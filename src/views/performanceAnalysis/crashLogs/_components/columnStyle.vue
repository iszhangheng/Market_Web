<template>
  <div>
    <!-- <span style="color:#20A0FF">{{row[col.prop]}}</span><br/> -->
    <span>{{newDate}}</span>
  </div>
</template>
<script>
export default {
  props: ['row', 'col', 'column', 'val'],
  computed: {
    newDate() {
      return this.$moment(this.val).format('YYYY-MM-DD HH:mm:ss');
    }
  }
};
</script>

