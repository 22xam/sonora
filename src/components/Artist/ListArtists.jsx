import { useState, useEffect } from "react";
import axios from "axios";
import CardArtist from "./CardArtist.jsx";
import HeaderArtist from "./HeaderArtist.jsx";
import ArtistForm from "./ArtistForm.jsx";
import "./ListArtists.css";

function ArtistList() {
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [currentPageUrl, setCurrentPageUrl] = useState(
    "https://sandbox.academiadevelopers.com/harmonyhub/artists/"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const response = await axios.get(currentPageUrl, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        setArtists(response.data.results);
        setFilteredArtists(response.data.results);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);
      } catch (error) {
        console.error("Error fetching artists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [currentPageUrl]);

  useEffect(() => {
    const results = artists.filter((artist) =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArtists(results);
  }, [searchTerm, artists]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPageUrl(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      setCurrentPageUrl(previousPage);
    }
  };

  return (
    <div>
      <HeaderArtist />
      <section className="fondo">
        <div className="barra-busqueda">
          <input 
            type="text"
            placeholder="Busca aquí a tu artista preferido"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <>
            <ul className="artist-list-grid">
              {filteredArtists.map((artist) => (
                <CardArtist
                  key={artist.id}
                  name={artist.name}
                  bio={artist.bio}
                  image={artist.image}
                  website={artist.website}
                />
              ))}
            </ul>
            <div className="control-paginas">
              <button className="Ant-Sig" onClick={handlePreviousPage} disabled={!previousPage}>
                Anterior
              </button>
              <button className="Ant-Sig" onClick={handleNextPage} disabled={!nextPage}>
                Siguiente
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default ArtistList;