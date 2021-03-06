import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from 'express';
import {buildSchema} from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
    //connect to database
    const orm = await MikroORM.init(microConfig);
    //run migrations
    await orm.getMigrator().up();

    
    const app = express();
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: () => ({ em: orm.em })
    });

    apolloServer.applyMiddleware({ app });
    
    app.listen(3000, () => {
        console.log('server started on localhost:3000');
    })
};

main().catch(err => {
    console.error(err);
});