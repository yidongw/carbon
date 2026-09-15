export default defineAppConfig({
  pages: [
    'pages/login/login',
    'pages/workstation/index',
    'pages/tasks/index',
    'pages/profile/index',
  ],
  tabBar: {
    custom: true,
    color: '#9aa3b2',
    selectedColor: '#2563eb',
    backgroundColor: '#ffffff',
    list: [
      { pagePath: 'pages/workstation/index', text: '工作台' },
      { pagePath: 'pages/tasks/index', text: '我的任务' },
      { pagePath: 'pages/profile/index', text: '我的' },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: 'Carbon MES',
    navigationBarTextStyle: 'black',
  },
})
