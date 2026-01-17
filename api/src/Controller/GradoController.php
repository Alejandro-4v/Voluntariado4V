<?php

namespace App\Controller;

use App\Entity\Grado;
use App\Repository\GradoRepository;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class GradoController extends AbstractController
{

    #[Route('/grado', name: 'grado_index', methods: ['GET'])]
    public function index(
        GradoRepository $gradoRepository
    ): JsonResponse {
        $grados = $gradoRepository->findAll();

        return $this->json(
            $grados,
            context: ['groups' => ['grado:read']]
        );
    }

    #[Route('/grado/{id}', name: 'grado_show', methods: ['GET'])]
    public function show(
        GradoRepository $gradoRepository,
        int $id
    ): JsonResponse {
        $grado = $gradoRepository->find($id);

        if (!$grado) {
            return $this->json(
                ['error' => 'Grado not found', 'details' => "Grado with id $id not found"],
                status: Response::HTTP_NOT_FOUND
            );
        }

        return $this->json(
            $grado,
            context: ['groups' => ['grado:read']]
        );
    }

    #[Route('/grado', name: 'grado_create', methods: ['POST'])]
    public function create(
        Request $request,
        GradoRepository $gradoRepository
    ): JsonResponse {
        $json = json_decode($request->getContent(), true);

        $grado = new Grado();

        if (isset($json['descripcion'])) {
            if ($gradoRepository->findOneBy(['descripcion' => $json['descripcion']])) {
                return $this->json([
                    'error' => 'Grado already exists',
                    'details' => "Grado with descripcion {$json['descripcion']} already exists"
                ], Response::HTTP_CONFLICT);
            }
            $grado->setDescripcion($json['descripcion']);
        } else {
            return $this->json([
                'error' => 'Missing descripcion',
                'details' => 'The field descripcion is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['nivel'])) {
            $grado->setNivel($json['nivel']);
        } else {
            return $this->json([
                'error' => 'Missing nivel',
                'details' => 'The field nivel is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        $gradoRepository->add($grado);

        return $this->json($grado, context: ['groups' => ['grado:read']], status: Response::HTTP_CREATED);
    }

    #[Route('/grado/{id}', name: 'grado_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        GradoRepository $gradoRepository
    ): JsonResponse {
        $json = json_decode($request->getContent(), true);

        $grado = $gradoRepository->find($id);

        if (!$grado) {
            return $this->json([
                'error' => 'Grado not found',
                'details' => "Grado with id $id not found"
            ], Response::HTTP_NOT_FOUND);
        }

        if (isset($json['descripcion'])) {
            $existing = $gradoRepository->findOneBy(['descripcion' => $json['descripcion']]);
            if ($existing && $existing->getIdGrado() !== $id) {
                return $this->json([
                    'error' => 'Grado already exists',
                    'details' => "Grado with descripcion {$json['descripcion']} already exists"
                ], Response::HTTP_CONFLICT);
            }
            $grado->setDescripcion($json['descripcion']);
        }

        if (isset($json['nivel'])) {
            $grado->setNivel($json['nivel']);
        }

        $gradoRepository->update($grado);

        return $this->json($grado, context: ['groups' => ['grado:read']]);
    }


    #[Route('/grado/{id}', name: 'grado_delete', methods: ['DELETE'])]
    public function delete(
        GradoRepository $gradoRepository,
        int $id
    ): JsonResponse {
        $grado = $gradoRepository->find($id);

        if (!$grado) {
            return $this->json([
                'error' => 'Grado not found',
                'details' => "Grado with id $id not found"
            ], Response::HTTP_NOT_FOUND);
        }

        $gradoRepository->remove($grado);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

}
