### Install
    $ npm install js-valid
    or
    $ git clone https://github.com/donvercety/js-valid.git

Then add a `<script>` to your index.html

##### npm

```html
<script src="./node_modules/js-valid/validate.js"></script>
```

##### git clone

```html
<script src="./js-valid/validate.js"></script>
```

### Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>js-valid</title>
</head>
<body>
    <form action="" id="test-form">
        <input type="text" name="name" id="name" placeholder="username"/>
        <input type="password" name="pass" id="pass" placeholder="pasword"/>
        <input type="password" name="pass_match" id="pass_match" placeholder="repeat password"/>
        <input type="text" name="email" id="email" placeholder="email"/>
        <input type="submit" value="send" />
    </form>
    
    <script src="./js-valid/validate.js"></script>
    <script type="text/javascript">
        var v, form; 
    
        v = new MY.Validate(),
        
        form = document.getElementById('test-form');
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // get all fields from the form using the id
            var data = v.getFormFields(form);
            
            // user validation
            v.validate(data.name, 'user');
            v.required().minLength(4).noWhitespace();
            
            // pass validation, even better single line
            v.validate(data.pass, 'pass').required().minLength(8).noWhitespace();
            
            // pass match validation
            v.validate(data.pass_match, 'pass_match').matches(data.pass);
            
            // email validation
            v.validate(data.email).required().isEmail();
            
            // check all validation rules
            if(v.isValid()) { 
                console.log('Validation successful!');
            } else {
                // display errors, 'getErrors()' returns an array containing all errors that occurred
                var err = v.getErrors();
                for(var i = 0, len = err.length; i < len; i++) {
                    console.warn('Error: ' + err[i]);
                }
            }
        });
    </script>
</body>
</html>
```

### Available validation methods
- min(val)
- max(val)
- exact(val)
- maxLength(val)
- minLength(val)
- exactLength(val)
- required()
- matches(val)
- isAlpha()
- isNumeric()
- isAlphaNumeric()
- isAlphaDash()
- isInteger()
- isHex()
- isBase64()
- isIP()
- isEmail()
- isUrl()
- noWhitespace()

! `min()`, `max()` and `exact()` are for checking integers.  
! `maxLength()`, `minLength()` and `exactLength()` are for checking character lenght.

All methods are chainable. You can validate as much variable as you like. Call `validate()` then add the rules that apply for that validation, calling again `validate()` will add another variable for validation, all the rules applied after the second call of `validate()` are applied to the second variable. When you added all the variables that needs to be validated just call `isValid()` this will rerun a `boolean` value. If you get `false` you can check what went wrong with `getErrors()`.

##### `validate(value, field_name)`
This method prepares a given value for validation. The first parameter `value` is the parameter to be validated. The second `field_name` is optional, this is displayed in the error message.

##### `getErrors()`
This method returns `false` if no errors are present or `array` containing all the errors that occurred during validation.

##### `isValid()`
Calling this method ends the validation loop and validates all the added values with their rules attached to them. Validating new values after that starts a new validation loop.

##### `setMsg(msg_name, new_msg)`
This method changes the default error message that will be displayed when an error occurred. You can use this to add your own custom error messages.

```js
var new_msg = '{1} value must must be less than {0}';
v.setMsg('maxLength', new_msg);

// old msg: {1} integer value must not exceed {0}
// new msg: {1} value must must be less than {0}
```

You can change all error messages for each method, just by adding as first parameter it's name and as second the new message. The characters `{0}` will be replaced with the validation value and `{1}` with the `field_name` that you specify in the `validate()` method as second parameter.

Methods that use both `{0}` and `{1}`, all ohter methods use only `{1}`.

- min(val)
- max(val)
- exact(val)
- maxLength(val)
- minLength(val)
- exactLength(val)
- matches(val)


Or simply, methods that use both, are methods that have a `val` parameter.