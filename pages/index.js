import { useState, useCallback } from 'react'
import axios from 'axios'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'

export default function Home() {
  const [file, setFile] = useState(null)
  const [phone, setPhone] = useState('+57')
  const [password, setPassword] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOut = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const droppedFile = files[0]
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile)
      } else {
        setError('Por favor, sube solo archivos PDF')
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !phone || !webhookUrl) {
      setError('Por favor completa los campos requeridos')
      return
    }

    try {
      new URL(webhookUrl)
    } catch (e) {
      setError('Por favor ingresa una URL válida')
      return
    }

    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('phone', phone)
    formData.append('webhookUrl', webhookUrl)
    if (password) formData.append('password', password)

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('Datos enviados:', response.data)
      setFile(null)
      setPassword('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError('Error al procesar el archivo: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
            Lector de Extractos
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Sube tu extracto bancario en PDF y nosotros nos encargamos del resto
          </p>
        </div>

        <div className="mt-12">
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Selector de archivo con preview */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Archivo PDF
                </label>
                <div
                  className={`
                    mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed 
                    rounded-xl transition-colors duration-200 ease-in-out
                    ${isDragging ? 'border-primary-500 bg-primary-50' : ''}
                    ${file ? 'border-primary-300 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
                  `}
                  onDragEnter={handleDragIn}
                  onDragLeave={handleDragOut}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    <div className="flex flex-col items-center">
                      {!file ? (
                        <>
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600 mt-4">
                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                              <span>Selecciona un archivo</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={(e) => {
                                  const file = e.target.files[0]
                                  if (file && file.type === 'application/pdf') {
                                    setFile(file)
                                  } else {
                                    setError('Por favor, sube solo archivos PDF')
                                  }
                                }}
                                accept=".pdf"
                                required
                              />
                            </label>
                            <p className="pl-1">o arrastra y suelta</p>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <svg className="h-6 w-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-gray-600">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFile(null)
                              setError(null)
                            }}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">PDF hasta 10MB</p>
                  </div>
                </div>
              </div>

              {/* Campo de URL del Webhook - Nuevo */}
              <div className="space-y-2">
                <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700">
                  URL del Webhook *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="url"
                    id="webhookUrl"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://tu-webhook.com/endpoint"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  URL donde se enviará el extracto procesado
                </p>
              </div>

              {/* Teléfono con selector de país */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Número de teléfono *
                </label>
                <PhoneInput
                  defaultCountry="co"
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              {/* Contraseña opcional */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña del PDF (opcional)
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ingresa la contraseña si el PDF está protegido"
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">Archivo procesado exitosamente</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !file || !phone || !webhookUrl}
                className={`
                  w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                  text-sm font-medium text-white shadow-sm transition-colors duration-200
                  ${loading || !file || !phone || !webhookUrl
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </div>
                ) : 'Procesar extracto'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 