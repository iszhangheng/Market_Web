// set function parseTime,formatTime to filter
export {
  parseTime,
  formatTime
}
from '@/utils';
import yhtRouter from '@/filters/yhtRouter';
import channelList from '@/filters/channel';

function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + 's';
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute');
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour');
  } else {
    return pluralize(~~(between / 86400), ' day');
  }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [{
      value: 1E18,
      symbol: 'E'
    },
    {
      value: 1E15,
      symbol: 'P'
    },
    {
      value: 1E12,
      symbol: 'T'
    },
    {
      value: 1E9,
      symbol: 'G'
    },
    {
      value: 1E6,
      symbol: 'M'
    },
    {
      value: 1E3,
      symbol: 'k'
    }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
    }
  }
  return num.toString();
}

export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}

export function yhtRouterFilter(url) {
  let result = '';
  yhtRouter.forEach(item => {
    url = url.lastIndexOf('/') === url.length - 1 ? url.substr(0, url.length - 1) : url;
    if (item.url === url) {
      result = item.title;
    }
  });
  return result;
}

export function yhtChannelFilter(key) {
  let result = '';
  channelList.forEach(item => {
    if (item.key === key) {
      result = item.value;
    }
  });
  return result;
}

export function yhtTitleFilter(title) {
  let result = '';
  yhtRouter.forEach(item => {
    title = title.lastIndexOf('/') === title.length - 1 ? title.substr(0, title.length - 1) : title;
    if (item.title === title) {
      result = item.url;
    }
  });
  return result;
}
