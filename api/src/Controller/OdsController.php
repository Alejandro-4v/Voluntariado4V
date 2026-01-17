<?php

namespace App\Controller;

use App\Entity\Ods;
use App\Repository\OdsRepository;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;


final class OdsController extends AbstractController
{
    #[Route('/ods', name: 'ods_index', methods: ['GET'])]
    public function index(
        OdsRepository $odsRepository
    ): JsonResponse {
        $odss = $odsRepository->findAll();

        return $this->json(
            $odss,
            context: ['groups' => ['ods:read']]
        );
    }

    #[Route('/ods/{id}', name: 'ods_show', methods: ['GET'])]
    public function show(
        OdsRepository $odsRepository,
        int $id
    ): JsonResponse {
        $ods = $odsRepository->find($id);

        if (!$ods) {
            return $this->json(
                ['error' => 'Ods not found', 'details' => "Ods with id $id not found"],
                status: Response::HTTP_NOT_FOUND
            );
        }

        return $this->json(
            $ods,
            context: ['groups' => ['ods:read']]
        );
    }

    #[Route('/ods', name: 'ods_create', methods: ['POST'])]
    public function create(
        Request $request,
        OdsRepository $odsRepository
    ): JsonResponse {
        $json = json_decode($request->getContent(), true);

        $ods = new Ods();

        if (isset($json['id'])) {
            $existing = $odsRepository->find($json['id']);
            if ($existing) {
                return $this->json([
                    'error' => 'Ods already exists',
                    'details' => "Ods with id {$json['id']} already exists"
                ], Response::HTTP_CONFLICT);
            }
            $ods->setIdOds($json['id']);
        }

        if (isset($json['descripcion'])) {
            if ($odsRepository->findOneBy(['descripcion' => $json['descripcion']])) {
                return $this->json([
                    'error' => 'Ods already exists',
                    'details' => "Ods with descripcion {$json['descripcion']} already exists"
                ], Response::HTTP_CONFLICT);
            }
            $ods->setDescripcion($json['descripcion']);
        } else {
            return $this->json([
                'error' => 'Missing descripcion',
                'details' => 'The field descripcion is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['imagenUrl'])) {
            $ods->setImagenUrl($json['imagenUrl']);
        }

        $odsRepository->add($ods);

        return $this->json($ods, context: ['groups' => ['ods:read']], status: Response::HTTP_CREATED);
    }

    #[Route('/ods/{id}', name: 'ods_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        OdsRepository $odsRepository
    ): JsonResponse {
        $json = json_decode($request->getContent(), true);

        $ods = $odsRepository->find($id);

        if (!$ods) {
            return $this->json([
                'error' => 'Ods not found',
                'details' => "Ods with id $id not found"
            ], Response::HTTP_NOT_FOUND);
        }

        if (isset($json['descripcion'])) {
            $existing = $odsRepository->findOneBy(['descripcion' => $json['descripcion']]);
            if ($existing && $existing->getIdOds() !== $id) {
                return $this->json([
                    'error' => 'Ods already exists',
                    'details' => "Ods with descripcion {$json['descripcion']} already exists"
                ], Response::HTTP_CONFLICT);
            }
            $ods->setDescripcion($json['descripcion']);
        }

        if (isset($json['imagenUrl'])) {
            $ods->setImagenUrl($json['imagenUrl']);
        }

        $odsRepository->update($ods);

        return $this->json($ods, context: ['groups' => ['ods:read']]);
    }

    #[Route('/ods/{id}', name: 'ods_delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        OdsRepository $odsRepository
    ): JsonResponse {
        $ods = $odsRepository->find($id);

        if (!$ods) {
            return $this->json([
                'error' => 'Ods not found',
                'details' => "Ods with id $id not found"
            ], Response::HTTP_NOT_FOUND);
        }

        $odsRepository->remove($ods);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

}
