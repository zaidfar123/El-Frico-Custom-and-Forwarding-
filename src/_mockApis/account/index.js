// third-party
import jwt from 'jsonwebtoken';

// project imports
import services from 'utils/mockAdapter';
import { JWT_API } from 'config';

// constant
const JWT_SECRET = JWT_API.secret;
const JWT_EXPIRES_TIME = JWT_API.timeout;

const delay = (timeout) => new Promise((res) => setTimeout(res, timeout));

let users = [
    {
        id: 1,
        email: 'filer',
        password: '1',
        name: 'Ali Ahmed',
        role: 'Filer'
    },
    {
        id: 2,
        email: 'verifier1',
        password: '1',
        name: 'Shahid Khan',
        role : 'Verifier1'
    },
    {
        id: 3,
        email: 'verifier2',
        password: '1',
        name: 'Aslam Mehmood',
        role : 'Verifier2'
    },
    {
        id:4,
        email: 'approver',
        password: '1',
        name: 'Azlaan Ahmed',
        role: 'Approver'
    }
];

// ==============================|| MOCK SERVICES ||============================== //

services.onPost('/api/account/login').reply(async (request) => {
    try {
        await delay(500);

        const { email, password } = JSON.parse(request.data);

        if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
            const localUsers = window.localStorage.getItem('users');
            users = JSON.parse(localUsers);
        }

        const user = users.find((_user) => _user.email === email);

        if (!user) {
            return [400, { message: 'Verify Your Email & Password' }];
        }

        if (user.password !== password) {
            return [400, { message: 'Invalid Password' }];
        }

        const serviceToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_TIME });

        return [
            200,
            {
                serviceToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }
        ];
    } catch (err) {
        console.error(err);
        return [500, { message: 'Server Error' }];
    }
});

services.onPost('/api/account/register').reply(async (request) => {
    try {
        await delay(500);

        const { id, email, password, firstName, lastName } = JSON.parse(request.data);

        if (!email || !password) {
            return [400, { message: 'Enter Your Email & Password' }];
        }

        if (!firstName || !lastName) {
            return [400, { message: 'Enter Your Name' }];
        }

        users = [
            ...users,
            {
                id,
                email,
                password,
                name: `${firstName} ${lastName}`
            }
        ];

        return [200, users];
    } catch (err) {
        console.error(err);
        return [500, { message: 'Server Error' }];
    }
});

services.onGet('/api/account/me').reply((request) => {
    try {
        const { Authorization } = request.headers;

        if (!Authorization) {
            return [401, { message: 'Token Missing' }];
        }

        if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
            const localUsers = window.localStorage.getItem('users');
            users = JSON.parse(localUsers);
        }

        const serviceToken = Authorization.toString();
        const jwData = jwt.verify(serviceToken, JWT_SECRET);
        const { userId } = jwData;
        const user = users.find((_user) => _user.id === userId);

        if (!user) {
            return [401, { message: 'Invalid Token' }];
        }

        return [
            200,
            {
                user: {
                    id: user.id,
                    email: user.email
                }
            }
        ];
    } catch (err) {
        return [500, { message: 'Server Error' }];
    }
});
