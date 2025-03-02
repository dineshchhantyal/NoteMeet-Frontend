// Define JSON value types to replace 'any'
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

export interface MessagePart {
	type: 'text' | 'tool-invocation' | 'reasoning' | 'source' | 'tool-result';
	content: string;
	// Using a specific type instead of any
	[key: string]: string | number | boolean | JsonValue | undefined;
}

export interface ExtendedChatMessage {
	id: string; // Required, not optional
	role: 'user' | 'assistant' | 'system';
	content: string;
	parts?: MessagePart[];
	createdAt?: Date;
}

export interface ToolInvocationPart extends MessagePart {
	type: 'tool-invocation';
	tool: string;
	// Replace any with specific types
	params: Record<string, JsonValue>;
	result?: string;
}

export interface ToolResultPart extends MessagePart {
	type: 'tool-result';
	toolName: string;
	result: JsonValue;
	success: boolean;
}

export interface ReasoningPart extends MessagePart {
	type: 'reasoning';
}

export interface SourcePart extends MessagePart {
	type: 'source';
	citation: string;
	url?: string;
}

export interface TextPart extends MessagePart {
	type: 'text';
}

export interface ChatSuggestion {
	text: string;
	icon?: JSX.Element;
}
