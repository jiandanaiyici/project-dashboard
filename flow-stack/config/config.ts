import { defineConfig } from '@umijs/max';

export default defineConfig({
  clientLoader: {},
  // plugins: ['@umijs/plugins/dist/react-query'],
  reactQuery: {
    devtool: {
      initialIsOpen: true,
    },
    queryClient: {
      defaultOptions: {
        queries: {
          staleTime: 0,
          retry: 1,
          networkMode: 'always',
          refetchOnWindowFocus: false,
        },
      },
    },
  },
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/project-management',
      component: 'ProjectManagement',
      title: '项目管理',
    },
    { path: '/dashboard', component: 'DashBoard', title: '总览大盘' },
    {
      path: '/team-performance',
      component: 'TeamPerformance',
      title: '团队效能',
    },
    { path: '/ai-decision', component: 'AIDecision', title: 'AI决策分析' },
    // { path: "/project-management-with-business-value", component: "DashBoard/ProjectManagementWithBusinessValue", title: '商业价值详情' },
    {
      path: '/release-management',
      component: 'ReleaseManagement',
      title: '发布管控',
    },
    {
      path: '/personal-dashboard',
      component: 'PersonalDashboard',
      //  layout: false,
      title: '个人看板',
    },
    {
      path: '/technical-efficiency-evaluation-center',
      component: 'PersonalDashboard/TechnicalEfficiencyEvaluationCenter',
      layout: false,
      title: '技术效能评估中心',
    },

    // // 人员效能详情
    {
      path: '/personnel-efficiency',
      component: 'DashBoard/PersonnelEfficiency',
      layout: false,
    },
    {
      path: '/personal-development-plan',
      component: 'PersonalDevelopmentPlan',
      layout: false,
      title: '个人发展计划',
    },
    {
      path: '/personal-efficacy-evaluation-of-technology-development',
      component: 'PersonalEfficacyEvaluationOfTechnologyDevelopment',
      layout: false,
      title: '个人技术开发效能评估',
    },
    {
      path: '/quality-control-platform',
      component: 'QualityControlPlatform',
      layout: false,
      title: '质量管控',
    },
    // /** 查看项目详情 */
    // { path: '/project-health-detail', component: 'ProjectHealthDetail' },
  ],
  npmClient: 'pnpm',
  mfsu: false,
  // 使用CDN加载Tailwind CSS，移除PostCSS插件配置
  headScripts: [
    // Tailwind CSS v3 CDN
    'https://cdn.tailwindcss.com',
    // 添加自定义配置
    {
      content: `
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#165DFF',
              secondary: '#86909C',
              success: '#52C41A',
              warning: '#FAAD14',
              danger: '#F5222D',
              '效能': '#0FC6C2',
              '协作': '#722ED1',
              '创新': '#FF7D00',
              'env-dev': '#52C41A',
              'env-test': '#1890FF',
              'env-staging': '#FAAD14',
              'env-production': '#F5222D',
            },
            boxShadow: {
              'card': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
            },
            animation: {
              'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
              pulse: {
                '0%, 100%': {
                  opacity: 1,
                },
                '50%': {
                  opacity: 0.5,
                },
              },
            },
          },
        }
      }
    `,
    },
    // 添加自定义工具类
    {
      content: `
      @layer utilities {
        .content-auto {
          content-visibility: auto;
        }
        .gradient-bg {
          background: linear-gradient(135deg, #165DFF 0%, #722ED1 100%);
        }
        .card-shadow {
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
        }
        .hover-lift {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12);
        }
      }
    `,
    },
  ],
  links: [
    // Tailwind CSS 自定义工具类的CDN（如果需要）
    {
      href: 'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css',
      rel: 'stylesheet',
    },
  ],
});
