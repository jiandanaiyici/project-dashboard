import React, { useState } from 'react';
import { Card, Tree, Button, Modal, Form, Input, Select, message, Space } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { TreeNode } = Tree;
const { Option } = Select;

interface OrgNode {
  key: string;
  title: string;
  type: 'department' | 'position';
  parentKey?: string;
  employeeCount?: number;
  manager?: string;
  children?: OrgNode[];
}

const OrganizationPage: React.FC = () => {
  const [orgData, setOrgData] = useState<OrgNode[]>([
    {
      key: 'company',
      title: '项目管理公司',
      type: 'department',
      employeeCount: 15,
      children: [
        {
          key: 'tech',
          title: '技术部',
          type: 'department',
          parentKey: 'company',
          employeeCount: 8,
          manager: '李技术',
          children: [
            {
              key: 'frontend',
              title: '前端组',
              type: 'position',
              parentKey: 'tech',
              employeeCount: 3,
              manager: '张三',
            },
            {
              key: 'backend',
              title: '后端组',
              type: 'position',
              parentKey: 'tech',
              employeeCount: 3,
              manager: '李四',
            },
            {
              key: 'devops',
              title: '运维组',
              type: 'position',
              parentKey: 'tech',
              employeeCount: 2,
              manager: '王五',
            },
          ],
        },
        {
          key: 'product',
          title: '产品部',
          type: 'department',
          parentKey: 'company',
          employeeCount: 4,
          manager: '赵产品',
          children: [
            {
              key: 'pm',
              title: '产品经理',
              type: 'position',
              parentKey: 'product',
              employeeCount: 2,
              manager: '产品一',
            },
            {
              key: 'ba',
              title: '业务分析师',
              type: 'position',
              parentKey: 'product',
              employeeCount: 2,
              manager: '分析一',
            },
          ],
        },
        {
          key: 'design',
          title: '设计部',
          type: 'department',
          parentKey: 'company',
          employeeCount: 3,
          manager: '美设计',
          children: [
            {
              key: 'ui',
              title: 'UI设计师',
              type: 'position',
              parentKey: 'design',
              employeeCount: 2,
              manager: 'UI一',
            },
            {
              key: 'ux',
              title: 'UX设计师',
              type: 'position',
              parentKey: 'design',
              employeeCount: 1,
              manager: 'UX一',
            },
          ],
        },
      ],
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNode, setEditingNode] = useState<OrgNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [form] = Form.useForm();

  const renderTreeNodes = (data: OrgNode[]): React.ReactNode =>
    data.map((item) => (
      <TreeNode
        key={item.key}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {item.type === 'department' ? <TeamOutlined /> : <UserOutlined />}
              <span style={{ marginLeft: 8 }}>{item.title}</span>
              <span style={{ marginLeft: 8, color: '#666', fontSize: '12px' }}>
                ({item.employeeCount || 0}人)
              </span>
              {item.manager && (
                <span style={{ marginLeft: 8, color: '#1890ff', fontSize: '12px' }}>
                  负责人: {item.manager}
                </span>
              )}
            </div>
            <div>
              <Button
                type="link"
                size="small"
                icon={<PlusOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd(item);
                }}
              />
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(item);
                }}
              />
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
              />
            </div>
          </div>
        }
      >
        {item.children && renderTreeNodes(item.children)}
      </TreeNode>
    ));

  const handleAdd = (parentNode?: OrgNode) => {
    setEditingNode(null);
    setSelectedNode(parentNode || null);
    form.resetFields();
    if (parentNode) {
      form.setFieldsValue({ parentKey: parentNode.key });
    }
    setIsModalVisible(true);
  };

  const handleEdit = (node: OrgNode) => {
    setEditingNode(node);
    setSelectedNode(null);
    form.setFieldsValue(node);
    setIsModalVisible(true);
  };

  const handleDelete = (node: OrgNode) => {
    Modal.confirm({
      title: '确定删除这个组织节点吗？',
      content: '删除后该节点下的所有子节点也会被删除',
      onOk() {
        // 递归删除节点的函数
        const deleteNode = (data: OrgNode[], targetKey: string): OrgNode[] => {
          return data.filter(item => {
            if (item.key === targetKey) {
              return false;
            }
            if (item.children) {
              item.children = deleteNode(item.children, targetKey);
            }
            return true;
          });
        };

        setOrgData(deleteNode(orgData, node.key));
        message.success('删除成功');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingNode) {
        // 编辑节点
        const updateNode = (data: OrgNode[], targetKey: string, newData: any): OrgNode[] => {
          return data.map(item => {
            if (item.key === targetKey) {
              return { ...item, ...newData };
            }
            if (item.children) {
              item.children = updateNode(item.children, targetKey, newData);
            }
            return item;
          });
        };

        setOrgData(updateNode(orgData, editingNode.key, values));
        message.success('更新成功');
      } else {
        // 添加节点
        const newNode: OrgNode = {
          key: `${Date.now()}`,
          ...values,
          children: [],
        };

        if (selectedNode) {
          // 添加到指定父节点
          const addToParent = (data: OrgNode[], parentKey: string, newChild: OrgNode): OrgNode[] => {
            return data.map(item => {
              if (item.key === parentKey) {
                return {
                  ...item,
                  children: [...(item.children || []), newChild],
                };
              }
              if (item.children) {
                item.children = addToParent(item.children, parentKey, newChild);
              }
              return item;
            });
          };

          setOrgData(addToParent(orgData, selectedNode.key, newNode));
        } else {
          // 添加为根节点
          setOrgData([...orgData, newNode]);
        }
        
        message.success('添加成功');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const onTreeSelect = (selectedKeys: any[], info: any) => {
    console.log('Selected:', selectedKeys, info);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="组织架构"
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAdd()}
            >
              添加部门
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: '16px', color: '#666' }}>
          <p>点击节点右侧的按钮可以添加、编辑或删除组织节点</p>
        </div>

        <Tree
          showLine
          switcherIcon={<TeamOutlined />}
          onSelect={onTreeSelect}
          defaultExpandAll
        >
          {renderTreeNodes(orgData)}
        </Tree>
      </Card>

      {/* 添加/编辑节点弹窗 */}
      <Modal
        title={editingNode ? '编辑组织节点' : '添加组织节点'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: 'department',
            employeeCount: 0,
          }}
        >
          <Form.Item
            name="title"
            label="节点名称"
            rules={[{ required: true, message: '请输入节点名称' }]}
          >
            <Input placeholder="请输入节点名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="节点类型"
            rules={[{ required: true, message: '请选择节点类型' }]}
          >
            <Select placeholder="请选择节点类型">
              <Option value="department">部门</Option>
              <Option value="position">职位</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="manager"
            label="负责人"
          >
            <Input placeholder="请输入负责人姓名" />
          </Form.Item>

          <Form.Item
            name="employeeCount"
            label="人员数量"
          >
            <Input type="number" placeholder="请输入人员数量" />
          </Form.Item>

          {selectedNode && (
            <Form.Item
              name="parentKey"
              label="父级节点"
            >
              <Input value={selectedNode.title} disabled />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default OrganizationPage;