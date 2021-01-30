import type {
	SemanticLifecycleStep,
	StepFunction,
	StepFunctionPluginContext,
	StepFunctionPluginOptions,
	WrapperFunction,
	WrapperOptions
} from "./types";

export function wrapFunction(
	wrapper: WrapperFunction,
	defaultReturn: any,
	stepName: SemanticLifecycleStep,
	currentIndex: number
): StepFunction {
	return (
		config: StepFunctionPluginOptions,
		context: StepFunctionPluginContext
	) => {
		const { plugins } = context.options;
		if (!plugins) return defaultReturn;
		const pluginDefinition = plugins[currentIndex];
		const pluginName = Array.isArray(pluginDefinition)
			? pluginDefinition[0]
			: pluginDefinition;
		if (!pluginName) return defaultReturn;
		/* eslint-disable-next-line @typescript-eslint/no-var-requires */
		const step = require(pluginName)[stepName];
		if (!step) return defaultReturn;
		return wrapper(step)(config, context);
	};
}

/*
  Returns an array to be passed as the configuration step to be augmented,
  effectively overriding the `semantic-release` plugin configuration for that
  step. Since we don't know ahead of time how many `semantic-release` plugins
  have been configured, this function returns a length 10 array of step
  functions to allow for a configuration of up to 9 plugins plus the appended
  step function.

  TODO: change above behaviour to be dynamic and avoid assumptions
*/
export default function wrapStep(
	stepName: SemanticLifecycleStep,
	wrapperFunction: WrapperFunction,
	wrapOptions: WrapperOptions
): Array<StepFunction | null> {
	const { defaultReturn, wrapperName } = wrapOptions;
	return Array(10)
		.fill(null)
		.map((_value, index) => {
			const wrapper = wrapFunction(
				wrapperFunction, defaultReturn, stepName, index
			);
			Object.defineProperty(wrapper, "name", { value: wrapperName });
			return wrapper;
		});
}
