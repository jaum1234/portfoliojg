import express from 'express';
import "dotenv/config";
import db from './database.js';


const app = express();

app.get('/api/videos', async (req, res) => {
  const videos = await db.collection('videos').get();

  res.status(200).json({
    mensagem: "Lista de vídeos",
    dados: videos.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  })
});

app.post('/api/videos', (req, res) => {
  db.collection('videos').add({
    titulo: "teste"
  })

  res.status(201).json({
    mensagem: "Vídeo adicionado com sucesso!"
  });
});

app.get('/api/categorias', (req, res) => {

});

app.post('/api/categorias', (req, res) => {

});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
})