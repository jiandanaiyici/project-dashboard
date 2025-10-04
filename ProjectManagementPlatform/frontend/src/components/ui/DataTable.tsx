import React from 'react';
import { Table, TableProps } from 'antd';
import { TableParams } from '@/types';
import Loading from './Loading';
import EmptyState from './EmptyState';

interface DataTableProps<T = any> extends Omit<TableProps<T>, 'onChange'> {
  loading?: boolean;
  params?: TableParams;
  onParamsChange?: (params: TableParams) => void;
  emptyText?: string;
  emptyDescription?: string;
  emptyAction?: {
    text: string;
    onClick: () => void;
  };
}

/**
 * 通用数据表格组件
 */
function DataTable<T extends Record<string, any>>({
  loading = false,
  params,
  onParamsChange,
  emptyText = '暂无数据',
  emptyDescription,
  emptyAction,
  dataSource,
  pagination,
  ...props
}: DataTableProps<T>) {
  
  const handleTableChange = (
    paginationConfig: any,
    filters: any,
    sorter: any,
  ) => {
    if (onParamsChange) {
      const newParams: TableParams = {
        current: paginationConfig.current,
        pageSize: paginationConfig.pageSize,
        sortField: sorter.field,
        sortOrder: sorter.order,
        filters,
      };
      onParamsChange(newParams);
    }
  };

  // 自定义空状态
  const emptyComponent = (
    <EmptyState
      title={emptyText}
      description={emptyDescription}
      action={emptyAction}
    />
  );

  // 分页配置
  const paginationConfig = pagination !== false ? {
    current: params?.current || 1,
    pageSize: params?.pageSize || 10,
    total: (pagination as any)?.total || 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
    ...pagination,
  } : false;

  return (
    <Loading spinning={loading}>
      <Table<T>
        {...props}
        dataSource={dataSource}
        pagination={paginationConfig}
        onChange={handleTableChange}
        locale={{
          emptyText: emptyComponent,
        }}
        scroll={{ x: 'max-content' }}
        size="middle"
      />
    </Loading>
  );
}

export default DataTable;