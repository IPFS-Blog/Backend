import { ApiProperty } from "@nestjs/swagger";

export class SelectOneOwnArticleRespose {
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
          description: "文章 編號。  \n",
          type: "integer",
        },
        title: {
          description: "文章 標題。  \n",
          type: "string",
        },
        subtitle: {
          description: "文章 副標題。  \n",
          type: "string",
        },
        contents: {
          description: "文章 標題內文。  \n",
          type: "string",
        },
        release: {
          description: "文章 發佈狀態。  \n",
          type: "boolean",
        },
      },
    },
    example: {
      id: 1,
      title: "我是第一篇文章",
      subtitle: "我是第一篇文章的副標題",
      contents: "我是第一篇文章的內文",
      release: 1,
    },
  })
  public readonly article: string[];
}
