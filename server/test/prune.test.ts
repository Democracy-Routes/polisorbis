import request from "supertest";
import app from "../app";
import dbPgQuery from "../src/db/pg-query";

const pgQueryP = dbPgQuery.queryP;

describe("POST /api/v3/prune", () => {
    let oldUserUid: number;
    let newUserUid: number;
    let oldZid: number;
    let newZid: number;

    beforeAll(async () => {
        // Setup: Create users and conversations with specific modified/created times
        const now = Date.now();
        const twoDaysAgo = now - (172800 * 1000 + 3600000); // 48h + 1h
        const oneHourAgo = now - 3600000;

        // Old user (to be pruned)
        const resOldUser = await pgQueryP("INSERT INTO users (created) VALUES ($1) RETURNING uid;", [twoDaysAgo]);
        oldUserUid = (resOldUser as any)[0].uid;

        // New user (to be kept)
        const resNewUser = await pgQueryP("INSERT INTO users (created) VALUES ($1) RETURNING uid;", [oneHourAgo]);
        newUserUid = (resNewUser as any)[0].uid;

        // Old conversation (to be pruned)
        const resOldConv = await pgQueryP("INSERT INTO conversations (owner, modified, created) VALUES ($1, $2, $2) RETURNING zid;", [newUserUid, twoDaysAgo]);
        oldZid = (resOldConv as any)[0].zid;

        // New conversation (to be kept)
        const resNewConv = await pgQueryP("INSERT INTO conversations (owner, modified, created) VALUES ($1, $2, $2) RETURNING zid;", [newUserUid, oneHourAgo]);
        newZid = (resNewConv as any)[0].zid;
    });

    afterAll(async () => {
        // Cleanup if needed (though pruning test might have cleaned them up)
        await pgQueryP("DELETE FROM conversations WHERE zid IN ($1, $2);", [oldZid, newZid]);
        await pgQueryP("DELETE FROM users WHERE uid IN ($1, $2);", [oldUserUid, newUserUid]);
    });

    it("should prune old conversations and empty users", async () => {
        const response = await request(app)
            .post("/api/v3/prune")
            .send({ "max-age": 172800 }); // 48 hours

        expect(response.status).toBe(200);
        expect(response.body.conversations_deleted).toBeGreaterThanOrEqual(1);
        expect(response.body.users_deleted).toBeGreaterThanOrEqual(1);

        // Verify old conv is gone
        const convs = await pgQueryP("SELECT zid FROM conversations WHERE zid = $1;", [oldZid]);
        expect((convs as any).length).toBe(0);

        // Verify new conv is still there
        const newConvs = await pgQueryP("SELECT zid FROM conversations WHERE zid = $1;", [newZid]);
        expect((newConvs as any).length).toBe(1);

        // Verify old user is gone
        const users = await pgQueryP("SELECT uid FROM users WHERE uid = $1;", [oldUserUid]);
        expect((users as any).length).toBe(0);

        // Verify new user is still there
        const newUsers = await pgQueryP("SELECT uid FROM users WHERE uid = $1;", [newUserUid]);
        expect((newUsers as any).length).toBe(1);
    });

    it("should respect the max-age parameter", async () => {
        // Create another oldish one but within 10 days
        const nineDaysAgo = Date.now() - (9 * 24 * 3600 * 1000);
        const resUser = await pgQueryP("INSERT INTO users (created) VALUES ($1) RETURNING uid;", [nineDaysAgo]);
        const userUid = (resUser as any)[0].uid;

        const response = await request(app)
            .post("/api/v3/prune")
            .send({ "max-age": 864000 }); // 10 days

        expect(response.status).toBe(200);
        // Should NOT have deleted the 9-day old user because max-age is 10 days
        const users = await pgQueryP("SELECT uid FROM users WHERE uid = $1;", [userUid]);
        expect((users as any).length).toBe(1);

        // Cleanup
        await pgQueryP("DELETE FROM users WHERE uid = $1;", [userUid]);
    });
});
