import { createContext } from 'use-context-selector'

export type WaitModal = {
  modalIsOpen: boolean
  setModalIsOpen: (value: boolean) => void
}

export const WaitModalContext = createContext<WaitModal>({} as WaitModal)
