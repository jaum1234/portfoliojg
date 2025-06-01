import server from "./server.js";
import "dotenv/config";
import db from './database.js';
import { param, body, validationResult } from 'express-validator'

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
  body('titulo.pt-br').notEmpty().withMessage('Título em português é obrigatório').isString().withMessage('Título em português deve ser uma string'),
  body('titulo.en-us').notEmpty().withMessage('Título em inglês é obrigatório').isString().withMessage('Título em inglês deve ser uma string'),
  body('descricao.pt-br').notEmpty().withMessage('Descrição em português é obrigatória').isString().withMessage('Descrição em português deve ser uma string'),
  body('descricao.en-us').notEmpty().withMessage('Descrição em inglês é obrigatória').isString().withMessage('Descrição em inglês deve ser uma string'),
  body('url_video').notEmpty().withMessage('URL do vídeo é obrigatória').isString().withMessage('URL do vídeo deve ser uma string').isURL().withMessage('URL do vídeo deve ser válida'),
  body('url_miniatura').notEmpty().withMessage('URL da miniatura é obrigatória').isString().withMessage('URL da miniatura deve ser uma string').isURL().withMessage('URL da miniatura deve ser válida'),
  body('categoriaId').notEmpty().withMessage('Categoria é obrigatória').isString().withMessage('Categoria deve ser uma string'),
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
  body('titulo.pt-br').notEmpty().withMessage('Título em português é obrigatório').isString().withMessage('Título em português deve ser uma string'),
  body('titulo.en-us').notEmpty().withMessage('Título em inglês é obrigatório').isString().withMessage('Título em inglês deve ser uma string'),
  body('descricao.pt-br').notEmpty().withMessage('Descrição em português é obrigatória').isString().withMessage('Descrição em português deve ser uma string'),
  body('descricao.en-us').notEmpty().withMessage('Descrição em inglês é obrigatória').isString().withMessage('Descrição em inglês deve ser uma string'),
  body('url_video').notEmpty().withMessage('URL do vídeo é obrigatória').isString().withMessage('URL do vídeo deve ser uma string').isURL().withMessage('URL do vídeo deve ser válida'),
  body('url_miniatura').notEmpty().withMessage('URL da miniatura é obrigatória').isString().withMessage('URL da miniatura deve ser uma string').isURL().withMessage('URL da miniatura deve ser válida'),
  body('categoriaId').notEmpty().withMessage('Categoria é obrigatória').isString().withMessage('Categoria deve ser uma string'),  
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        mensagem: "Erro de validação",
        erros: errors.array()
      });
    }

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

server.delete('/api/videos/:id', 
  param('id').isString().withMessage('ID do vídeo deve ser uma string').notEmpty().withMessage('ID do vídeo é obrigatório'),
    async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        mensagem: "Erro de validação",
        erros: errors.array()
      });
    }

    const { id } = req.params;

    try {
      const video = await db.collection('videos').doc(id).get();

      if (!video.exists) {
        return res.status(404).json({
          mensagem: "Vídeo não encontrado"
        });
      }

      await video.ref.delete();

      return res.status(200).json({
        mensagem: "Vídeo removido com sucesso!"
      });
    } catch (error) {
      res.status(500).json({
        mensagem: "Erro ao remover vídeo",
        erro: error.message
      });
    }
  }
);

server.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
})