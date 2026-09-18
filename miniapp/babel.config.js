// babel-preset-taro is more like a preset entry for React/Vue/etc frameworks.
// See https://docs.taro.zone/docs/next/babel-config for details.
module.exports = {
  presets: [
    ['taro', { framework: 'react', ts: true, compiler: 'vite' }],
  ],
}
