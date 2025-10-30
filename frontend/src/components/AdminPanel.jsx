import { useState, useEffect } from 'react'
import { adminAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function AdminPanel({ onUpdate }) {
  const [diagnostics, setDiagnostics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [generateCount, setGenerateCount] = useState(5)
  const [message, setMessage] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    loadDiagnostics()
  }, [])

  async function loadDiagnostics() {
    try {
      const data = await adminAPI.diagnostics(token)
      setDiagnostics(data)
    } catch (error) {
      console.error('Error loading diagnostics:', error)
    }
  }

  async function handleReset() {
    if (!confirm('⚠️ ATTENTION : Cela va supprimer TOUTES les données (posts, commentaires, likes). Continuer ?')) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const result = await adminAPI.reset(token)
      setMessage({ type: 'success', text: result.message || 'Données réinitialisées avec succès' })
      loadDiagnostics()
      onUpdate()
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la réinitialisation' })
    } finally {
      setLoading(false)
    }
  }

  async function handleSeed() {
    setLoading(true)
    setMessage(null)

    try {
      const result = await adminAPI.seed(token)
      setMessage({ type: 'success', text: result.message || 'Données de démonstration créées' })
      loadDiagnostics()
      onUpdate()
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du seed' })
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate() {
    setLoading(true)
    setMessage(null)

    try {
      const result = await adminAPI.generate(generateCount, token)
      setMessage({ type: 'success', text: result.message || `${generateCount} posts générés` })
      loadDiagnostics()
      onUpdate()
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la génération' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          👑 Panneau d'administration
        </h2>
        <p className="text-neutral-400">
          Gérez les données de la base de données et visualisez les statistiques.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`border rounded-lg p-4 ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      {/* Diagnostics */}
      {diagnostics && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              📊 Diagnostics de la base de données
            </h3>
            <button
              onClick={loadDiagnostics}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md text-sm transition-all"
            >
              🔄 Actualiser
            </button>
          </div>

          {/* Tables Stats */}
          {diagnostics.database?.tables && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Object.entries(diagnostics.database.tables).map(([table, info]) => (
                <div
                  key={table}
                  className="bg-neutral-950 border border-neutral-800 rounded-md p-4"
                >
                  <div className="text-sm text-neutral-400 mb-1">
                    {table.replace('demo_', '')}
                  </div>
                  <div className="text-2xl font-bold">
                    {info.count !== null ? info.count : '—'}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {info.status === 'ok' ? '✓ OK' : '✗ Erreur'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Environment */}
          {diagnostics.environment && (
            <div className="bg-neutral-950 border border-neutral-800 rounded-md p-4">
              <div className="text-sm font-semibold text-neutral-400 mb-3">Environnement</div>
              <div className="grid grid-cols-2 gap-4">
                <EnvStatus label="JWT Secret" status={diagnostics.environment.hasJwtSecret} />
                <EnvStatus label="Supabase URL" status={diagnostics.environment.hasSupabaseUrl} />
                <EnvStatus label="Anon Key" status={diagnostics.environment.hasAnonKey} />
                <EnvStatus label="Service Role" status={diagnostics.environment.hasServiceRoleKey} />
              </div>
            </div>
          )}

          {/* Executed By */}
          {diagnostics.executedBy && (
            <div className="mt-4 text-xs text-neutral-500">
              📝 Exécuté par : {diagnostics.executedBy}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seed */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            🌱 Seed de démonstration
          </h3>
          <p className="text-sm text-neutral-400 mb-4">
            Créer 2 posts de démonstration avec commentaires et likes.
          </p>
          <button
            onClick={handleSeed}
            disabled={loading}
            className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-md transition-all disabled:opacity-50"
          >
            {loading ? 'Chargement...' : '🌱 Créer données démo'}
          </button>
        </div>

        {/* Generate */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            ✨ Génération automatique
          </h3>
          <p className="text-sm text-neutral-400 mb-4">
            Générer plusieurs posts aléatoires avec commentaires et likes.
          </p>
          <div className="flex gap-2 mb-3">
            <input
              type="number"
              min="1"
              max="20"
              value={generateCount}
              onChange={(e) => setGenerateCount(parseInt(e.target.value) || 1)}
              className="flex-1 bg-neutral-950 border border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <span className="flex items-center text-sm text-neutral-400">posts</span>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full px-4 py-2 bg-sky-500 hover:bg-sky-400 text-black font-semibold rounded-md transition-all disabled:opacity-50"
          >
            {loading ? 'Génération...' : '✨ Générer'}
          </button>
        </div>
      </div>

      {/* Reset - Danger Zone */}
      <div className="bg-rose-500/10 border-2 border-rose-500/30 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-2 text-rose-400 flex items-center gap-2">
          ⚠️ Zone dangereuse
        </h3>
        <p className="text-sm text-neutral-400 mb-4">
          Cette action est irréversible. Tous les posts, commentaires et likes seront supprimés définitivement.
        </p>
        <button
          onClick={handleReset}
          disabled={loading}
          className="px-6 py-2 bg-rose-500 hover:bg-rose-400 text-white font-semibold rounded-md transition-all disabled:opacity-50"
        >
          {loading ? 'Suppression...' : '🗑️ Réinitialiser toutes les données'}
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="text-sm text-blue-300 space-y-2">
          <p>💡 <strong>Astuce :</strong> Utilisez "Seed" pour créer rapidement des données de test.</p>
          <p>🚀 <strong>Génération :</strong> Créez plusieurs posts d'un coup (1-20).</p>
          <p>⚠️ <strong>Reset :</strong> Utilisez uniquement en développement ou pour nettoyer les données de test.</p>
        </div>
      </div>
    </div>
  )
}

function EnvStatus({ label, status }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${status ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      <span className="text-sm text-neutral-400">{label}</span>
      <span className="text-xs text-neutral-500 ml-auto">
        {status ? '✓' : '✗'}
      </span>
    </div>
  )
}

