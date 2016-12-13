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

  '*': ["flash","localize","message"],


  user: {
    show: ["flash","sessionAuth", "userCanSeeProfile","message"],
    edit: ["flash","sessionAuth", "userCanSeeProfile","message"],
    update: ["flash","sessionAuth", "userCanSeeProfile","message"],
    index: ["sessionAuth", "isadmin","message","flash" ],
    render: ["flash","sessionAuth", "userCanSeeProfile","message"],
    destroy: ["flash","sessionAuth", "userCanSeeProfile","message"],
    create: ["message", "flash"]
  },

  action: {
    update_position: ["flash", "message","sessionAuth", "userCanConfigureInterface"]
  },

  event: {
    update_position: ["flash", "message","sessionAuth", "userCanConfigureInterface"]
  },

  video: {
    update_position: ["flash", "message","sessionAuth", "userCanConfigureInterface"]
  },

  robot:{
    create: ["flash", "message","sessionAuth", "localize"],
    index: ["flash", "message","sessionAuth", "localize"],
    delete_permission: ["flash", "message","sessionAuth", "localize", "UserCanEditRobot"],
    new_permissions: ["flash", "message","sessionAuth", "localize", "UserCanEditRobot"],
    show_permissions: ["flash", "message","sessionAuth", "localize", "UserCanEditRobot"],
    edit: ["flash", "message","sessionAuth", "localize", "UserCanEditRobot"],
    update: ["flash", "message","sessionAuth", "localize", "UserCanEditRobot"],
    destroy: ["flash", "message","sessionAuth", "localize", "UserCanEditRobot"],
    changetobusy: ["flash", "message","sessionAuth", "localize", "userCanShowInterface"],
    show: ["flash", "message","sessionAuth", "localize"],
    robot_subscribe: ["flash", "message","sessionAuth"]
  },

  session: {
    create: ["flash", "message", "localize"],
    '*': ["flash", "message", "localize"]
  },


  message: {
    index: ["flash", "message","sessionAuth"],
    send: ["flash", "message","sessionAuth"],
    new: ["flash", "message","sessionAuth"],
    show: ["flash", "message","sessionAuth"],
    destroy: ["flash", "message","sessionAuth"],
    '*': ["flash", "message","sessionAuth"]
  },

  index:{
    index: ["flash", "message", "localize"]
  },

  interface: {
    configure: ["flash", "message","sessionAuth", "userCanConfigureInterface"],
    show: ["flash", "sessionAuth", "message", "userCanShowInterface"],
    view: ["flash", "message","sessionAuth", "userCanViewInterface"]
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
