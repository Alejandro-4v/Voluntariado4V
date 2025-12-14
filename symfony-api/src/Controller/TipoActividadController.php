<?php

namespace App\Controller;

use App\Entity\TipoActividad;
use App\Repository\TipoActividadRepository;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use \Symfony\Component\Serializer\Exception\ExceptionInterface;

use Exception;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;


final class TipoActividadController extends AbstractController
{
    #[Route('/tipoActividad', name: 'tipo_actividad_index', methods: ['GET'])]
    public function index(
        TipoActividadRepository $tipoActividadRepository
    ): JsonResponse {
        /** @var TipoActividad[] $tiposActividad */
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
        /** @var TipoActividad $tipoActividad */
        $tipoActividad = $tipoActividadRepository->find($id);

        if (!$tipoActividad) {
            return $this->json(
                ['error' => 'TipoActividad not found'],
                status: Response::HTTP_NOT_FOUND
            );
        }

        return $this->json($tipoActividad, context: ['groups' => ['tipoActividad:read']]);
    }


    #[Route('/tipoActividadEnUso', name: 'tipo_actividad_en_uso', methods: ['GET'])]
    public function enUso(
        TipoActividadRepository $tipoActividadRepository
    ): JsonResponse {
        /** @var TipoActividad[] $tipoActividades */
        $tipoActividades = $tipoActividadRepository->findAll();

        /** @var TipoActividad[] $tipoActividadesEnUso */
        $tipoActividadesEnUso = array();

        foreach ($tipoActividades as $tipoActividad) {
            if (count($tipoActividad->getActividades()) > 0) {
                array_push($tipoActividadesEnUso, $tipoActividad);
            }
        }

        return $this->json(
            $tipoActividadesEnUso,
            context: ['groups' => ['tipoActividad:read']],
            status: Response::HTTP_OK
        );

    }

    #[Route('/tipoActividad', name: 'tipo_actividad_create', methods: ['POST'])]
    public function create(
        Request $request,
        TipoActividadRepository $tipoActividadRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $data = $request->getContent();

        try {
            /** @var TipoActividad $tipoActividad */
            $tipoActividad = $serializer->deserialize($data, TipoActividad::class, 'json');
            $tipoActividadRepository->add($tipoActividad);
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

        return $this->json($tipoActividad, context: ['groups' => ['tipoActividad:read']], status: Response::HTTP_CREATED);

    }

    #[Route('/tipoActividad', name: 'tipo_actividad_update', methods: ['PUT'])]
    public function update(
        Request $request,
        TipoActividadRepository $tipoActividadRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $data = $request->getContent();
        $json = json_decode($data, true);

        if (!isset($json['idTipoActividad'])) {
            return $this->json([
                'error' => 'Missing ID',
                'details' => 'PUT request must include idTipoActividad'
            ], Response::HTTP_BAD_REQUEST);
        }

        $tipoActividad = $tipoActividadRepository->find($json['idTipoActividad']);

        if (!$tipoActividad) {
            return $this->json([
                'error' => 'TipoActividad not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $serializer->deserialize(
            $data,
            TipoActividad::class,
            'json',
            [
                'object_to_populate' => $tipoActividad,
                'groups' => ['tipoActividad:update']
            ]
        );

        $tipoActividadRepository->update($tipoActividad);

        return $this->json($tipoActividad, context: ['groups' => ['tipoActividad:read']]);
    }

}
