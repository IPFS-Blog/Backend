import { ApiProperty } from "@nestjs/swagger";

export class SelectLikeCommentResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 200,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "array",
    description: "使用者的留言 資料",
    items: {
      properties: {
        number: {
          description: "留言 編號。  \n",
          type: "number",
        },
        likes: {
          description: "流言 被按讚數量。  \n",
          type: "number",
        },
        contents: {
          description: "留言 內容。  \n",
          type: "string",
        },
        createAt: {
          description: "留言 創建時間。  \n",
          type: "string",
        },
        updateAt: {
          description: "留言 更新時間。  \n",
          type: "string",
        },
        article: {
          description: "文章資料。  \n",
          type: "object",
          properties: {
            id: {
              description: "文章 編號。  \n",
              type: "number",
            },
          },
        },
      },
    },
    example: [
      {
        id: 1,
        number: 1,
        likes: 1,
        contents: "我是第二篇文章的留言1",
        createAt: "2023-08-25T11:38:54.165Z",
        updateAt: "2023-08-25T11:39:37.000Z",
        article: {
          id: 2,
        },
      },
      {
        id: 2,
        number: 2,
        likes: 1,
        contents: "我是第二篇文章的留言2",
        createAt: "2023-08-25T11:38:57.851Z",
        updateAt: "2023-08-25T11:41:06.000Z",
        article: {
          id: 2,
        },
      },
      {
        id: 4,
        number: 1,
        likes: 2,
        contents: "我是第一篇文章的留言1",
        createAt: "2023-08-25T11:42:07.676Z",
        updateAt: "2023-08-25T16:57:08.000Z",
        article: {
          id: 1,
        },
      },
      {
        id: 5,
        number: 2,
        likes: 1,
        contents: "我是第一篇文章的留言2",
        createAt: "2023-08-25T11:42:10.718Z",
        updateAt: "2023-08-25T11:42:17.000Z",
        article: {
          id: 1,
        },
      },
    ],
  })
  public readonly comments: string[];
}
