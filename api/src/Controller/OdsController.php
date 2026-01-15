<?php

namespace App\Controller;

use App\Entity\Ods;
use App\Repository\OdsRepository;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;

use Exception;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;


final class OdsController extends AbstractController
{
    #[Route('/ods', name: 'ods_index', methods: ['GET'])]
    public function index(
        OdsRepository $odsRepository
    ): JsonResponse {
        /** @var Ods[] $ods */
        $ods = $odsRepository->findAll();

        return $this->json(
            $ods,
            context: ['groups' => ['ods:read']]
        );
    }

    #[Route('/ods/{id}', name: 'ods_show', methods: ['GET'])]
    public function show(
        OdsRepository $odsRepository,
        int $id
    ): JsonResponse {
        /** @var Ods $ods */
        $ods = $odsRepository->find($id);

        if (!$ods) {
            return $this->json(
                ['error' => 'Ods not found'],
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
        OdsRepository $odsRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $data = $request->getContent();

        try {
            /** @var Ods $ods */
            $ods = $serializer->deserialize($data, Ods::class, 'json');
            $odsRepository->add($ods);
        } catch (UniqueConstraintViolationException $e) {
            return $this->json([
                'error' => 'Unique constraint violation',
                'details' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        } catch (ExceptionInterface $e) {
            return $this->json([
                'error' => 'Invalid JSON',
                'details' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        } catch (Exception $e) {
            return $this->json([
                'error' => 'Internal server error',
                'details' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json($ods, status: Response::HTTP_CREATED, context: ['groups' => ['ods:read']]);
    }

    #[Route('/ods/{id}', name: 'ods_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        OdsRepository $odsRepository,
        SerializerInterface $serializer
    ): JsonResponse {

        $data = $request->getContent();

        $ods = $odsRepository->find($id);

        if (!$ods) {
            return $this->json([
                'error' => 'ODS not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $serializer->deserialize(
            $data,
            Ods::class,
            'json',
            [
                'object_to_populate' => $ods,
                'groups' => ['ods:update']
            ]
        );

        $odsRepository->update($ods);

        return $this->json($ods, context: ['groups' => ['ods:read']]);
    }


    #[Route('/ods/{id}', name: 'ods_delete', methods: ['DELETE'])]
    public function delete(
        OdsRepository $odsRepository,
        int $id
    ): JsonResponse {
        /** @var Ods $ods */
        $ods = $odsRepository->find($id);

        if (!$ods) {
            return $this->json([
                'error' => 'Ods not found',
            ], Response::HTTP_NOT_FOUND);
        }

        $odsRepository->remove($ods);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
