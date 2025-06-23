// Polyfill para fetch si es necesario
if (!window.fetch) {
  // Importamos un polyfill de fetch
  import('whatwg-fetch');
}

// Polyfill para Promise si es necesario
if (!window.Promise) {
  import('es6-promise').then(module => {
    window.Promise = module.default;
  });
}
