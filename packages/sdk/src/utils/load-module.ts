export default async function loadModule<T = any>({ appName, remotePath }: { appName: string; remotePath: string; }) {
  if (!(appName in window)) {
    throw new Error(`The app ${appName} is not found`);
  }
  // Initializes the share scope. This fills it with known provided modules from this build and all remotes
  await __webpack_init_sharing__('default');
  const container = (window as any)[appName]; // or get the container somewhere else
  // Initialize the container, it may provide shared modules
  await container.init(__webpack_share_scopes__.default);
  const factory = await (window as any)[appName].get(remotePath);
  return factory() as T;
}
