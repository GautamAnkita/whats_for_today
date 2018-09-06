const bcrypt  = require('bcrypt');
const hashedPassword = hashPassword('1234');

module.exports = [
    {
        first_name: 'Jon',
        last_name: 'Snow',
        date_of_birth: '1982-11-24',
        email: 'j@j.com',
        password_digest: hashedPassword,
        address_line1: '6-4533 Simon Blvd.',
        address_line2: '',
        city: 'Toronto',
        state: 'ON',
        country: 'Canada'
    },
    {
        first_name: 'Andy',
        last_name: 'Kim',
        date_of_birth: '1983-01-14',
        email: 'a@a.com',
        password_digest: hashedPassword,
        is_admin: true,
        address_line1: '23-343 Main St.',
        address_line2: '',
        city: 'Vancouver',
        state: 'BC',
        country: 'Canada'
    },
    {
        first_name: 'Will',
        last_name: 'Smith',
        date_of_birth: '1974-03-12',
        email: 'w@w.com',
        password_digest: hashedPassword,
        address_line1: '6-34 Smith St.',
        address_line2: '',
        city: 'Vancouver',
        state: 'BC',
        country: 'Canada'
    }
  ];

  function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  };