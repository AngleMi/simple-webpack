(function (modules) {
    function require (fileName) {
        const fn = modules[fileName];

        const module = { exports: {} };

        fn(require, module, module.exports);

        return module.exports;
    }

    require('/Users/zhimin/Desktop/simple-webapck/src/index.js');
})({ '/Users/zhimin/Desktop/simple-webapck/src/index.js': function (require, module, exports) { undefined }, './greeting.js': function (require, module, exports) { undefined }, })
