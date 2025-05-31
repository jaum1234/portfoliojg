import express from 'express';

const app = express();

app.get('/videos', (req, res) => {

});

app.post('/videos', (req, res) => {

});

app.get('/categorias', (req, res) => {

});

app.post('/categorias', (req, res) => {

});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
})