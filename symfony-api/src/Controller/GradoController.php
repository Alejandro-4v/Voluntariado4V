<?php

namespace App\Controller;

use App\Entity\Grado;
use App\Repository\GradoRepository;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;

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
        } catch (\Symfony\Component\Serializer\Exception\ExceptionInterface $e) {
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

    #[Route('/grado', name: 'grado_update', methods: ['PUT'])]
    public function update(
        Request $request,
        GradoRepository $gradoRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $data = $request->getContent();
        $json = json_decode($data, true);

        if (!isset($json['idGrado'])) {
            return $this->json([
                'error' => 'Missing ID',
                'details' => 'PUT request must include idGrado'
            ], Response::HTTP_BAD_REQUEST);
        }

        $grado = $gradoRepository->find($json['idGrado']);

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

        return $this->json([
            'message' => 'Grado deleted successfully',
        ], Response::HTTP_ACCEPTED);
    }

}
