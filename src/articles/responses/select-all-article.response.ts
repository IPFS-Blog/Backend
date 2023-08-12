import { ApiProperty } from "@nestjs/swagger";

export class SelectAllArticleResponse {
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
          type: "number",
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
        release: {
          description: "文章 發佈狀態。  \n",
          type: "boolean",
        },
        totalComments: {
          description: "文章 留言總數。  \n",
          type: "number",
        },
        likes: {
          description: "文章 按讚數。  \n",
          type: "number",
        },
        ipfsHash: {
          description: "文章 IPFS 的 Hash 碼。  \n",
          type: "string",
        },
        createAt: {
          description: "文章創建時間。  \n",
          type: "date",
        },
        updateAt: {
          description: "文章更新時間。  \n",
          type: "date",
        },
        user: {
          description: "使用者資料。  \n",
          type: "array",
          items: {
            properties: {
              username: {
                description: "使用者名稱。  \n",
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
    example: [
      {
        id: 1,
        title: "我是第一篇文章",
        subtitle: "我是第一篇文章的副標題",
        contents: "我是第一篇文章的內文",
        release: 1,
        totalComments: 2,
        likes: 1,
        ipfsHash: "QmPZurWdTQfJTnbY7khWFFtNEdJLX8nKPptxNLvatX1A3f",
        createAt: "2023-04-11T18:47:15.095Z",
        updateAt: "2023-04-11T19:32:20.300Z",
        user: {
          username: "Jhon",
          picture:
            "https://miro.medium.com/v2/resize:fit:1400/1*FKlRYAU5z-74RYqsTYrOAQ@2x.png",
        },
      },
      {
        id: 3,
        title: "我是第二篇文章",
        subtitle: "我是第二篇文章的副標題",
        contents: "我是第二篇文章的內文",
        release: 1,
        totalComments: 0,
        likes: 0,
        ipfsHash: "QmdSWF9ME7Ubd1mVGktez33iadEEd1V7F1hwEWM2dbBW6D",
        createAt: "2023-06-27T15:29:07.964Z",
        updateAt: "2023-06-27T15:29:07.964Z",
        user: {
          username: "Bob",
          picture: null,
        },
      },
    ],
  })
  public readonly articles: string[];
}
