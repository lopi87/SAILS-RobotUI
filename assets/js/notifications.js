/**
 * Created by manuel on 25/02/17.
 */

//ALERTS FUNCTION

//TOASTR

toast = function() {};

toast.success = function(message) {
  toastr.success('RobotUI', message);
};
toast.info = function(message) {
  toastr.info('RobotUI', message);
};

toast.warning = function(message) {
  toastr.warning('RobotUI', message);
};

toast.danger = function(message) {
  toastr.error('RobotUI', message);
};


//BOOTSTARP NOTIFICATION DEPRECATED
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
