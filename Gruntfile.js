module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt)

	const copyFiles = [
        'classes/**',
		'views/**',
        'assets/**',
		'languages/**',
		'smoobu-calendar.php',
		'uninstall.php',
		'activation.php',
		'constants.php',
		'index.php',
		'vendor/**',
		'!**/*.map',
		'!assets/js/*.css',
		'composer.json',
	]

    const excludeCopyFilesPro = copyFiles
		.slice(0)
		.concat([
			'changelog.txt',
			'readme.txt',
		])

	const changelog = grunt.file.read('.changelog');
	grunt.loadNpmTasks('@floatwork/grunt-po2mo');
	grunt.loadNpmTasks('grunt-exec');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Clean temp folders and release copies.
		clean: {
			temp: {
				src: ['**/*.tmp', '**/.afpDeleted*', '**/.DS_Store'],
				dot: true,
				filter: 'isFile',
			},
			assets: ['assets/css/**', 'assets/js/**', 'assets/images/**' ],
			folder_v2: ['build/**'],
		},

		checktextdomain: {
			options: {
				text_domain: 'st-webinar-management',
				keywords: [
					'__:1,2d',
					'_e:1,2d',
					'_x:1,2c,3d',
					'esc_html__:1,2d',
					'esc_html_e:1,2d',
					'esc_html_x:1,2c,3d',
					'esc_attr__:1,2d',
					'esc_attr_e:1,2d',
					'esc_attr_x:1,2c,3d',
					'_ex:1,2c,3d',
					'_n:1,2,4d',
					'_nx:1,2,4c,5d',
					'_n_noop:1,2,3d',
					'_nx_noop:1,2,3c,4d',
				],
			},
			files: {
				src: [
                    'classes/**/*.php',
                    'views/**/*.php',
					'smoobu-calendar.php',
					'uninstall.php',
					'activation.php',
					'constants.php',
					'index.php',
					'src/**/*.js',
					'!core/external/**', // Exclude external libs.
				],
				expand: true,
			},
		},

		copy: {
			pro: {
				src: excludeCopyFilesPro,
				dest: 'build/<%= pkg.name %>/',
			},
		},

		compress: {
			pro: {
				options: {
					mode: 'zip',
					archive: './build/<%= pkg.name %>-<%= pkg.version %>.zip',
				},
				expand: true,
				cwd: 'build/<%= pkg.name %>/',
				src: ['**/*'],
				dest: '<%= pkg.name %>/',
			},
		},

/* 		exec: {
			update_po_tx: { // Update Transifex translation - grunt exec:update_po_tx
				cmd: 'tx pull -a --minimum-perc=100'
			},
			update_po_wti: { // Update WebTranslateIt translation - grunt exec:update_po_wti
				cmd: 'wti pull',
				cwd: 'languages/',
			}
		}, */

		po2mo: {
			files: {
				src: 'languages/smoobu-calendar-de_DE.po',
				dest: 'languages/smoobu-calendar-de_DE.mo',
/* 				src: 'languages/*.po',
				expand: true, */
			},
		},

/*         po2mo: {
            files: {
                expand: true,
                cwd: 'languages/',
                src: ['*.po'],
                dest: 'languages/',
                ext: '.mo',
            },
        }, */

        exec: {
			msginit: {
				command: 'msginit --locale=de_DE --output-file=languages/smoobu-calendar-de_DE.po --input=languages/smoobu-calendar.pot',
			},
/*             msgfmt: {
                command: 'msgfmt languages/smoobu-calendar-de_DE.po -o languages/smoobu-calendar-de_DE.mo',
            }, */
        },
	})

	grunt.loadNpmTasks('grunt-search')

	grunt.registerTask('version-compare', ['search'])
	grunt.registerTask('finish', function () {
		const json = grunt.file.readJSON('package.json')
		const file = './build/' + json.name + '-' + json.version + '.zip'
		grunt.log.writeln('Process finished.')

		grunt.log.writeln('----------')
	});

    grunt.registerTask('generate-german-translation', [
		'exec:msginit',
		'po2mo',
		/* 'exec:msgfmt', */
	]);

	grunt.registerTask('build', [
		'checktextdomain',
		'copy:pro',
		'compress:pro',
		'generate-german-translation', // Add the task to generate German translation
	]);

	grunt.registerTask('preBuildClean', [
		'clean:temp',
		'clean:assets',
		'clean:folder_v2',
	])
}
