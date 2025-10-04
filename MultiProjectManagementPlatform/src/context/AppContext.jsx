import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// 创建应用上下文
export const AppContext = createContext();

// 应用上下文提供者组件
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  // 初始化用户信息
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userInfo = authService.getUserInfo();
        if (userInfo) {
          setUser(userInfo);
        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // 登录处理
  const handleLogin = async (credentials) => {
    try {
      setIsLoading(true);
      const { user: loggedInUser } = await authService.login(credentials);
      setUser(loggedInUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出处理
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentProject(null);
  };

  // 切换菜单折叠状态
  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  // 设置当前项目
  const setCurrentProjectInfo = (project) => {
    setCurrentProject(project);
  };

  // 上下文值
  const contextValue = {
    user,
    isLoading,
    menuCollapsed,
    currentProject,
    handleLogin,
    handleLogout,
    toggleMenu,
    setCurrentProjectInfo,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// 自定义Hook，用于在组件中使用应用上下文
export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// 为了防止编译错误，需要导入React
export default AppContext;