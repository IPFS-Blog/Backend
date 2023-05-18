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
        subtitle: {
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
        user: {
          description: "使用者資料。  \n",
          type: "array",
          items: {
            properties: {
              id: {
                description: "使用者 ID。  \n",
                type: "string",
              },
              username: {
                description: "使用者 名稱。  \n",
                type: "string",
              },
              address: {
                description: "使用者 錢包地址。  \n",
                type: "string",
              },
              email: {
                description: "使用者 信箱。  \n",
                type: "string",
              },
              picture: {
                description: "使用者 大頭貼。  \n",
                type: "string",
              },
            },
          },
        },
      },
    },
    example: {
      id: 1,
      title: "我是第一篇文章",
      subtitle: "我是第一篇文章的副標題",
      contents: "我是第一篇文章的內文",
      createAt: "2023-04-11T18:47:15.095Z",
      updateAt: "2023-04-11T19:32:20.300Z",
      user: {
        id: 1,
        username: "John",
        email: "jhon@gmail.com",
        address: "0x264D6BF791f6Be6F001A95e895AE0a904732d473",
        picture:
          "https://miro.medium.com/v2/resize:fit:1400/1*FKlRYAU5z-74RYqsTYrOAQ@2x.png",
      },
    },
  })
  public readonly article: string[];
}
