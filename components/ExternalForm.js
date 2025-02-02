import React, { useState } from 'react';
import axios from 'axios';

// Reutilizamos los íconos del ojo
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

function ExternalForm() {
  const [file, setFile] = useState(null);
  const [phone, setPhone] = useState('+57 ');
  const [webhook, setWebhook] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Por favor, selecciona un archivo PDF válido');
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value.startsWith('+57 ')) {
      setPhone(value);
    } else {
      setPhone('+57 ' + value.replace('+57 ', ''));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !phone || !webhook) {
      setError('Por favor, completa todos los campos requeridos');
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 12) {
      setError('El número de teléfono debe tener 10 dígitos más el código de área');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('phone', phone.replace(/\s+/g, ''));
      if (password) {
        formData.append('password', password);
      }

      await axios.post(webhook, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      alert('Datos enviados exitosamente');
      
      setFile(null);
      setPhone('+57 ');
      setWebhook('');
      setPassword('');
      setError('');
      
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      setError('Error al enviar los datos: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary-600">
            Tracker de gastos de tarjeta de crédito
          </h1>
          <p className="text-secondary-500">
            Sube tu extracto para analizar tus gastos
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Archivo PDF
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-white border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Teléfono
              </label>
              <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full px-4 py-3 bg-white border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="+57 3001234567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                URL del Webhook
              </label>
              <input
                type="url"
                value={webhook}
                onChange={(e) => setWebhook(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://ejemplo.com/webhook"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Contraseña del PDF
                <span className="text-sm font-normal text-secondary-500 ml-2">
                  (opcional - solo si el documento está protegido)
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ingresa la contraseña si el PDF está protegido"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
          >
            Analizar extracto
          </button>
        </form>
      </div>
    </div>
  );
}

export default ExternalForm; 