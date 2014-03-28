Upgrading Projects from v2.x to v3.0
-------------

The following guide will describe the steps needed to take a project generated using v2 of the generator and enable it for use with v3.0.

The new v3.0 generator has moved some files, made small changes how script tags and @import statements are injected, and offers users the ability to create a completely custom directory structure.  To convert a v2 project to v3.0, do the following:

1. Rename and move `js/setup.js` to `app.js`.  Modify the related script tag in `index.html`.
2. Move `css/app.less` to `app.less`.  Modify the related link tag in `index.html`.
3. In `app.less`, modify the existing @import statements and remove the `../` from the beginning of the @import statements for all partial and directive less files.
4. In `app.less`, combine the two comment-separated sections for partial and directive less into one section.  Modify the bottom comment marker of this section to be `/* Add Component LESS Above */`.
5. In `index.html`, combine the 4 comment-separated sections for component script tags (for partials, directives, services, filters) into one section.  Modify the bottom comment marker of this section to be `<!-- Add New Component JS Above -->`.
6. Overwrite your existing `Gruntfile.js` with the content from [Gruntfile.js](app/templates/skeleton/Gruntfile.js).  Do a find and replace and search for `<%%=` and replace with `<%=`.
7. Upgrade the `grunt-dom-munger` task by doing `npm install grunt-dom-munger@3.4 --save-dev`.
8. Create a `.yo-rc.json` file in the project root with the following content:

```js
{
    "generator-cg-angular": {
        "uirouter": false,
        "partialDirectory": "partial/",
        "directiveDirectory": "directive/",
        "serviceDirectory": "service/",
        "filterDirectory": "filter/",
        "inject": {
            "js": {
                "file": "index.html",
                "marker": "<!-- Add New Component JS Above -->",
                "template": "<script src=\"<%= filename %>\"></script>"
            },
            "less": {
                "file": "app.less",
                "marker": "/* Add Component LESS Above */",
                "template": "@import \"<%= filename %>\";"
            }
        }
    }
}
```

Upgrading from v3.0 to v3.1
-------------

1.  Modify your `.yo-rc.json` file to look like the following.  The only changes are in the `less` section.  They are the new `relativeToModule` property and the updated `file` value.

```js
{
    "generator-cg-angular": {
        "uirouter": false,
        "partialDirectory": "partial/",
        "directiveDirectory": "directive/",
        "serviceDirectory": "service/",
        "filterDirectory": "filter/",
        "inject": {
            "js": {
                "file": "index.html",
                "marker": "<!-- Add New Component JS Above -->",
                "template": "<script src=\"<%= filename %>\"></script>"
            },
            "less": {
                "relativeToModule": true,
                "file": "<%= module %>.less",
                "marker": "/* Add Component LESS Above */",
                "template": "@import \"<%= filename %>\";"
            }
        }
    }
}
```

2. Modify your `app.js` file.  The v3.1 generator does not generate the chained calls to `$routeProvider`.  Please update the `app.js` so that the contents of the `config` method call look something like:

```js
    /* Add New Routes Above */
    $routeProvider.otherwise({redirectTo:'/home'});
```

Notice that there is now no beginning "$routeProvider." above the comment marker.  The new generator will inject full statements w/o chaining.  For example:

```js
    $routeProvider.when('route',{templateUrl:'partial.html'});
    $routeProvider.when('route2',{templateUrl:'partial2.html'});
    $routeProvider.when('route3',{templateUrl:'partial3.html'});
    /* Add New Routes Above */
    $routeProvider.otherwise({redirectTo:'/home'});
```
