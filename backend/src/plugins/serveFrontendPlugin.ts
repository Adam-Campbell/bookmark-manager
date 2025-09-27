import fp from "fastify-plugin";
import { type FastifyInstance, type FastifyPluginOptions } from "fastify";
import * as fs from "fs";
import path from "path";

async function serveFrontendPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    const { rootDir } = options;
    fastify.setNotFoundHandler((req, reply) => {
        if (req.raw.method === "GET" && !req.raw.url?.startsWith("/api")) {
            reply
                .type("text/html")
                .send(
                    fs.readFileSync(
                        path.join(
                            rootDir,
                            "..",
                            "..",
                            "frontend",
                            "dist",
                            "index.html"
                        )
                    )
                );
        } else {
            reply.status(404).send({ error: "Not found" });
        }
    });
}

export default fp(serveFrontendPlugin);
