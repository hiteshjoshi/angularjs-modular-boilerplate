# Modular angularjs boilerplate with grunt

### Prerequisite

+ You need node v0.8 or higher to run this program. Follow this [Node Installation Instruction](https://www.npmjs.org/doc/README.html).
+ Download and install [Git](http://git-scm.com/) form here. Git is required by Bower.
+ Install Grunt's command line interface (CLI) globally
```sh
$ npm install -g grunt-cli
```
+ Install Bower to manage this template dependencies(plugin, library etc)
```sh
$ npm install -g bower
```
+ **cd** to the folder and run this 2 command:
```sh
$ npm install
```
```sh
$ bower install
```
+ Then you can run the Command Line Instruction available in gruntfile.js . Just make sure that you **cd** to the folder.


### SASS OR LESS
+ If you plan to use SASS make sure you have ruby install and sass gem installed. If not install it
```gem install sass

+ You can use both LESS and SASS or just one. Make sure to update your Grunt tasks accordingly,
+ ![Grunt configuration](http://i.imgur.com/0RFGub0.png)


### Command Line Instruction

+ Build temporary web server and enable auto reload. Good for development purpose
```sh
$ grunt serve
```
+ Run documentation
```sh
$ grunt docs
```
+ copy all the needed files and folders to **dist** folder.
```sh
$ grunt dist
```
+ copy all the needed files and folders to **dist** folder and minify all javascript, stysheet, html and images.
```sh
$ grunt dist --min
```