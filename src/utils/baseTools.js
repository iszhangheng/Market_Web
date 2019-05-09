// 判断字符串是否为空
export function isEmpty(str) {
  if (str === null || str === undefined || str.length === 0) {
    return true;
  }
  return false;
}
export const restTypeList = [{
    value: '事假',
    label: '事假'
  },
  {
    value: '病假',
    label: '病假'
  },
  {
    value: '婚假',
    label: '婚假'
  },
  {
    value: '看护假',
    label: '看护假'
  },
  {
    value: '丧假',
    label: '丧假'
  }
];
export const deptPostList = [{
    value: 'CGB',
    label: '采购部',
    children: [{
      value: 'CGB1557217001013',
      label: '采购部经理'
    }, {
      value: 'CGB1557217001014',
      label: '采购员'
    }]
  },
  {
    value: 'XSB',
    label: '销售部',
    children: [{
      value: 'XSB1557217001015',
      label: '销售部经理'
    }, {
      value: 'XSB1557217001016',
      label: '销售员'
    }]
  },
  {
    value: 'CWB',
    label: '财务部',
    children: [{
      value: 'CWB1557217001020',
      label: '财务部经理'
    }, {
      value: 'CGB1557217001014',
      label: '采购员'
    }]
  },
  {
    value: 'RSB',
    label: '人事部',
    children: [{
      value: 'RSB1557217001022',
      label: '人事部经理'
    }, {
      value: 'RSB1557217001021',
      label: '人事专员'
    }]
  }
];
