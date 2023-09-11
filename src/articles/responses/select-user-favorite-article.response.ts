import { ApiProperty } from "@nestjs/swagger";

export class SelectUserFavoriteArticleResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 200,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "array",
    description: "創作者 資料",
    items: {
      properties: {
        createAt: {
          description: "新增收藏 創建時間。  \n",
          type: "string",
        },
        articleId: {
          description: "使用者 大頭貼。  \n",
          type: "object",
          properties: {
            id: {
              description: "文章 編號。  \n",
              type: "number",
            },
            title: {
              description: "文章 標題。  \n",
              type: "string",
            },
            subtitle: {
              description: "文章 副標題。  \n",
              type: "string",
            },
            ipfsHash: {
              description: "文章 IPFS 的 Hash 碼。  \n",
              type: "string",
            },
            createAt: {
              description: "文章 創建時間。  \n",
              type: "string",
            },
          },
        },
      },
    },
    example: [
      {
        createAt: "2023-09-11T05:34:42.971Z",
        articleId: {
          id: 1,
          title: "我是第一篇文章",
          subtitle: "我是第一篇文章的副標題",
          ipfsHash: "QmdSWF9ME7Ubd1mVGktez33iadEEd1V7F1hwEWM2dbBW6D",
          createAt: "2023-06-26T09:34:08.887Z",
        },
      },
      {
        createAt: "2023-09-11T06:42:13.585Z",
        articleId: {
          id: 3,
          title: "我是第三篇文章",
          subtitle: "我是第三篇文章的副標題",
          ipfsHash: null,
          createAt: "2023-06-27T15:29:09.983Z",
        },
      },
    ],
  })
  public readonly articles: string[];
}
