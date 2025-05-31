import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import styles from "./Loader.module.css"
import type { FileInfo, FileItem } from "./types"

export const Loader: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [allCompleted, setAllCompleted] = useState(false)
  const [downloadStarted, setDownloadStarted] = useState(false)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get<FileInfo[]>(
          "https://store.neuro-city.ru/downloads/for-test-tasks/downloader"
        )
        const filesData = response.data.filter((file) => file.type === "file")

        setFiles(
          filesData.map((file) => ({
            ...file,
            url: `https://store.neuro-city.ru/downloads/for-test-tasks/downloader/${file.name}`,
            progress: 0,
            completed: false,
          }))
        )
      } catch (error) {
        console.error(error)
      }
    }

    fetchFiles()
  }, [])

  const downloadFile = async (file: FileItem, index: number) => {
    const startTime = Date.now()
    let lastLoaded = 0
    let lastTime = startTime

    try {
      const response = await axios({
        url: file.url,
        method: "GET",
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const currentTime = Date.now()
            const timeDiff = (currentTime - lastTime) / 1000
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)

            if (progress >= 100) {
              updateFileProgress(index, 100)
              return
            }

            if (timeDiff > 0.5 && progressEvent.loaded > lastLoaded) {
              const loadedDiff = progressEvent.loaded - lastLoaded
              const speed = loadedDiff / timeDiff / 1024
              const speedText =
                speed > 1024 ? `${(speed / 1024).toFixed(1)} MB/s` : `${speed.toFixed(1)} KB/s`

              const remainingBytes = progressEvent.total - progressEvent.loaded
              const remainingTime = remainingBytes / (loadedDiff / timeDiff)
              const minutes = Math.floor(remainingTime / 60)
              const seconds = Math.floor(remainingTime % 60)
              const timeText = `${minutes > 0 ? `${minutes} мин ` : ""}${seconds} сек`

              updateFileProgress(index, progress, speedText, timeText)
              lastLoaded = progressEvent.loaded
              lastTime = currentTime
            }
          }
        },
      })

      updateFileProgress(index, 100)

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", file.name)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)

      updateFileCompletion(index, true)
    } catch (error) {
      console.error(error)
    }
  }

  const updateFileProgress = (index: number, progress: number, speed?: string, remainingTime?: string) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles]
      newFiles[index] = {
        ...newFiles[index],
        progress,
        ...(speed && { speed }),
        ...(remainingTime && { remainingTime }),
      }
      return newFiles
    })
  }

  const updateFileCompletion = (index: number, completed: boolean) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles]
      newFiles[index] = { ...newFiles[index], completed }
      return newFiles
    })
  }

  const startAllDownloads = () => {
    setDownloadStarted(true)
    setAllCompleted(false)
    setFiles((prevFiles) =>
      prevFiles.map((file) => ({
        ...file,
        progress: 0,
        completed: false,
        speed: undefined,
        remainingTime: undefined,
      }))
    )

    files.forEach((file, index) => {
      downloadFile(file, index)
    })
  }

  useEffect(() => {
    if (files.length > 0 && downloadStarted && files.every((f) => f.completed) && !allCompleted) {
      setAllCompleted(true)
    }
  }, [files, allCompleted, downloadStarted])

  return (
    <>
      <h1 className={styles.title}>Загрузчик файлов</h1>

      {files.length === 0 ? (
        <div>Нет файлов для загрузки</div>
      ) : (
        <>
          <div>
            {files.map((file, index) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={styles.file_item}
              >
                <div className={styles.file_header}>
                  <div>
                    <div>{file.name}</div>
                    <div className={styles.file_size}>{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                  </div>
                  {file.completed ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      ✓
                    </motion.span>
                  ) : (
                    <div>
                      <div>{file.progress}%</div>
                      {file.speed && (
                        <div className={styles.speed_info}>
                          {file.speed} • {file.remainingTime}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className={styles.progress_bar}>
                  <motion.div
                    className={styles.progress_fill}
                    initial={{ width: "0%" }}
                    animate={{ width: `${file.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={startAllDownloads}
            disabled={downloadStarted && !allCompleted}
            className={`${styles.button} ${downloadStarted && !allCompleted ? styles.buttonDisabled : ""}`}
          >
            {downloadStarted && !allCompleted ? "Загрузка..." : "Начать загрузку"}
          </button>
        </>
      )}
    </>
  )
}
