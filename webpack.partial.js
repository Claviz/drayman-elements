const webpack = require('webpack');

module.exports = {
    resolve: {
        fallback: {
            assert: false,
            util: false
        },
    },
}