import type { Options } from "semantic-release";

/* Accepted values for semantic-release lifecycle steps */
export type SemanticLifecycleStep =
	| "verifyConditions"
	| "analyzeCommits"
	| "verifyRelease"
	| "generateNotes"
	| "prepare"
	| "publish"
	| "addChannel"
	| "success"
	| "fail";

/* Type alias for semantic-release configuration, passed to plugins. */
export type StepFunctionPluginOptions = Options;

// TODO: add proper type mapping for step function contexts

/* Interface for semantic-release step context, passed to plugins. */
export interface StepFunctionPluginContext {
	options: StepFunctionPluginOptions
}

export type StepFunction = (
	config: StepFunctionPluginOptions,
	context: StepFunctionPluginContext
) => any;
