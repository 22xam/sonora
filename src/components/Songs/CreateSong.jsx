import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CreateSong.css";

const CreateSong = () => {
  const location = useLocation();
  const {
    id: albumId,
    title: initialTitle,
    year: initialYear,
    artist: artistId,
  } = location.state || {};

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [duration, setDuration] = useState("");
  const [songFile, setSongFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSongFile(file);
    setFileName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Mostrar el cartel de cargando

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("year", year);
      formData.append("duration", duration);
      formData.append("song_file", songFile);
      formData.append("album", albumId);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}harmonyhub/songs/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      if (!response.ok) {
        throw new Error("Fallo la carga de la cancion");
      }

      setSuccess("Cancion Agregada con exito");
      swal({
        title: "Cancion Creada con éxito",
        text: "Gracias por ser parte de la comunidad SONORA",
        icon: "success",
        buttons: "Aceptar",
        timer: "2000",
      });
      navigate(-1);

      setTitle("");
      setYear("");
      setDuration("");
      setSongFile(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false); // Ocultar el cartel de cargando
    }
  };

  return (
    <section className="fondo">
      <div className="button-container">
        <button onClick={handleBackClick} className="boton-agregar-cancion">
        Volver al album
        </button>
      </div>
      <div className="agregar-cancion">
        <article>
          <div>
            <h2 className="titulo-agregar-cancion">Agrega una cancion</h2>
            <h3 className="titulos">Album {initialTitle}</h3>
            <h4 className="titulos"> Año del Album {initialYear} </h4>
            <div>
            <form onSubmit={handleSubmit}>
              <div className="titulos">
                <button className="boton-agregar-cancion" htmlFor="songFile">Seleccione un archivo MP3</button>
                <input
                  type="file"
                  id="songFile"
                  onChange={handleFileChange}
                  required
                />
                {fileName && <p>Archivo seleccionado: {fileName}</p>}
              </div>
              <div>
                <label htmlFor="title">Titulo de la cancion</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="year">Año</label>
                <input
                  type="number"
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="duration">Duración (segundos)</label>
                <input
                  type="number"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div >
              <div className="button-container">
              <button className= "boton-agregar-cancion" type="submit">Agregar canción</button>
              </div>
              </form>
              {isLoading && <p style={{ color: "blue" }}>Cargando...</p>}
              {error && <p style={{ color: "red" }}>{error}</p>}
              {success && <p style={{ color: "green" }}>{success}</p>}
              </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default CreateSong;

