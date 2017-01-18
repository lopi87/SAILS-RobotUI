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

  action: {
    '*': ['flash', 'localize', 'sessionAuth','message'],
    update_position: ['userCanConfigureInterface']
  },

  event: {
    '*': ['flash', 'sessionAuth','message', 'localize'],
    update_position: ['userCanConfigureInterface']
  },

  icon: {
    '*': ['flash', 'sessionAuth', 'localize']
  },

  index:{
    '*': ['flash', 'localize']
  },

  interface: {
    '*': ['flash', 'sessionAuth', 'localize'],
    configure: ['userCanConfigureInterface'],
    show: ['userCanShowInterface'],
    view: ['userCanViewInterface']
  },

  language: {
    '*': ['flash', 'sessionAuth', 'localize'],
  },


  message: {
    '*': ['flash', 'sessionAuth', 'localize']
  },

  robot:{
    '*': ['flash', 'sessionAuth', 'message', 'localize'],
    delete_permission: ['UserCanEditRobot'],
    new_permissions: ['UserCanEditRobot'],
    show_permissions: ['UserCanEditRobot'],
    edit: ['UserCanEditRobot'],
    update: ['UserCanEditRobot'],
    destroy: ['UserCanEditRobot']
  },

  room: {
    '*': ['flash', 'sessionAuth', 'localize']
  },

  session: {
    create: ['flash', 'message', 'localize']
  },

  socket:{
    '*': ['flash', 'localize']
  },

  user: {
    '*': ['flash', 'localize', 'message'],
    show: ['sessionAuth','userCanSeeProfile'],
    edit: ['sessionAuth','userCanSeeProfile'],
    update: ['sessionAuth','userCanSeeProfile'],
    index: ['sessionAuth','isadmin' ],
    render: ['sessionAuth','sessionAuth', 'userCanSeeProfile'],
    destroy: ['sessionAuth','userCanSeeProfile']
  },

  video: {
    '*': ['flash','sessionAuth','message', 'localize'],
    update_position: ['userCanConfigureInterface']
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
