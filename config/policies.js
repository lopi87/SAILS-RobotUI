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

  '*': ['flash', 'localize'],


  user: {
    '*': ['flash','localize','message'],
    show: ['sessionAuth','userCanSeeProfile','message'],
    edit: ['sessionAuth','userCanSeeProfile','message'],
    update: ['sessionAuth','userCanSeeProfile','message'],
    index: ['sessionAuth','isadmin','message','flash' ],
    render: ['sessionAuth','sessionAuth', 'userCanSeeProfile','message'],
    destroy: ['sessionAuth','userCanSeeProfile','message']
  },

  action: {
    '*': ['sessionAuth', 'flash','localize','message'],
    update_position: ['userCanConfigureInterface']
  },

  event: {
    '*': ['sessionAuth', 'flash','localize','message'],
    update_position: ['userCanConfigureInterface']
  },

  video: {
    '*': ['sessionAuth', 'flash','localize','message'],
    update_position: ['userCanConfigureInterface']
  },

  robot:{
    '*': ['sessionAuth', 'flash','localize','message'],
    delete_permission: ['UserCanEditRobot'],
    new_permissions: ['UserCanEditRobot'],
    show_permissions: ['UserCanEditRobot'],
    edit: ['UserCanEditRobot'],
    update: ['UserCanEditRobot'],
    destroy: ['UserCanEditRobot']
  },

  session: {
    create: ['flash', 'message', 'localize']
  },


  message: {
    '*': ['sessionAuth', 'flash','localize','message']
  },

  index:{
    '*': ['flash','localize','message']
  },

  interface: {
    '*': ['sessionAuth', 'flash','localize','message'],
    configure: ['userCanConfigureInterface'],
    show: ['userCanShowInterface'],
    view: ['userCanViewInterface']
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
