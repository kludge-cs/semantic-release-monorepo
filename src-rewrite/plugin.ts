import {
	mapNextReleaseVersion,
	withOptionsTransforms
} from "./options-transforms";
import { compose } from "ramda";
import logPluginVersion from "./log-plugin-version";
import readPkg from "read-pkg";
import versionToGitTag from "./version-to-git-tag";
import withOnlyPackageCommits from "./only-package-commits";
import wrapStep from "./wrapStep";

const wrapperName = "semantic-release-monorepo";

export const analyzeCommits = wrapStep("analyzeCommits",
	compose(
		logPluginVersion("analyzeCommits"),
		withOnlyPackageCommits
	),
	{wrapperName: wrapperName}
);

export const generateNotes = wrapStep("generateNotes",
	compose(
		logPluginVersion("generateNotes"),
		withOnlyPackageCommits,
		withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)])
	),
	{wrapperName: wrapperName}
);

export const success = wrapStep("success",
	compose(
		logPluginVersion("success"),
		withOnlyPackageCommits,
		withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)])
	),
	{wrapperName: wrapperName}
);

export const fail = wrapStep("fail",
	compose(
		logPluginVersion("fail"),
		withOnlyPackageCommits,
		withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)])
	),
	{wrapperName: wrapperName}
);

export const tagFormat = `${readPkg.sync().name}-v\${version}`;
