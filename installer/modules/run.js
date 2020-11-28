/**
 * Installation
 */

const fs = require('fs');
const theCWD = process.cwd();
const theCWDArray = theCWD.split('/');
const theDir = theCWDArray[theCWDArray.length - 1];
const ora = require('ora');
const execa = require('execa');
const chalk = require('chalk');
const download = require('download');
const handleError = require('./handleError.js');
const clearConsole = require('./clearConsole.js');
const printNextSteps = require('./printNextSteps.js');

module.exports = () => {
	// Init.
	clearConsole();

	let upstreamUrl = '';
	// When running GitHub actions, make sure the files from current repo are downloaded
	if (process.env.WPFY_GH_REPO) {
  	let refname = process.env.WPFY_GH_REF.split('/');
    refname = refname[refname.length-1];
		upstreamUrl = `https://raw.githubusercontent.com/${process.env.WPFY_GH_REPO}/${refname}`;
	} else {
		upstreamUrl = 'https://raw.githubusercontent.com/luangjokaj/wordpressify/v0.2.8-18';
	}

	// Files.
	const filesToDownload = [
		`${upstreamUrl}/.babelrc`,
		`${upstreamUrl}/.gitignore`,
		`${upstreamUrl}/.stylelintrc`,
		`${upstreamUrl}/.env`,
		`${upstreamUrl}/LICENSE`,
		`${upstreamUrl}/README.md`,
		`${upstreamUrl}/gulpfile.js`,
		`${upstreamUrl}/docker-compose.yml`,
		`${upstreamUrl}/wp-config.php`,
		`${upstreamUrl}/installer/package.json`,

		`${upstreamUrl}/src/assets/css/globals.css`,
		`${upstreamUrl}/src/assets/css/mixins.css`,
		`${upstreamUrl}/src/assets/css/style.css`,
		`${upstreamUrl}/src/assets/css/variables.css`,
		`${upstreamUrl}/src/assets/css/wordpressify.css`,

		`${upstreamUrl}/src/assets/js/main.js`,

		`${upstreamUrl}/src/theme/404.php`,
		`${upstreamUrl}/src/theme/archive.php`,
		`${upstreamUrl}/src/theme/comments.php`,
		`${upstreamUrl}/src/theme/content-none.php`,
		`${upstreamUrl}/src/theme/content-page.php`,
		`${upstreamUrl}/src/theme/content-single.php`,
		`${upstreamUrl}/src/theme/content.php`,
		`${upstreamUrl}/src/theme/footer.php`,
		`${upstreamUrl}/src/theme/functions.php`,
		`${upstreamUrl}/src/theme/header.php`,
		`${upstreamUrl}/src/theme/index.php`,
		`${upstreamUrl}/src/theme/page.php`,
		`${upstreamUrl}/src/theme/screenshot.png`,
		`${upstreamUrl}/src/theme/search.php`,
		`${upstreamUrl}/src/theme/searchform.php`,
		`${upstreamUrl}/src/theme/sidebar.php`,
		`${upstreamUrl}/src/theme/single.php`,
	];

	// Organise file structure
	const dotFiles = ['.babelrc', '.gitignore', '.stylelintrc', '.env'];
	const cssFiles = ['globals.css', 'mixins.css', 'style.css', 'variables.css', 'wordpressify.css'];
	const jsFiles = ['main.js'];
	const pluginFiles = ['README.md'];
	const themeFiles = [
		'404.php',
		'archive.php',
		'comments.php',
		'content-none.php',
		'content-page.php',
		'content-single.php',
		'content.php',
		'footer.php',
		'functions.php',
		'header.php',
		'index.php',
		'page.php',
		'screenshot.png',
		'search.php',
		'searchform.php',
		'sidebar.php',
		'single.php',
	];

	// Start.
	console.log('\n');
	console.log(
		'📦 ',
		chalk.black.bgYellow(` Downloading 🎈 WordPressify files in: → ${chalk.bgGreen(` ${theDir} `)}\n`),
		chalk.dim(`\n In the directory: ${theCWD}\n`),
		chalk.dim('This might take a couple of minutes.\n'),
	);

	const spinner = ora({ text: '' });
	spinner.start(`1. Creating 🎈 WordPressify files inside → ${chalk.black.bgWhite(` ${theDir} `)}`);

	// Download.
	Promise.all(filesToDownload.map(x => download(x, `${theCWD}`))).then(async () => {
		if (!fs.existsSync('src')) {
			await execa('mkdir', [
				'src',
				'src/theme',
				'src/plugins',
				'src/assets',
				'src/assets/css',
				'src/assets/js',
			]);
		}

		dotFiles.map(x =>
			fs.rename(`${theCWD}/${x.slice(1)}`, `${theCWD}/${x}`, err => handleError(err)),
		);
		cssFiles.map(x =>
			fs.rename(`${theCWD}/${x}`, `${theCWD}/src/assets/css/${x}`, err => handleError(err)),
		);
		jsFiles.map(x =>
			fs.rename(`${theCWD}/${x}`, `${theCWD}/src/assets/js/${x}`, err => handleError(err)),
		);
		themeFiles.map(x =>
			fs.rename(`${theCWD}/${x}`, `${theCWD}/src/theme/${x}`, err => handleError(err)),
		);
		spinner.succeed();

		// The npm install.
		spinner.start('2. Installing npm packages...');
		// await execa('npm', ['install', '--silent']);
		await execa('npm', ['install']);
		spinner.succeed();

		// Installing WordPress files
		spinner.start(`3. Installing WordPress files from ${chalk.green('https://wordpress.org/')} ...`);
		await execa('npm', ['run', 'install:wordpress']);
		spinner.succeed();

		// Done.
		printNextSteps();
	});
};
