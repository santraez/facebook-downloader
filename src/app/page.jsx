"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { saveAs } from "file-saver"
import { FaPlayCircle } from "react-icons/fa"
import { MdPauseCircle } from "react-icons/md"
import styles from "./styles.module.sass"

export const randomStrings = (length, type="letter") => {
  const letters = "abcdefghijklmnopqrstuvwxyz"
  const numbers = "0123456789"
  const symbols = "!@#$%^&*()_+~`|}{[]\:;?><,./-="
  const selected = (type === "letter") ? letters : (type === "number") ? numbers : symbols
  let result = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * selected.length)
    result += selected.charAt(randomIndex)
  }
  return result
}

export default function Home() {
  const [state, setState] = useState(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const ref = useRef(null)
  const videoRef = useRef(null)
  useEffect(() => {
    if (!state) return
    return videoRef.current.play()
  }, [state])
  const handleSearch = () => {
    if (!ref.current.value) return
    setTimeout(() => {
      (async () => {
        try {
          const video = ref.current.value
          const url = `https://facebook-downloader-eight.vercel.app/api?url=${video}`
          const { data } = await axios.get(url)
          setState(data.videoLink)
        } catch (error) {
          console.log(error)
          alert("Intente otra vez")
        }
      })()
    }, 2000)
  }
  const handleClear = () => {
    ref.current.value = ""
  }
  const handleDownload = async () => {
    const videoName = randomStrings(10, "letter")
    if (!state) return
    saveAs(state, `${videoName}.mp4`)
  }
  const handlePlay = () => {
    if (!state) return
    videoRef.current.play()
    setIsPlaying(true)
  }
  const handlePause = () => {
    if (!state) return
    videoRef.current.pause()
    setIsPlaying(false)
  }
  return (
    <main className={styles.container}>
      <h1>Videos de Facebook</h1>
      <input ref={ref} type="text" placeholder="Ingresa un video de facebook"/>
      <div className={styles.buttons}>
        <button onClick={handleSearch} className={styles.search}>BUSCAR</button>
        <button onClick={handleClear} className={styles.clear}>LIMPIAR</button>
      </div>
      <div className={styles.video}>
        <div className={styles.play}>
          {
            (isPlaying) ? (
              <FaPlayCircle onClick={handlePause} />
            ) : (
              <MdPauseCircle onClick={handlePlay} />
            )
          }
        </div>
        <video ref={videoRef} src={state} autoPlay></video>
      </div>
      <button className={styles.download} onClick={handleDownload}>DESCARGAR</button>
    </main>
  )
}