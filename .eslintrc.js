module.exports = {
    "rules": {
        "no-debugger":1,
        "no-console": [2, { allow: ["log"] }],
        "no-extra-parens": 1,
        "new-cap": 0,
        "no-var": 0,
        "prefer-template": 0,
        "prefer-arrow-callback": 0,
        "no-use-before-define": 0,
    },
    "env": {
        "es6": false,
        "browser": false
    },
    "extends": "airbnb",
    "parserOptions": {
        "ecmaVersion": 5,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": false
        },
    },
    "globals": {
        "Materialize": true,
        "describe": true,
        "it": true,
        "expect": true,
        "angular": true,
        "require": true,
        "before": true,
        "beforeEach": true,
        "after": true,
        "afterEach": true
    }
};
