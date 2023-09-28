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
            likes: {
              description: "文章 按讚數。  \n",
              type: "number",
            },
            createAt: {
              description: "文章 創建時間。  \n",
              type: "string",
            },
            updateAt: {
              description: "文章 更改時間。  \n",
              type: "string",
            },
          },
        },
      },
    },
    example: [
      {
        createAt: "2023-09-28T14:42:06.524Z",
        articleId: {
          id: 3,
          title: "我是第二篇文章",
          subtitle: "我是第一篇文章的副標題",
          likes: 0,
          ipfsHash: null,
          createAt: "2023-08-25T11:37:37.929Z",
          updateAt: "2023-08-25T11:38:23.169Z",
        },
      },
      {
        createAt: "2023-09-28T14:40:29.457Z",
        articleId: {
          id: 2,
          title: "我是第一篇文章",
          subtitle: "我是第一篇文章的副標題",
          likes: 0,
          ipfsHash: null,
          createAt: "2023-08-25T11:37:30.706Z",
          updateAt: "2023-08-25T11:39:02.000Z",
        },
      },
    ],
  })
  public readonly articles: string[];
}
