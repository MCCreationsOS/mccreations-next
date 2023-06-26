module.exports = {
    async rewrites() {
      return [
        {
          source: '/',
          destination: '/index_fix',
        },
      ]
    },
  }