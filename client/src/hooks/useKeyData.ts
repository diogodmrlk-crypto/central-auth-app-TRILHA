import { useState, useCallback, useEffect } from 'react';
import { KeyData, Package, ChartData } from '@/types';
import { useStorage } from './useStorage';

const STORAGE_KEYS = {
  keys: 'ferrao_keys',
  packages: 'ferrao_packages',
  limit: 'ferrao_limit',
  chartData: 'ferrao_chart',
  apiKeys: 'ferrao_api_keys',
  deleted: 'ferrao_deleted',
};

export const useKeyData = () => {
  const [generatedKeys, setGeneratedKeys] = useStorage<KeyData[]>(STORAGE_KEYS.keys, []);
  const [apiKeys, setApiKeys] = useStorage<KeyData[]>(STORAGE_KEYS.apiKeys, []);
  const [packages, setPackages] = useStorage<Package[]>(STORAGE_KEYS.packages, [
    {
      id: 'default',
      name: 'API',
      url: 'https://teste-api-mcok.vercel.app/keys',
      desc: 'API principal FERRAO',
      enabled: true,
      sent: 0,
    },
  ]);
  const [limitCount, setLimitCount] = useStorage<number>(STORAGE_KEYS.limit, 0);
  const [chartData, setChartData] = useStorage<ChartData>(STORAGE_KEYS.chartData, {});
  const [deletedIds, setDeletedIds] = useStorage<string[]>(STORAGE_KEYS.deleted, []);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Mescla keys geradas e da API
  const getMergedKeys = useCallback((): KeyData[] => {
    const all = [...generatedKeys, ...apiKeys];
    const seen = new Set<string>();
    const deletedSet = new Set(deletedIds);

    return all
      .filter((k) => {
        if (seen.has(k.id) || deletedSet.has(k.id)) return false;
        seen.add(k.id);
        return true;
      })
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [generatedKeys, apiKeys, deletedIds]);

  // Adiciona uma key gerada
  const addGeneratedKey = useCallback(
    (key: KeyData) => {
      setGeneratedKeys([...generatedKeys, key]);
      const today = new Date().toISOString().slice(0, 10);
      setChartData({
        ...chartData,
        [today]: (chartData[today] || 0) + 1,
      });
    },
    [generatedKeys, chartData, setGeneratedKeys, setChartData]
  );

  // Adiciona múltiplas keys
  const addMultipleKeys = useCallback(
    (keys: KeyData[]) => {
      setGeneratedKeys([...generatedKeys, ...keys]);
      const today = new Date().toISOString().slice(0, 10);
      setChartData({
        ...chartData,
        [today]: (chartData[today] || 0) + keys.length,
      });
    },
    [generatedKeys, chartData, setGeneratedKeys, setChartData]
  );

  // Deleta keys selecionadas
  const deleteSelectedKeys = useCallback(() => {
    const newDeletedIds = [...deletedIds, ...Array.from(selectedIds)];
    setDeletedIds(newDeletedIds);
    setGeneratedKeys(generatedKeys.filter((k) => !selectedIds.has(k.id)));
    setApiKeys(apiKeys.filter((k) => !selectedIds.has(k.id)));
    setSelectedIds(new Set());
  }, [selectedIds, deletedIds, generatedKeys, apiKeys, setDeletedIds, setGeneratedKeys, setApiKeys]);

  // Reseta device de uma key
  const resetKeyDevice = useCallback(
    (keyId: string) => {
      const updateFn = (keys: KeyData[]) =>
        keys.map((k) =>
          k.id === keyId
            ? { ...k, used: false, device: '', activatedAt: 0, expiresAt: 0 }
            : k
        );

      setGeneratedKeys(updateFn(generatedKeys));
      setApiKeys(updateFn(apiKeys));
    },
    [generatedKeys, apiKeys, setGeneratedKeys, setApiKeys]
  );

  // Revoga uma key
  const revokeKey = useCallback(
    (keyId: string) => {
      const newDeletedIds = [...deletedIds, keyId];
      setDeletedIds(newDeletedIds);
      setGeneratedKeys(generatedKeys.filter((k) => k.id !== keyId));
      setApiKeys(apiKeys.filter((k) => k.id !== keyId));
    },
    [deletedIds, generatedKeys, apiKeys, setDeletedIds, setGeneratedKeys, setApiKeys]
  );

  // Limpa todas as keys
  const clearAllKeys = useCallback(() => {
    setGeneratedKeys([]);
    setApiKeys([]);
    setLimitCount(0);
    setChartData({});
    setDeletedIds([]);
    setSelectedIds(new Set());
  }, [setGeneratedKeys, setApiKeys, setLimitCount, setChartData, setDeletedIds]);

  // Adiciona um package
  const addPackage = useCallback(
    (pkg: Package) => {
      setPackages([...packages, pkg]);
    },
    [packages, setPackages]
  );

  // Remove um package
  const removePackage = useCallback(
    (pkgId: string) => {
      setPackages(packages.filter((p) => p.id !== pkgId));
    },
    [packages, setPackages]
  );

  // Alterna status de um package
  const togglePackage = useCallback(
    (pkgId: string) => {
      setPackages(
        packages.map((p) =>
          p.id === pkgId ? { ...p, enabled: !p.enabled } : p
        )
      );
    },
    [packages, setPackages]
  );

  return {
    generatedKeys,
    apiKeys,
    packages,
    limitCount,
    chartData,
    deletedIds,
    selectedIds,
    getMergedKeys,
    addGeneratedKey,
    addMultipleKeys,
    deleteSelectedKeys,
    resetKeyDevice,
    revokeKey,
    clearAllKeys,
    addPackage,
    removePackage,
    togglePackage,
    setSelectedIds,
    setLimitCount,
    setChartData,
  };
};
