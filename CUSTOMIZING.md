Customizing the Subgenerators
-------------

You may need to customize the subgenerators if you use things like SASS, RequireJS, and more.  The subgenerators can be extended and overriden through the `.yo-rc.json` file.  The `.yo-rc.json` file can be configured with the following properties:

#### partialTemplates
Type: `String`

Directory to load partial template files from.

#### directiveSimpleTemplates
Type: `String`

Directory to load directive template files from if the user has chosen to create a directive without an external partial.

#### directiveComplexTemplates
Type: `String`

Directory to load directive template files from if the user has chosen to create a directive with an external partial.

#### serviceTemplates
Type: `String`

Directory to load service template files from.

#### filterTemplates
Type: `String`

Directory to load filter template files from

#### inject
Type: `Object`

A map of file extensions where each extension key contains another map containing 3 properties (file, template, marker).  The subgenerators use these options to inject script tags and import statements.  These options can be extended to add new file types, or override to change the existing injection behavior.

## Example Configuration

Here is an example configuration that matches the default behavior of the subgenerators:

```js
{
	"uirouter": false,
	"partialDirectory": "partial/",
	"directiveDirectory": "directive/",
	"serviceDirectory": "service/",
	"filterDirectory": "filter/",
	"partialTemplates": "templates/partial",
	"directiveSimpleTemplates": "templates/simpleDirective",
	"directiveComplexTemplates": "templates/complexDirective",
	"serviceTemplates": "templates/service",
	"filterTemplates": "templates/filter",
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
```

If a given template property is missing, the default templates will be used.

## Template Directories

Each template directory can contain any number of files for a given subgenerator.  Each file will be read, run through the template engine, and then saved to the user specified destination.  The name of the destination file will be derived from the name of the template file by replacing the type word (partial/directive/filter/service) with the name of the component.  In other words, `partial-spec.js` becomes `whatever-spec.js`.

### Template variables

All templates are valid underscore templates using the standard ERB-style delimiters.  The templates will also have the following variables:

* `appname` - name of the Angular app/module name
* `name` - the name of the component entered by the user
* `dir` - the name of the directory where the component will be placed (includes trailing backslash)
* `ctrlname` - (partials only) name of the controller
* `_` - Underscore.js with Underscore.string mixed in.  This allows you to use code like `<%= _.camelize(name) %>` in the templates.
