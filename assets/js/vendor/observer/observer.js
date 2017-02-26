// Observers


//In here is where the different observers functions are added to execute them.
function observers () {
  checkbox_observer();
  summernote_observer();
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



function summernote_observer() {
  $('.summernote').summernote({
    height: null,                 // set editor height
    minHeight: null,             // set minimum height of editor
    maxHeight: null,             // set maximum height of editor
    focus: true                  // set focus to editable area after initializing summernote
  });
}

//FUNCTIONS:

function checkbox_observer () {
  $('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green',
    radioClass: 'iradio_square-green',
  });
}
