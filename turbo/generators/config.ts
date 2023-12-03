import type { PlopTypes } from '@turbo/gen';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
	plop.setGenerator('package', {
		description: 'Add a new package',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'Enter the name of the package:',
			},
			{
				type: 'input',
				name: 'description',
				message: 'Enter a description for the package:',
			},
		],
		actions: [
			{
				type: 'add',
				path: 'packages/{{name}}/package.json',
				templateFile: 'templates/package/package.json.hbs',
			},
			{
				type: 'add',
				path: 'packages/{{name}}/build.config.ts',
				templateFile: 'templates/package/build.config.ts.hbs',
			},
			{
				type: 'add',
				path: 'packages/{{name}}/README.md',
				templateFile: 'templates/package/README.md.hbs',
			},
			{
				type: 'add',
				path: 'packages/{{name}}/CHANGELOG.md',
				templateFile: 'templates/package/CHANGELOG.md.hbs',
			},
			{
				type: 'add',
				path: 'packages/{{name}}/src/index.ts',
				templateFile: 'templates/package/src/index.ts.hbs',
			},
			{
				type: 'add',
				path: 'packages/{{name}}/test/index.test.ts',
				templateFile: 'templates/package/test/index.test.ts.hbs',
			},
			{
				type: 'modify',
				path: 'jinen.code-workspace',
				transform: (fileContents, answers) => {
					const workspace = JSON.parse(fileContents);
					workspace.folders.push({ path: `packages/${answers.name}` });
					return JSON.stringify(workspace, null, 4);
				},
			},
		],
	});
}
