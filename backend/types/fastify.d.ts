import "fastify";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
    // prisma added by prisma.ts plugin
    interface FastifyInstance {
        prisma: PrismaClient;
    }
    // user (possibly) added by authUser.ts plugin
    interface FastifyRequest {
        user?: {
            id: string;
        };
    }
}
