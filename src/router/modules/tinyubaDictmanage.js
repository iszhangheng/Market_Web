export default [{
  // 页面字典
    path: 'pageDictionary',
    name: 'pageDictionary',
    component: () =>
      import('@/views/dictManage/pageDictionary/index'),
    meta: {
      title: 'pageDictionary'
    }
  },
  // 银行字典
  {
    path: 'bankDictionary',
    name: 'bankDictionary',
    component: () =>
      import('@/views/dictManage/bankDictionary/index'),
    meta: {
      title: 'bankDictionary'
    }
  }
];
