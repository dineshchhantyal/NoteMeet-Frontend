import { JSONValue } from 'ai';

// Define JSON value types to replace 'any'
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

// Base type with discriminant
interface BasePart {
	type: string;
}

export interface TextPart extends BasePart {
	type: 'text';
	text: string;
}

export interface ToolInvocationPart extends BasePart {
	type: 'tool-invocation';
	toolInvocation: {
		state: 'pending' | 'result' | 'error';
		step: number;
		toolCallId: string;
		toolName: string;
		args: Record<string, JsonValue>;
		result?: JsonValue;
		error?: string;
	};
}

export interface ToolResultPart extends BasePart {
	type: 'tool-result';
	toolResult: {
		toolCallId: string;
		result: JsonValue;
	};
	toolInvocation: {
		toolName: string;
		result: JSONValue;
		state: 'result' | string;
	};
}

export interface ReasoningPart extends BasePart {
	type: 'reasoning';
	reasoning: string;
}

export interface SourcePart extends BasePart {
	type: 'source';
	citation: string;
	url?: string; // Optional since your component checks if it exists
}

// Union type for all message parts
export type MessagePart =
	| TextPart
	| ToolInvocationPart
	| ToolResultPart
	| ReasoningPart
	| SourcePart;

export interface ExtendedChatMessage {
	id: string; // Required, not optional
	role: 'user' | 'assistant' | 'system';
	content: string;
	parts?: MessagePart[];
	createdAt?: Date;
}

export interface ChatSuggestion {
	text: string;
	icon?: React.ReactNode;
}
