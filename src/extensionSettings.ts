import * as vscode from "vscode";

export const extensionSettings = (context: vscode.ExtensionContext) => {
  const usageKey = "botpress-openai-hub-usage-count";
  const currentUsage = context.globalState.get<number>(usageKey) || 0;

  const userProvidedApiKey = vscode.workspace
    .getConfiguration("botpressHub")
    .get<string>("openaiApiKey");

  const setUserProvidedApiKey = (apiKey: string) =>
    vscode.workspace
      .getConfiguration("botpressHub")
      .update("openaiApiKey", apiKey, true);

  const incrementUsage = () => {
    context.globalState.update(
      usageKey,
      context.globalState.get<number>(usageKey) + 1
    );
  };

  return {
    usageKey,
    currentUsage,
    userProvidedApiKey,
    setUserProvidedApiKey,
    incrementUsage,
  };
};
