<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DocsController
{
    #[Route('/docs', name: 'api_docs_ui', methods: ['GET'])]
    public function ui(): Response
    {
        $html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
<script>
  window.onload = () => {
    window.ui = SwaggerUIBundle({
      url: '/docs/schema',
      dom_id: '#swagger-ui',
    });
  };
</script>
</body>
</html>
HTML;

        return new Response($html, 200, ['Content-Type' => 'text/html']);
    }

    #[Route('/docs/schema', name: 'api_docs_schema', methods: ['GET'])]
    public function schema(): Response
    {
        $path = dirname(__DIR__, 2) . '/OAS.yaml';

        if (!file_exists($path)) {
            return new Response('OAS file not found', 404);
        }

        return new Response(
            file_get_contents($path),
            200,
            ['Content-Type' => 'application/yaml']
        );
    }
}
