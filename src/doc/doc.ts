export function getBotpressKeywordDoc(word: string): string | null {
  const docs: Record<string, string> = {
    IntegrationDefinition: `### \`IntegrationDefinition\`
An Integration Definition acts as a comprehensive specification that outlines an integration's features and behaviors. It defines how the integration will communicate with both the Botpress ecosystem and external services, and which functionality it will expose to bots.

Integrations can define their configuration requirements using Zod, a TypeScript-first schema validation library. The integration can also provide multiple configuration schemas to support different use cases or environments. This allows end users to select the appropriate configuration method based on their needs.

[Doc](https://botpress.mintlify.app/for-developers/sdk/integration/introduction#integration-definition)`,

    events: `### \`events\`
Integrations define events that represent activities within the external service. For example:
- A Slack integration might define a memberLeftChannel event
- A GitHub integration might define a pullRequestOpened event
- A Dropbox integration might define a fileUploaded event

Bots can subscribe to these events to trigger specific actions or workflows.

[Doc](https://botpress.mintlify.app/for-developers/sdk/integration/introduction#events)`,

    actions: `### \`actions\`
Integrations expose actions that bots can invoke to interact with the external service. For example:
- Retrieving or updating information in external systems
- Performing operations on behalf of users


[Doc](https://botpress.mintlify.app/for-developers/sdk/integration/introduction#actions)`,

    interfaces: `### \`interfaces\`
Integrations can implement standard interfaces defined by the Botpress Team to provide consistent functionality:
- Enabling compatibility with plugins that rely on those interfaces
- Enabling compatibility with specific features of the Botpress platform
- Ensuring consistent behavior across different integrations


[Doc](https://botpress.mintlify.app/for-developers/sdk/integration/publish-your-integration-on-botpress-hub#your-integration%E2%80%99s-public-information)`,

    channels: `### \`channels\`
Interfaces can define communication channel requirements that integrations must implement.

[Doc](https://botpress.mintlify.app/for-developers/sdk/interface/introduction#channels)`,

    entities: `### \`entities\`
Entities define standardized data structures for an interface. They:
- Establish common data models across different integrations
- Allow integrations to extend and customize the base entity

Actions and events defined by an interface may consume or produce these entities.
[Doc](https://botpress.mintlify.app/for-developers/sdk/interface/introduction#entities)`,

    hitl: `### \`hitl\`
The Human in the loop (HITL) interface allows you to implement human agent intervention in your integration.
[Doc](https://botpress.mintlify.app/for-developers/sdk/integration/publish-your-integration-on-botpress-hub#your-integration%E2%80%99s-public-information)`,

    ["files-readonly"]: `### \`files-readonly\`
The unidirectional file synchronization interface allows you to implement 1-way sync in your integration to import files from an external service to Botpress.

[Doc](https://botpress.mintlify.app/for-developers/sdk/integration/publish-your-integration-on-botpress-hub#your-integration%E2%80%99s-public-information)`,
  };

  return docs[word] ?? null;
}
