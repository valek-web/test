import React, { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import type { User, ApiResponse } from "./types"
import styles from "./Slider.module.css"

const API_KEY = "reqres-free-v1"

export const Slider: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [cardsPerSlide, setCardsPerSlide] = useState<number>(3)
  const [direction, setDirection] = useState<number>(1)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<ApiResponse>("https://reqres.in/api/users", {
          headers: {
            "x-api-key": `${API_KEY}`,
          },
        })
        console.log(response.data.data)
        setUsers(response.data.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchUsers()
  }, [])

  const nextSlide = (): void => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + cardsPerSlide >= users.length ? 0 : prev + cardsPerSlide))
  }

  const prevSlide = (): void => {
    setDirection(-1)
    setCurrentSlide((prev) =>
      prev - cardsPerSlide < 0
        ? users.length - (users.length % cardsPerSlide || cardsPerSlide)
        : prev - cardsPerSlide
    )
  }

  const handleDelete = (id: number): void => {
    if (users.length === 1) return
    setUsers(users.filter((user) => user.id !== id))
    if (currentSlide >= users.length - cardsPerSlide) {
      setCurrentSlide(Math.max(0, users.length - cardsPerSlide - 1))
    }
  }

  const getVisibleCards = (): User[] => {
    const visibleCards: User[] = []
    if (users.length <= cardsPerSlide) return users
    for (let i = 0; i < cardsPerSlide; i++) {
      const index = (currentSlide + i) % users.length
      if (users[index]) {
        visibleCards.push(users[index])
      }
    }
    return visibleCards
  }
  console.log(users)

  return (
    <motion.div
      className={styles.slider_container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2>Слайдер</h2>
      <div className={styles.controls}>
        <div>
          <label>Колличество слайдов </label>
          <select
            value={cardsPerSlide}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setCardsPerSlide(Number(e.target.value))
              setCurrentSlide(0)
            }}
          >
            {[1, 2, 3].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.slider}>
        <motion.button
          className={`${styles.nav_btn} ${styles.prev}`}
          onClick={prevSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          &lt;
        </motion.button>

        <div className={styles.cards_container}>
          <AnimatePresence custom={{ direction }} mode="popLayout">
            {getVisibleCards().map((user) => (
              <motion.div
                key={user.id}
                className={styles.card}
                custom={{ direction }}
                variants={{
                  hidden: { scale: 0.3, opacity: 0 },
                  visible: { scale: 1, opacity: 1 },
                  exit: { scale: 0.3, opacity: 0 },
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5 }}
                layout
              >
                <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                <h3>
                  {user.first_name} {user.last_name}
                </h3>
                <p>{user.email}</p>
                <motion.button
                  className={styles.delete_btn}
                  onClick={() => handleDelete(user.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  &#10007;
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.button
          className={`${styles.nav_btn} ${styles.next}`}
          onClick={nextSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          &gt;
        </motion.button>
      </div>
    </motion.div>
  )
}
