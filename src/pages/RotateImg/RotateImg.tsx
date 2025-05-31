import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import { saveAs } from "file-saver"
import styles from "./RotateImg.module.css"

export const RotateImg: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [rotation, setRotation] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        setRotation(0)
      }
      img.onerror = () => {
        console.log("err")
      }
      if (typeof event.target?.result === "string") {
        img.src = event.target.result
      }
    }
    reader.readAsDataURL(file)
  }

  const rotateImage = (angle: number) => {
    setRotation((prevRotation) => (prevRotation + angle) % 360)
  }

  const saveImage = () => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (rotation % 180 === 0) {
      canvas.width = image.width
      canvas.height = image.height
    } else {
      canvas.width = image.height
      canvas.height = image.width
    }

    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.drawImage(image, -image.width / 2, -image.height / 2)

    ctx.setTransform(1, 0, 0, 1, 0, 0)

    const isJPEG = image.src.toLowerCase().includes("jpeg") || image.src.toLowerCase().includes("jpg")

    canvas.toBlob(
      (blob) => {
        if (blob) {
          saveAs(blob, `img.${isJPEG ? "jpg" : "png"}`)
        }
      },
      rotation % 180 === 90 || rotation % 180 === 270 ? "image/png" : isJPEG ? "image/jpeg" : "image/png"
    )
  }

  return (
    <>
      <h1>Поворот изображения</h1>

      <div className={styles.controls}>
        <button onClick={() => fileInputRef.current?.click()} className={styles.button}>
          Открыть
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/jpeg, image/png"
          style={{ display: "none" }}
        />

        <button onClick={() => rotateImage(90)} disabled={!image} className={styles.button}>
          &#8635;
        </button>

        <button onClick={() => rotateImage(-90)} disabled={!image} className={styles.button}>
          &#8634;
        </button>

        <button onClick={saveImage} disabled={!image} className={styles.button}>
          Сохранить
        </button>
      </div>

      <div className={styles.image_container}>
        {image ? (
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            style={{
              transformOrigin: "center center",
              display: "inline-block",
              maxWidth: "100%",
            }}
          >
            <img
              src={image.src}
              alt="#"
              style={{
                maxWidth: "100%",
                maxHeight: "50vh",
                display: "block",
              }}
            />
          </motion.div>
        ) : (
          <p>Нет картинки</p>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  )
}
