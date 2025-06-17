// utils/config.js
let config = {};

export async function loadConfig() {
  if (typeof window !== "undefined") {
    const res = await fetch('/runtime-config.json');
    console.log('### Loaded runtime config:', config);
    config = await res.json();
  }
}

export function getConfig(key) {
  console.log('### Loading config...');
  return config[key];
}