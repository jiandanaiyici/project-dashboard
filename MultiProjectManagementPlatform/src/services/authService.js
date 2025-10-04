import { delay } from '../utils/request';
import { mockData } from '../mock/mockData';

// 身份验证服务
export const authService = {
  // 登录服务
  login: async (credentials) => {
    console.log(credentials, 'credentials>>>>>')
    await delay(800);
    const user = mockData.users.find(u => u.email === credentials.email && u.password === credentials.password);
    console.log(mockData, 'user>>>>>', user)
    if (user) {
      const token = `mock-token-${user.id}`;
      // 创建简化的用户信息用于存储
      const userInfo = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      };
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      return {
        token,
        user: userInfo
      };
    }
    throw new Error('邮箱或密码错误');
  },
  
  // 退出登录
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  },
  
  // 获取用户信息
  getUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },
};

export default authService;