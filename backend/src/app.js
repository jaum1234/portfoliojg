import server from "./server.js";
import "dotenv/config";
import db from './database.js';
import { body, validationResult } from 'express-validator'

server.get('/api/videos', async (req, res) => {
  const videos = await db.collection('videos').get();

  res.status(200).json({
    mensagem: "Lista de vídeos",
    dados: videos.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  })
});

server.post('/api/videos', 
  body('titulo.pt-br').notEmpty().withMessage('Título em português é obrigatório'),
  body('titulo.en-us').notEmpty().withMessage('Título em inglês é obrigatório'),
  body('descricao.pt-br').notEmpty().withMessage('Descrição em português é obrigatória'),
  body('descricao.en-us').notEmpty().withMessage('Descrição em inglês é obrigatória'),
  body('url_video').notEmpty().withMessage('URL do vídeo é obrigatória'),
  body('url_miniatura').notEmpty().withMessage('URL da miniatura é obrigatória'),
  body('categoriaId').notEmpty().withMessage('Categoria é obrigatória'),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        mensagem: "Erro de validação",
        erros: errors.array()
      });
    }

    db.collection('videos').add(req.body)

    res.status(201).json({
      mensagem: "Vídeo adicionado com sucesso!"
    });
  }
);

server.put('/api/videos/:id', 
  body('titulo.pt-br').notEmpty().withMessage('Título em português é obrigatório'),
  body('titulo.en-us').notEmpty().withMessage('Título em inglês é obrigatório'),
  body('descricao.pt-br').notEmpty().withMessage('Descrição em português é obrigatória'),
  body('descricao.en-us').notEmpty().withMessage('Descrição em inglês é obrigatória'),
  body('url_video').notEmpty().withMessage('URL do vídeo é obrigatória'),
  body('url_miniatura').notEmpty().withMessage('URL da miniatura é obrigatória'),
  body('categoriaId').notEmpty().withMessage('Categoria é obrigatória'),  
  async (req, res) => {
    const { id } = req.params;

    try {
      const video = await db.collection('videos').doc(id).get();

      if (!video.exists) {
        return res.status(404).json({
          mensagem: "Vídeo não encontrado"
        });
      }
      
      await video.ref.update(req.body);

      return res.status(200).json({
        mensagem: "Vídeo atualizado com sucesso!"
      });
    } catch (error) {
      res.status(500).json({
        mensagem: "Erro ao atualizar vídeo",
        erro: error.message
      });
    }
});

server.get('/api/categorias', (req, res) => {

});

server.post('/api/categorias', (req, res) => {

});

server.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
})