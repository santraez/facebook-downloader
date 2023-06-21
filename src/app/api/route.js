import { NextResponse } from "next/server"
import puppeteer from "puppeteer"

function delay(ms) {return new Promise(resolve => setTimeout(resolve, ms))}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")
  const newUrl = url.replace("www", "m")
  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()
  await page.goto(newUrl)
  await delay(2000)
  const element = await page.waitForSelector("div[data-sigil='m-video-play-button playInlineVideo']")
  await element.click()
  await delay(3000)
  const src = await page.evaluate(() => {
    const video = document.querySelector("div[data-sigil='inlineVideo'] > video")
    return video.src
  })
  await browser.close()
  return NextResponse.json({ videoLink: src })
}
