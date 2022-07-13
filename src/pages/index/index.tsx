import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, Button, Image,
} from '@tarojs/components';
import {
  useEnv, useNavigationBar, useModal, useToast,
} from 'taro-hooks';
import dayjs from 'dayjs';
import { getFundInfo, getFundInfoList, getFundDetails } from '../../api/index';

import './index.less';
import testData from './test';

function Index() {
  const env = useEnv();

  const fundCodeArr = [
    '003095',
    '161725',
    '110020',
    '005827',
    '005669',
    '320007',
    '002190',
    '001475',
    '011103',
    '110011',
  ];
  const fundBuyInfo = {
    '003095': {
      lastBuyPrice: '2.5080',
      avgPrice: '3.1320',
    },
    161725: {
      lastBuyPrice: '1.0302',
      avgPrice: '1.2053',
    },
    '005827': {
      lastBuyPrice: '2.4799',
      avgPrice: '2.6587',
    },
    110020: {
      lastBuyPrice: '1.7569',
      avgPrice: '1.8808',
    },
    '011103': {
      lastBuyPrice: '1.1195',
      avgPrice: '1.2994',
    },
    '002190': {
      lastBuyPrice: '3.3694',
      avgPrice: '3.9964',
    },
    '001475': {
      lastBuyPrice: '1.5420',
      avgPrice: '1.6722',
    },
    110011: {
      lastBuyPrice: '6.2173',
      avgPrice: '7.3992',
    },
  };
  let initData:any[] = [];
  if (env === 'h5') {
    const { host } = window.location;
    initData = host === 'toy.lion1ou.tech' ? [] : [...testData];
  }
  const [fundInfoList, setFundInfoList] = useState(initData);
  const [loading, setLoading] = useState(false);
  const getFundInfoListHandle = () => {
    setLoading(true);
    const today = dayjs().format('YYYY-MM-DD');
    getFundInfoList(fundCodeArr, today).then((res: any) => {
      setFundInfoList(res.data);
      setLoading(false);
    });
  };

  const getContinuousNum = (historyList, current) => {
    const lens = historyList.length;
    const list:any = [];
    for (let i = lens - 1; i > 0; i -= 1) {
      if (Number(historyList[i][2]) >= 0 && Number(current) >= 0) {
        list.push(historyList[i][2]);
      } else if (Number(historyList[i][2]) < 0 && Number(current) < 0) {
        list.push(historyList[i][2]);
      } else {
        break;
      }
    }
    const a = list.reduce((r, i) => Number(r) + Number(i), 0);
    return a + Number(current);
  };

  const renderList = () => {
    if (!fundInfoList.length) {
      return (
        <Text style={{ textAlign: 'center', paddingTop: '200px', fontSize: '14px' }}>
          暂无数据
        </Text>
      );
    }
    const res = fundInfoList
      .map((item: any) => ({
        ...item,
        todayDiffLastBuy: fundBuyInfo[item.code] ? ((item.expectWorth - fundBuyInfo[item.code].lastBuyPrice) * 100) / fundBuyInfo[item.code].lastBuyPrice : 0,
        diffAvgPrice: fundBuyInfo[item.code] ? ((item.expectWorth - fundBuyInfo[item.code].avgPrice) * 100) / fundBuyInfo[item.code].avgPrice : 0,
        // diffLastBuy: ((item.netWorth - fundBuyInfo[item.code].lastBuyPrice) * 100) / fundBuyInfo[item.code].lastBuyPrice || 0,
        // diffyesterDayPrice: ((item.netWorth - fundBuyInfo[item.code].avgPrice) * 100) / fundBuyInfo[item.code].avgPrice || 0,
        continuousUpOrDown: getContinuousNum(item.netWorthData.slice(0, -1), item.netWorthData[item.netWorthData.length - 1][2]) || 0,
        todayContinuousUpOrDown: getContinuousNum(item.netWorthData, item.expectGrowth) || 0,
      })).sort((a, b) => a.todayContinuousUpOrDown - b.todayContinuousUpOrDown);

    return res.map((item) => (
      <View style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <View style={{ width: '200px', textAlign: 'center' }}>{item.name}</View>
        <View style={{
          textAlign: 'center', width: '100px', fontSize: '14px', display: 'block', color: Number(item.expectGrowth) > 0 ? '#ff6040' : '#006040',
        }}
        >
          {item.expectWorth}
        </View>
        <View style={{
          textAlign: 'center', width: '100px', fontSize: '14px', display: 'block', color: Number(item.expectGrowth) > 0 ? '#ff6040' : '#006040',
        }}
        >
          {item.expectGrowth}
          %
        </View>
        <View style={{
          textAlign: 'center', width: '100px', fontSize: '14px', display: 'block', color: item.todayContinuousUpOrDown > 0 ? '#ff6040' : '#006040',
        }}
        >

          {item.todayContinuousUpOrDown.toFixed(2)}
          %
        </View>
        {/* <View style={{
          textAlign: 'center', width: '100px', fontSize: '14px', display: 'block', color: item.todayDiffLastBuy > 0 ? '#ff6040' : '#006040',
        }}
        >

          {item.todayDiffLastBuy.toFixed(2)}
          %
        </View> */}
        <View style={{
          textAlign: 'center', width: '100px', fontSize: '14px', display: 'block', color: Number(item.continuousUpOrDown) > 0 ? '#ff6040' : '#006040',
        }}
        >
          {item.continuousUpOrDown.toFixed(2)}
          %
        </View>
        <View style={{
          textAlign: 'center', width: '100px', fontSize: '14px', display: 'block', color: Number(item.netWorthData[item.netWorthData.length - 1][2]) > 0 ? '#ff6040' : '#006040',
        }}
        >
          {item.netWorthData[item.netWorthData.length - 1][2]}
          %
        </View>
      </View>

    ));
  };

  return (
    <View className="wrapper">
      <Button size="mini" type="primary" onClick={getFundInfoListHandle}>
        获取数据
      </Button>
      {loading ? <Text style={{ textAlign: 'center' }}>加载中...</Text> : ''}
      <View style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <View style={{ width: '200px', textAlign: 'center' }}>名称</View>
        <View style={{ textAlign: 'center', width: '100px' }}>
          今日实时
        </View>
        <View style={{ textAlign: 'center', width: '100px' }}>
          今日差率
        </View>
        <View style={{ textAlign: 'center', width: '100px' }}>
          今日连续
        </View>
        {/* <View style={{ textAlign: 'center', width: '100px' }}>
          最后成交差率
        </View> */}
        <View style={{ textAlign: 'center', width: '100px' }}>
          昨日连续
        </View>
        <View style={{ textAlign: 'center', width: '100px' }}>
          昨日差率
        </View>
      </View>
      {renderList()}
    </View>
  );
}

export default Index;
