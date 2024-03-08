'use client'

import Image from 'next/image'
import { FormEvent } from 'react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [file, setFile] = useState<File>()
  const [previewImage, setPreviewImage] = useState<string>()
  const [isDemoAvailable, setIsDemoAvailable] = useState<boolean>(true)

  useEffect(() => {
    async function checkDemoAvailability() {
      try {
        const response = await fetch('http://localhost:5000/predict', { method: 'OPTIONS' })
        if (!response.ok) {
          setIsDemoAvailable(false)
        }
      } catch (error) {
        setIsDemoAvailable(false)
      }
    }

    checkDemoAvailability()
  }, [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!file) {
      alert("File cannot be empty...")
    }

    const formData = new FormData(event.currentTarget)
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: formData,
    }).catch()

    // Handle response if necessary
    const data = await response.json()
    console.log(data)

    // Display preview image
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <main className="px-16 md:px-20 pt-20 space-y-10">
      <section className="mx-auto w-full py-20 space-y-5">
        <h1 className="font-semibold text-2xl">
          Joseph Redmon
        </h1>
        <h2 className='font-semibold text-xl'>
          AI Face Gender Recognitions
        </h2>
        <p>
          This is our web demo portofolio for AI Indonesia first project to create gender recognitions artificial intellegence.
        </p>
      </section>
      <section className="w-full py-20 space-y-20">
        <h1 className="text-center font-semibold text-2xl">
          Team Member
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="px-5 py-5 border border-solid border-black">
            <h1>Lila Setiyani</h1>
            <a href="https://www.linkedin.com/in/lila-setiyani-6284a6138/" className="underline text-blue-500">Linkedin</a>
          </div>
          <div className="px-5 py-5 border border-solid border-black">
            <h1>Kusuma N Adi P</h1>
            <a href="https://www.linkedin.com/in/kusuma-noer-adi-purnomo/" className="underline text-blue-500">Linkedin</a>
          </div>
          <div className="px-5 py-5 border border-solid border-black">
            <h1>Muhammad Dhoni Apriyadi</h1>
            <a href="https://www.linkedin.com/in/muhammaddhoniapriyadi" className="underline text-blue-500">Linkedin</a>
          </div>
          <div className="px-5 py-5 border border-solid border-black">
            <h1>Indrawan Cahyadi</h1>
            <a href="https://id.linkedin.com/in/indrawan-cahyadi-378b2a84" className="underline text-blue-500">Linkedin</a>
          </div>
          <div className="px-5 py-5 border border-solid border-black">
            <h1>Kylee Valencia</h1>
            <a href="http://www.linkedin.com/in/kylee-valencia-0b35001b9" className="underline text-blue-500">Linkedin</a>
          </div>
          <div className="px-5 py-5 border border-solid border-black">
            <h1>Muhammad Arief Rahman</h1>
            <a href="/" className="underline text-blue-500">Linkedin</a>
          </div>
          <div className="px-5 py-5 border border-solid border-black">
            <h1>Muhammad Qistan</h1>
            <a href="/" className="underline text-blue-500">Linkedin</a>
          </div>
          <div className="px-5 py-5 border border-solid border-black">
            <h1>Rifat Rachim Khatami Fasha</h1>
            <a href="/" className="underline text-blue-500">Linkedin</a>
          </div>
        </div>
      </section>
      <section className="w-full py-20 space-y-20">
        <h1 className="text-center font-semibold text-2xl">
          Demo
        </h1>
        <form onSubmit={onSubmit} className='flex flex-col space-y-5'>
          <input
            type="file"
            name="file"
            onChange={(e) => {
              setFile(e.target.files?.[0])
              setPreviewImage(undefined)
            }}
          />
          <div>
            <button type='submit' className='bg-black text-white px-5 py-2 rounded-lg hover:bg-white hover:text-black border border-black'>
              Predict
            </button>
          </div>
        </form>

        {previewImage && (
          <div className="mt-5">
            <h2 className="text-lg font-semibold mb-2">Preview Image</h2>
            <Image src={previewImage} alt="Preview" className="max-w-full h-auto" />
          </div>
        )}
      </section>
    </main>
  );
}
