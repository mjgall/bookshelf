const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    ['/api', '/auth'],
    createProxyMiddleware({
      target: 'http://localhost:2001',
      changeOrigin: false,
    })
  );
};