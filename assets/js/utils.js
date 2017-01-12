
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





//ALERTS FUNCTION

bootstrap_alert = function() {};

bootstrap_alert.success = function(message, time) {
  $('#alert_placeholder').append('<div class="alert alert-success alert-dismissible fade in" style="" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <strong>Well done!</strong>' + ' ' + message + ' ' + '</div> </div>');
  $("html, body").animate({ scrollTop: 0 }, "slow");
  alertTimeout(time);
};
bootstrap_alert.info = function(message, time) {
  $('#alert_placeholder').append('<div class="alert alert-info alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <strong>Advice!</strong>' + ' ' + message + ' ' + '</div> </div>');
  $("html, body").animate({ scrollTop: 0 }, "slow");
  alertTimeout(time);
};

bootstrap_alert.warning = function(message, time) {
  $('#alert_placeholder').append('<div class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <strong>Warning!</strong>' + ' ' + message + ' ' + '</div> </div>');
  $("html, body").animate({ scrollTop: 0 }, "slow");
  alertTimeout(time);
};

bootstrap_alert.danger = function(message, time) {
  $('#alert_placeholder').append('<div class="alert alert-danger alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <strong>Ups!</strong>' + ' ' + message + ' ' + '</div> </div>');
  $("html, body").animate({ scrollTop: 0 }, "slow");
  alertTimeout(time);
};

function alertTimeout(wait){
  if (wait > 0){
    setTimeout(function(){
      $('#alert_placeholder').children('.alert:first-child').remove()
    }, wait);
  }
}


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

  var head = '<!DOCTYPE html><html lang="es"><head>  <title>RobotUI</title>  <!--STYLES-->  <link rel="stylesheet" href="/styles/bootstrap/bootstrap.css">  <link rel="stylesheet" href="/styles/bootstrap/bootstrap-theme.css">  <link rel="stylesheet" href="/styles/jasny-bootstrap/jasny-bootstrap.css">  <link rel="stylesheet" href="/styles/bootstrap-colorpicker/bootstrap-colorpicker.css">  <link rel="stylesheet" href="/styles/font-awesome/font-awesome.css">  <link rel="stylesheet" href="/styles/parsley/parsley.css">  <link rel="stylesheet" href="/styles/jquery-ui/jquery-ui.css">  <link rel="stylesheet" href="/styles/chosen/ImageSelect.css">  <link rel="stylesheet" href="/styles/chosen/chosen.min.css">  <link rel="stylesheet" href="/styles/importer.css">  <!--STYLES END-->  <!--SCRIPTS-->  <script src="/js/dependencies/sails.io.js"></script>  <script src="/js/vendor/jquery-2.2.4.js"></script>  <script src="/js/vendor/bootstrap.js"></script>  <script src="/js/vendor/chosen.jquery.js"></script>  <script src="/js/vendor/ImageSelect.jquery.js"></script>  <script src="/js/vendor/jasny-bootstrap.js"></script>  <script src="/js/vendor/bootstrap-colorpicker.js"></script>  <script src="/js/vendor/jquery-ui.js"></script>  <script src="/js/vendor/parsley.js"></script>  <script src="/js/i18n/de.js"></script>  <script src="/js/i18n/en.js"></script>  <script src="/js/i18n/es.js"></script>  <script src="/js/i18n/fr.js"></script>  <script src="/js/i18n/pt.js"></script>  <script src="/js/i18n/ru.js"></script>  <script src="/js/vendor/gridster.js"></script>  <script src="/js/utils.js"></script>  <script src="/js/customValidate.js"></script>  <!--SCRIPTS END--></head><body><div id="alert_placeholder"></div>'
  var foot = '</body></html><script type="text/javascript">  function savesocket() { io.socket.get("/session/saveSocketID");  }  addLoadEvent(savesocket);</script>'

  doc.open();
  doc.write(head);
  doc.write(div);
  doc.write(foot);

  doc.close();
}

