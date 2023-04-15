import { ApiProperty } from "@nestjs/swagger";

export class SelectOneArticleRespose {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "200",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "array",
    description: "文章 資料",
    items: {
      properties: {
        id: {
          description: "文章編號。  \n",
          type: "string",
        },
        title: {
          description: "文章標題。  \n",
          type: "string",
        },
        overview: {
          description: "文文章副標題。  \n",
          type: "string",
        },
        contents: {
          description: "文章標題內文。  \n",
          type: "string",
        },
        createAt: {
          description: "文章創建時間。  \n",
          type: "string",
        },
        updateAt: {
          description: "文章更新時間。  \n",
          type: "string",
        },
      },
    },
    example: {
      id: 1,
      title: "我是第一篇文章",
      overview: "我是第一篇文章的副標題",
      contents: "我是第一篇文章的內文",
      createAt: "2023-04-11T18:47:15.095Z",
      updateAt: "2023-04-11T19:32:20.300Z",
    },
  })
  public readonly articles: string[];
}
