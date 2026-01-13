<?php

namespace App\Controller;

use App\Entity\Voluntario;
use App\Repository\VoluntarioRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class VoluntarioController extends AbstractController
{
    #[Route('/voluntario', name: 'voluntario_index', methods: ['GET'])]
    public function index(VoluntarioRepository $voluntarioRepository): JsonResponse
    {
        /** @var Voluntario[] $voluntarios */
        $voluntarios = $voluntarioRepository->findAll();

        return $this->json(
            $voluntarios,
            context: ['groups' => ['voluntario:read', 'disponibilidad:read']]
        );
    }

    #[Route('/voluntario/{nif}', name: 'voluntario_show', methods: ['GET'])]
    public function show(
        VoluntarioRepository $voluntarioRepository,
        string $nif
    ): JsonResponse {
        /** @var Voluntario $voluntario */
        $voluntario = $voluntarioRepository->find($nif);

        if (!$voluntario) {
            return $this->json(
                ['error' => 'Voluntario not found'],
                status: Response::HTTP_NOT_FOUND
            );
        }

        return $this->json(
            $voluntario,
            context: ['groups' => ['voluntario:read']]
        );
    }
}
