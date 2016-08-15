
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




//carga dinamica de archivos
function loadjscssfile(filename, filetype){
  if (filetype=="js"){ //if filename is a external JavaScript file
    var fileref=document.createElement('script')
    fileref.setAttribute("type","text/javascript")
    fileref.setAttribute("src", filename)
  }
  else if (filetype=="css"){ //if filename is an external CSS file
    var fileref=document.createElement("link")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
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
  loadjscssfile( "/js/i18n/" + load_lang + ".js", "js") //dynamically load and add this .js file
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


