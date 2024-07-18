export const getKeplr = async (chainId: string) => {
  const keplr = (window as any).keplr;
  await keplr.enable(chainId);

  const offlineSigner = keplr.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  const key = await keplr.getKey(chainId);

  return { offlineSigner, accounts, key };
};
