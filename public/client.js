// This file is run by the browser each time your view template is loaded

/**
 * Define variables that reference elements included in /views/index.html:
 */

// Forms
// const dbForm = document.getElementById("databaseForm") //从文档中查找并获取 ID 为 "databaseForm" 的元素，并将其赋值给变量 dbForm
const pageForm = document.getElementById("pageForm")
// const blocksForm = document.getElementById("blocksForm")
// const commentForm = document.getElementById("commentForm")


// Table cells where API responses will be appended
// const dbResponseEl = document.getElementById("dbResponse")
// const pageResponseEl = document.getElementById("pageResponse")
// const blocksResponseEl = document.getElementById("blocksResponse")
// const commentResponseEl = document.getElementById("commentResponse")

/**
 * Functions to handle appending new content to /views/index.html
 */

// Appends the API response to the UI，将 API 响应添加到页面上
const appendApiResponse = function (apiResponse, el) {
  console.log(apiResponse) //打印响应体

  // Add success message to UI
  const newParagraphSuccessMsg = document.createElement("p")
  newParagraphSuccessMsg.textContent = "Result: " + apiResponse.message
  el.appendChild(newParagraphSuccessMsg)
  // See browser console for more information
  if (apiResponse.message === "error") return //如果响应体中的 message 属性值为 "error"，则返回

  // Add ID of Notion item (db, page, comment) to UI，将 ID 添加到页面上
  // const newParagraphId = document.createElement("p")
  // newParagraphId.textContent = "ID: " + apiResponse.data.id
  // el.appendChild(newParagraphId) 

  // Add URL of Notion item (db, page) to UI，将 URL 添加到页面上
//   if (apiResponse.data.url) {
//     const newAnchorTag = document.createElement("a")
//     newAnchorTag.setAttribute("href", apiResponse.data.url)
//     newAnchorTag.innerText = apiResponse.data.url
//     el.appendChild(newAnchorTag)
//   }
} 

// Appends the blocks API response to the UI，将块 API 响应添加到页面上
const appendBlocksResponse = function (apiResponse, el) {
  console.log(apiResponse)

  // Add success message to UI
  const newParagraphSuccessMsg = document.createElement("p")
  newParagraphSuccessMsg.textContent = "Result: " + apiResponse.message
  el.appendChild(newParagraphSuccessMsg)

  // Add block ID to UI
  const newParagraphId = document.createElement("p")
  newParagraphId.textContent = "ID: " + apiResponse.data.results[0].id
  el.appendChild(newParagraphId)
}

/**
 * Attach submit event handlers to each form included in /views/index.html
 */

// Attach submit event to each form
// dbForm.onsubmit = async function (event) {
//   event.preventDefault() //这行代码阻止了浏览器默认的表单提交行为（即页面刷新）。这是使用 AJAX 技术时必须的步骤，能让用户体验更流畅。

//   const dbName = event.target.dbName.value //获取表单中名为 dbName 的输入框的值
//   const body = JSON.stringify({ dbName }) //将 dbName 的值转换为 JSON 字符串
// //发起异步 POST 请求
//   const newDBResponse = await fetch("/databases", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body,
//   })
//   const newDBData = await newDBResponse.json() //解析响应体为 JSON 格式

//   appendApiResponse(newDBData, dbResponseEl) //将响应体添加到页面上
// }

//当没有提交 email 和 name 时，会弹出提示框，且输入框会变红;提交成功后，按钮会变成绿色动画对钩

$(document).ready(function() {
  const pageForm = $("#pageForm");

  pageForm.on("submit", function(e) {
    e.preventDefault(); // 阻止表单默认提交

    const pageNameInput = $("#newPageName");
    const emailInput = $("#newEmail");
    const pageName = pageNameInput.val().trim();
    const email = emailInput.val().trim();

    // 重置错误样式
    pageNameInput.css("border-bottom", "");
    emailInput.css("border-bottom", "");

    // 验证必填字段
    if (!pageName || !email) {
      if (!pageName) pageNameInput.css("border-bottom", "2px solid red");
      if (!email) emailInput.css("border-bottom", "2px solid red");

      setTimeout(() => {
        alert("🤯 Name&Email must be required!");
      }, 0);

      return; // 不继续执行
    }

    // 开始按钮动画
    const button = pageForm.find("button");
    const lBar = button.find(".load");

    button.removeClass("complete");
    lBar.removeClass("loading").width(0);

    setTimeout(() => lBar.addClass("loading"), 10);

    // 发送表单数据
    const body = JSON.stringify({
      pageName,
      email
      // 其他字段根据需要加入
    });

    fetch("/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
    .then(res => res.json())
    .then(data => {
      // 10ms秒后显示成功
      setTimeout(() => {
        button.addClass("complete");
      }, 10);
      
      // 显示返回的消息
      // appendApiResponse(data, $("#pageResponse")[0]);
    })
    // .catch(() => alert("提交失败，请重试"));
  });
});

// blocksForm.onsubmit = async function (event) {
//   event.preventDefault()

//   const pageID = event.target.pageID.value
//   const content = event.target.content.value
//   const body = JSON.stringify({ pageID, content })

//   const newBlockResponse = await fetch("/blocks", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body,
//   })

//   const newBlockData = await newBlockResponse.json()
//   appendBlocksResponse(newBlockData, blocksResponseEl)
// }

// commentForm.onsubmit = async function (event) {
//   event.preventDefault()

//   const pageID = event.target.pageIDComment.value
//   const comment = event.target.comment.value
//   const body = JSON.stringify({ pageID, comment })

//   const newCommentResponse = await fetch("/comments", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body,
//   })

//   const newCommentData = await newCommentResponse.json()
//   appendApiResponse(newCommentData, commentResponseEl)
// }
