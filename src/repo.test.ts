import mysql2 from "mysql2/promise";

import { getHoge } from "./repo";

jest.mock("mysql2/promise");

// query関数のモック
const mockedQuery = jest.fn();

// createPool でダミーのPoolConnectionを返すようにする
(mysql2.createPool as unknown as jest.Mock).mockImplementation(() => ({
    getConnection: async () => ({
        query: mockedQuery,
    }),
}));

beforeEach(() => {
    // テスト毎にquery()モックリセット
    mockedQuery.mockReset();
});

describe("Mocked SQL test", () => {
    test("test1", async () => {
        // ダミーの戻り値セット
        // ※mysql2.PoolConnection.query は Promise<[結果行配列, FieldPacket[]]> を返す
        mockedQuery.mockResolvedValue([
            [{ id: 1 }], // 結果行配列
            [], // 本来は FieldPacket[] 参照しないので省略
        ]);

        // 実行
        const rows = await getHoge();

        // モック関数の呼び出し・戻り値チェック
        expect(mockedQuery).toBeCalledTimes(1);
        expect(mockedQuery).toBeCalledWith("SELECT id FROM hoge ORDER BY id DESC");
        expect(rows).toEqual([{ id: 1 }]);
    });

    test("test2", async () => {
        // ダミーの戻り値セット
        mockedQuery.mockResolvedValue([[{ id: 2 }], []]);

        // 実行
        const rows = await getHoge();

        // モック関数の呼び出し・戻り値チェック
        expect(mockedQuery).toBeCalledTimes(1);
        expect(mockedQuery).toBeCalledWith("SELECT id FROM hoge ORDER BY id DESC");
        expect(rows).toEqual([{ id: 2 }]);
    });
});
