import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Button, Image } from "@tarojs/components";
import { useEnv, useNavigationBar, useModal, useToast } from "taro-hooks";
import { getFundInfo, getFundInfoList } from "../../api/index";
import dayjs from "dayjs";

import "./index.less";

const Index = () => {
  const env = useEnv();

  const fundCodeArr = [
    "003095",
    "161725",
    "005827",
    "110020",
    "011103",
    "002190",
    "001475",
    "110011"
  ];
  const fundBuyInfo = {
    "003095": {
      lastBuyPrice: "2.5080",
      avgPrice: "3.1320"
    },
    "161725": {
      lastBuyPrice: "1.0302",
      avgPrice: "1.2053"
    },
    "005827": {
      lastBuyPrice: "2.4799",
      avgPrice: "2.6587"
    },
    "110020": {
      lastBuyPrice: "1.7569",
      avgPrice: "1.8808"
    },
    "011103": {
      lastBuyPrice: "1.1195",
      avgPrice: "1.2994"
    },
    "002190": {
      lastBuyPrice: "3.3694",
      avgPrice: "3.9964"
    },
    "001475": {
      lastBuyPrice: "1.5420",
      avgPrice: "1.6722"
    },
    "110011": {
      lastBuyPrice: "6.2173",
      avgPrice: "7.3992"
    }
  };

  const [fundInfoList, setFundInfoList] = useState([]);

  const getFundInfoListHandle = () => {
    const today = dayjs().format("YYYY-MM-DD");
    getFundInfoList(fundCodeArr, today).then((res: any) => {
      setFundInfoList(res.data);
    });
  };

  const renderList = () => {
    if (!fundInfoList.length) {
      return <Text style={{textAlign: 'center', paddingTop: '200px', fontSize: '14px'}}>暂无数据</Text>;
    }
    const res = fundInfoList
      .map(item => ({
        ...item,
        diffLastBuy: ((item.expectWorth - fundBuyInfo[item.code].lastBuyPrice) * 100) / fundBuyInfo[item.code].lastBuyPrice,
        diffAvgPrice: ((item.expectWorth - fundBuyInfo[item.code].avgPrice) * 100) / fundBuyInfo[item.code].avgPrice
      })).sort((a, b) => a.diffLastBuy - b.diffLastBuy);

    return res.map(item => {
      return (
        <View style={{ border: "1px solid #ddd", margin: "5px" }} >
          <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
            <Text style={{ fontSize: "18px" }}>{item.name}</Text>
            <Text style={{ fontSize: "14px", color: Number(item.expectGrowth) > 0 ? "#ff6040" : "#006040" }}>
              实时：{item.expectWorth}/{item.expectGrowth}
            </Text>
          </View>
          <Text style={{ fontSize: "14px", display: "block", color: item.diffAvgPrice > 0 ? "#ff6040" : "#006040" }} >
            成本偏差：{item.diffAvgPrice.toFixed(2)}%
          </Text>
          <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
          <Text style={{ fontSize: "14px", display: "block", color: item.diffLastBuy > 0 ? "#ff6040" : "#006040" }} >
            最后成交偏差：{item.diffLastBuy.toFixed(2)}%
          </Text>
          <Text style={{ fontSize: "12px", display: "block", textAlign: 'right' }} >
           {item.expectWorthDate}
          </Text>
          </View>
        </View>
      );
    });
  };

  return (
    <View className='wrapper'>
      <Button size='mini' type='primary' onClick={getFundInfoListHandle}>
        获取数据
      </Button>
      {renderList()}
    </View>
  );
};

export default Index;
