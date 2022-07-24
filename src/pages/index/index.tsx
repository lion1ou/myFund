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

  const fundBuyInfo = {
    '003095': {
      lastBuyDate: '2022-06-28',
    },
    161725: {
      lastBuyDate: '2022-07-07',
    },
    110020: {
      lastBuyDate: '2022-07-05',
    },
    '005827': {
      lastBuyDate: '2021-09-15',
    },
    320007: {
      lastBuyDate: '2022-07-13',
    },
    '001475': {
      lastBuyDate: '2022-07-13',
    },
    '005669': {
      lastBuyDate: '2022-07-12',
    },
    '002190': {
      lastBuyDate: '2022-07-11',
    },
    110011: {
      lastBuyDate: '2022-07-13',
    },
    '011103': {
      lastBuyDate: '2022-07-11',
    },
  };

  const isPro = env === 'WEB' && window.location.host === 'toy.lion1ou.tech';

  const [fundInfoList, setFundInfoList] = isPro ? useState([]) : useState(testData);

  const [loading, setLoading] = useState(false);
  const getFundInfoListHandle = () => {
    setLoading(true);
    const today = dayjs().format('YYYY-MM-DD');
    const fundCodeArr = Object.keys(fundBuyInfo);
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

  const getDayPrice = (historyList, date) => {
    const lens = historyList.length;
    for (let i = lens - 1; i > 0; i -= 1) {
      if (historyList[i][0] === date) {
        return historyList[i][1];
      }
    }
    return 0;
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
      .map((item: any) => {
        const lastBuyPrice = fundBuyInfo[item.code] ? getDayPrice(item.totalNetWorthData, fundBuyInfo[item.code].lastBuyDate) : 0;
        return {
          ...item,
          ...fundBuyInfo[item.code],
          todayDiffLastBuy: ((item.expectWorth - lastBuyPrice) * 100) / lastBuyPrice || 0,
          diffLastBuy: ((item.netWorth - lastBuyPrice) * 100) / lastBuyPrice || 0,
          todayContinuousUpOrDown: getContinuousNum(item.netWorthData, item.expectGrowth) || 0,
          continuousUpOrDown: getContinuousNum(item.netWorthData.slice(0, -1), item.netWorthData[item.netWorthData.length - 1][2]) || 0,
        };
      }).sort((a, b) => a.todayContinuousUpOrDown - b.todayContinuousUpOrDown);

    const colorStyle = (val) => ({ color: (Number(val) > 0 ? '#ff6040' : '#006040') });

    return res.map((item) => (
      <View style={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #ddd',
      }}
      >
        <View style={{ width: '200px', textAlign: 'center' }}>{item.name}</View>
        <View className="num-text" style={colorStyle(item.expectWorth)}>
          {item.expectWorth}
        </View>
        <View className="num-text" style={colorStyle(item.expectGrowth)}>
          {item.expectGrowth}
          %
        </View>
        <View className="num-text" style={colorStyle(item.todayDiffLastBuy)}>
          <View>
            {item.todayDiffLastBuy.toFixed(2)}
            %
          </View>
          <View>{item.lastBuyDate}</View>
        </View>
        <View className="num-text" style={colorStyle(item.todayContinuousUpOrDown)}>
          {item.todayContinuousUpOrDown.toFixed(2)}
          %
        </View>
        <View className="num-text" style={colorStyle(item.continuousUpOrDown)}>
          {item.continuousUpOrDown.toFixed(2)}
          %
        </View>
        <View className="num-text" style={colorStyle(item.diffLastBuy)}>
          {item.diffLastBuy.toFixed(2)}
          %
        </View>
        <View className="num-text" style={colorStyle(item.netWorthData[item.netWorthData.length - 1][2])}>
          {item.netWorthData[item.netWorthData.length - 1][2]}
          %
        </View>
      </View>

    ));
  };

  return (
    <View className="wrapper">
      <View className="flex-between" style={{ marginBottom: '10px' }}>
        <Button size="mini" type="primary" onClick={getFundInfoListHandle} style={{ display: 'inline-block' }}>
          获取数据
        </Button>
        <Text>
          {fundInfoList.length ? fundInfoList[0].netWorthDate : ''}
        </Text>
      </View>

      {loading ? <Text style={{ textAlign: 'center' }}>加载中...</Text> : ''}
      <View className="flex-between" style={{ borderBottom: '1px solid #cccccc' }}>
        <View style={{ width: '200px', textAlign: 'center' }}>名称</View>
        <View style={{ textAlign: 'center', width: '100px' }}>
          今日实时
        </View>
        <View style={{ textAlign: 'center', width: '100px' }}>
          今日差率
        </View>
        <View style={{ textAlign: 'center', width: '100px' }}>
          最后成交差率
        </View>
        <View style={{ textAlign: 'center', width: '100px' }}>
          今日连续
        </View>

        <View style={{ textAlign: 'center', width: '100px' }}>
          昨日连续
        </View>
        <View style={{ textAlign: 'center', width: '100px' }}>
          最后成交差率
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
