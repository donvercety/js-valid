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
<script type="text/javascript">
    var v = new MY.Validate();
    
    var user = 'biguser001', pass = 'Str0ngP@ss';
    
    // validating user and give rules
    v.validate(user); 
    v.required().minLength(8).isAlphaDash().noWhitespace();
    
    // validating pass and give rules directly
    v.validate(pass).required().minLength(8);
    
    // check all validation rules
    if(v.isValid()) { 
        console.log('Validation successful!');
    } else {
        // display errors
        console.log('Errors: ' + v.getErrors());
    }
</script>
```

### Available validation methods
- `min()`
- `max()`
- `maxLength()`
- `minLength()`
- `exactLength()`
- `required()`
- `matches()`
- `isAlpha()`
- `isNumeric()`
- `isAlphaNumeric()`
- `isAlphaDash()`
- `isInteger()`
- `isHex()`
- `isBase64()`
- `isIP()`
- `isEmail()`
- `isUrl()`
- `noWhitespace()`

! `min()` and `max()` are for checking integers.  
! `maxLength()`, `minLength()` and `exactLength()` are for checking character lenght.

All methods are chainable. You can validate as much variable as you like. Call `validate()` then add the rules that apply for that validation, calling again `validate()` will add another variable for validation, all the rules applied after the second call of `validate()` are applied to the second variable. When you added all the variables that needs to be validated just call `isVAlid()` this will rerun a `boolean` value. If you get `false` you can check what went wrong with `getErrors()`.

Calling `isValid()` ends the validation loop and validates all the added values with their rules attached to them. Validating new values after that starts a new validation loop.
