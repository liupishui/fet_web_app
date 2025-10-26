window.onload = function() {
  //<editor-fold desc="Changeable Configuration Block">

  // the following lines will be replaced by docker/configurator, when it runs in a docker-container
  //所有配置项 https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md
  window.ui = SwaggerUIBundle({
    urls: [{name:"2222",url:"swagger.json"},{name:"2",url:"swagger1.json"}],
    dom_id: '#swagger-ui',
    deepLinking: true,
    queryConfigEnabled:true,
    defaultModelsExpandDepth:8,
    defaultModelExpandDepth:8,
    docExpansion:"list",
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });

  //</editor-fold>
};
