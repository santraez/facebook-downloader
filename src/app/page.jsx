"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { saveAs } from "file-saver"
import { FaPlayCircle } from "react-icons/fa"
import { MdPauseCircle } from "react-icons/md"
import styles from "./styles.module.sass"
import Image from "next/image"

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

const origin = (typeof window === "undefined") ? "" : window.location.origin

export default function Home() {
  const [state, setState] = useState(null)
  console.log("🚀 ~ file: page.jsx:28 ~ Home ~ state:", state)
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const ref = useRef(null)
  const videoRef = useRef(null)
  useEffect(() => {
    if (!state) return
    return videoRef.current.play()
  }, [state])
  const handleSearch = () => {
    if (!ref.current.value) return
    setIsLoading(true)
    setTimeout(() => {
      (async () => {
        try {
          const video = ref.current.value
          const url = `http://localhost:3000/api?url=${video}`
          const { data } = await axios.get(url)
          const newVideoUrl = data.videoLink.replace("https://video.flim9-1.fna.fbcdn.net", origin)
          setState(newVideoUrl)
          setIsLoading(false)
        } catch (error) {
          console.log(error)
          alert("Intente otra vez")
          setIsLoading(false)
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
      {(isLoading) && (
        <div className={styles.loading}>
          <div className={styles.image}>
            <Image src="/default.png" width={200} height={200} alt="cat loading" />
          </div>
          <span>Buscando...</span>
        </div>
      )}
      <h1>Videos de Facebook</h1>
      <input ref={ref} type="text" placeholder="Ingresa un video de facebook"/>
      <div className={styles.buttons}>
        <button onClick={handleSearch} className={styles.search}>BUSCAR</button>
        <button onClick={handleClear} className={styles.clear}>LIMPIAR</button>
      </div>
      <div className={styles.video}>
        <div className={styles.controls}>
          {(isPlaying) ? (
            <FaPlayCircle className={styles.play} onClick={handlePause} />
          ) : (
            <MdPauseCircle className={styles.pause} onClick={handlePlay} />
          )}
        </div>
        <video ref={videoRef} src={state} autoPlay></video>
      </div>
      <button className={styles.download} onClick={handleDownload}>DESCARGAR</button>
    </main>
  )
}
