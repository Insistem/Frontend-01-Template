# 每周总结可以写在这里

# usage

```

npm run dev

```

# steps

1. 配置babel-loader
2. 使用plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'create' }]],将React.createElement函数名改成create

npx webpack --config ./week14/webpack.config.js