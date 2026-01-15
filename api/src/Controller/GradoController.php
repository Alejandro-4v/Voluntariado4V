<?php

namespace App\Controller;

use App\Entity\Grado;
use App\Repository\GradoRepository;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use \Symfony\Component\Serializer\Exception\ExceptionInterface;

use Exception;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

final class GradoController extends AbstractController
{

    #[Route('/grado', name: 'grado_index', methods: ['GET'])]
    public function index(
        GradoRepository $gradoRepository
    ): JsonResponse {
        /** @var Grado[] $grados */
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
        /** @var Grado $grado */
        $grado = $gradoRepository->find($id);

        if (!$grado) {
            return $this->json(
                ['error' => 'Grado not found'],
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
        GradoRepository $gradoRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $data = $request->getContent();

        try {
            /** @var Grado $grado */
            $grado = $serializer->deserialize($data, Grado::class, 'json');
            $gradoRepository->add($grado);
        } catch (UniqueConstraintViolationException $e) {
            return $this->json([
                'error' => 'Unique constraint violation',
                'details' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        } catch (ExceptionInterface $e) {
            return $this->json([
                'error' => 'Internal server error',
                'details' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        } catch (Exception $e) {
            return $this->json([
                'error' => 'Internal server error',
                'details' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json($grado, context: ['groups' => ['grado:read']], status: Response::HTTP_CREATED);
    }

    #[Route('/grado/{id}', name: 'grado_update', methods: ['PUT'])] // Note: OAS doesn't specify PUT for Grado, but I'm fixing the route just in case or if it was intended. Wait, OAS DOES NOT specify PUT for Grado.
    public function update(
        int $id,
        Request $request,
        GradoRepository $gradoRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $data = $request->getContent();

        $grado = $gradoRepository->find($id);

        if (!$grado) {
            return $this->json([
                'error' => 'Grado not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $serializer->deserialize(
            $data,
            Grado::class,
            'json',
            [
                'object_to_populate' => $grado,
                'groups' => ['grado:update']
            ]
        );

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
            ], Response::HTTP_NOT_FOUND);
        }

        $gradoRepository->remove($grado);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

}
