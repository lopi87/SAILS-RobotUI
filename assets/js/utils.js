
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
  $("#error_panel").addClass('hidden');
  $("#errors_container").html('');
  $('#uimodal').html(title);
  $("#container").html(data);
}

function openEditModal(title, data, text){
  $("#errors_container").html('');
  $('#uimodal').html(title);
  $("#container").html(data);
  $("#btn_action_modal").html(text);
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
function change_connect_btn( mode, text_btn){
  if (mode == 'connect'){
    $("#connect").replaceWith("<button  id=\"connect\" type=\"button\" class=\"marginlef10 btn btn-sm btn-success\">" + text_btn + "</button>");
  } else {
    $("#connect").replaceWith("<button  id=\"connect\" type=\"button\" class=\"marginlef10 btn btn-sm btn-danger\">" + text_btn + "</button>");
  }
}


//CAMBIAR IMAGEN ESTADO
function change_img_state(id, boolean, connect_text, disconnect_text){
  var img_id = '#img_state_' + id;
  var img_on= "online.png";
  var img_off= "offline.png";
  var src = $(img_id).attr("src");

  if (boolean){
    src = src.replace(img_off, img_on);
    $(img_id).attr("src", src);
    $("#connect_btn").html("<button id=\"connect_btn\" type=\"button\" class=\"btn btn-sm btn-success\">" + connect_text + "</button>");
  }else{
    src = src.replace(img_on,img_off);
    $(img_id).attr("src", src);
    $("#connect_btn").html("<button id=\"connect_btn\" type=\"button\" class=\"btn btn-sm btn-danger\">" + disconnect_text + "</button>");
  }
}

function change_img_busy(id, boolean, free_text, busy_text){
  var label_id = '#label_state_' + id;
  if (boolean){
      $(label_id).replaceWith("<span id=\"" + label_id + "\" class=\"label label-pill label-danger \">" + busy_text + "</span>");
  }else{
      $(label_id).replaceWith("<span id=\"" + label_id + "\" class=\"label label-pill label-success \">" + free_text + "</span>");
  }
}


//CAMBIAR FREE BUSY ROBOT
function set_actions(id, busy, online){
  var btn_tconfig = '#btn_tconfigure_'+ id;
  var btn_tcontrol =  '#btn_tcontrol_'+ id;
  var btn_tview =  '#btn_tview_'+ id;

  if(online && busy){
    $(btn_tconfig).addClass('disabled');
    $(btn_tview).removeClass('disabled');
    $(btn_tcontrol).addClass('disabled');
  }

  if(online && !busy){
    $(btn_tconfig).addClass('disabled');
    $(btn_tview).addClass('disabled');
    $(btn_tcontrol).removeClass('disabled');
  }

  if(!online){
    $(btn_tconfig).removeClass('disabled');
    $(btn_tview).addClass('disabled');
    $(btn_tcontrol).addClass('disabled');
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
      $("#content_slider_" + id).attr("onclick", fn);
    });
    $("[id^=event_]").each( function( ){
      $( this ).attr('data-toggle', '');
      $( this ).attr('data-target', '');
      var id = $( this ).attr('id').replace('event_','');
      fn = "ajax_destroy_call('/event/destroy/" + id + "')";
      $("#event_" + id).attr("onclick", fn);
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
      $("#content_slider_" + id).attr("onclick", fn);
    });
    $("[id^=event_]").each( function( ){
      $( this ).attr('data-toggle', 'modal');
      $( this ).attr('data-target', '#writeModal');
      id = $( this ).attr('id').replace('event_','');
      fn = "ajax_call('/event/edit/" + id + "','event')";
      $("#event_" + id).attr("onclick", fn);
    });

  }else{
    off_click_events();
  }
}


function off_click_events() {
  $("[id^=play_]").removeAttribute("onclick");
  $("[id^=button_]").removeAttribute("onclick");
  $("[id^=content_slider_]").removeAttribute("onclick");
  $("[id^=event_]").removeAttribute("onclick");
}



function disable_menu(){
  $("[id^=new_]").addClass('disabled');
  remove_events( $("[id^=new_]") );
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

  remove_events( $("[id^=play_]") );
  remove_events( $("[id^=button_]") );
  remove_events( $("[id^=content_slider_]") );
  remove_events( $("[id^=event_]") );
}


function remove_events( ids ){
  ids.removeAttr('data-toggle').removeAttr('data-target').removeAttr('onclick');
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

function reset_canvas(id){
  var canvas = document.getElementById(id);
  var context = canvas.getContext('2d');
  var imageObj = new Image();
  imageObj.src = '/images/video/video.png';
  imageObj.onload = function(){
    context.drawImage(imageObj,0,0,context.width,context.height);
  };
}


function show_errors(errors){
  $("#errors_container").html('<p>' + errors + '</p>');
  $("#error_panel").removeClass('hidden');
  toastr.error(errors, 'RobotUI');
}


function show_success(success){
  toastr.info(success, 'RobotUI');
}


function enable_colorform(){
  if($("#custom").is(':checked')) {
    $('#colorform').show();
  } else {
    $('#colorform').hide();
  }
}

