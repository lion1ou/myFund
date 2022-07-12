import Taro from '@tarojs/taro';

export const getFundInfo = (code: string, startDate?: string) => new Promise((resolve, reject) => {
  Taro.request({
    url: `https://api.doctorxiong.club/v1/fund/detail?code=${code}&startDate=${startDate}`,
    success: (res) => {
      if (res.statusCode === 200) {
        resolve(res.data);
      } else {
        reject(res);
      }
    },
    fail: (error) => { reject(error); },
  });
});

export const getFundInfoList = (codeList: string[], startDate?: string) => new Promise((resolve, reject) => {
  Taro.request({
    url: `https://api.doctorxiong.club/v1/fund/detail/list?code=${codeList.join(',')}&startDate=${startDate}`,
    success: (res) => {
      if (res.statusCode === 200) {
        resolve(res.data);
      } else {
        reject(res);
      }
    },
    fail: (error) => { reject(error); },
  });
});

export const getFundDetails = (fundcode) => new Promise((resolve, reject) => {
  Taro.request({
    url: `https://fundmobapi.eastmoney.com/FundMApi/FundBaseTypeInformation.ashx?FCODE=${fundcode}&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&Uid=&_=${new Date().getTime()}`,
    method: 'GET',
    mode: 'no-cors',
    header: {
      mode: 'no-cors',
    },
    success: (res) => {
      if (res.statusCode === 200) {
        resolve(res.data);
      } else {
        reject(res);
      }
    },
    fail: (error) => { reject(error); },
  });
});
