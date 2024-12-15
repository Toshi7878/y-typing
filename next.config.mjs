const nextConfig = {
  transpilePackages: ["jotai-devtools"],
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(wav|mp3)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "static/sounds/",
          publicPath: "/_next/static/sounds/",
        },
      },
      experimental: {
        serverComponentsExternalPackages: ["@trpc/server"],
      },
    });

    return config;
  },
};

export default nextConfig;
