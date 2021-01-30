import type { StepFunction } from "./index";

export type WrapperFunction = (step: StepFunction) => StepFunction;

export interface WrapperOptions {
	defaultReturn?: any,
	wrapperName: string
}
