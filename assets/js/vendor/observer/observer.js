// Observers


//In here is where the different observers functions are added to execute them.
function observers () {
  checkbox_observer();
  summernote_observer();
  colorpicker_observer();
}



// ready is a function that starts the observers function...
var ready = function() { observers() };

$(document).ready( ready );                  //... once document ready
$(document).ajaxComplete( ready );           //... once ajax is complete


// $(document).on('ajax:error', function(e, xhr, status, error){
//   toastr.error(error);
//   alert('ERROR!');
// });
//
// $(document).on('ajax:success', function(e, xhr, status, success){
//   toastr.info(success);
//   alert('SUCCESS');
// });

//FUNCTIONS:

function summernote_observer() {
    $('.summernote').summernote({
    height: null,                // set editor height
    minHeight: 300,              // set minimum height of editor
    maxHeight: null,             // set maximum height of editor
    focus: true                  // set focus to editable area after initializing summernote
  });
}

function checkbox_observer() {
  $('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green',
    radioClass: 'iradio_square-green'
  });
}

function colorpicker_observer() {
  $('.colorpicker-component').colorpicker({format: 'hex'});
}
