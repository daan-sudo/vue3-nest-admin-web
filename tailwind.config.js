/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  // 关键修改：告诉 Tailwind 监听 [data-theme="dark"]
  darkMode: ['selector', '[data-theme="dark"]'],
  corePlugins: {
    // 禁用 Tailwind 的基础样式重置，防止干扰 Ant Design
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // 你可以定义一套跟随主题变化的语义化颜色
        'primary-text': 'var(--c-text)',
        'app-bg': 'var(--c-bg)',
      },
    },
  },
  plugins: [],
}
