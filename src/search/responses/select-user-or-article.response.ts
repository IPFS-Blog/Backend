import { ApiProperty } from "@nestjs/swagger";

export class SelectUserOrArticleResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 200,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "array",
    description: "使用者 資料",
    items: {
      properties: {
        data: {
          description: "使用者 資料。  \n",
          type: "array",
          items: {
            properties: {
              id: {
                description: "使用者 編號。  \n",
                type: "number",
              },
              username: {
                description: "使用者 名稱。  \n",
                type: "string",
              },
              email: {
                description: "使用者 信箱。  \n",
                type: "string",
              },
              address: {
                description: "使用者 錢包ID。  \n",
                type: "string",
              },
              picture: {
                description: "使用者 大頭貼。  \n",
                type: "string",
              },
            },
          },
        },
        account: {
          description: "使用者 數量。  \n",
          type: "number",
        },
      },
    },
    example: {
      data: [
        {
          id: 31,
          username: "John",
          email: "jhon@example.com",
          address: "0x264D6BF791f6Be6F001A95e895AE0a904732d471",
          picture: null,
        },
        {
          id: 32,
          username: "John12",
          email: "a20688392@gmail.com",
          address: "0x264D6BF791f6Be6F001A95e895AE0a904732d477",
          picture: "https://i.imgur.com/Rkrp9tt.jpg",
        },
      ],
      account: 2,
    },
  })
  public readonly users: string[];

  @ApiProperty({
    type: "array",
    description: "文章 資料",
    items: {
      properties: {
        data: {
          description: "文章 資料。  \n",
          type: "array",
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
              user: {
                description: "",
                type: "array",
                items: {
                  properties: {
                    id: {
                      description: "使用者 編號。  \n",
                      type: "number",
                    },
                    username: {
                      description: "使用者 名稱。  \n",
                      type: "string",
                    },
                    email: {
                      description: "使用者 信箱。  \n",
                      type: "string",
                    },
                    address: {
                      description: "使用者 錢包ID。  \n",
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
        },
        account: {
          description: "文章 數量。  \n",
          type: "number",
        },
      },
    },
    example: {
      data: [
        {
          id: 1,
          title: "John 著作",
          user: {
            id: 1,
            username: "John",
            email: "jhon12@gmail.com",
            address: "0x264D6BF791f6Be6F001A95e895AE0a904732d473",
            picture: "https://i.imgur.com/Rkrp9tt.jpg",
          },
        },
      ],
      account: 1,
    },
  })
  public readonly articles: string[];
}
