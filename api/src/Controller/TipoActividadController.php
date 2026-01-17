<?php

namespace App\Controller;

use App\Entity\TipoActividad;
use App\Repository\TipoActividadRepository;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;


final class TipoActividadController extends AbstractController
{
    #[Route('/tipoActividad', name: 'tipo_actividad_index', methods: ['GET'])]
    public function index(
        TipoActividadRepository $tipoActividadRepository
    ): JsonResponse {
        $tiposActividad = $tipoActividadRepository->findAll();

        return $this->json(
            $tiposActividad,
            context: ['groups' => ['tipoActividad:read']]
        );
    }

    #[Route('/tipoActividad/{id}', name: 'tipo_actividad_show', methods: ['GET'])]
    public function show(
        TipoActividadRepository $tipoActividadRepository,
        int $id
    ): JsonResponse {
        $tipoActividad = $tipoActividadRepository->find($id);

        if (!$tipoActividad) {
            return $this->json(
                ['error' => 'TipoActividad not found', 'details' => "TipoActividad with id $id not found"],
                status: Response::HTTP_NOT_FOUND
            );
        }

        return $this->json($tipoActividad, context: ['groups' => ['tipoActividad:read']]);
    }

    #[Route('/tipoActividad', name: 'tipo_actividad_create', methods: ['POST'])]
    public function create(
        Request $request,
        TipoActividadRepository $tipoActividadRepository
    ): JsonResponse {
        $json = json_decode($request->getContent(), true);

        $tipoActividad = new TipoActividad();

        if (isset($json['descripcion'])) {
            if ($tipoActividadRepository->findOneBy(['descripcion' => $json['descripcion']])) {
                return $this->json([
                    'error' => 'TipoActividad already exists',
                    'details' => "TipoActividad with descripcion {$json['descripcion']} already exists"
                ], Response::HTTP_CONFLICT);
            }
            $tipoActividad->setDescripcion($json['descripcion']);
        } else {
            return $this->json([
                'error' => 'Missing descripcion',
                'details' => 'The field descripcion is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['imagenUrl'])) {
            $tipoActividad->setImagenUrl($json['imagenUrl']);
        }

        $tipoActividadRepository->add($tipoActividad);

        return $this->json($tipoActividad, context: ['groups' => ['tipoActividad:read']], status: Response::HTTP_CREATED);

    }

    #[Route('/tipoActividad/{id}', name: 'tipo_actividad_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        TipoActividadRepository $tipoActividadRepository
    ): JsonResponse {
        $json = json_decode($request->getContent(), true);

        $tipoActividad = $tipoActividadRepository->find($id);

        if (!$tipoActividad) {
            return $this->json([
                'error' => 'TipoActividad not found',
                'details' => "TipoActividad with id $id not found"
            ], Response::HTTP_NOT_FOUND);
        }

        if (isset($json['descripcion'])) {
            $existing = $tipoActividadRepository->findOneBy(['descripcion' => $json['descripcion']]);
            if ($existing && $existing->getIdTipoActividad() !== $id) {
                return $this->json([
                    'error' => 'TipoActividad already exists',
                    'details' => "TipoActividad with descripcion {$json['descripcion']} already exists"
                ], Response::HTTP_CONFLICT);
            }
            $tipoActividad->setDescripcion($json['descripcion']);
        }

        if (isset($json['imagenUrl'])) {
            $tipoActividad->setImagenUrl($json['imagenUrl']);
        }

        $tipoActividadRepository->update($tipoActividad);

        return $this->json($tipoActividad, context: ['groups' => ['tipoActividad:read']]);
    }

    #[Route('/tipoActividad/{id}', name: 'tipo_actividad_delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        TipoActividadRepository $tipoActividadRepository
    ): JsonResponse {
        $tipoActividad = $tipoActividadRepository->find($id);

        if (!$tipoActividad) {
            return $this->json([
                'error' => 'TipoActividad not found',
                'details' => "TipoActividad with id $id not found"
            ], Response::HTTP_NOT_FOUND);
        }

        $tipoActividadRepository->remove($tipoActividad);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

}
