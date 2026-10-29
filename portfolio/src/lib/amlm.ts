import { createContext, useContext } from 'react'

// Selection is shared by every photo in a scope (a page): one photo is selected at a time, and its tag opens the popup.
export interface AmLMState {
  selected: string | null
  popupOpen: boolean
  select: (id: string) => void
  toggleTag: () => void
}

export const AmLMContext = createContext<AmLMState | null>(null)

export const useAmLM = () => useContext(AmLMContext)
