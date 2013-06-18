#generator-cg-angular

>Yeoman Generator for Enterprise Angular Projects

Features

* Provides a directory structure geared towards large Angular projects.  
    * Each controller, service, filter, and directive are placed in their own file.  
    * All files related to a conceptual unit are placed together.  For example, the controller and HTML file for a partial are placed together in the same directory.
* Provides a ready-made Grunt build that produces an extremely optimized distribution.
* Integrates Bower for package management
* Includes Yeoman sub-generators for directives, services, partials, and filters
* Integrates LESS and includes Bootstrap via the source LESS files allowing you to reuse Bootstrap vars/mixins/etc.
* Testable - Included Yeoman sub-generators also build test skeletons.  Run test via `grunt test`.

Directory Layout
-------------
Below is an explanation of the folder structure.

    /css .............................. usually only contains app.less
        app.less ...................... main app-wide styles
    /img .............................. images (not created by default but included in bin if added)
    /js ............................... app global javascript files
        setup.js ...................... angular module initialization and route setup
    /directive. ....................... angular directives folder
        my-directive.js ............... example simple directive
        /my-directive2 ................ example complex directive (contains external partial)
            my-directive2.js .......... complex directive javascript
            my-directive2.html ........ complex directive partial
            my-directive2.less ........ complex directive LESS
    /filter ........................... angular filters folder
        my-filter.js .................. example filter
    /partial .......................... angular partials folder
        /my-partial ................... example partial
            my-partial.html ........... example partial html
            my-partial.js ............. example partial controller
            my-partial.less ........... example partial LESS
    /service .......................... angular services folder
        my-service.js ................. example service
    /bin .............................. distributable version of app built using grunt and Gruntfile.js
    /lib .............................. 3rd party libraries, managed by bower (renamed components to lib)
    /node_modules ..................... npm managed libraries used by grunt

Getting Started
-------------

Prerequisites: Node, Grunt, Yeoman, and Bower.  Once Node is installed, do:

    npm install -g grunt-cli yo bower

Next, install this generator:

    npm install -g generator-cg-angular

To create a project:

    mkdir MyNewAwesomeApp
    cd MyNewAwesomeApp
    yo cg-angular

Grunt Tasks
-------------

Now that the project is created, you have 3 simple Grunt commands available:

    grunt server  #This will run a development server with watch & reload enabled.
    grunt test    #Run headless unit tests using PhantomJS.
    grunt build   #Places a fully optimized (minified, concatenated, and more) in /bin

Yeoman Sub-generators
-------------

There are a set of sub-generators to initialize empty Angular components.  Each of these generators will:

* Create one or more skeleton files (javascript, LESS, html, etc) for the component type
* Create a skeleton unit test in /test
* Update index.html and add the necessary `script` tags.
* Update app.less and add the @import as needed.
* For partials, update the setup.js, adding the necessary route call if a route was entered in the generator prompts.

There are generators for `directive`,`partial`,`service`, and `filter`.

Running a generator:

    yo cg-angular:directive my-awesome-directive
    yo cg-angular:partial my-partial
    yo cg-angular:service my-service
    yo cg-angular:filter my-filter

The name paramater passed (i.e. 'my-awesome-directive') will be used for directory and/or file names.  The generators will derive appropriate class names from this parameter (ex. 'my-awesome-directive' will convert to a class name of 'MyAwesomeDirective').

One quick note, each sub-generator pulls the Angular app/module name from the package.json.  Therefore, if you choose to change the name of your Angular app/module, you must ensure that the name in the package.json stays in sync.

Release History
-------------

* 6/18/2013 v1.0.0 - Initial release of template as Yeoman generator.

