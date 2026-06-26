'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { ChevronDown, Plus, Trash2, Loader2, Check } from 'lucide-react'
import { Category, createCategory, deleteCategory } from '@/app/admin/(dashboard)/categories/actions'

interface CategoryComboboxProps {
  initialCategories: Category[]
  defaultValue?: string
}

export function CategoryCombobox({ initialCategories, defaultValue = 'Uncategorized' }: CategoryComboboxProps) {
  // Sync state with props in case server action revalidates the layout
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter list based on active search
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase())
  )

  const exactMatchExists = categories.some(
    cat => cat.name.toLowerCase() === search.toLowerCase().trim()
  )

  const handleCreate = async () => {
    if (!search.trim() || exactMatchExists) return
    
    setIsCreating(true)
    const newCategoryName = search.trim()
    const result = await createCategory(newCategoryName)
    
    if (result.success) {
      // Optimistically update the UI for instant snap response
      const optimisticCat: Category = {
        id: crypto.randomUUID(), 
        name: newCategoryName,
        created_at: new Date().toISOString()
      }
      // Re-sort alphabetically immediately
      setCategories(prev => [...prev, optimisticCat].sort((a, b) => a.name.localeCompare(b.name)))
      setSelectedCategory(newCategoryName)
      setSearch('')
      setIsOpen(false)
    } else {
      alert(result.error)
    }
    setIsCreating(false)
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation() // Prevent the click from triggering the row selection
    setDeletingId(id)
    
    const result = await deleteCategory(id)
    if (result.success) {
      // Remove from local list instantly
      setCategories(prev => prev.filter(c => c.id !== id))
    } else {
      alert(result.error)
    }
    setDeletingId(null)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault() // STOP the master form from submitting
      if (search.trim() && !exactMatchExists) {
        handleCreate()
      } else if (filteredCategories.length > 0) {
        setSelectedCategory(filteredCategories[0].name)
        setSearch('')
        setIsOpen(false)
      }
    }
  }

  const handleSelect = (name: string) => {
    setSelectedCategory(name)
    setSearch('')
    setIsOpen(false)
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Hidden input binds the selected value directly to FormData for Next.js Actions */}
      <input type="hidden" name="category" value={selectedCategory} />
      
      {/* Custom Trigger Display */}
      <div 
        className={`w-full px-4 py-3 rounded-lg border bg-brand-gray text-white flex items-center justify-between cursor-pointer group transition-all ${
          isOpen ? 'border-brand-gold ring-1 ring-brand-gold' : 'border-brand-border hover:border-brand-gold/50'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedCategory ? "text-white" : "text-gray-500"}>
          {selectedCategory}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 group-hover:text-brand-gold transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-gold' : ''}`} />
      </div>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-brand-dark border border-brand-border rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Sticky Search Input */}
          <div className="p-2 border-b border-brand-border bg-brand-dark/95 backdrop-blur-sm sticky top-0 z-10">
            <input 
              type="text"
              autoFocus
              className="w-full px-3 py-2.5 bg-brand-gray/50 border border-brand-border/50 rounded-lg text-sm text-white focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 placeholder-gray-500 transition-all font-mono"
              placeholder="Search or type to create..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Scrolling Results Box */}
          <div className="max-h-56 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-brand-gold/20 scrollbar-track-transparent">
            {filteredCategories.length > 0 ? (
              <ul className="space-y-1">
                {filteredCategories.map((cat) => (
                  <li 
                    key={cat.id}
                    onClick={() => handleSelect(cat.name)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-brand-gray/70 cursor-pointer text-sm text-gray-300 transition-colors group/item"
                  >
                    <span className="flex items-center">
                      {selectedCategory === cat.name ? (
                        <Check className="w-4 h-4 mr-3 text-brand-gold shrink-0" />
                      ) : (
                        <div className="w-4 h-4 mr-3 shrink-0"></div>
                      )}
                      <span className={selectedCategory === cat.name ? "text-brand-gold font-bold tracking-wide" : "font-medium"}>
                        {cat.name}
                      </span>
                    </span>
                    
                    {/* Delete Action (hidden if currently selected to prevent deleting active data) */}
                    {selectedCategory !== cat.name && (
                      <button 
                        type="button"
                        onClick={(e) => handleDelete(e, cat.id)}
                        disabled={deletingId === cat.id}
                        className="opacity-0 group-hover/item:opacity-100 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/50 hover:border-red-900/50 border border-transparent rounded-md transition-all disabled:opacity-50"
                        title="Permanently delete category"
                      >
                        {deletingId === cat.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-6 text-center text-xs text-gray-500">
                No matching categories found.
              </div>
            )}

            {/* Smart Create Button */}
            {search.trim() !== '' && !exactMatchExists && (
              <div className="mt-2 pt-2 border-t border-brand-border">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="w-full flex items-center justify-start px-3 py-3 text-sm font-bold tracking-wide text-brand-gold bg-brand-gold/5 hover:bg-brand-gold/10 rounded-lg transition-all border border-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,175,55,0.05)] hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-3" />
                  )}
                  Create "{search}"
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
