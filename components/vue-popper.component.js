function on(element, event, handler) {
    if (element && event && handler) {
      document.addEventListener ? element.addEventListener(event, handler, false) : element.attachEvent('on' + event, handler);
    }
  }

  function off(element, event, handler) {
    if (element && event) {
      document.removeEventListener ? element.removeEventListener(event, handler, false) : element.detachEvent('on' + event, handler)
    }
  }

parasails.registerComponent('popper', {
    props: {
        tagName: {
          type: String,
          "default": 'span'
        },
        trigger: {
          type: String,
          "default": 'hover',
          validator: function validator(value) {
            return ['clickToOpen', 'click', // Same as clickToToggle, provided for backwards compatibility.
            'clickToToggle', 'hover', 'focus'].indexOf(value) > -1;
          }
        },
        delayOnMouseOver: {
          type: Number,
          "default": 10
        },
        delayOnMouseOut: {
          type: Number,
          "default": 10
        },
        disabled: {
          type: Boolean,
          "default": false
        },
        content: String,
        enterActiveClass: String,
        leaveActiveClass: String,
        boundariesSelector: String,
        reference: {},
        forceShow: {
          type: Boolean,
          "default": false
        },
        dataValue: {
          "default": null
        },
        appendToBody: {
          type: Boolean,
          "default": false
        },
        visibleArrow: {
          type: Boolean,
          "default": true
        },
        transition: {
          type: String,
          "default": ''
        },
        stopPropagation: {
          type: Boolean,
          "default": false
        },
        preventDefault: {
          type: Boolean,
          "default": false
        },
        options: {
          type: Object,
          "default": function _default() {
            return {};
          }
        }
      },
      data: function data() {
        return {
          referenceElm: null,
          popperJS: null,
          showPopper: false,
          currentPlacement: '',
          popperOptions: {
            placement: 'bottom',
            computeStyle: {
              gpuAcceleration: false
            }
          }
        };
      },
      watch: {
        showPopper: function showPopper(value) {
          if (value) {
            this.$emit('show', this);
  
            if (this.popperJS) {
              this.popperJS.enableEventListeners();
            }
  
            this.updatePopper();
          } else {
            if (this.popperJS) {
              this.popperJS.disableEventListeners();
            }
  
            this.$emit('hide', this);
          }
        },
        forceShow: {
          handler: function handler(value) {
            this[value ? 'doShow' : 'doClose']();
          },
          immediate: true
        },
        disabled: function disabled(value) {
          if (value) {
            this.showPopper = false;
          }
        }
      },
      created: function created() {
        this.appendedArrow = false;
        this.appendedToBody = false;
        this.popperOptions = Object.assign(this.popperOptions, this.options);
      },
      mounted: function mounted() {
        this.referenceElm = this.reference || this.$slots.reference[0].elm;
        for (let n = 0; n < this.$slots['default'].length; n+=1) {
            if (typeof this.$slots['default'][n].tag !== 'undefined' && this.$slots['default'][n].tag !== 'text') {
                this.popper = this.$slots['default'][n].elm;
                break;
            }
        }
        // Made this change as it was trying to append to a text node
        //this.popper = this.$slots["default"][0].elm;

  
        switch (this.trigger) {
          case 'clickToOpen':
            on(this.referenceElm, 'click', this.doShow);
            on(document, 'click', this.handleDocumentClick);
            break;
  
          case 'click': // Same as clickToToggle, provided for backwards compatibility.
  
          case 'clickToToggle':
            on(this.referenceElm, 'click', this.doToggle);
            on(document, 'click', this.handleDocumentClick);
            break;
  
          case 'hover':
            on(this.referenceElm, 'mouseover', this.onMouseOver);
            on(this.popper, 'mouseover', this.onMouseOver);
            on(this.referenceElm, 'mouseout', this.onMouseOut);
            on(this.popper, 'mouseout', this.onMouseOut);
            break;
  
          case 'focus':
            on(this.referenceElm, 'focus', this.onMouseOver);
            on(this.popper, 'focus', this.onMouseOver);
            on(this.referenceElm, 'blur', this.onMouseOut);
            on(this.popper, 'blur', this.onMouseOut);
            break;
        }
      },
      methods: {
        doToggle: function doToggle(event) {
          if (this.stopPropagation) {
            event.stopPropagation();
          }
  
          if (this.preventDefault) {
            event.preventDefault();
          }
  
          if (!this.forceShow) {
            this.showPopper = !this.showPopper;
          }
        },
        doShow: function doShow() {
          this.showPopper = true;
        },
        doClose: function doClose() {
          this.showPopper = false;
        },
        doDestroy: function doDestroy() {
          if (this.showPopper) {
            return;
          }
  
          if (this.popperJS) {
            this.popperJS.destroy();
            this.popperJS = null;
          }
  
          if (this.appendedToBody) {
            this.appendedToBody = false;
            document.body.removeChild(this.popper.parentElement);
          }
        },
        createPopper: function createPopper() {
          var _this = this;
  
          this.$nextTick(function () {
            if (_this.visibleArrow) {
              _this.appendArrow(_this.popper);
            }
  
            if (_this.appendToBody && !_this.appendedToBody) {
              _this.appendedToBody = true;
              document.body.appendChild(_this.popper.parentElement);
            }
  
            if (_this.popperJS && _this.popperJS.destroy) {
              _this.popperJS.destroy();
            }
  
            if (_this.boundariesSelector) {
              var boundariesElement = document.querySelector(_this.boundariesSelector);
  
              if (boundariesElement) {
                _this.popperOptions.modifiers = Object.assign({}, _this.popperOptions.modifiers);
                _this.popperOptions.modifiers.preventOverflow = Object.assign({}, _this.popperOptions.modifiers.preventOverflow);
                _this.popperOptions.modifiers.preventOverflow.boundariesElement = boundariesElement;
              }
            }
  
            _this.popperOptions.onCreate = function () {
              _this.$emit('created', _this);
  
              _this.$nextTick(_this.updatePopper);
            };
  
            _this.popperJS = new bootstrap.Popper(_this.referenceElm, _this.popper, _this.popperOptions);
          });
        },
        destroyPopper: function destroyPopper() {
          off(this.referenceElm, 'click', this.doToggle);
          off(this.referenceElm, 'mouseup', this.doClose);
          off(this.referenceElm, 'mousedown', this.doShow);
          off(this.referenceElm, 'focus', this.doShow);
          off(this.referenceElm, 'blur', this.doClose);
          off(this.referenceElm, 'mouseout', this.onMouseOut);
          off(this.referenceElm, 'mouseover', this.onMouseOver);
          off(document, 'click', this.handleDocumentClick);
          this.showPopper = false;
          this.doDestroy();
        },
        appendArrow: function appendArrow(element) {
          if (this.appendedArrow) {
            return;
          }
  
          this.appendedArrow = true;
          var arrow = document.createElement('div');
          arrow.setAttribute('x-arrow', '');
          arrow.className = 'popper__arrow';
          element.appendChild(arrow);
        },
        updatePopper: function updatePopper() {
          this.popperJS ? this.popperJS.scheduleUpdate() : this.createPopper();
        },
        onMouseOver: function onMouseOver() {
          var _this2 = this;
  
          clearTimeout(this._timer);
          this._timer = setTimeout(function () {
            _this2.showPopper = true;
          }, this.delayOnMouseOver);
        },
        onMouseOut: function onMouseOut() {
          var _this3 = this;
  
          clearTimeout(this._timer);
          this._timer = setTimeout(function () {
            _this3.showPopper = false;
          }, this.delayOnMouseOut);
        },
        handleDocumentClick: function handleDocumentClick(e) {
          if (!this.$el || !this.referenceElm || this.elementContains(this.$el, e.target) || this.elementContains(this.referenceElm, e.target) || !this.popper || this.elementContains(this.popper, e.target)) {
            return;
          }
  
          this.$emit('documentClick', this);
  
          if (this.forceShow) {
            return;
          }
  
          this.showPopper = false;
        },
        elementContains: function elementContains(elm, otherElm) {
          if (typeof elm.contains === 'function') {
            return elm.contains(otherElm);
          }
  
          return false;
        }
      },
      destroyed: function destroyed() {
        this.destroyPopper();
      },
      template: `<component :is="tagName">
            <transition :name="transition" :enter-active-class="enterActiveClass" :leave-active-class="leaveActiveClass" @after-leave="doDestroy">
            <span ref="popper" v-show="!disabled && showPopper"><slot>{{content}}</slot></span>
            </transition>
            <slot name="reference"></slot>
        </component>`
});
     
     