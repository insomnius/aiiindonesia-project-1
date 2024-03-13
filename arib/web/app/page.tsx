'use client'

import Image from 'next/image'
import { FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { Prediction, Models } from './response'

export default function Home() {
  const [file, setFile] = useState<File>()
  const [previewImage, setPreviewImage] = useState<string>()
  const [isDemoAvailable, setIsDemoAvailable] = useState<boolean>(true)
  const [prediction, setPrediction] = useState<Prediction>()
  const [submission, setSubmission] = useState<boolean>(false)
  const [models, setModels] = useState<Models>()

  useEffect(() => {
    async function checkDemoAvailability() {
      try {
        const response = await fetch('http://localhost:5000/predict', { method: 'OPTIONS' })
        if (!response.ok) {
          setIsDemoAvailable(false)
          return
        }

        const modelListResponse = await fetch('http://localhost:5000/models', { method: 'GET' })
        const models = await modelListResponse.json() as Models
        setModels(models)
      } catch (error) {
        setIsDemoAvailable(false)
      }
    }

    checkDemoAvailability()
  }, [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submission) {
      return
    }
    setPrediction(undefined)
    setSubmission(true)

    if (!file) {
      alert("File cannot be empty...")
      setSubmission(false)
      return
    }

    const formData = new FormData(event.currentTarget)
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: formData,
    })

    // Handle response if necessary
    const data = await response.json() as Prediction
    setPrediction(data)

    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewImage(url)
      setSubmission(false)
      return () => URL.revokeObjectURL(url)
    }

    setSubmission(false)
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
      <section className="w-full py-20 space-y-2">
        <h1 className="text-center font-semibold text-2xl">
          Demo
        </h1>
        <form onSubmit={onSubmit} className='space-y-5'>
          {models && (
            <div className="flex flex-col space-y-2">
              <label htmlFor="formModel" className='font-semibold'>Model</label>
              <select id="formModel" name="model" className='py-4 px-2 border border-black'>
                {models.models.map((model) => (
                  <option key={model}>{model}</option>
                ))}
              </select>
            </div>
          )}
          <div className='flex space-x-5'>
            <div className='flex-grow'>
              <input
                type="file"
                name="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  setFile(file)
                  if (file) {
                    const url = URL.createObjectURL(file)
                    setPreviewImage(url)
                    return () => URL.revokeObjectURL(url)
                  }
                }}
                className='py-4 px-2 border border-black w-full'
              />
            </div>
            <div className='my-auto'>
              <button type='submit' className='bg-gray-100 px-5 py-2 rounded-lg hover:bg-gray-300  border border-gray-500'>
                Predict
              </button>
            </div>
          </div>
        </form>

        {previewImage && (
          <div className='flex'>
            <div className="mt-5">
              <h2 className="text-lg font-semibold mb-2">Preview Image</h2>
              {prediction && (
                <div>
                  <p>Gender: <span className='font-bold'>{prediction.gender}</span></p>
                </div>
              )}
              <Image src={previewImage} alt="Preview" className="max-w-full h-auto" width={399} height={399} />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
