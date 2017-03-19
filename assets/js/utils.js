
//Uso de multiples llamadas window.onload
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}


//Modals
function closeModal() {
  $("#errors_container").html('');
  $('.modal').modal('hide');
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();
}

function openModal(title, data){
  $("#errors_container").html('');
  $('#myModalLabel').html(title);
  $("#container").html(data);
}

//carga dinamica de archivos js, css, ...
function loadjscssfile(filename, filetype){
  var fileref;
  if (filetype=="js"){ //if filename is a external JavaScript file
    fileref=document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", filename)
  }
  else if (filetype=="css"){ //if filename is an external CSS file
    fileref=document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename)
  }
  if (typeof fileref!="undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref)
}

//loadjscssfile("myscript.js", "js") //dynamically load and add this .js file
//loadjscssfile("javascript.ejs", "js") //dynamically load "javascript.ejs" as a JavaScript file
//loadjscssfile("mystyle.css", "css") ////dynamically load and add this .css file




//Parsley functions
function set_parsley_lang(load_lang) {
  loadjscssfile( "/js/i18n/" + load_lang + ".js", "js"); //dynamically load and add this .js file
}

window.Parsley.addValidator('filemaxmegabytes', {
  validateString: function(_value, maxSize, parsleyInstance) {
    if (!window.FormData) {
      alert('You are making all developpers in the world cringe. Upgrade your browser!');
      return true;
    }
    var files = parsleyInstance.$element[0].files;
    return files.length != 1  || files[0].size <= maxSize * 1024;
  },
  requirementType: 'integer',
  messages: {
    es: 'Este archivo no debe ser mayor que %s kb',
    en: 'This file should not be larger than %s Kb',
    fr: "Ce fichier est plus grand que %s Kb."
  }
});


window.Parsley.addValidator('filemimetypes', {
  requirementType: 'string',
  validateString: function (value, requirement, parsleyInstance) {

    if (!window.FormData) {
      alert('You are making all developpers in the world cringe. Upgrade your browser!');
      return true;
    }

    var file = parsleyInstance.$element[0].files;

    if (file.length == 0) {
      return true;
    }

    var allowedMimeTypes = requirement.replace(/\s/g, "").split(',');
    return allowedMimeTypes.indexOf(file[0].type) !== -1;

  },
  messages: {
    es: 'Extension de archivo no permitida',
    en: 'File mime type not allowed'
  }
});


//Utils

//CAMBIAR IMAGEN ESTADO
function change_img_state(id, boolean){
  var img_id = '#img_state_' + id;
  var img_on= "online.png";
  var img_off= "offline.png";
  var src = $(img_id).attr("src");

  if (boolean){
    src = src.replace(img_off, img_on);
    $(img_id).attr("src", src);
  }else{
    src = src.replace(img_on,img_off);
    $(img_id).attr("src", src);
  }
}

//CAMBIAR FREE BUSY ROBOT
function change_free_busy(id, busy){
  var label_id = '[id="label_state_'+ id + '"]';
  var label_free= '<span class="label label-pill label-success"> Free </span>';
  var label_busy= '<span class="label label-pill label-danger"> Busy </span>';

  var btn_config = '[id="btn_config_'+ id + '"]';
  var btn_tcontrol =  '[id="btn_tcontrol_'+ id + '"]';
  var btn_view =  '[id="btn_view_'+ id + '"]';


  if (busy){
    $(label_id).html(label_busy);

    $(btn_config).addClass('hidden');
    $(btn_view).removeClass('hidden');
    $(btn_tcontrol).addClass('hidden');

  }else{
    $(label_id).html(label_free);

    $(btn_config).removeClass('hidden');
    $(btn_view).addClass('hidden');
    $(btn_tcontrol).removeClass('hidden');
  }
}

//CAMBIAR ONLINE OFFLINE ROBOT
function change_online_offline(id, online){
  var label_id = '[id="label_online_'+ id + '"]';
  var label_online= '<span class="label label-pill label-success"> Online </span>';
  var label_offline= '<span class="label label-pill label-danger"> Offline </span>';


  if (online) {
    $(label_id).html(label_online);
  }else{
    $(label_id).html(label_offline);
  }

}












//modes: 'create', 'edit' and 'delete'
function setting_panel_mode( mode ){
  var menu_button = $('#action_' + mode );
  var was_enabled = menu_button.hasClass('active');
  $('[id^=action_]').removeClass('active');

  if ( was_enabled ){
    //turn off
    on_off_action( mode , 'off');
  } else {
    //turn on
    menu_button.addClass('active');
    on_off_action( mode, 'on' )
  }
}


function on_off_action( mode, state ){

  switch ( mode ){
    case 'create':
      if (state == 'on') {
        enable_menu();
      }
    break;
    case 'delete':
      if (state == 'on') {
        disable_menu();
        destroy_mode('on');
      }
    break;
    case 'edit':
      if (state == 'on') {
        disable_menu();
        edit_mode('on');
      }
    break;
  }
}


function destroy_mode(state){
  var fn;
  if (state == 'on'){
    $("[id^=play_]").each( function( ){
      $( this ).attr('data-toggle', '');
      $( this ).attr('data-target', '');
      var id = $( this ).attr('id').replace('play_','');
      fn = "ajax_destroy_call('/video/destroy/" + id + "')";
      $("#play_" + id).attr("onclick", fn);
    });
    $("[id^=button_]").each( function( ){
      $( this ).attr('data-toggle', '');
      $( this ).attr('data-target', '');
      var id = $( this ).attr('id').replace('button_','');
      fn = "ajax_destroy_call('/action/destroy/" + id + "')";
      $("#button_" + id).attr("onclick", fn);
    });
    $("[id^=slider_]").each( function( ){
      $( this ).attr('data-toggle', '');
      $( this ).attr('data-target', '');
      var id = $( this ).attr('id').replace('slider_','');
      fn = "ajax_destroy_call('/slider/destroy/" + id + "')";
      $("#slider_" + id).attr("onclick", fn);
    });
  }else{
    off_click_events();
  }
}


function edit_mode( state ){
  var id, fn;

  if (state == 'on'){
    $("[id^=play_]").each( function( ){
      $( this ).attr('data-toggle', 'modal');
      $( this ).attr('data-target', '#writeModal');
      id = $( this ).attr('id').replace('play_','');
      fn = "ajax_call('/video/edit/" + id + "','video')";
      $("#play_" + id).attr("onclick", fn);
    });
    $("[id^=button_]").each( function( ){
      $( this ).attr('data-toggle', 'modal');
      $( this ).attr('data-target', '#writeModal');
      id = $( this ).attr('id').replace('button_','');
      fn = "ajax_call('/action/edit/" + id + "','action')";
      $("#button_" + id).attr("onclick", fn);
    });
    $("[id^=slider_]").each( function( ){
      $( this ).attr('data-toggle', 'modal');
      $( this ).attr('data-target', '#writeModal');
      id = $( this ).attr('id').replace('slider_','');
      fn = "ajax_call('/slider/edit/" + id + "','slider')";
      $("#slider_" + id).attr("onclick", fn);
    });
  }else{
    off_click_events();
  }
}


function off_click_events() {
  $("[id^=play_]").removeAttribute("onclick");
  $("[id^=button_]").removeAttribute("onclick");
  $("[id^=slider_]").removeAttribute("onclick");
}



function disable_menu(){
  $("[id^=new_]").addClass('disabled');
  $("[id^=new_]").removeAttr('data-toggle');
  $("[id^=new_]").removeAttr('data-target');
  $("[id^=new_]").removeAttr('onclick');
  interact('.draggable').draggable(false);
}


function enable_menu(){
  var fn;
  $("[id^=new_]").removeClass( "disabled" );
  $("[id^=new_]").attr('data-toggle', 'modal');
  $("[id^=new_]").attr('data-target', '#writeModal');

  fn = "ajax_call('/video/create/','video')";
  $("#new_video").attr("onclick", fn);

  fn = "ajax_call('/event/create/','event')";
  $("#new_event").attr("onclick", fn);

  fn = "ajax_call('/slider/create/','slider')";
  $("#new_slider").attr("onclick", fn);

  fn = "ajax_call('/action/create/','action')";
  $("#new_action").attr("onclick", fn);

  fn = "ajax_call('/icon/create/','icon')";
  $("#new_icon").attr("onclick", fn);

  interact('.draggable').draggable(true);
}


function draw_image_to_canvas(id, data){
  var canvas = document.getElementById(id);
  var context = canvas.getContext('2d');
  var imageObj = new Image();
  imageObj.src = "data:image/jpeg;base64,"+data;
  imageObj.onload = function(){
    context.height = imageObj.height;
    context.width = imageObj.width;
    context.drawImage(imageObj,0,0,context.width,context.height);
  }
}


//MESSAGES
// Update num new msg
function update_num_msg(text){
  var num_msg = document.getElementById('msg_new').innerHTML.replace('+','');
  num_msg--;
  if(num_msg == 0) {
    $('#buttom_msg').html('<a href="/message/index">' + text + '<spam id="msg_new"></spam></a>');
  } else {
    $('#buttom_msg').html('<a href="/message/index">' + text + '  ' + '<span id="msg_new" class="label label-pill label-danger">' + '+' + num_msg + '</span></a>');
  }
}

function new_msg_num_update(text){
  var num_msg = document.getElementById('msg_new').innerHTML.replace('+','');
  if (document.getElementById('msg_new').innerHTML == ''){
    num_msg = 1;
  }else{
    num_msg++;
  }

  $('#buttom_msg').html('<a href="/message/index">' + text + '   ' + '<span id="msg_new" class="label label-pill label-danger">' + '+' + num_msg + '</span></a>');

}

function change_eye_icon(id){
  var env_id = '#env_' + id;
  $(env_id).html('<i class="fa fa-eye fa-2x" aria-hidden="true"></i>');
  var read_btn = '#mark_read_btn_' + id;
  $(read_btn).remove();
}
