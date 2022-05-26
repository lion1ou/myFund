import React, { useCallback, useEffect } from "react";
import { View, Text, Button, Image } from "@tarojs/components";
import { useEnv, useNavigationBar, useModal, useToast } from "taro-hooks";
import { getFundInfo, getFundInfoList } from '../../api/index';
import dayjs from 'dayjs';

import './index.less'

const Index = () => {
  const env = useEnv();
  const [_, { setTitle }] = useNavigationBar({ title: "Taro Hooks" });
  const [show] = useModal({
    title: "Taro Hooks!",
    showCancel: false,
    confirmColor: "#8c2de9",
    confirmText: "支持一下",
    mask: true,
  });
  const [showToast] = useToast({ mask: true });

  const handleModal = useCallback(() => {
    show({ content: "不如给一个star⭐️!" }).then(() => {
      showToast({ title: "点击了支持!" });
    });
  }, [show, showToast]);

  const fundCodeArr = ['003095', '161725', '005827', '110020', '011103', '002190', '001475', '110011'] 
  const fundBuyInfo = {
    '003095': {
      lastBuyPrice: '2.5080',
      avgPrice: '3.1320'
    },
    '161725': {
      lastBuyPrice: '1.0302',
      avgPrice: '1.2053'
    },
    '005827': {
      lastBuyPrice: '2.4799',
      avgPrice: '2.6587'
    },
    '110020': {
      lastBuyPrice: '1.7569',
      avgPrice: '1.8808'
    },
    '011103': {
      lastBuyPrice: '1.2092',
      avgPrice: '1.3628'
    },
    '002190': {
      lastBuyPrice: '3.3694',
      avgPrice: '3.9964'
    },
    '001475': {
      lastBuyPrice: '1.5420',
      avgPrice: '1.6722'
    },
    '110011': {
      lastBuyPrice: '6.0289',
      avgPrice: '8.6525'
    }
  }

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD')
    getFundInfoList(fundCodeArr, today).then((res) => {
      console.log(res)
    })
  }) 

  return (
    <View className='wrapper'>
      
      <View className='list'>
        <Text className='label'>运行环境</Text>
        <Text className='note'>{env}</Text>
      </View>
      <Button className='button' onClick={() => setTitle("Taro Hooks Nice!")}>
        设置标题
      </Button>
      <Button className='button' onClick={handleModal}>
        使用Modal
      </Button>
    </View>
  );
};

export default Index;
