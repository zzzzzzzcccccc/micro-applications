import { Options } from './types';
import getDefaultConfiguration from './get-default-configuration';

export default function build(options: Options) {
  const defaultConfigurationOptions = getDefaultConfiguration({
    outputPath: options.outputPath,
    isDev: options.isDev,
    devServerPort: options.devServerPort,
  });

  const {
    mode = defaultConfigurationOptions.mode,
    entry = defaultConfigurationOptions.entry,
    output = defaultConfigurationOptions.output,
    devtool = defaultConfigurationOptions.devtool,
    module = defaultConfigurationOptions.module,
    resolve = defaultConfigurationOptions.resolve,
    plugins = defaultConfigurationOptions.plugins,
    optimization = defaultConfigurationOptions.optimization,
    devServer = defaultConfigurationOptions.devServer
  } = options;

  return {
    mode,
    target: defaultConfigurationOptions.target,
    entry,
    output,
    devtool,
    module,
    resolve,
    plugins,
    optimization,
    devServer
  }
}
