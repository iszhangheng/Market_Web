const mixin = {
  data() {
    return {};
  },
  computed: {
    pickerOptions() {
      return {
        shortcuts: [{
            text: this.$t('date.today'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: this.$t('date.week'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: this.$t('date.month'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: this.$t('date.months'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      };
    },
    startDate() {
      const start = this.date === null ? '' : this.date[0];
      return start ? this.$moment(start).valueOf() : '';
    },
    endDate() {
      const end = this.date === null ? '' : this.date[1];
      return end ? this.$moment(end).valueOf() : '';
    }
  },
  methods: {}
};
export default mixin;
