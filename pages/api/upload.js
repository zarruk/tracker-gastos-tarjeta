import multer from 'multer';
import { createRouter } from 'next-connect';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path';

// Asegurarse de que el directorio uploads existe
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: function (req, file, cb) {
      cb(null, new Date().getTime() + '-' + file.originalname)
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

const router = createRouter();

router
  .use(upload.single('file'))
  .post(async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
      }

      const { phone, password, webhookUrl } = req.body;

      if (!phone || !webhookUrl) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
      }

      // Validar formato de URL
      try {
        new URL(webhookUrl);
      } catch (e) {
        return res.status(400).json({ error: 'URL del webhook inválida' });
      }

      // Crear un nuevo FormData
      const formData = new FormData();
      
      // Agregar el archivo como stream
      formData.append('file', fs.createReadStream(req.file.path));
      formData.append('phone', phone);
      if (password) {
        formData.append('password', password);
      }

      try {
        // Usar la URL proporcionada por el usuario
        const response = await axios.post(webhookUrl, formData, {
          headers: {
            ...formData.getHeaders(),
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'User-Agent': 'PostmanRuntime/7.43.0'
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity
        });

        // Eliminar el archivo temporal después de enviarlo
        fs.unlinkSync(req.file.path);

        return res.status(200).json({ 
          message: 'Datos procesados exitosamente',
          webhookResponse: response.data
        });
      } catch (webhookError) {
        console.error('Error al enviar al webhook:', webhookError);
        // Eliminar el archivo temporal en caso de error
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ 
          error: 'Error al procesar la solicitud en el servidor remoto',
          details: webhookError.message
        });
      }
    } catch (error) {
      console.error('Error en el procesamiento:', error);
      // Limpiar archivo si existe
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error al eliminar archivo temporal:', unlinkError);
        }
      }
      return res.status(500).json({ 
        error: 'Error interno del servidor',
        details: error.message
      });
    }
  });

export default router.handler();

export const config = {
  api: {
    bodyParser: false,
  },
}; 