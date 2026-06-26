import { getStoreSettings } from './actions'
import { SettingsForm } from './SettingsForm'
import { Settings, AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'Global Settings | Takumi Admin',
}

export default async function SettingsPage() {
  const { data: settings, error } = await getStoreSettings()

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white flex items-center">
            <Settings className="mr-3 text-brand-gold h-8 w-8" /> 
            Store Configuration
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-lg leading-relaxed">
            Manage your master storefront logistics. Changes deployed here instantly propagate across all customer-facing UI routes.
          </p>
        </div>
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-red-950/40 text-red-400 border border-red-900/50 flex items-start">
          <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      ) : settings ? (
        <SettingsForm initialSettings={settings} />
      ) : (
        <div className="p-12 text-center bg-brand-gray/10 rounded-2xl border border-brand-border/50">
          <Settings className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-gray-300">Configuration Not Found</h3>
          <p className="text-sm text-gray-500 mt-2">The global settings row could not be found in the database. Please initialize the SQL schema.</p>
        </div>
      )}
      
    </div>
  )
}
