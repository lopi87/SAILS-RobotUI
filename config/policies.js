/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  '*' : 'flash',

  action:{
    '*': ['flash', 'localize', 'sessionAuth','message'],
    update_position: ['flash', 'localize', 'sessionAuth','message', 'userCanConfigureInterface']
  },

  event:{
    '*': ['flash', 'sessionAuth','message', 'localize'],
    update_position: ['flash', 'localize', 'sessionAuth','message', 'userCanConfigureInterface' ]
  },

  icon:{
    '*': ['flash', 'sessionAuth', 'localize', 'message']
  },

  index:{
    '*': ['flash', 'localize', 'flash', 'message']
  },

  interface:{
    '*': ['flash', 'sessionAuth','message', 'localize'],
    configure: ['flash', 'sessionAuth','message', 'localize', 'userCanConfigureInterface'],
    show: ['flash', 'sessionAuth','message', 'localize', 'userCanShowInterface'],
    view: ['flash', 'sessionAuth','message', 'localize', 'userCanViewInterface']
  },

  language: {
    '*': ['flash', 'localize']
  },


  message:{
    '*': ['flash', 'sessionAuth', 'localize','message'],
    new: ['flash', 'sessionAuth', 'localize','message'],
    send: ['flash', 'sessionAuth', 'localize','message'],
    destroy: ['flash', 'sessionAuth', 'localize','message', 'messagePermissions'],
    show: ['flash', 'sessionAuth', 'localize','message', 'messagePermissions'],
    markasread: ['flash', 'sessionAuth', 'localize','message', 'messagePermissions'],
    index: ['flash', 'sessionAuth', 'localize','message']
  },

  robot:{
    '*': ['flash', 'sessionAuth', 'message', 'localize'],
    delete_permission: ['flash', 'sessionAuth','message', 'localize', 'UserCanEditRobot'],
    new_permissions: ['flash', 'sessionAuth','message', 'localize', 'UserCanEditRobot'],
    show_permissions: ['flash', 'sessionAuth','message', 'localize', 'UserCanEditRobot'],
    edit: ['flash', 'sessionAuth','message', 'localize', 'UserCanEditRobot'],
    update: ['flash', 'sessionAuth','message', 'localize', 'UserCanEditRobot'],
    destroy: ['flash', 'sessionAuth','message', 'localize', 'UserCanEditRobot']
  },

  room:{
    '*': ['flash', 'sessionAuth', 'localize']
  },

  session:{
    create: ['flash', 'message', 'localize']
  },

  slider:{
    '*': ['flash', 'localize', 'sessionAuth','message'],
    update_position: ['flash', 'localize', 'sessionAuth','message', 'userCanConfigureInterface']
  },

  socket:{
    '*': ['flash', 'localize']
  },

  user:{
    '*': ['flash', 'localize', 'message'],
    show: ['flash', 'localize', 'message', 'sessionAuth','userCanSeeProfile'],
    edit: ['flash', 'localize', 'message', 'sessionAuth','userCanSeeProfile'],
    update: ['flash', 'localize', 'message', 'sessionAuth','userCanSeeProfile'],
    index: ['flash', 'localize', 'message', 'sessionAuth','isadmin' ],
    render: ['flash', 'localize', 'message', 'sessionAuth','sessionAuth', 'userCanSeeProfile'],
    destroy: ['flash', 'localize', 'message', 'sessionAuth','userCanSeeProfile']
  },

  video:{
    '*': ['flash','sessionAuth','message', 'localize'],
    update_position: ['flash', 'localize', 'message', 'userCanConfigureInterface']
  }


  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
	// RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		// '*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy
		// (this overrides `false` above)
		// nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		// feed : ['isNiceToAnimals', 'hasRabbitFood']
	// }
};
