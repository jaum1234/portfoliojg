import fetch from "node-fetch";
import "dotenv/config";

export default async function() {
  const videos = await fetch(`${process.env.BACKEND_URL}/api/videos`);
  if (!videos.ok) throw new Error("Erro ao buscar vídeos da API");
  const videosData = await videos.json();

  const categorias = await fetch(`${process.env.BACKEND_URL}/api/categorias`);
  if (!categorias.ok) throw new Error("Erro ao buscar categorias da API");
  const categoriasData = await categorias.json();

  return {
    videos: videosData.dados,
    categorias: categoriasData.dados,
  };
}