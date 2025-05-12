import * as path from "path";

const BOTS_FOLDER = "bots";
const INTEGRATIONS_FOLDER = "integrations";
const INTERFACES_FOLDER = "interfaces";
const PACKAGES_FOLDER = "packages";
const PLUGINS_FOLDER = "plugins";

export const getBotRoot = (fullPath: string): string => {
  return getFolderRoot(fullPath, BOTS_FOLDER);
};

export const getIntegrationRoot = (fullPath: string): string => {
  return getFolderRoot(fullPath, INTEGRATIONS_FOLDER);
};

export const getInterfaceRoot = (fullPath: string): string => {
  return getFolderRoot(fullPath, INTERFACES_FOLDER);
};

export const getPackageRoot = (fullPath: string): string => {
  return getFolderRoot(fullPath, PACKAGES_FOLDER);
};

export const getPluginRoot = (fullPath: string): string => {
  return getFolderRoot(fullPath, PLUGINS_FOLDER);
};

export const getFolderRoot = (
  fullPath: string,
  connectorType: string
): string => {
  const normalized = path.resolve(fullPath);
  const parts = normalized.split(path.sep);

  const connectorIndex = parts.indexOf(connectorType);
  if (connectorIndex === -1 || connectorIndex + 1 >= parts.length) {
    console.error(`Path does not include "${connectorType}/<name>"`);
    return null;
  }

  const pathParts = parts.slice(0, connectorIndex + 2);
  return pathParts.join(path.sep);
};
