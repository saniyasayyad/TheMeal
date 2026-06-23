import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { authApi } from '../api/auth.api'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'

const DIETARY_OPTIONS = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo']
const CUISINE_OPTIONS = ['Italian', 'Indian', 'Chinese', 'Mexican', 'Japanese', 'Thai', 'French', 'Mediterranean']

export function Profile() {
  const { user, setUser } = useAuth()
  const [saving, setSaving] = useState(false)
  const [prefs, setPrefs] = useState({
    dietaryTags: user?.preferences.dietaryTags ?? [],
    cuisines:    user?.preferences.cuisines    ?? [],
    allergies:   user?.preferences.allergies   ?? [],
  })
  const [allergyInput, setAllergyInput] = useState(prefs.allergies.join(', '))

  const toggle = (key: 'dietaryTags' | 'cuisines', val: string) => {
    setPrefs((p) => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter((v) => v !== val) : [...p[key], val],
    }))
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await authApi.updatePreferences({
        ...prefs,
        allergies: allergyInput.split(',').map((s) => s.trim()).filter(Boolean),
      })
      setUser(res.data.data!.user)
      toast.success('Preferences saved!')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-2xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border shadow-sm p-6 space-y-6">
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Dietary Preferences</h2>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => toggle('dietaryTags', opt)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${prefs.dietaryTags.includes(opt) ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Favourite Cuisines</h2>
          <div className="flex flex-wrap gap-2">
            {CUISINE_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => toggle('cuisines', c)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${prefs.cuisines.includes(c) ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-2">Allergies</h2>
          <input
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            placeholder="nuts, shellfish, dairy (comma-separated)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <Button isLoading={saving} onClick={save}>Save Preferences</Button>
      </div>
    </main>
  )
}
