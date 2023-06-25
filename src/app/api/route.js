import { NextResponse } from "next/server"
import puppeteer from "puppeteer"

function delay(ms) {return new Promise(resolve => setTimeout(resolve, ms))}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")
  const newUrl = url.replace("www", "m")
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage"
    ]
  })
  const page = await browser.newPage()
  await page.goto(newUrl)
  const element = await page.waitForSelector("div[data-sigil='m-video-play-button playInlineVideo']")
  await delay(2000)
  await element.click()
  await delay(3000)
  const src = await page.evaluate(() => {
    const video = document.querySelector("div[data-sigil='inlineVideo'] > video")
    return video.src
  })
  await browser.close()
  return NextResponse.json({ videoLink: src }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  })
}
