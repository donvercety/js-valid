var MY = MY || {};

MY.Validate = (function() {
    "use strict";
    
    var result     = null,
        errors     = [],
        lastErrors = [];

    /**
     * Regular expressions used for validation.
     * @type {RegExp}
     */
    var numericRegex      = /^-{0,1}\d*\.{0,1}\d+$/,
        alphaRegex        = /^[a-z]+$/i,
        alphaNumericRegex = /^[a-z0-9]+$/i,
        alphaDashRegex    = /^[a-z0-9_\-]+$/i,
        integerRegex      = /^\-?[0-9]+$/,
        base64Regex       = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
        whitespaceRegex   = /\s/g,
        ipRegex           = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
        emailRegex        = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
        urlRegex          = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

    /**
     * Error messages to be displayed in error array.
     * @type {Object}
     */
    var messages = {
        
        max: 'integer value must not exceed {0}',
        min: 'integer value must be at least {0}',

        maxLength: 'must not exceed {0} characters in length',
        minLength: 'must be at least {0} characters in length',
        exactLength: 'must be exactly {0} characters in length',

        required: 'required value is empty or undefined',
        matches: 'does not match the selected value: {0}',

        isAlpha: 'must contain only alphabetical characters',
        isNumeric: 'must contain only numbers',
        isAlphaNumeric: 'must contain only alpha-numeric characters',
        isAlphaDash: 'must contain only alpha-numeric characters, underscores, and dashes',
        isInteger: 'must contain an integer',

        isBase64: 'must contain a base64 string',
        isIP: 'must contain a valid IP',
        isEmail: 'must contain a valid email address',
        isUrl: 'must contain a valid URL',

        noWhitespace: 'must not use whitespace character'
    };

    /**
     * Crates the error message
     * @param  {[string]} message
     * @return {[string]}
     */
    function msg(message) {
        var args = Array.prototype.slice.call(arguments, 1);
        return message.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number]  : match;
        });
    }

    // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
    // :: Class constructor
    // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

    function Validate() {
        this.value = null;
    }

    // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
    // :: Public Methods
    // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
    
    /**
     * Get all data from a form element in HTML
     * @param  {[string]} formID [id of the form element]
     * @return {[object]}        [object containing all data form the form]
     */
    Validate.prototype.getFormFields = function(formID) {
        var container, inputs, index, len, data = {};

        // get the container element
        container = document.getElementById(formID);

        // find it's child 'input' elements
        inputs = container.getElementsByTagName('input');
        for(index = 0, len = inputs.length; index < len;  index++) {
            if(inputs[index].name) {
                if(inputs[index].type == 'radio') {
                    if(inputs[index].checked) { data[inputs[index].name] = inputs[index].value; }  
                } else {
                    data[inputs[index].name] = inputs[index].value;  
                }
            }
        }

        // find it's child 'textarea' elements
        var textarea, t_index, tl;
        textarea = container.getElementsByTagName('textarea');
        for(t_index = 0, tl = textarea.length; t_index < tl;  t_index++) {
            if(textarea[t_index].name) {
                data[textarea[t_index].name] = textarea[t_index].value;
            }    
        }

        // find it's child 'select' elements
        var select, option, s_index, sl;
        select = container.getElementsByTagName('select');
        for(s_index = 0, sl = select.length; s_index < sl;  s_index++) {
            if(select[s_index].name) {
                option = select[s_index].getElementsByTagName('option');
                var o_index, ol;
                for(o_index = 0, ol = option.length; o_index < ol;  o_index++) {
                    if(option[o_index].selected) {
                        data[select[s_index].name] = option[o_index].value;
                    }
                }
            }    
        }

        return data;
    };
    
    /**
     * Supply the value to be validated
     * @param  {[mixed]} value
     */
    Validate.prototype.validate = function(value) {
        this.value  = value;
        return this;
    };

    /**
     * Set custom message
     * @param {[string]} msg    [message to be changed]
     * @param {[string]} newMsg [new message text]
     */
    Validate.prototype.setMsg = function(msg, newMsg) {
        messages[msg] = newMsg;
    };

    /**
     * Get errors, if any, after running isValid()
     * @return {[mixed]} [returns errors array, if no errors, returns false]
     */
    Validate.prototype.getErrors = function() {
        return lastErrors.length > 0 ? lastErrors : false;
    };

    /**
     * Run the validator
     * @return {Boolean}
     */
    Validate.prototype.isValid = function() {
        result = (errors.length === 0);
        lastErrors = errors;
        errors = [];
        this.value = null;
        return result;
    };

    // :: Validators

    Validate.prototype.max = function(value) {
        this.isInteger(value);
        if(this.value >= value) {
            errors.push(msg(messages.max, value)); }
        return this;
    };

    Validate.prototype.min = function(value) {
        this.isInteger(value);
        if(this.value <= value) {
            errors.push(msg(messages.min, value)); }
        return this;
    };

    Validate.prototype.maxLength = function(value) {
        if(this.value === null || this.value.toString().length > value) {
            errors.push(msg(messages.maxLength, value)); }
        return this;
    };

    Validate.prototype.minLength = function(value) {
        if(this.value === null || this.value.toString().length < value) {
            errors.push(msg(messages.minLength, value)); }
        return this;
    };

    Validate.prototype.exactLength = function(value) {
        if(this.value === null || this.value.toString().length != value) {
            errors.push(msg(messages.exactLength, value)); }
        return this;
    };

    Validate.prototype.required = function() {
        if(this.value === null || this.value === '' || this.value === undefined) {
            errors.push(msg(messages.required)); }
        return this;
    };

    Validate.prototype.matches = function(value) {
        if(this.value !== value) {
            errors.push(msg(messages.matches, value)); }
        return this;
    };

    Validate.prototype.isAlpha = function() {
        if(this.value === null || !alphaRegex.test(this.value)) {
            errors.push(msg(messages.isAlpha)); }
        return this;
    };

    Validate.prototype.isNumeric = function() {
        if(!numericRegex.test(this.value)) {
            errors.push(msg(messages.isNumeric)); }
        return this;
    };

    Validate.prototype.isAlphaNumeric = function() {
        if(this.value === null || !alphaNumericRegex.test(this.value)) {
            errors.push(msg(messages.isAlphaNumeric)); }
        return this;
    };

    Validate.prototype.isAlphaDash = function() {
        if(this.value === null || !alphaDashRegex.test(this.value)) {
            errors.push(msg(messages.isAlphaDash)); }
        return this;
    };

    Validate.prototype.isInteger = function() {
        if(!integerRegex.test(this.value)) {
            errors.push(msg(messages.isInteger)); }
        return this;
    };

    Validate.prototype.isBase64 = function() {
        if(!base64Regex.test(this.value)) {
            errors.push(msg(messages.isBase64)); }
        return this;
    };

    Validate.prototype.isIP = function() {
        if(!ipRegex.test(this.value)) {
            errors.push(msg(messages.isIP)); }
        return this;
    };

    Validate.prototype.isEmail = function() {
        if(!emailRegex.test(this.value)) {
            errors.push(msg(messages.isEmail)); }
        return this;
    };

    Validate.prototype.isUrl = function() {
        if(!urlRegex.test(this.value)) {
            errors.push(msg(messages.isUrl)); }
        return this;
    };

    Validate.prototype.noWhitespace = function() {
        if(this.value === null || whitespaceRegex.test(this.value)) {
            errors.push(msg(messages.noWhitespace)); }
        return this;
    };
    
    return Validate;
}());
