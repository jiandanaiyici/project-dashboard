import React, { useState, useEffect } from 'react';
import { Select, Tabs } from 'antd';
import { Line } from '@antv/g2plot';

import { riskTrendData } from '@/mock';
import AIDecisionCenter from './AIDecisionCenter';
import AIDecisionCenterWithResourceOptimization from './AIDecisionCenterWithResourceOptimization';
import AIReleaseSuggestion from './AIReleaseSuggestion';
import AIDashboard from './AIDashboard';

const { TabPane } = Tabs;

const AIDecision: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const [riskChart, setRiskChart] = useState<any>(null);

  // 初始化图表
  useEffect(() => {
    const container = document.getElementById('riskTrendChart');
    if (container) {
      const chart = new Line(container, {
        data: riskTrendData,
        xField: 'date',
        yField: 'total',
        yAxis: {
          title: {
            text: '风险指数',
          },
          max: 100,
        },
        legend: {
          position: 'top-right',
        },
        smooth: true,
        animation: {
          appear: {
            animation: 'path-in',
            duration: 1000,
          },
        },
      });

      setRiskChart(chart);

      return () => {
        chart.destroy();
      };
    }
  }, []);

  return (
    <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
      <TabPane tab="智能概览" key="overview">
        <AIDashboard />
      </TabPane>
      <TabPane tab="风险预测" key="risk">
        <AIDecisionCenter projectId={'123'} />
      </TabPane>
      <TabPane tab="资源优化" key="resources">
        <AIDecisionCenterWithResourceOptimization projectId={123} />
      </TabPane>
      <TabPane tab="发布建议" key="release">
        <AIReleaseSuggestion projectId={123} />
      </TabPane>
      <TabPane tab="模型配置" key="model" />
    </Tabs>
  );
};

export default AIDecision;
