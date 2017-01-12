/**
 * Sails Seed Settings
 * (sails.config.seeds)
 *
 * Configuration for the data seeding in Sails.
 *
 * For more information on configuration, check out:
 * http://github.com/frostme/sails-seed
 */
module.exports.seeds = {

  user: {
    data: [
      {
        id: "584b0f35a3f0ac26181cd642",
        name: "m",
        email: "er_lope@hotmail.com",
        language: "es",
        admin: true,
        online: false,
        password: '12345678',
        confirmation: '12345678',
        avatarUrl: "/images/avatar/avatar.png",
        encryptedPassword: "$2a$10$ISyLb32.j/TE8VkMDmfJGeHu5o/aI3sddapt/GGzea.4KWuKGUeRC",
        onLine: true,
        latitude: 0
      },
      {
        id: "58505b0fe2916f2b18a48a04",
        name: "Manuel",
        email: "lopez.urbina.manuel@gmail.com",
        language: "es",
        admin: false,
        online: false,
        password: '12345678',
        confirmation: '12345678',
        avatarUrl: "/images/avatar/avatar.png",
        encryptedPassword: "$2a$10$dHF2BWMtfQww0sx696ZCQeEHn6nR1nbLVkYBh8I38xCiYaCyiDxuO",
        latitude: 0
       }
    ],
  },

  robot:{
    data: [
      {
        id: "584f03efd5e35f4a1e727874",
        name: 'RC Car',
        description: 'Radio control F1',
        ipaddress: '192.168.1.1',
        port: 2222,
        owner: "584b0f35a3f0ac26181cd642",
        public_drive: true,
        public_view: true,
        busy: false,
        down: true,
        avatarUrl: '/uploads/robot_avatar/584f03efd5e35f4a1e727874.jpg',
        robot_interface: "584f03efd5e35f4a1e727875"
      },
      {
        id: "584f04dbd5e35f4a1e72787b",
        name: "F1 Renault",
        description: "F1 Renault Alonso Radio control",
        ipaddress: "192.168.1.1",
        port: 3434,
        owner: "584b0f35a3f0ac26181cd642",
        public_drive: true,
        public_view: true,
        busy: false,
        down: true,
        avatarUrl: "/uploads/robot_avatar/584f04dbd5e35f4a1e72787b.jpg",
        robot_interface: "584f04dbd5e35f4a1e72787c"
      },
      {
        id: "584f05aed5e35f4a1e727887",
        name: "SRV Surveyor",
        description: "SRV-1 Robot",
        ipaddress: "192.168.1.1",
        port: 2323,
        owner: "584b0f35a3f0ac26181cd642",
        public_drive: true,
        public_view: true,
        busy: false,
        down: true,
        avatarUrl: "/uploads/robot_avatar/584f05aed5e35f4a1e727887.jpg",
        robot_interface: "584f05aed5e35f4a1e727888"
      }
    ],
  },


  interface:{
    data: [
      {
        id: "584f03efd5e35f4a1e727875",
        robot_owner: "584f03efd5e35f4a1e727874",
        panel_sizex: 200,
        panel_sizey: 200
      },
      {
        id: "584f04dbd5e35f4a1e72787c",
        robot_owner: "584f04dbd5e35f4a1e72787b",
        panel_sizex: 200,
        panel_sizey: 200
      },
      {
        id: "584f05aed5e35f4a1e727888",
        robot_owner: "584f05aed5e35f4a1e727887",
        panel_sizex: 200,
        panel_sizey: 200
      }

    ],
  }

};
