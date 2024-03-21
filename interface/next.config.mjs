/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        // Fix: "Module parse failed" for .node files
        if (!isServer) {
            config.externals = config.externals || [];
            config.externals.push('onnxruntime-node');
        }

        config.module.rules.push({
            test: /\.node$/,
            loader: 'node-loader',
        });

        return config;
    },
};

export default nextConfig;
