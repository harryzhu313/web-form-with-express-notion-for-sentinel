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

$(document).ready(function () {
  /* ---------- ★ 提交锁定状态 ---------- */
  let hasSubmitted = false          // 是否已提交过
  let lastSuccessMsg = ""           // 记录服务器成功返回值

  const $pageForm = $("#pageForm")

  /* ---------- 页面提交 ---------- */
  $pageForm.on("submit", function (e) {
    e.preventDefault() // 阻止表单默认提交

    // 输入元素
    const $pageNameInput = $("#newPageName")
    const $emailInput = $("#newEmail")
    const $phoneInput = $("#newPhoneNumber")
    const $paragraphInput = $("#newParagraph")

    const pageName = $pageNameInput.val().trim()
    const email = $emailInput.val().trim()
    const phone = $phoneInput.val().trim()
    const paragraph = $paragraphInput.val().trim()

    // 重置错误样式
    $pageNameInput.css("border-bottom", "")
    $emailInput.css("border-bottom", "")

    // 必填校验
    if (!pageName || !email) {
      if (!pageName) $pageNameInput.css("border-bottom", "2px solid red")
      if (!email) $emailInput.css("border-bottom", "2px solid red")
      setTimeout(() => alert("🤯 Name&Email must be required!"), 0)
      return
    }

    /* ---------- ★ 已提交过则提示 ---------- */
    if (hasSubmitted) {
      alert(lastSuccessMsg || "✅ 已提交成功！请点击刷新后再试。")
      return
    }

    /* ---------- 提交按钮及进度条 ---------- */
    const $submitBtn = $("#submitBtn")
    const $lBar = $submitBtn.nextAll(".bar").find(".load")

    // 复位动画
    $submitBtn.removeClass("complete")
    $lBar.removeClass("loading").width(0)
    setTimeout(() => $lBar.addClass("loading"), 10)

    // 给父页发送成功提示（如需）
    window.parent.postMessage("formSubmitted", "*")

    /* ---------- 发送请求 ---------- */
    fetch("/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageName, email, phone, paragraph }),
    })
      .then((res) => res.json())
      .then((data) => {
        /* 动画完成 */
        setTimeout(() => $submitBtn.addClass("complete"), 10)

        /* ---------- ★ 锁定再次提交 ---------- */
        hasSubmitted = true
        lastSuccessMsg = data.message || "✅ Submit success!"
      })
      // .catch(() => alert("提交失败，请重试"))
  })

  /* ---------- ★ 刷新按钮 ---------- */
  $("#refreshBtn").on("click", function () {
    $pageForm[0].reset()                                // 清空表单
    const $submitBtn = $("#submitBtn")
    const $lBar = $submitBtn.nextAll(".bar").find(".load")
    $submitBtn.removeClass("complete")                   // 复位提交动画
    $lBar.removeClass("loading").width(0)

    hasSubmitted = false                                 // 解锁再次提交
    lastSuccessMsg = ""
  })
})
