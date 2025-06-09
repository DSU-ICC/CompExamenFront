module.exports = function override(config) {
  // 1. Находим правило для SVG файлов
  const svgRule = config.module.rules
    .find(rule => rule.oneOf)
    ?.oneOf.find(rule => 
      rule.test && 
      typeof rule.test.test === 'function' && 
      rule.test.test('.svg')
    );

  // 2. Если правило найдено - модифицируем его
  if (svgRule) {
    svgRule.exclude = /node_modules/;
  }

  // 3. Добавляем новое правило только для наших SVG
  config.module.rules.push({
    test: /\.svg$/,
    include: /node_modules\/@ckeditor/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          throwIfNamespace: false,
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false
                  }
                }
              }
            ]
          }
        }
      }
    ]
  });

  return config;
};