import { ApiProperty } from "@nestjs/swagger";

export class SelectLikeArticleResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 200,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "array",
    description: "使用者的文章 資料",
    items: {
      properties: {
        id: {
          description: "文章 ID。  \n",
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
        totalComments: {
          description: "文章 留言總數。  \n",
          type: "number",
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
    example: [
      {
        id: 2,
        title: "我是第二篇文章",
        subtitle: "我是第二篇文章的副標題",
        totalComments: 2,
        likes: 1,
        createAt: "2023-04-28T13:06:31.982Z",
        updateAt: "2023-04-28T13:41:15.676Z",
      },
      {
        id: 3,
        title: "我是第三篇文章",
        subtitle: "我是第三篇文章的副標題",
        totalComments: 0,
        likes: 0,
        createAt: "2023-04-28T13:06:32.734Z",
        updateAt: "2023-04-28T13:07:02.109Z",
      },
      {
        id: 4,
        title: "我是第四篇文章",
        subtitle: "我是第四篇文章的副標題",
        totalComments: 0,
        likes: 1,
        createAt: "2023-04-28T13:07:07.905Z",
        updateAt: "2023-04-28T13:41:18.399Z",
      },
    ],
  })
  public readonly articles: string[];
}
