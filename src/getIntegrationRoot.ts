import * as path from "path";

export const getIntegrationRoot = (fullPath: string): string => {
  const normalized = path.resolve(fullPath);
  const parts = normalized.split(path.sep);

  const integrationsIndex = parts.indexOf("integrations");
  if (integrationsIndex === -1 || integrationsIndex + 1 >= parts.length) {
    throw new Error('Path does not include "integrations/<integration-name>"');
  }

  const integrationPathParts = parts.slice(0, integrationsIndex + 2);
  return integrationPathParts.join(path.sep);
};
