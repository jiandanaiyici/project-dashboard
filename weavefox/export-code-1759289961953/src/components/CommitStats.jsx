import React from 'react';
import { Statistic, Row, Col, Card } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const CommitStats = ({ data }) => {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title="代码提交次数"
            value={data?.count || 0}
            precision={0}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
            suffix="次"
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="提交代码量"
            value={data?.lines || 0}
            precision={0}
            valueStyle={{ color: '#008cff' }}
            suffix="行"
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="环比增长"
            value={data?.growth || 0}
            precision={1}
            valueStyle={{ color: data?.growth >= 0 ? '#3f8600' : '#cf1322' }}
            prefix={data?.growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="%"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default CommitStats;
