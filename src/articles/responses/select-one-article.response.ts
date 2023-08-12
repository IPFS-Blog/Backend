import { ApiProperty } from "@nestjs/swagger";

export class SelectOneArticleResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 200,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "object",
    description: "文章 資料",
    items: {
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
        contents: {
          description: "文章 標題內文。  \n",
          type: "string",
        },
        release: {
          description: "文章 發佈狀態。  \n",
          type: "number",
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
          description: "文章 創建時間。  \n",
          type: "string",
        },
        updateAt: {
          description: "文章 更新時間。  \n",
          type: "string",
        },
        user: {
          description: "使用者資料。  \n",
          type: "object",
          properties: {
            id: {
              description: "使用者 ID。  \n",
              type: "number",
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
              nullable: true,
            },
          },
        },
        comments: {
          description: "文章的留言。  \n",
          type: "array",
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
      release: 1,
      totalComments: 2,
      likes: 1,
      ipfsHash: "QmPZurWdTQfJTnbY7khWFFtNEdJLX8nKPptxNLvatX1A3f",
      createAt: "2023-04-11T18:47:15.095Z",
      updateAt: "2023-04-11T19:32:20.300Z",
      user: {
        id: 1,
        username: "Jhon",
        email: "jhon@gmail.com",
        address: "0x264D6BF791f6Be6F001A95e895AE0a904732d473",
        picture:
          "https://miro.medium.com/v2/resize:fit:1400/1*FKlRYAU5z-74RYqsTYrOAQ@2x.png",
      },
      comments: [
        {
          number: 1,
          likes: 0,
          contents: "我是第一篇文章的留言1",
          createAt: "2023-06-27T18:24:48.860Z",
          updateAt: "2023-06-27T18:25:10.000Z",
        },
        {
          number: 2,
          likes: 0,
          contents: "我是第一篇文章的留言2",
          createAt: "2023-06-27T18:24:58.404Z",
          updateAt: "2023-06-27T18:24:58.404Z",
        },
      ],
    },
  })
  public readonly article: string[];
}
