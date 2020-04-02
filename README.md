# Parasails Vue-popper component
This is a Vue.js component that can be used with the [sails.js](https://sailsjs.com/get-started) and [parasails.js](https://github.com/mikermcneil/parasails).
Parasails is essentially a port of Vue.js that is slightly customized to work better within sails.js (or that is at least what I understand)

### What is the Vue Popper component?
This is just a component to allow you to use the [popper.js](https://popper.js.org/)[Github](https://github.com/popperjs/popper-core) library from within a sailsJs web app. The popper.js website describes this library as a "tooltip & popover positioning engine." This is used throughout the web and popularly in [Bootstrap](https://getbootstrap.com/) and gives developers the basic tools to calculate the position of a tooltip or popover depending on the position of the element it is anchored to and the possition of the window. It works really well. This is based heavily off [RobinCK](https://github.com/RobinCK_) popper implementation for VueJs.


![popover screenshot 1](https://dl.dropboxusercontent.com/s/ovkv0gpoe4j4wpz/popover-example-1.png)
![popover screenshot 2](https://dl.dropboxusercontent.com/s/lbggebeli8j7jj8/popover-example-2.png)


## Setup
Place the follwoing files (css in dependencies, js in components) in their respective directories in your sailsJS or Parasails project. 
You should be able to use directly in your EJS templates, page component or any other component in sailsJs.


### Props
All the props have default values so none of them are necessary. 
Refer to the [popper.js](https://popper.js.org/docs/v2/constructors/) documentation for prop usage. Or the [VueJS popper respository](https://github.com/RobinCK/vue-popper)

| Props               | Type      | Default                                         | Description  |
| --------------------|:----------| ------------------------------------------------|--------------|
| disabled            | Boolean   | false                                           |   |
| delay-on-mouse-over | Number    | 10                                              | Delay in ms before showing popper during a mouse over |
| delay-on-mouse-out  | Number    | 10                                              | Delay in ms before hiding popper during a mouse out |
| append-to-body      | Boolean   | false                                           |   |
| visible-arrow       | Boolean   | true                                            |   |
| force-show          | Boolean   | false                                           |   |
| trigger             | String    | hover                                           | Optional value: <br><ul><li>**hover** - hover to open popper content</li><li>**clickToOpen** - every click on the popper triggers open, only clicking outside of the popper closes it</li><li>**clickToToggle** - click on the popper toggles it's visibility</li><li>**click** (deprecated - same as **clickToToggle**)</li><li>**focus** - opens popper on focus event, closes on blur.</li> |
| content             | String    | null                                            |   |
| enter-active-class  | String    | null                                            |   |
| leave-active-class  | String    | null                                            |   |
| boundaries-selector | String    | null                                            |   |
| transition          | String    | empty                                           |   |
| options             | Object    | { placement: 'bottom', gpuAcceleration: false } | [popper.js](https://popper.js.org/popper-documentation.html) options  |
| data-value          | Any       | null                                            | data of popper  |
| stop-propagation    | Boolean   | false                                           |  |
| prevent-default     | Boolean   | false                                           |  |
| root-class          | String    | empty                                           | Class name for root element |

### An example of use
~~~~
<popper class="w-100" trigger="clickToOpen" :options="{placement: 'top'}">
    <p @click.prevent="methodInParent">The content you want displayed in your popper</p>
</popper>
~~~~

### Calling methods from within the popper 
The parasails popper uses content slots so you can call a method on the content of a popper from the parent component. In the above example "methodInParent()" would be a method in the parent component of the parasails popper.
