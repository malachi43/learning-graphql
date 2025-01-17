require("dotenv").config();
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const connectToDatabase = require("./database/connect")
const { persons } = require("./mock_data");
const { seedDatabase } = require("./utils/seedDatabase")
const typeDefs = require("./typedefs");
const resolvers = require("./resolvers")
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
        const authorization = req ? req.headers.authorization : null;
        const isToken = authorization && authorization.startsWith("Bearer ");
        let token = isToken && authorization.trim().split(" ")[1];
        const { username } = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findOne({ username })
        return { currentUser }
    }
}).then(async ({ url }) => {
    console.log("connecting to mongodb...")
    const connection = await connectToDatabase(process.env.MONGO_URI);
    console.log(`successfully connected to database: [ ${connection.connection.host} ]`)
    await seedDatabase(persons)
    console.log(`Server ready at ${url}`)
})