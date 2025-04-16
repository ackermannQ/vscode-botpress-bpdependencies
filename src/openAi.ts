import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import OpenAI from "openai";
import { extensionSettings } from "./extensionSettings";

export const openAi = async (context: vscode.ExtensionContext) => {
  const extensionSettingsService = extensionSettings(context);
  let userKey = extensionSettingsService.userProvidedApiKey ?? null;

  if (!extensionSettingsService.userProvidedApiKey) {
    userKey = await vscode.window.showInputBox({
      prompt: "Enter your OpenAI API key",
      ignoreFocusOut: true,
      password: true,
    });

    if (userKey) {
      extensionSettingsService.setUserProvidedApiKey(userKey);
    } else {
      vscode.window.showErrorMessage(
        "API key is required to use this feature."
      );
      return;
    }
  }

  const client = new OpenAI({
    apiKey: userKey,
  });

  function getPackageJsonContent(pkgPath: string): any {
    const raw = fs.readFileSync(pkgPath, "utf-8");
    return JSON.parse(raw);
  }

  async function generateHubMd(projectContext: any): Promise<string> {
    vscode.window.showInformationMessage("Generating hub.md, please wait");

    const prompt = `
You are an expert at writing documentation. Based on the information inside package.json, generate a concise and helpful 'hub.md' that documents what this project is following the templating inside the hub.md template provided.

package.json:
${JSON.stringify(projectContext, null, 2)}

hub.md:
${hubFile}
`;

    try {
      const res = await client.chat.completions.create({
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }],
      });

      extensionSettingsService.incrementUsage();

      return res.choices[0]?.message?.content ?? "";
    } catch (error: any) {
      console.error("Error from OpenAI:", error);
      vscode.window.showErrorMessage("OpenAI request failed: " + error.message);
    }

    return "";
  }

  function writeHubMd(folderPath: string, content: string) {
    const targetPath = path.join(folderPath, "hub.md");
    fs.writeFileSync(targetPath, content, "utf-8");
    vscode.window.showInformationMessage(
      "File generated! Don't forget to review it"
    );
  }

  const hubFile = `
# Integrate your chatbot with Confluence to fetch pages, retrieve all pages, and interact with Confluence content seamlessly

## Configuration

### Setup and Configuration

1. Confluence API token creation
   - Log in to your Confluence account and navigate to the [API token management page](https://id.atlassian.com/manage-profile/security/api-tokens).
   - Generate a new API token and copy it.
2. Confluence Botpress integration configuration
   - Install the Confluence integration in your Botpress bot.
   - Paste the API token copied earlier in the configuration fields, along with your Confluence username and host URL. These credentials will allow your bot to fetch pages and interact with Confluence.
   - Save configuration.

## Usage
This section needs to be filled depending on the package usage, may be empty for the developer to fill

## Supported Events
This section needs to be filled depending on the package usage, may be empty for the developer to fill

## Limitations

Standard Confluence API limitations apply to the Confluence integration in Botpress. These limitations include rate limits, payload size restrictions, and other constraints imposed by Confluence. Ensure that your chatbot adheres to these limitations to maintain optimal performance and reliability.

More details are available in the [Confluence REST API Documentation](https://developer.atlassian.com/cloud/confluence/rest/).


[] THIS FILE WAS REVIEWED
`;

  return {
    getPackageJsonContent,
    generateHubMd,
    writeHubMd,
  };
};
