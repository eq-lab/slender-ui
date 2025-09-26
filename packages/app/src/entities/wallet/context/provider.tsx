'use client';

import React, { useEffect, useState } from 'react';
import { getAddress, isConnected as getIsConnected } from '@stellar/freighter-api';
import { WalletContext } from '@/shared/contexts/wallet';

export function WalletProvider({ children }: { children: JSX.Element }) {
  const [address, setAddress] = useState<string>();
  const [isConnected, setIsConnected] = useState<boolean>();

  useEffect(() => {
    (async () => {
      const res = await getIsConnected();
      setIsConnected(res.isConnected);
    })();
  }, []);

  useEffect(() => {
    if (!isConnected) return () => {};
    const getWalletAddress = async () => {
      const userInfo = await getAddress();
      setAddress(userInfo.address);
    };
    getWalletAddress();

    const id = setInterval(() => {
      getWalletAddress();
    }, 2000);
    return () => {
      clearInterval(id);
    };
  }, [isConnected]);

  return (
    <WalletContext.Provider value={{ address, setAddress, isConnected }}>
      {children}
    </WalletContext.Provider>
  );
}
