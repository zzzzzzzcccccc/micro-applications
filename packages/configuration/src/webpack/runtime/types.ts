import * as webpack from "webpack";

type WebpackPlugin =
  | undefined
  | null
  | false
  | ""
  | 0
  | ((this: webpack.Compiler, compiler: webpack.Compiler) => void)
  | webpack.WebpackPluginInstance;

export interface Options {
  publicPath: string
  outputPath: string;
  copyPublicPaths?: string[];
  mode?: "none" | "development" | "production";
  envs?: Record<string, any>
  defineEnvs?: Record<string, string>;
  isDev?: boolean
  devServerPort?: number
  devServerProxy?: Record<string, any>
  entry?: webpack.Entry
  output?: Record<string, any>;
  devtool?: string;
  module?: webpack.ModuleOptions;
  resolve?: webpack.ResolveOptions;
  plugins?: WebpackPlugin[];
  optimization?: any;
  devServer?: any;
}

export type DefaultOptions = Pick<Options, "outputPath" | "isDev" | "envs" | "defineEnvs"  | "publicPath" | "copyPublicPaths" | "devServerPort" | "devServerProxy">;
