import { initEdgeStore } from "@edgestore/server";
import { initEdgeStoreClient } from "@edgestore/server/core";
const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
  roomFiles: es
    .fileBucket({
      maxSize: 1024 * 1024 * 30,
    })
    .beforeDelete(({ ctx, fileInfo }) => {
      return true;
    }),
});
export default edgeStoreRouter;
export const edgeStoreClient = initEdgeStoreClient({
  router: edgeStoreRouter,
  baseUrl: process.env.NEXTAUTH_URL,
});
