'use client'

import Image from 'next/image'
import { FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { Prediction, Models } from './response'
import Member from "@/app/component/member";
import Lottie from "lottie-react";
import lottieMeetingAnimation from '@/app/lottie/meetingAnimation.json'

export default function Home() {
  const [file, setFile] = useState<File>()
  const [previewImage, setPreviewImage] = useState<string>()
  const [isDemoAvailable, setIsDemoAvailable] = useState<boolean>(false)
  const [prediction, setPrediction] = useState<Prediction>()
  const [submission, setSubmission] = useState<boolean>(false)
  const [models, setModels] = useState<Models>()

  useEffect(() => {
    async function checkDemoAvailability() {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_HOST + '/predict', { method: 'OPTIONS' })
        if (!response.ok) {
          setIsDemoAvailable(false)
          return
        }

        const modelListResponse = await fetch(process.env.NEXT_PUBLIC_API_HOST + '/models', { method: 'GET' })
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
    const response = await fetch(process.env.NEXT_PUBLIC_API_HOST + '/predict', {
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

  function demo() {
    if (isDemoAvailable) {
      return (
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
      );
    }

    return (
      <div>
        <p className='text-center'>
          No demo is available currently, please contact <a href='https://www.linkedin.com/in/insomnius/'>Muhammad Arief Rahman</a> for demo request.
        </p>
      </div>)
  }

  return (
    <main>
      <section className="py-52 space-y-2 px-16 flex">
        <div className='my-auto'>
          <h1 className="font-bold text-4xl font-montserrat tracking-wide">
            AI Face Gender Recognitions Projects
          </h1>
          <h2 className='font-bold text-2xl font-lato'>
            by Joseph Redmon
          </h2>
          <p className='font-lato'>
            This is our web demo portofolio for AI Indonesia first project to create gender recognitions artificial intellegence.
          </p>
        </div>
        <div className='w-1/3 mx-auto'>
          <Lottie animationData={lottieMeetingAnimation} />
        </div>
      </section>

      <Member></Member>

      <section className="w-full py-20 space-y-2">
        <h1 className="text-center font-semibold text-2xl">
          Demo
        </h1>
        {demo()}

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
