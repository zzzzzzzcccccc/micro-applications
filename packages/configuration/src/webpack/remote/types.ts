import * as webpack from 'webpack'

type WebpackPlugin =
  | undefined
  | null
  | false
  | ''
  | 0
  | ((this: webpack.Compiler, compiler: webpack.Compiler) => void)
  | webpack.WebpackPluginInstance

export interface Options {
  outputPath: string
  mode?: 'none' | 'development' | 'production'
  isDev?: boolean
  devServerPort?: number
  devServerProxy?: Record<string, any>
  entry?: webpack.Entry
  output?: Record<string, any>
  devtool?: string
  module?: webpack.ModuleOptions
  resolve?: webpack.ResolveOptions
  plugins?: WebpackPlugin[]
  optimization?: any
  devServer?: any
}

export type DefaultOptions = Pick<Options, 'outputPath' | 'isDev' | 'devServerPort'>
