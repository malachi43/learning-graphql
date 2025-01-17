const Person = require("../models/person");
const User = require("../models/user");
const { GraphQLError } = require('graphql');
const jwt = require("jsonwebtoken");
const resolvers = {
    Query: {
        personCount: async () => Person.countDocuments(),
        allPersons: async () => Person.find({}),
        findPerson: async (root, args) => Person.find({ name: args.name }),
        allUsers: async () => User.find({}),
        me: (_root, _args, context) => context.currentUser
    },
    Person: {
        address: (root) => {
            return {
                city: root.city,
                street: root.street
            }
        }
    },
    Mutation: {
        addPerson: async (root, args, { currentUser }) => {
            try {
                if (!currentUser) throw new GraphQLError("not authenticated", {
                    extensions: {
                        code: "BAD_REQUEST",
                    }
                })
                const person = new Person({ ...args });
                currentUser.friends = currentUser.friends.concat(person);
                await currentUser.save();
                return person.save();
            } catch (error) {
                throw error
            }

        },
        addAsFriend: async (root, args, { currentUser }) => {
            const isFriend = (person) =>
                currentUser.friends.map(f => f._id.toString()).includes(person._id.toString())

            if (!currentUser) {
                throw new GraphQLError('wrong credentials', {
                    extensions: { code: 'BAD_USER_INPUT' }
                })
            }

            const person = await Person.findOne({ name: args.name })
            if (!isFriend(person)) {
                currentUser.friends = currentUser.friends.concat(person);
            }

            await currentUser.save()

            return currentUser
        },
        editNumber: async (root, args) => {
            const { name = "", phone = "" } = args;
            const person = await Person.findOne({ name })
            if (!person) throw new GraphQLError("no user with that name", {
                extensions: {
                    code: "BAD_USER_INPUT",
                    invalidArgs: name,
                }
            })
            person.phone = phone
            return person.save();
        },
        createUser: async (root, args) => {
            try {
                const user = new User({ ...args })
                return user.save();
            } catch (error) {
                throw new GraphQLError("failed creating user", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args.username,
                        error
                    }
                })
            }

        },
        login: async (root, args) => {
            try {
                const { username = "", password = "" } = args;
                const user = await User.findOne({ username });
                if (!user) throw new Error("invalid credentials.")
                const defaultPassword = "secret";
                const isPasswordValid = password === defaultPassword;
                if (!isPasswordValid) throw new Error("invalid credentials.");
                const userToken = { username, id: user._id }
                return { value: jwt.sign(userToken, process.env.JWT_SECRET) }
            } catch (error) {
                throw error;
            }

        }
    }
}


module.exports = resolvers