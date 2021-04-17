const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config.js");

const pubsub = new PubSub();

const PORT = process.env.port || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  //Delega el request al context para poder acceder desde este, y no dejarle la pega a express en rutas no seguras
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
	.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("MongoDB Connected");
		return server.listen({ port: PORT });
	})
	.then((res) => {
		console.log(`Server running at ${res.url}`);
	})
	.catch((err) => {
		console.error(err);
	});
