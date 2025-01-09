import { useState, useEffect, useCallback } from "react";

function removeLocalStorageItemByPrefix(prefix: string, except: string) {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(prefix) && key !== except)
    .forEach((key) => localStorage.removeItem(key));
}

export function useMaskData(shape: string, suffix: string) {
  // Generate the maskKey based on the provided parameters
  const maskKey = `${shape}-${suffix}`;

  // Internal state to store mask data
  const [maskData, setMaskData] = useState([]);

  // Initialize maskData when maskKey changes
  useEffect(() => {
    const storedData = localStorage.getItem(maskKey);
    setMaskData(storedData ? JSON.parse(storedData) : []);
  }, [maskKey]);

  // Set data to both state and localStorage
  const set = useCallback(
    (newData: any) => {
      const dataToSave = newData ?? [];
      localStorage.setItem(maskKey, JSON.stringify(dataToSave));
      setMaskData(dataToSave); // Update internal state
      removeLocalStorageItemByPrefix(maskKey.split("-")[0], maskKey);
    },
    [maskKey]
  );

  // Clear data from both state and localStorage
  const clear = useCallback(() => {
    localStorage.removeItem(maskKey);
    setMaskData([]); // Reset internal state
  }, [maskKey]);

  return {
    maskData, // Current state of mask data
    set,
    clear,
  };
}
