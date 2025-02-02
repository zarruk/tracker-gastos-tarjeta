const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const upload = multer();

app.use(cors());

// Agregar endpoint GET para pruebas
app.get('/webhook', (req, res) => {
  res.json({
    status: 'Servidor webhook activo',
    message: 'Use POST para enviar archivos'
  });
});

app.post('/webhook', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    const phone = req.body.phone;
    const password = req.body.password;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No se recibió ningún archivo'
      });
    }

    console.log('Archivo recibido:', {
      nombre: file.originalname,
      tipo: file.mimetype,
      tamaño: file.size,
      telefono: phone,
      tienePassword: !!password
    });
    
    res.status(200).json({
      success: true,
      message: "Archivo recibido correctamente",
      fileInfo: {
        name: file.originalname,
        type: file.mimetype,
        size: file.size
      }
    });

  } catch (error) {
    console.error('Error procesando el archivo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor al procesar el archivo'
    });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor webhook corriendo en puerto ${PORT}`);
}); 