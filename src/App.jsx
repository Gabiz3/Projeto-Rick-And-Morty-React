import React, { useEffect, useState, useCallback } from 'react';
import logoImg from '/public/img/titulo_Img.jpeg';

function App() {
  const [personagem, setPersonagem] = useState({});
  const [personagemId, setPersonagemId] = useState(1);
  const [episodios, setEpisodios] = useState([]);
  const [alerta, setAlerta] = useState(null);
  const [valorInput, setValorInput] = useState('');

  const maxPersonagens = 826;

  const buscarPersonagem = async (id) => {
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
      if (!response.ok) throw new Error('Personagem não encontrado.');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar personagem:', error);
      mostrarAlerta(error.message, 'error');
      throw error;
    }
  };

  const buscarPersonagemPorNome = async (nome) => {
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${nome}`);
      if (!response.ok) throw new Error('Personagem não encontrado.');
      const data = await response.json();
      if (data.results.length > 0) {
        return data.results[0];
      } else {
        throw new Error('Personagem não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar personagem:', error);
      mostrarAlerta(error.message, 'error');
      throw error;
    }
  };

  const atualizarInfoPersonagem = async (personagem) => {
    setPersonagem(personagem);
    const promessasEpisodios = personagem.episode.map(async (urlEpisodio) => {
      const response = await fetch(urlEpisodio);
      return await response.json();
    });

    try {
      const episodios = await Promise.all(promessasEpisodios);
      setEpisodios(episodios);
    } catch (error) {
      console.error('Erro ao buscar episódios:', error);
    }
  };

  const atualizarPersonagem = useCallback(async (id) => {
    const personagem = await buscarPersonagem(id);
    if (personagem) atualizarInfoPersonagem(personagem);
  }, []);

  useEffect(() => {
    atualizarPersonagem(personagemId);
  }, [personagemId, atualizarPersonagem]);

  const mostrarAlerta = (mensagem, tipo) => {
    setAlerta({ mensagem, tipo });
    setTimeout(() => {
      setAlerta(null);
    }, 3000);
  };

  const lidarComBusca = async () => {
    const valorAjustado = valorInput.trim();
    if (!valorAjustado) {
      mostrarAlerta('Por favor, insira um ID ou nome de personagem.', 'error');
      return;
    }

    const valorConvertido = parseInt(valorAjustado, 10);
    if (!isNaN(valorConvertido) && valorConvertido > 0 && valorConvertido <= maxPersonagens) {
      setPersonagemId(valorConvertido);
    } else if (isNaN(valorConvertido)) {
      try {
        const personagem = await buscarPersonagemPorNome(valorAjustado);
        if (personagem) {
          setPersonagemId(personagem.id);
        } else {
          mostrarAlerta('Personagem não encontrado.', 'error');
        }
      } catch (error) {
        mostrarAlerta('Personagem não encontrado.', 'error');
      }
    } else {
      mostrarAlerta('ID inválido.', 'error');
    }
  };

  const handleKeyDown = (evento) => {
    if (evento.key === 'ArrowLeft') {
      setPersonagemId((idAnterior) => (idAnterior - 1 > 0 ? idAnterior - 1 : maxPersonagens));
    } else if (evento.key === 'ArrowRight') {
      setPersonagemId((idAnterior) => (idAnterior + 1 <= maxPersonagens ? idAnterior + 1 : 1));
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex="0">
      <header>
        <img className="logoimg" src={logoImg} alt="Logo Rick and Morty" />
      </header>
      <div className="character-info">
        <div className="portal-container">
          <div className="portal-gif">
            <img src="https://media.giphy.com/media/i2tLw5ZyikSFdkeGHT/giphy.gif" alt="Gif" />
          </div>
          <div className="character-image-container">
            <img src={personagem.image} alt="Personagem" />
          </div>
        </div>
        <div className="character-details">
          <div className="attributes">
            <p><strong>Nome:</strong> {personagem.name}</p>
            <p><strong>Status:</strong> {personagem.status}</p>
            <p><strong>Espécie:</strong> {personagem.species}</p>
            <p><strong>Gênero:</strong> {personagem.gender}</p>
            <p><strong>Origem:</strong> {personagem.origin?.name}</p>
            <p><strong>Localização:</strong> {personagem.location?.name}</p>
            <p><strong>Criado em:</strong> {personagem.created}</p>
            <p><strong>ID:</strong> {personagem.id}</p>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="ID ou nome do personagem"
              value={valorInput}
              onChange={(e) => setValorInput(e.target.value)}
              onKeyPress={(evento) => {
                if (evento.key === 'Enter') lidarComBusca();
              }}
            />
            <button onClick={lidarComBusca}>Buscar</button>
          </div>
          <div className="navigation-buttons">
            <button onClick={() => setPersonagemId((idAnterior) => (idAnterior - 1 > 0 ? idAnterior - 1 : maxPersonagens))}>
              Anterior
            </button>
            <button onClick={() => setPersonagemId((idAnterior) => (idAnterior + 1 <= maxPersonagens ? idAnterior + 1 : 1))}>
              Próximo
            </button>
          </div>
        </div>
      </div>
      <section className="episode-info">
        <h3>Episódios</h3>
        <div className="episodes">
          {episodios.map((episodio, index) => (
            <div key={index} className="episode">
              {episodio.episode} - {episodio.name}
            </div>
          ))}
        </div>
      </section>
      {alerta && (
        <div className={`custom-alert ${alerta.tipo}`}>
          {alerta.mensagem}
        </div>
      )}
      <footer>
        <p>Gaby-2024</p>
      </footer>
    </div>
  );
}

export default App;
