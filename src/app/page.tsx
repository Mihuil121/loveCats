'use client'
import dynamic from "next/dynamic"

const HomePage = dynamic(() => import("@/components/Home/Home"), {
  ssr: false,
  loading: () =>
    <p>
      Загрузка котиков
    </p>
})

const page = () => {
  return (
    <div>
      <HomePage />
    </div>
  )
}

export default page