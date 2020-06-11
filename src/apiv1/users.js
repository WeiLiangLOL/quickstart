const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const debug = require('debug')('quickstart:gateway-users');

const database = require('../../etc/sequelize').database;

/**
 * Get all users
 */
router.get('/', (req, res, next) => {
    database.users
        .findAll()
        .then((users) => {
            for (let user of users) delete user.dataValues.password_hash;
            res.send(users);
        })
        .catch((err) => {
            debug(err);
            res.status(500).send({ message: 'An error has occurred' });
        });
});

/**
 * Get one user
 */
router.get('/:id', (req, res, next) => {
    database.users
        .findByPk(req.params.id)
        .then((user) => {
            delete user.dataValues.password_hash;
            res.send(user);
        })
        .catch((err) => {
            debug(err);
            res.status(404).send({ message: 'User does not exist' });
        });
});

/**
 * Create user
 */
router.post('/', (req, res, next) => {
    let user = req.body;

    // Basic input check (short of validation)
    if (!user.username || !user.password || !user.firstname || !user.lastname) {
        return res.status(400).send({ message: 'Empty Fields' });
    }
    if (user.date_of_birth === '') delete user.date_of_birth;
    if (user.allow_login !== 'true') user.allow_login = 'false';

    // Hash incoming password
    bcrypt
        .hash(user.password, 12)
        .then((password_hash) => {
            delete user.password;
            user.password_hash = password_hash;

            // Send database query to create user
            return database.users.findOrCreate({
                where: { username: user.username },
                defaults: user,
            });
        })
        .then(([user, created]) => {
            if (!created) {
                return res.status(400).send({ message: 'Duplicate username' });
            }

            // Successfully created
            delete user.dataValues.password_hash; // Hide password hash from client
            res.status(201).send(user);
        })
        .catch((err) => {
            debug(err);
            res.status(500).send({ message: 'An error has occurred' });
        });
});

/**
 * Update user
 */
router.put('/', (req, res, next) => {
    // TODO: 501 unimplemented
    res.status(501).send();
});

/**
 * Delete user
 */
router.delete('/:id', (req, res, next) => {
    database.users
        .destroy({ where: { username: req.params.id } })
        .then((count) => {
            if (!count) {
                return res.status(404).send({ message: 'User not found' });
            }
            res.send({ message: `User with id '${req.params.id}' deleted` });
        })
        .catch((err) => {
            debug(err);
            res.status(500).send({ message: 'An error has occurred' });
        });
});

/**
 * Catch all other requests
 */
router.use((req, res, next) => {
    res.status(405).send({ message: 'An error has occurred' });
});

module.exports = router;
