<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'app_default')]
    public function index(): JsonResponse
    {
        return $this->json([
            'error' => 'Not Found',
            'details' => 'The requested page does not exist.'
        ], Response::HTTP_NOT_FOUND);
    }

    #[Route('/{path}', name: 'app_catch_all', requirements: ['path' => '.*'], priority: -1)]
    public function catchAll(): JsonResponse
    {
        return $this->json([
            'error' => 'Not Found',
            'details' => 'The requested page does not exist.'
        ], Response::HTTP_NOT_FOUND);
    }
}
