var form = document.getElementById('my-form'); 
form.addEventListener("submit", function(evt){
    evt.preventDefault();
    var formData = getFormData('my-form');

    v.validate(formData.user).required().minLength(8).isAlphaDash().noWhitespace();
    console.log('Value: ' + formData.user, 'Verdict: ' + v.isValid());
    console.log('Errors: ' + v.getErrors());

    v.validate(formData.pass).required().minLength(12);
    console.log('Value: ' + formData.pass, 'Verdict: ' + v.isValid());
    console.log('Errors: ' + v.getErrors());
});

function getFormData(formID) {
    var container, inputs, len, index, data = {};

    // get the container element
    container = document.getElementById(formID);

    // find it's child 'input' elements
    inputs = container.getElementsByTagName('input');
    for(index = 0, len = inputs.length; index < len;  index++) {
        if(inputs[index].name) {
            data[inputs[index].name] = inputs[index].value;
        }    
    }

    return data;
}

function assert(value, desc) {
	var resultsList = document.getElementById("results");
	if (!resultsList) {
		resultsList = document.createElement('ul');
		document.getElementsByTagName('body')[0].appendChild(resultsList);
		resultsList.setAttribute('id','results');
	}
	var li = document.createElement("li");
	li.className = value ? "pass" : "fail";
	li.appendChild(document.createTextNode(desc));
	resultsList.appendChild(li);
}