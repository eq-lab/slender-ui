import React from 'react';
import { SupportedTokenName } from '@/shared/stellar/constants/tokens';
import { AddAssetButton } from '../add-asset-button';
import { AssetSelect } from '../asset-select';
import { useGetAssetsInfo } from '../../hooks/use-get-assets-info';

interface Props {
  onChange: (value?: SupportedTokenName) => void;
  excludedTokens: SupportedTokenName[];
  isDeposit?: boolean;
}

export function AddAsset({ onChange, excludedTokens, isDeposit }: Props) {
  const assetsInfo = useGetAssetsInfo(excludedTokens, isDeposit);

  if (assetsInfo.length === 1) {
    return <AddAssetButton onClick={() => onChange(excludedTokens[0])} />;
  }

  if (assetsInfo.length > 1) {
    return (
      <AssetSelect
        onChange={onChange}
        assetsInfo={assetsInfo}
        tooltipText={isDeposit ? 'Collateral Asset' : 'Debt Asset'}
      />
    );
  }

  return null;
}
