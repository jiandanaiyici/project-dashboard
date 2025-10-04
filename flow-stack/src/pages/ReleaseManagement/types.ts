export interface Environment {
  name: string;
  status: string;
  statusColor: string;
  envColor: string;
  version: string;
  lastDeploy: string;
  servers: string;
  runningStatus: string;
  runningStatusColor: string;
}

// 定义类型接口
export interface ChangeItem {
  id: string;
  title: string;
  type: { name: string; color: string };
  submitter: { name: string; avatar: string };
  riskLevel: { name: string; color: string };
  status: string;
  statusColor: string;
}

export interface ApprovalStep {
  title: string;
  status: string;
  approver: string;
  icon: string;
  color: string;
  isActive?: boolean;
  description?: string;
}

export interface ReleaseInfo {
  version: string;
  environment: string;
  date: string;
  submitter: string;
  status: string;
  statusColor: string;
  features: number;
  bugfixes: number;
  deployType: string;
  duration: string;
  description: string;
  descriptionIcon: string;
  descriptionIconColor: string;
}
