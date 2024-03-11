module.exports = {
    apps: [
        {
            name: "yu-gi-oh-front",
            script: "./node_modules/next/dist/bin/next",
            args: "start -p 3003",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
