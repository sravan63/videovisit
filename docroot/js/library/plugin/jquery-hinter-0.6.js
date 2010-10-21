(function($) {

    $.widget("litmusbox.hinter", {
        options : {    
            hint           : '',
            isClearOnFocus : false,
            beforeBlur     : null,
            afterBlur      : null,
            beforeFocus    : null,
            afterFocus     : null
        },
        _create : function() {
            //To prevent "this" from being overwritten
            var self = this;
            
            //Set hint
            self.options.hint = jQuery.trim(self.element.attr('hint'));
            
            //Display hint
            self.element.val(self.options.hint);
            
            //Attach event handlers
            self.element.focus(function(event) {
                self._focus(event);
            }).blur(function(event) {
                self._blur(event);
            });
        },
        _destroy : function() {
            //To prevent "this" from being overwritten
            var self = this;
                        
            //Unbind handlers			
            self.element.unbind('focus', self._focus).unbind('blur', self._blur);
    	},
    	_setOption : function(option, value) {
    		$.Widget.prototype._setOption.apply(this, arguments);	
		    
    		switch(option) {
    		    case 'hint':
    		        this.options.hint = value;
    		        break;

    		    case 'isClearOnFocus':
    		        this.options.isClearOnFocus = value;
    		        break;
    		            		    
    		    case 'beforeBlur':
    		        this.options.beforeBlur = value;
    		        break;
		        
    		    case 'afterBlur':
    		        this.options.afterBlur = value;
    		        break;
		        
    		    case 'beforeFocus':
    		        this.options.beforeFocus = value;
    		        break;
		        
    		    case 'afterFocus':
    		        this.options.afterFocus = value;
    		        break;
    		        		    		        
    		}		
    	},
    	_focus : function(event) {      	    
    	    //Call pre focus handler
            if(jQuery.isFunction(this.options.beforeFocus)) {
                this.options.beforeFocus.apply(this, [this.options]);
            }
            
            //Clear current value if set in options of if current value is equal to the hint
            if(this.options.isClearOnFocus || this.element.val() == this.options.hint) {
                this.element.val('');
            }

            //Call post focus handler
            if(jQuery.isFunction(this.options.afterFocus)) { 
                this.options.afterFocus.apply(this, [this.options]);
            }    	    
    	},
    	_blur : function(event) {
    	    //Call pre blur handler
            if(jQuery.isFunction(this.options.beforeBlur)) {
                this.options.beforeBlur.apply(this, [this.options]);
            }
            
            //Reset the hint if there is no user input
            if(jQuery.trim(this.element.val()).length <= 0) {
                this.element.val(this.options.hint);
            }
            
            //Call post blur handler
            if(jQuery.isFunction(this.options.afterBlur)) { 
                this.options.afterBlur.apply(this, [this.options]);                            
            }     	    
    	},
    	
    	val : function() {
            //To prevent "this" from being overwritten
            var self = this;
                	    
    	    //Check to see if the current value is the hint, if so return an empty string otherwise the current value
            if(jQuery.trim(self.element.val()) == self.options.hint) {
                return '';
            }
            else {
                return jQuery.trim(self.element.val());
            }
    	},
    	reset : function() {
            this.element.val(this.options.hint);
    	}    	    	
    });

})(jQuery);