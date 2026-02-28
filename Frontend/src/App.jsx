import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const PAGE_SIZE = 5

function App() {
  const [songs, setSongs] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [newSong, setNewSong] = useState({ nombre: '', artista: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const paginationInfo = useMemo(() => {
    const disabledPrev = currentPage <= 1
    const disabledNext = currentPage >= totalPages

    return { disabledPrev, disabledNext }
  }, [currentPage, totalPages])

  const normalizeSongsResponse = (payload) => {
    if (Array.isArray(payload)) {
      const computedTotalPages = Math.max(1, Math.ceil(payload.length / PAGE_SIZE))
      return {
        list: payload,
        total: computedTotalPages
      }
    }

    const list = payload?.songs ?? payload?.data ?? payload?.items ?? []
    const total = Number(payload?.totalPages ?? payload?.pages ?? 1)

    return {
      list: Array.isArray(list) ? list : [],
      total: Number.isFinite(total) && total > 0 ? total : 1
    }
  }

  const loadSongs = async (page, query) => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(PAGE_SIZE))
      if (query.trim()) {
        params.set('search', query.trim())
      }

      const response = await fetch(`${API_URL}/songs?${params.toString()}`)
      if (!response.ok) {
        throw new Error('No se pudieron cargar las canciones.')
      }

      const data = await response.json()
      const normalized = normalizeSongsResponse(data)
      setSongs(normalized.list)
      setTotalPages(normalized.total)
    } catch (requestError) {
      setError(requestError.message)
      setSongs([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSongs(currentPage, searchQuery)
  }, [currentPage, searchQuery])

  const handleSearch = () => {
    setCurrentPage(1)
    setSearchQuery(searchInput)
  }

  const handleAddSong = async (event) => {
    event.preventDefault()
    setError('')
    setSuccessMessage('')

    const nombre = newSong.nombre.trim()
    const artista = newSong.artista.trim()

    if (!nombre || !artista) {
      setError('Debes completar nombre y artista.')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, artista })
      })

      if (!response.ok) {
        throw new Error('No se pudo agregar la cancion.')
      }

      setNewSong({ nombre: '', artista: '' })
      setSuccessMessage('Cancion agregada correctamente.')
      await loadSongs(currentPage, searchQuery)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">Carlos Barrientos y Diego Cordón</p>
        <h1>Laboratorio 4 - Programación Web</h1>
      </section>

      <section className="panel">
        <h2>Agregar canción</h2>
        <form className="song-form" onSubmit={handleAddSong}>
          <input
            type="text"
            placeholder="Nombre de la canción"
            value={newSong.nombre}
            onChange={(event) =>
              setNewSong((previous) => ({ ...previous, nombre: event.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Nombre del artista"
            value={newSong.artista}
            onChange={(event) =>
              setNewSong((previous) => ({ ...previous, artista: event.target.value }))
            }
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Agregar canción'}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="search-row">
          <h2>Lista de canciones</h2>
          <div className="search-controls">
            <input
              type="text"
              placeholder="Buscar por nombre o artista"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <button type="button" onClick={handleSearch}>
              Buscar
            </button>
          </div>
        </div>

        {error && <p className="feedback error">{error}</p>}
        {successMessage && <p className="feedback success">{successMessage}</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Artista</th>
              </tr>
            </thead>
            <tbody>
              {!loading && songs.length === 0 && (
                <tr>
                  <td colSpan="2" className="empty-row">
                    Sin canciones para mostrar.
                  </td>
                </tr>
              )}
              {songs.map((song, index) => (
                <tr key={`${song.nombre}-${song.artista}-${index}`}>
                  <td>{song.nombre}</td>
                  <td>{song.artista}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="loading">Cargando canciones...</p>}
        </div>

        <div className="pagination">
          <button
            type="button"
            onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
            disabled={paginationInfo.disabledPrev}
          >
            Anterior
          </button>
          <span>
            Pagina {currentPage} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
            disabled={paginationInfo.disabledNext}
          >
            Siguiente
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
