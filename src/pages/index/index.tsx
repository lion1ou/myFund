import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, Button, Image,
} from '@tarojs/components';
import {
  useEnv, useNavigationBar, useModal, useToast,
} from 'taro-hooks';
import dayjs from 'dayjs';
import { getFundInfo, getFundInfoList } from '../../api/index';

import './index.less';
import testData from './test';

function Index() {
  const env = useEnv();

  const fundCodeArr = [
    '003095',
    '161725',
    '005827',
    '110020',
    '011103',
    '002190',
    '001475',
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

  const [fundInfoList, setFundInfoList] = useState([...testData]);
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
        todayDiffLastBuy: ((item.expectWorth - fundBuyInfo[item.code].lastBuyPrice) * 100) / fundBuyInfo[item.code].lastBuyPrice,
        diffAvgPrice: ((item.expectWorth - fundBuyInfo[item.code].avgPrice) * 100) / fundBuyInfo[item.code].avgPrice,
        diffLastBuy: ((item.netWorth - fundBuyInfo[item.code].lastBuyPrice) * 100) / fundBuyInfo[item.code].lastBuyPrice,
        diffyesterDayPrice: ((item.netWorth - fundBuyInfo[item.code].avgPrice) * 100) / fundBuyInfo[item.code].avgPrice,
        continuousUpOrDown: getContinuousNum(item.netWorthData.slice(0, -1), item.netWorthData[item.netWorthData.length - 1][2]),
        todayContinuousUpOrDown: getContinuousNum(item.netWorthData, item.expectGrowth),
      })).sort((a, b) => a.diffLastBuy - b.diffLastBuy);

    return res.map((item) => (
      <View style={{ border: '1px solid #ddd', margin: '5px' }}>
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: '18px' }}>{item.name}</Text>
          <Text style={{ fontSize: '12px', display: 'block', textAlign: 'right' }}>
            {item.expectWorthDate}
          </Text>
        </View>

        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{}}>
            <Text style={{ fontSize: '14px' }}>昨日</Text>
            <Text style={{ fontSize: '14px', display: 'block', color: Number(item.netWorthData[item.netWorthData.length - 1][2]) > 0 ? '#ff6040' : '#006040' }}>
              趋势：
              {item.totalNetWorthData[item.totalNetWorthData.length - 1][1]}
              /
              {item.netWorthData[item.netWorthData.length - 1][2]}
              %
            </Text>
            <Text style={{ fontSize: '14px', display: 'block', color: item.continuousUpOrDown > 0 ? '#ff6040' : '#006040' }}>
              连续：
              {item.continuousUpOrDown.toFixed(2)}
              %
            </Text>
            <Text style={{ fontSize: '14px', display: 'block', color: item.diffyesterDayPrice > 0 ? '#ff6040' : '#006040' }}>
              成本：
              {item.diffyesterDayPrice.toFixed(2)}
              %
            </Text>
            <Text style={{ fontSize: '14px', display: 'block', color: item.diffLastBuy > 0 ? '#ff6040' : '#006040' }}>
              最后成交：
              {item.diffLastBuy.toFixed(2)}
              %
            </Text>
          </View>

          <View style={{}}>
            <Text style={{ fontSize: '14px' }}>今日</Text>
            <Text style={{ fontSize: '14px', display: 'block', color: Number(item.expectGrowth) > 0 ? '#ff6040' : '#006040' }}>
              趋势：
              {item.expectWorth}
              /
              {item.expectGrowth}
              %
            </Text>
            <Text style={{ fontSize: '14px', display: 'block', color: item.todayContinuousUpOrDown > 0 ? '#ff6040' : '#006040' }}>
              连续：
              {item.todayContinuousUpOrDown.toFixed(2)}
              %
            </Text>
            <Text style={{ fontSize: '14px', display: 'block', color: item.diffAvgPrice > 0 ? '#ff6040' : '#006040' }}>
              成本：
              {item.diffAvgPrice.toFixed(2)}
              %
            </Text>
            <Text style={{ fontSize: '14px', display: 'block', color: item.todayDiffLastBuy > 0 ? '#ff6040' : '#006040' }}>
              最后成交：
              {item.todayDiffLastBuy.toFixed(2)}
              %
            </Text>
          </View>
        </View>
        <View>
          <Text style={{ fontSize: '12px' }}>操作建议：</Text>
          <Text style={{ fontSize: '20px' }}>
            {item.todayContinuousUpOrDown > 3 && item.diffAvgPrice >= 10 ? '卖' : item.todayContinuousUpOrDown < -5 ? '买' : '无'}
          </Text>
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
      {renderList()}
    </View>
  );
}

export default Index;
