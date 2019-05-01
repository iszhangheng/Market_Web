<template>
  <div>
    <span>{{newDate}}</span>
  </div>
</template>
<script>
export default {
  props: ['row', 'col', 'column', 'val'],
  computed: {
    newDate() {
      let date = parseInt(this.val);
      let hour = 0;
      let minute = 0;
      let second = 0;
      hour = parseInt(date / (60 * 60 * 1000));
      date = parseInt(date % (60 * 60 * 1000));
      minute = parseInt(date / (60 * 1000));
      date = parseInt(date % (60 * 1000));
      second = parseInt(date / (1000));
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (minute < 10) {
        minute = '0' + minute;
      }
      if (second < 10) {
        second = '0' + second;
      }
      return hour + ':' + minute + ':' + second;
      // ':' +
      // (
      //   ((
      //     (parseInt(this.val) / 1000 / 3600 -
      //       parseInt(this.val) / 1000 / 3600) *
      //     60
      //   ).toFixed(2) -
      //     (
      //       (parseInt(this.val) / 1000 / 3600 -
      //         parseInt(this.val) / 1000 / 3600) *
      //       60
      //     )
      //       .toFixed(2)
      //       .toFixed(2)) *
      //     60
      // ).toFixed(2)
    }
  }
};
</script>

