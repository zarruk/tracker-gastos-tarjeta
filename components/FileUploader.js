const handleFileChange = async (event) => {
  const file = event.target.files[0];
  
  try {
    // Validar que haya un archivo seleccionado
    if (!file) {
      setMessage('Por favor seleccione un archivo');
      setIsError(true);
      return;
    }

    // Crear el objeto con la estructura exacta que necesitas
    const requestData = {
      phone: phoneNumber,
      fileContent: await convertFileToBase64(file)
    };

    // Mostrar mensaje de carga
    setIsError(false);
    setMessage('Enviando archivo...');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify(requestData),
      mode: 'cors',
      credentials: 'omit'
    });

    // Manejar respuesta
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    setMessage(data.message || 'Archivo enviado exitosamente');
    setIsError(false);

  } catch (error) {
    console.error('Error detallado:', error);
    setMessage(error.message || 'Error de conexión al servidor');
    setIsError(true);
  }
};

// Función auxiliar para convertir archivo a base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}; 