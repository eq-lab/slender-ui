import { useContextSelector } from 'use-context-selector'
import { WaitModalContext } from './context'

export const useWaitModalIsOpen = () =>
  useContextSelector(WaitModalContext, (state) => state.modalIsOpen)

export const useSetWaitModalIsOpen = () =>
  useContextSelector(WaitModalContext, (state) => state.setModalIsOpen)
