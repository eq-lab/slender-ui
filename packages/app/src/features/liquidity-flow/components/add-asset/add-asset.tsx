import React from 'react'
import { SupportedTokenName } from '@/shared/stellar/constants/tokens'
import { AddAssetButton } from '../add-asset-button'
import { AssetSelect } from '../asset-select'

interface Props {
  onChange: (value?: SupportedTokenName) => void
  excludedTokens: SupportedTokenName[]
}

export function AddAsset({ onChange, excludedTokens }: Props) {
  if (excludedTokens.length === 0) {
    return null
  }
  if (excludedTokens.length === 1) {
    return <AddAssetButton onClick={() => onChange(excludedTokens[0])} />
  }
  return <AssetSelect onChange={onChange} tokenNames={excludedTokens} />
}
