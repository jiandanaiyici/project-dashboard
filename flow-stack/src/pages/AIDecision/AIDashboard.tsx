import { aiChats, releaseWindows } from '@/mock';
import {
  ArrowUpOutlined,
  AudioOutlined,
  BulbOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  HistoryOutlined,
  SendOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Input, Select } from 'antd';
import React, { Fragment, useState } from 'react';
/**
 * 智能概览
 */
const AIDashboard = () => {
  const [chatMessages, setChatMessages] = useState(aiChats);
  const [inputMessage, setInputMessage] = useState('');

  const [releaseEnv, setReleaseEnv] = useState('production');
  // 发送消息
  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newUserMessage = {
      type: 'user' as const,
      content: inputMessage.trim(),
    };

    setChatMessages([...chatMessages, newUserMessage]);
    setInputMessage('');

    // 模拟AI回复
    setTimeout(() => {
      const aiResponses = [
        '根据分析，您提出的问题涉及多个因素。我建议优先关注核心模块的开发进度，并适当调整资源分配以降低风险。具体方案可以参考资源优化区域的建议。',
        '您的问题需要结合当前项目的多个维度进行分析。从数据来看，主要挑战在于时间约束和资源负载。我可以生成一份详细的分析报告供您参考。',
        '基于历史数据和当前趋势，我认为通过合理的资源调整，项目可以按计划推进。建议重点关注高风险任务的进展，并增加每日站会的沟通频率。',
      ];

      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const newAiMessage = {
        type: 'ai' as const,
        content: randomResponse,
      };

      setChatMessages((prev) => [...prev, newAiMessage]);
    }, 1500);
  };
  return (
    <Fragment>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
        <Card className='border-l-4 border-blue-500 hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between'>
            <div className='text-gray-500 text-sm'>项目进度</div>
            <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
              <CheckCircleOutlined className='text-blue-500' />
            </div>
          </div>
          <div className='mt-3 text-2xl font-bold'>68%</div>
          <div className='mt-1 text-xs text-green-500'>
            <ArrowUpOutlined className='mr-1' />
            较上周上升 5%
          </div>
          <div className='mt-3 text-xs text-gray-600'>
            <span className='font-medium'>完成率：</span> 34/50 任务
          </div>
        </Card>

        <Card className='border-l-4 border-orange-500 hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between'>
            <div className='text-gray-500 text-sm'>风险指数</div>
            <div className='w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center'>
              <ExclamationCircleOutlined className='text-orange-500' />
            </div>
          </div>
          <div className='mt-3 text-2xl font-bold'>中等</div>
          <div className='mt-1 text-xs text-red-500'>
            <ArrowUpOutlined className='mr-1' />
            较上周上升 12%
          </div>
          <div className='mt-3 text-xs text-gray-600'>
            <span className='font-medium'>主要风险：</span> 核心模块开发进度滞后
          </div>
        </Card>

        <Card className='border-l-4 border-green-500 hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between'>
            <div className='text-gray-500 text-sm'>预计交付日期</div>
            <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
              <CalendarOutlined className='text-green-500' />
            </div>
          </div>
          <div className='mt-3 text-xl font-bold'>6月30日</div>
          <div className='mt-1 text-xs text-green-500'>
            <CheckCircleOutlined className='mr-1' />
            与计划一致
          </div>
          <div className='mt-3 text-xs text-gray-600'>
            <span className='font-medium'>可信度：</span> 85% 基于当前进度
          </div>
        </Card>

        <Card className='border-l-4 border-purple-500 hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between'>
            <div className='text-gray-500 text-sm'>资源利用率</div>
            <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center'>
              <UserOutlined className='text-purple-500' />
            </div>
          </div>
          <div className='mt-3 text-2xl font-bold'>78%</div>
          <div className='mt-1 text-xs text-orange-500'>
            <ArrowUpOutlined className='mr-1' />
            接近最佳负载
          </div>
          <div className='mt-3 text-xs text-gray-600'>
            <span className='font-medium'>优化建议：</span>{' '}
            调整2名开发人员任务分配
          </div>
        </Card>
      </div>
      {/* 发布建议和AI助手 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* 发布窗口建议 */}
        <div>
          <Card className='h-full'>
            <div className='flex flex-wrap justify-between items-center mb-6'>
              <div>
                <h3 className='font-semibold text-gray-800'>最佳发布窗口</h3>
                <p className='text-gray-500 text-sm mt-1'>
                  基于用户活跃度和系统负载的AI推荐
                </p>
              </div>
              <div className='mt-4 sm:mt-0'>
                <Select
                  defaultValue='production'
                  className='w-40'
                  onChange={setReleaseEnv}
                  suffixIcon={<DownOutlined className='text-xs' />}
                  options={[
                    { value: 'production', label: '生产环境' },
                    { value: 'staging', label: '预发布环境' },
                    { value: 'testing', label: '测试环境' },
                  ]}
                />
              </div>
            </div>

            {/* 推荐发布时间 */}
            <div className='bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 mb-6'>
              <div className='text-center'>
                <div className='text-xs text-gray-500'>推荐发布窗口</div>
                <div className='text-xl font-bold mt-1'>
                  {releaseWindows[0].time}
                </div>
                <div className='text-xs text-purple-600 mt-1'>
                  <CheckOutlined className='mr-1' />
                  最佳匹配度 {releaseWindows[0].matchRate}%
                </div>
              </div>

              <div className='mt-4 grid grid-cols-2 gap-3 text-xs'>
                <Card size='small'>
                  <div className='text-gray-500'>用户活跃度</div>
                  <div className='font-medium mt-1 text-green-600'>
                    {releaseWindows[0].userActivity}
                  </div>
                </Card>
                <Card size='small'>
                  <div className='text-gray-500'>系统负载</div>
                  <div className='font-medium mt-1 text-green-600'>
                    {releaseWindows[0].systemLoad}
                  </div>
                </Card>
                <Card size='small'>
                  <div className='text-gray-500'>恢复窗口</div>
                  <div className='font-medium mt-1 text-green-600'>
                    {releaseWindows[0].recoveryWindow}
                  </div>
                </Card>
                <Card size='small'>
                  <div className='text-gray-500'>成功率预测</div>
                  <div className='font-medium mt-1 text-green-600'>
                    {releaseWindows[0].successRate}
                  </div>
                </Card>
              </div>
            </div>

            {/* 备选发布时间 */}
            <div>
              <h4 className='font-medium text-gray-700 mb-3 text-sm'>
                备选发布窗口
              </h4>
              <div className='space-y-3'>
                {releaseWindows.slice(1).map((window, index) => (
                  <Card key={index} hoverable className='cursor-pointer'>
                    <div className='flex justify-between'>
                      <div className='text-sm font-medium'>{window.time}</div>
                      <Badge
                        color='blue'
                        text={`匹配度 ${window.matchRate}%`}
                      />
                    </div>
                    <div className='mt-2 flex items-center text-xs text-gray-500 space-x-2'>
                      <span>
                        <UserOutlined className='mr-1' />
                        {window?.tags?.[0]}
                      </span>
                      <span>•</span>
                      <span>
                        <UserOutlined className='mr-1' />
                        {window?.tags?.[1]}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* 智能问答助手 */}
        <div className='lg:col-span-2'>
          <Card className='h-full'>
            <div className='flex flex-wrap justify-between items-center mb-6'>
              <div>
                <h3 className='font-semibold text-gray-800'>AI智能助手</h3>
                <p className='text-gray-500 text-sm mt-1'>
                  基于项目数据的智能问答与分析
                </p>
              </div>
              <div className='flex space-x-2 mt-4 sm:mt-0'>
                <Button icon={<HistoryOutlined />} type='text'>
                  历史记录
                </Button>
                <Button icon={<StarOutlined />} type='text'>
                  收藏
                </Button>
              </div>
            </div>

            <div className='border border-gray-200 rounded-lg overflow-hidden flex flex-col h-80'>
              <div
                className='flex-grow p-4 overflow-y-auto'
                id='ai-chat-container'
              >
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${message.type === 'user' ? 'flex justify-end' : ''}`}
                  >
                    <div
                      className={`rounded-lg p-3 max-w-3xl ${message.type === 'user' ? 'bg-blue-50' : 'bg-gray-50'}`}
                    >
                      <div
                        className={`flex items-center mb-2 ${message.type === 'user' ? 'justify-end' : ''}`}
                      >
                        {message.type === 'user' && (
                          <>
                            <span className='mr-2 text-xs font-medium text-gray-700'>
                              您
                            </span>
                            <Avatar
                              size={20}
                              src='https://picsum.photos/id/1005/200/200'
                            />
                          </>
                        )}
                        {message.type === 'ai' && (
                          <>
                            <div className='w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs'>
                              <span>AI</span>
                            </div>
                            <span className='ml-2 text-xs font-medium text-gray-700'>
                              AI助手
                            </span>
                          </>
                        )}
                      </div>
                      <p className='text-sm text-gray-600 whitespace-pre-line'>
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 输入区 */}
              <div className='border-t border-gray-200 p-3'>
                <div className='flex'>
                  <Input
                    placeholder='输入您的问题...'
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onPressEnter={sendMessage}
                    className='rounded-r-none'
                  />
                  <Button
                    type='primary'
                    onClick={sendMessage}
                    className='rounded-l-none'
                  >
                    <SendOutlined />
                  </Button>
                </div>
                <div className='flex justify-center mt-3 space-x-4'>
                  <Button
                    type='text'
                    icon={<BulbOutlined />}
                    className='text-xs text-gray-500'
                  >
                    推荐问题
                  </Button>
                  <Button
                    type='text'
                    icon={<FileTextOutlined />}
                    className='text-xs text-gray-500'
                  >
                    生成报告
                  </Button>
                  <Button
                    type='text'
                    icon={<AudioOutlined />}
                    className='text-xs text-gray-500'
                  >
                    语音输入
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Fragment>
  );
};

export default AIDashboard;
