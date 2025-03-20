require("dotenv").config()
const express = require("express")
const app = express()

const { Client } = require("@notionhq/client")
const notion = new Client({ auth: process.env.NOTION_KEY })

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"))
app.use(express.json()) // for parsing application/json

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html")
})

// Create new database. The page ID is set in the environment variables.
// app.post("/databases", async function (request, response) {
//   const pageId = process.env.NOTION_PAGE_ID
//   const title = request.body.dbName

//   try {
//     const newDb = await notion.databases.create({
//       parent: {
//         type: "page_id",
//         page_id: pageId,
//       },
//       title: [
//         {
//           type: "text",
//           text: {
//             content: title,
//           },
//         },
//       ],
//       properties: {
//         Name: {
//           title: {},
//         },
//       },
//     })
//     response.json({ message: "success!", data: newDb })
//   } catch (error) {
//     response.json({ message: "error", error })
//   }
// })

// Create new page. The database ID is provided in the web form.添加了 database 的环境变量，不需要新创建一个 database 再添加 page 了。
app.post("/pages", async function (request, response) {
  const { pageName, email, phone, header, paragraph } = request.body;
  // 输入校验，只要求必须填写 name 和 email
  if (!pageName || !email) {
    return response.json({ message: "❌ Name&Email must be required!" });
  }
  const dbID = process.env.NOTION_DATABASE_ID;

  // 构造 properties 对象，先放入必填项，再根据是否有 phone 添加可选项
  const properties = {
    Name: {
      title: [
        {
          text: {
            content: pageName,
          },
        },
      ],
    },
    Email: {
      email: email,
    },
  };
  if (phone) {
    properties.Phone = { phone_number: phone };
  }

  // 构造 children 数组，header 和 paragraph 均为可选
  const children = [];
  if (header) {
    children.push({
      object: "block",
      heading_2: {
        rich_text: [
          {
            text: {
              content: header,
            },
          },
        ],
      },
    });
  }
  if (paragraph) {
    children.push({
      object: "block",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: paragraph,
            },
          },
        ],
      },
    });
  }

  try {
    // 如果 children 数组有内容才传入，不然不传
    const newPage = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: dbID,
      },
      properties,
      ...(children.length > 0 && { children }),
    });
    response.json({
      message: "✅ Submit！We'll contact to you soon! 😊",
      data: newPage,
    });
  } catch (error) {
    response.json({ message: "error", error });
  }
});

// Create new block (page content). The page ID is provided in the web form.
// app.post("/blocks", async function (request, response) {
//   const { pageID, content } = request.body

//   try {
//     const newBlock = await notion.blocks.children.append({
//       block_id: pageID, // a block ID can be a page ID
//       children: [
//         {
//           // Use a paragraph as a default but the form or request can be updated to allow for other block types: https://developers.notion.com/reference/block#keys
//           paragraph: {
//             rich_text: [
//               {
//                 text: {
//                   content: content,
//                 },
//               },
//             ],
//           },
//         },
//       ],
//     })
//     response.json({ message: "success!", data: newBlock })
//   } catch (error) {
//     response.json({ message: "error", error })
//   }
// })

// Create new page comments. The page ID is provided in the web form.
// app.post("/comments", async function (request, response) {
//   const { pageID, comment } = request.body

//   try {
//     const newComment = await notion.comments.create({
//       parent: {
//         page_id: pageID,
//       },
//       rich_text: [
//         {
//           text: {
//             content: comment,
//           },
//         },
//       ],
//     })
//     response.json({ message: "success!", data: newComment })
//   } catch (error) {
//     response.json({ message: "error", error })
//   }
// })

// listen for requests :)启动逻辑
const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port)
})

