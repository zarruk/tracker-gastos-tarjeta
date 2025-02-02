import Link from 'next/link'

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <p className="mt-2 text-base text-gray-500">Página no encontrada</p>
          <Link 
            href="/" 
            className="mt-4 inline-block text-primary-600 hover:text-primary-500"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
} 