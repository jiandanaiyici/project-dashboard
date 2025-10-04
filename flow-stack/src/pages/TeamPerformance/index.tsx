import React from 'react';
import { Tabs } from 'antd';

import TeamOverview from './TeamOverview';
import IterationComparison from './IterationComparison';
import MemberContributions from './MemberContributions';
import QualityMetrics from './QualityMetrics';
import ImprovementPlan from './ImprovementPlan';

const { TabPane } = Tabs;
/**
 * 团队效能
 */
const TeamPerformancePage: React.FC = () => {
  return (
    <Tabs defaultActiveKey="team">
      <TabPane tab="效能概览" key="team">
        <TeamOverview />
      </TabPane>
      {/* <TabPane tab="成员效能详情" key="member">
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      </TabPane> */}
      <TabPane tab="成员贡献" key="contribution">
        <MemberContributions />
      </TabPane>
      <TabPane tab="迭代对比" key="iteration">
        <IterationComparison />
      </TabPane>
      <TabPane tab="质量指标" key="quality">
        <QualityMetrics />
      </TabPane>
      <TabPane tab="改进计划" key="plan">
        <ImprovementPlan />
      </TabPane>
    </Tabs>
  );
};

export default TeamPerformancePage;
