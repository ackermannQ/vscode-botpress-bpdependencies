import * as vscode from "vscode";

export const extensionSettings = (context: vscode.ExtensionContext) => {
  const usageKey = "botpress-openai-hub-usage-count";
  const secretKey = "botpressHub.openaiApiKey";

  const getCurrentUsage = (): number =>
    context.globalState.get<number>(usageKey) || 0;

  const incrementUsage = async () => {
    const current = context.globalState.get<number>(usageKey) || 0;
    await context.globalState.update(usageKey, current + 1);
  };

  const getUserProvidedApiKey = async (): Promise<string | undefined> => {
    return await context.secrets.get(secretKey);
  };

  const setUserProvidedApiKey = async (apiKey: string): Promise<void> => {
    await context.secrets.store(secretKey, apiKey);
  };

  const deleteUserProvidedApiKey = async (): Promise<void> => {
    await context.secrets.delete(secretKey);
  };

  return {
    usageKey,
    getCurrentUsage,
    incrementUsage,
    getUserProvidedApiKey,
    setUserProvidedApiKey,
    deleteUserProvidedApiKey,
  };
};
