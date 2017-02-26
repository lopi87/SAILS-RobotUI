
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

//Apertura de una ventana

//Open the interface in a new window
function openWin(width, height, content) {
  var div = document.getElementById(content).outerHTML;
  var myWindow = window.open('', '', 'width=' + width ,'height=' + height);
  var doc = myWindow.document;

  var head = '<!DOCTYPE html><html lang="es"><head>  <title>RobotUI</title>  <!--STYLES-->  <link rel="stylesheet" href="/styles/bootstrap/bootstrap.css">  <link rel="stylesheet" href="/styles/bootstrap/bootstrap-theme.css">  <link rel="stylesheet" href="/styles/jasny-bootstrap/jasny-bootstrap.css">  <link rel="stylesheet" href="/styles/bootstrap-colorpicker/bootstrap-colorpicker.css">  <link rel="stylesheet" href="/styles/font-awesome/font-awesome.css">  <link rel="stylesheet" href="/styles/parsley/parsley.css">  <link rel="stylesheet" href="/styles/jquery-ui/jquery-ui.css">  <link rel="stylesheet" href="/styles/chosen/ImageSelect.css">  <link rel="stylesheet" href="/styles/chosen/chosen.min.css">  <link rel="stylesheet" href="/styles/importer.css">  <!--STYLES END-->  <!--SCRIPTS-->  <script src="/js/dependencies/sails.io.js"></script>  <script src="/js/vendor/jquery-2.2.4.js"></script>  <script src="/js/vendor/bootstrap.js"></script>  <script src="/js/vendor/chosen.jquery.js"></script>  <script src="/js/vendor/ImageSelect.jquery.js"></script>  <script src="/js/vendor/jasny-bootstrap.js"></script>  <script src="/js/vendor/bootstrap-colorpicker.js"></script>  <script src="/js/vendor/jquery-ui.js"></script>  <script src="/js/vendor/parsley.js"></script>  <script src="/js/i18n/de.js"></script>  <script src="/js/i18n/en.js"></script>  <script src="/js/i18n/es.js"></script>  <script src="/js/i18n/fr.js"></script>  <script src="/js/i18n/pt.js"></script>  <script src="/js/i18n/ru.js"></script>  <script src="/js/vendor/gridster.js"></script>  <script src="/js/utils.js"></script> <!--SCRIPTS END--></head><body><div id="alert_placeholder"></div>'
  var foot = '</body></html><script type="text/javascript">  function savesocket() { io.socket.get("/session/saveSocketID");  }  addLoadEvent(savesocket);</script>'

  doc.open();
  doc.write(head);
  doc.write(div);
  doc.write(foot);

  doc.close();
}
















function setting_panel_mode( mode ){
  var menu_button = $('#action_' + mode );
  var was_active = menu_button.hasClass('active');
  $('[id^=action_]').removeClass('active');

  if ( was_active ){
    on_off_action( mode , 'off');
  } else {
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
  if (state == 'on'){
    $("[id^=play_]").each( function( ){
      $( this ).attr('data-toggle', '');
      $( this ).attr('data-target', '');
      var id = $( this ).attr('id').replace('play_','');
      $("#play_" + id).click(function( ){ ajax_destroy_call('/video/destroy/' + id ); });
    });
    $("[id^=button_]").each( function( ){
      $( this ).attr('data-toggle', '');
      $( this ).attr('data-target', '');
      var id = $( this ).attr('id').replace('button_','');
      $("#button_" + id).click(function( ){ ajax_destroy_call('/action/destroy/' + id ); });
    });
    $("[id^=slider_]").each( function( ){
      $( this ).attr('data-toggle', '');
      $( this ).attr('data-target', '');
      var id = $( this ).attr('id').replace('slider_','');
      $("#slider_" + id).click(function(){ ajax_destroy_call('/slider/destroy/' + id ); });
    });
  }else{
    off_click_events();
  }
}


function edit_mode( state ){
  var id;

  if (state == 'on'){
    $("[id^=play_]").each( function( ){
      $( this ).attr('data-toggle', 'modal');
      $( this ).attr('data-target', '#writeModal');
      id = $( this ).attr('id').replace('play_','');
      $("#play_" + id).click(function( ){ ajax_call('/video/edit/' + id, 'video');});
    });
    $("[id^=button_]").each( function( ){
      $( this ).attr('data-toggle', 'modal');
      $( this ).attr('data-target', '#writeModal');
      id = $( this ).attr('id').replace('button_','');
      $("#button_" + id).click(function( ){ ajax_call('/action/edit/' + id, 'button');});
    });
    $("[id^=slider_]").each( function( ){
      $( this ).attr('data-toggle', 'modal');
      $( this ).attr('data-target', '#writeModal');
      id = $( this ).attr('id').replace('slider_','');
      $("#slider_" + id).click(function( ){ ajax_call('/slider/edit/' + id, 'slider');});
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
  $("[id^=new_]").addClass( "disabled" );
  $("[id^=new_]").prop('onclick',null).off('click');
  interact('.draggable').draggable(false);
  alert('DISABLE');
}


function enable_menu(){
  $("[id^=new_]").removeClass( "disabled" );
  $("[id^=new_]").prop('onclick',null).on('click');
  interact('.draggable').draggable(true);
  alert('ENABLE');
}



//
// var canvas = document.createElement("canvas");
// canvas.width = 24;
// canvas.height = 24;
// document.body.appendChild(canvas);
// var ctx = canvas.getContext("2d");
// ctx.fillStyle = "#000000";
// ctx.font = "24px FontAwesome";
// ctx.textAlign = "center";
// ctx.textBaseline = "middle";
// ctx.fillText("\uf047", 12, 12);
// var dataURL = canvas.toDataURL('image/png');
// $('body').css('cursor', 'url('+dataURL+'), auto');
