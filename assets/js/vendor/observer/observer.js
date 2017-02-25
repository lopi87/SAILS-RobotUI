// Observers


//In here is where the different observers functions are added to execute them.
function observers () {
  checkbox_observer();
}



// ready is a function that starts the observers function...
var ready = function() { observers() };

$(document).ready( ready );                  //... once document ready
$(document).ajaxComplete( ready );           //... once ajax is complete
$(document).on('turbolinks:load', ready );   //... once a link is clicked
// $(document).on('fields_added.nested_form_fields', ready);

$(document).on('turbolinks:before-cache', function() {

} );



$(document).on('ajax:error', function(e, xhr, status, error){
  toastr.error(error);
});





//FUNCTIONS:

function checkbox_observer () {
  $('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green',
    radioClass: 'iradio_square-green',
  });
}
