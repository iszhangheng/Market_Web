<template>
  <div>
    <!-- <span style="color:#20A0FF">{{row[col.prop]}}</span><br/> -->
    <span>{{val}}</span>
  </div>
</template>
<script>
export default {
  props: ['row', 'col', 'column', 'val']
};
</script>

