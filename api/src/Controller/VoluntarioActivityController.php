<?php

namespace App\Controller;

use App\Repository\ActividadRepository;
use App\Repository\VoluntarioRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/actividad', name: 'voluntario_actividad_')]
final class VoluntarioActivityController extends AbstractController
{
    #[Route('/{idActividad}/join/{nif}', name: 'join', methods: ['POST'])]
    public function join(
        int $idActividad,
        string $nif,
        ActividadRepository $actividadRepository,
        VoluntarioRepository $voluntarioRepository
    ): JsonResponse {
        $user = $this->getUser();

        // Verify the user joining is the authenticated user
        if ($user instanceof \App\Entity\Voluntario) {
            if ($user->getNif() !== $nif) {
                return $this->json(['error' => 'You cannot join an activity for another volunteer'], Response::HTTP_FORBIDDEN);
            }
        } else {
            if (!$this->isGranted('ROLE_ADMINISTRADOR')) {
                return $this->json(['error' => 'Access Denied'], Response::HTTP_FORBIDDEN);
            }
        }

        $actividad = $actividadRepository->find($idActividad);
        if (!$actividad) {
            return $this->json(['error' => 'Actividad not found'], Response::HTTP_NOT_FOUND);
        }

        $voluntario = $voluntarioRepository->findOneBy(['nif' => $nif]);
        if (!$voluntario) {
            return $this->json(['error' => 'Voluntario not found'], Response::HTTP_NOT_FOUND);
        }

        // Check if already joined
        if ($actividad->getVoluntarios()->contains($voluntario)) {
            return $this->json(['error' => 'Already joined'], Response::HTTP_CONFLICT); // Or just 200 OK
        }

        $actividad->addVoluntario($voluntario);
        $actividadRepository->update($actividad);

        return $this->json(['status' => 'Joined successfully'], Response::HTTP_CREATED);
    }

    #[Route('/{idActividad}/leave/{nif}', name: 'leave', methods: ['DELETE'])]
    public function leave(
        int $idActividad,
        string $nif,
        ActividadRepository $actividadRepository,
        VoluntarioRepository $voluntarioRepository
    ): JsonResponse {
        $user = $this->getUser();

        if ($user instanceof \App\Entity\Voluntario) {
            if ($user->getNif() !== $nif) {
                return $this->json(['error' => 'You cannot leave an activity for another volunteer'], Response::HTTP_FORBIDDEN);
            }
        } else {
            if (!$this->isGranted('ROLE_ADMINISTRADOR')) {
                return $this->json(['error' => 'Access Denied'], Response::HTTP_FORBIDDEN);
            }
        }

        $actividad = $actividadRepository->find($idActividad);
        if (!$actividad) {
            return $this->json(['error' => 'Actividad not found'], Response::HTTP_NOT_FOUND);
        }

        $voluntario = $voluntarioRepository->findOneBy(['nif' => $nif]);
        if (!$voluntario) {
            return $this->json(['error' => 'Voluntario not found'], Response::HTTP_NOT_FOUND);
        }

        if (!$actividad->getVoluntarios()->contains($voluntario)) {
            return $this->json(['error' => 'Not joined'], Response::HTTP_BAD_REQUEST);
        }

        $actividad->removeVoluntario($voluntario);
        $actividadRepository->update($actividad);

        return $this->json(['status' => 'Left successfully'], Response::HTTP_OK);
    }
}
