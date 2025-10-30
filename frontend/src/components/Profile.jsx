import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user, token } = useAuth()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          👤 Mon profil
        </h2>

        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-3xl">
              {user?.role === 'admin' ? '👑' : '👤'}
            </div>
            <div>
              <div className="text-xl font-semibold">{user?.email}</div>
              <div className="text-sm text-neutral-400">ID: {user?.id}</div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
            <div className="bg-neutral-950 border border-neutral-800 rounded-md p-4">
              <div className="text-sm text-neutral-400 mb-1">Email</div>
              <div className="font-medium">{user?.email}</div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-md p-4">
              <div className="text-sm text-neutral-400 mb-1">Rôle</div>
              <div className="font-medium">
                {user?.role === 'admin' ? (
                  <span className="text-amber-400">👑 Administrateur</span>
                ) : (
                  <span className="text-sky-400">👤 Utilisateur</span>
                )}
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-md p-4">
              <div className="text-sm text-neutral-400 mb-1">User ID</div>
              <div className="font-medium text-xs text-neutral-300 break-all">{user?.id}</div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-md p-4">
              <div className="text-sm text-neutral-400 mb-1">Connecté depuis</div>
              <div className="font-medium">
                {user?.authenticatedAt 
                  ? new Date(user.authenticatedAt).toLocaleString('fr-FR')
                  : 'Session en cours'
                }
              </div>
            </div>
          </div>

          {/* Token Info */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-4">
            <div className="text-sm text-neutral-400 mb-2">🔑 Token JWT</div>
            <div className="font-mono text-xs text-neutral-500 break-all bg-neutral-900 p-2 rounded">
              {token ? `${token.substring(0, 50)}...` : 'Non disponible'}
            </div>
            <div className="text-xs text-neutral-500 mt-2">
              Expire: {user?.expiresAt 
                ? new Date(user.expiresAt).toLocaleString('fr-FR')
                : 'Informations non disponibles'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          🔐 Permissions
        </h3>

        <div className="space-y-2">
          <PermissionItem 
            allowed={true} 
            text="Voir les posts publics"
          />
          <PermissionItem 
            allowed={true} 
            text="Créer des posts"
          />
          <PermissionItem 
            allowed={true} 
            text="Modifier ses posts"
          />
          <PermissionItem 
            allowed={true} 
            text="Supprimer ses posts"
          />
          <PermissionItem 
            allowed={true} 
            text="Ajouter des commentaires"
          />
          <PermissionItem 
            allowed={true} 
            text="Liker des posts"
          />
          <PermissionItem 
            allowed={user?.role === 'admin'} 
            text="Accès au panneau admin"
          />
          <PermissionItem 
            allowed={user?.role === 'admin'} 
            text="Réinitialiser les données"
          />
          <PermissionItem 
            allowed={user?.role === 'admin'} 
            text="Générer des posts automatiques"
          />
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="text-sm text-blue-300 space-y-2">
          <p>💡 <strong>Note :</strong> Ceci est une démo utilisant des tokens JWT générés localement.</p>
          <p>🔐 En production, l'authentification serait gérée par Supabase Auth avec de vraies sessions utilisateur.</p>
          {user?.role === 'admin' && (
            <p>👑 <strong>Mode Admin :</strong> Vous avez accès à toutes les fonctionnalités administratives dans l'onglet Admin.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function PermissionItem({ allowed, text }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
        allowed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-600'
      }`}>
        {allowed ? '✓' : '✗'}
      </div>
      <span className={allowed ? 'text-neutral-300' : 'text-neutral-600'}>
        {text}
      </span>
    </div>
  )
}

