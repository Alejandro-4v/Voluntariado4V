<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Repository\TipoActividadRepository;
use App\Entity\TipoActividad;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Response;

final class TipoActividadController extends AbstractController
{
    #[Route('/tipo_actividad', name: 'tipo_actividad_index', methods: ['GET'])]
    public function index(
        TipoActividadRepository $tipoActividadRepository
    ): JsonResponse
    {
        /** @var TipoActividad[] $tiposActividad */
        $tiposActividad = $tipoActividadRepository->findAll();

        return $this->json(
            $tiposActividad,
            context: ['groups' => ['tipo_actividad:read']]
        );
    }

    #[Route('/tipo_actividad_en_uso', name: 'tipo_actividad_en_uso', methods: ['GET'])]
    public function enUso(
        TipoActividadRepository $tipoActividadRepository
    ): JsonResponse
    {
        /** @var TipoActividad[] $tipoActividades */
        $tipoActividades = $tipoActividadRepository->findAll();

        /** @var TipoActividad[] $tipoActividadesEnUso */
        $tipoActividadesEnUso = array();

        foreach($tipoActividades as $tipoActividad) {
            if (count($tipoActividad->getActividades()) > 0) {
                array_push($tipoActividadesEnUso, $tipoActividad);
            }
        }

        return $this->json(
            $tipoActividadesEnUso,
            context: ['groups' => ['tipo_actividad:read']],
            status: Response::HTTP_OK
        );

    }

}
