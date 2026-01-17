<?php

namespace App\Controller;

use App\Entity\Actividad;
use App\Entity\Entidad;
use App\Entity\Grado;
use App\Entity\Ods;
use App\Entity\TipoActividad;
use App\Entity\Voluntario;

use App\Repository\ActividadRepository;
use App\Repository\EntidadRepository;
use App\Repository\GradoRepository;
use App\Repository\OdsRepository;
use App\Repository\TipoActividadRepository;
use App\Repository\VoluntarioRepository;

use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;

use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;


final class ActividadController extends AbstractController
{
    private const ESTADOS_VALIDOS = ['A', 'F', 'P', 'C', 'R', 'E'];

    #[Route('/actividad', name: 'actividad_index', methods: ['GET'])]
    public function index(
        ActividadRepository $actividadRepository,
        Request $request
    ): JsonResponse {
        $filters = $request->query->all();

        $actividades = $actividadRepository->findByFilters($filters);

        return $this->json(
            $actividades,
            context: ['groups' => ['actividad:read']]
        );
    }

    #[Route('/actividad/{id}', name: 'actividad_show', methods: ['GET'])]
    public function show(
        ActividadRepository $actividadRepository,
        int $id
    ): JsonResponse {
        $actividad = $actividadRepository->find($id);

        if (!$actividad) {
            return $this->json(
                ['error' => 'Actividad not found', 'details' => "Actividad with id $id not found"],
                status: Response::HTTP_NOT_FOUND
            );
        }

        return $this->json(
            $actividad,
            context: ['groups' => ['actividad:read']]
        );
    }

    #[Route('/actividad', name: 'actividad_create', methods: ['POST'])]
    public function create(
        Request $request,
        ActividadRepository $actividadRepository,

        GradoRepository $gradoRepository,
        EntidadRepository $entidadRepository,
        VoluntarioRepository $voluntarioRepository,
        OdsRepository $odsRepository,
        TipoActividadRepository $tipoActividadRepository
    ): JsonResponse {

        $data = $request->getContent();

        $json = json_decode($data, true);

        $actividad = new Actividad();

        if (isset($json['nombre'])) {
            $actividad->setNombre($json['nombre']);
        } else {
            return $this->json([
                'error' => 'Missing nombre',
                'details' => 'The field nombre is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['descripcion'])) {
            $actividad->setDescripcion($json['descripcion']);
        } else {
            $actividad->setDescripcion(null);
        }

        if (isset($json['estado'])) {
            $estado = $json['estado'];
            if (!\in_array($estado, self::ESTADOS_VALIDOS)) {
                return $this->json([
                    'error' => 'Invalid estado',
                    'details' => 'Estado must be one of A, F, P, C, R, E'
                ], Response::HTTP_BAD_REQUEST);
            }
            $actividad->setEstado($estado);
        } else {
            $actividad->setEstado('P');
        }

        if (isset($json['convoca'])) {
            $entidad = $entidadRepository->find($json['convoca']);

            if (!$entidad) {
                return $this->json([
                    'error' => 'Entidad not found',
                    'details' => "Entidad with id {$json['convoca']} not found"
                ], Response::HTTP_BAD_REQUEST);
            }

            $actividad->setConvoca($entidad);
        } else {
            return $this->json([
                'error' => 'Missing entidad',
                'details' => 'The field convoca is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['lugar'])) {
            $actividad->setLugar($json['lugar']);
        } else {
            return $this->json([
                'error' => 'Missing lugar',
                'details' => 'The field lugar is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            $inicio = new DateTimeImmutable($json['inicio']);
        } catch (Exception $e) {
            return $this->json([
                'error' => 'Invalid inicio datetime format',
                'details' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            $fin = new DateTimeImmutable($json['fin']);
        } catch (Exception $e) {
            return $this->json([
                'error' => 'Invalid fin datetime format',
                'details' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }

        if ($inicio > $fin) {
            return $this->json([
                'error' => 'Invalid datetime range',
                'details' => 'The start date cannot be after the end date.'
            ], Response::HTTP_BAD_REQUEST);
        }

        $actividad->setInicio($inicio);
        $actividad->setFin($fin);

        if (isset($json['grado'])) {
            $grado = $gradoRepository->find($json['grado']);

            if (!$grado) {
                return $this->json([
                    'error' => 'Grado not found',
                    'details' => "Grado with id {$json['grado']} not found"
                ], Response::HTTP_BAD_REQUEST);
            }

            $actividad->setGrado($grado);
        } else {
            return $this->json([
                'error' => 'Missing grado',
                'details' => 'The field grado is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['imagenUrl'])) {
            $imagenUrl = $json['imagenUrl'];
            $actividad->setImagenUrl($imagenUrl);
        } else {
            $actividad->setImagenUrl(null);
        }

        if (isset($json['voluntarios'])) {
            $voluntarios = new ArrayCollection();

            foreach ($json["voluntarios"] as $idVoluntario) {
                $voluntario = $voluntarioRepository->find($idVoluntario);

                if (!$voluntario) {
                    return $this->json([
                        'error' => 'Voluntario not found',
                        'details' => "Voluntario with id {$idVoluntario} not found",
                    ], Response::HTTP_BAD_REQUEST);
                }

                $voluntarios->add($voluntario);
            }

            $actividad->setVoluntarios($voluntarios);
        } else {
            $actividad->setVoluntarios(new ArrayCollection());
        }

        if (isset($json['ods'])) {
            $odss = new ArrayCollection();

            foreach ($json['ods'] as $idOds) {
                $ods = $odsRepository->find($idOds);

                if (!$ods) {
                    return $this->json([
                        'error' => 'Ods not found',
                        'details' => "Ods with id {$idOds} not found"
                    ], Response::HTTP_BAD_REQUEST);
                }

                $odss->add($ods);
            }

            $actividad->setOds($odss);

        } else {
            $actividad->setOds(new ArrayCollection());
        }

        if (isset($json['tiposActividad'])) {
            $tiposActividad = new ArrayCollection();

            foreach ($json['tiposActividad'] as $idTipoActividad) {
                $tipoActividad = $tipoActividadRepository->find($idTipoActividad);

                if (!$tipoActividad) {
                    return $this->json([
                        'error' => 'TipoActividad not found',
                        'details' => "TipoActividad with id {$idTipoActividad} not found",
                    ], Response::HTTP_BAD_REQUEST);
                }

                $tiposActividad->add($tipoActividad);
            }

            $actividad->setTiposActividad($tiposActividad);
        } else {
            $actividad->setTiposActividad(new ArrayCollection());
        }

        if (isset($json['plazas'])) {
            $actividad->setPlazas((int) $json['plazas']);
        }

        $actividadRepository->add($actividad);

        return $this->json($actividad, context: ['groups' => ['actividad:read']], status: Response::HTTP_CREATED);

    }

    #[Route(path: '/actividad/{id}', name: 'actividad_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        ActividadRepository $actividadRepository,

        GradoRepository $gradoRepository,
        EntidadRepository $entidadRepository,
        VoluntarioRepository $voluntarioRepository,
        OdsRepository $odsRepository,
        TipoActividadRepository $tipoActividadRepository
    ): JsonResponse {
        $data = $request->getContent();
        $json = json_decode($data, true);

        $actividad = $actividadRepository->find($id);

        if (!$actividad) {
            return $this->json([
                'error' => 'Actividad not found',
                'details' => "Actividad with id $id not found"
            ], Response::HTTP_NOT_FOUND);
        }

        if (isset($json['nombre'])) {
            $nombre = $json['nombre'];

            if ($nombre === '') {
                return $this->json([
                    'error' => 'Invalid nombre',
                    'details' => 'Nombre cannot be empty'
                ], Response::HTTP_BAD_REQUEST);
            }

            if ($nombre != $actividad->getNombre()) {
                $actividad->setNombre($nombre);
            }
        }

        if (isset($json['descripcion'])) {
            $descripcion = $json['descripcion'];

            if ($descripcion != $actividad->getDescripcion()) {
                $actividad->setDescripcion($descripcion);
            }
        }

        if (isset($json['lugar'])) {
            $lugar = $json['lugar'];

            if ($lugar != $actividad->getLugar()) {
                $actividad->setLugar($lugar);
            }
        }

        if (isset($json['estado'])) {
            $estado = strtoupper($json['estado']);

            if ($estado === '') {
                return $this->json([
                    'error' => 'Invalid estado',
                    'details' => 'Estado cannot be empty'
                ], Response::HTTP_BAD_REQUEST);
            }

            if ($estado != $actividad->getEstado()) {
                if (!\in_array($estado, self::ESTADOS_VALIDOS)) {
                    return $this->json([
                        'error' => 'Invalid estado',
                        'details' => 'Estado must be one of A, F, P, C, R, E'
                    ], Response::HTTP_BAD_REQUEST);
                }
            }

            $actividad->setEstado($estado);

        }

        if (isset($json['plazas'])) {
            $actividad->setPlazas((int) $json['plazas']);
        }

        if (isset($json['convoca'])) {
            $entidad = $entidadRepository->find($json['convoca']);

            if (!$entidad) {
                return $this->json([
                    'error' => 'Entidad not found',
                    'details' => "Entidad with id {$json['convoca']} not found"
                ], Response::HTTP_BAD_REQUEST);
            }

            if ($entidad != $actividad->getConvoca()) {
                $actividad->setConvoca($entidad);
            }
        }

        $inicio = $actividad->getInicio();
        $fin = $actividad->getFin();

        if (isset($json['inicio'])) {
            try {
                $inicio = new DateTimeImmutable($json['inicio']);
            } catch (Exception $e) {
                return $this->json([
                    'error' => 'Invalid inicio datetime format',
                    'details' => $e->getMessage()
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        if (isset($json['fin'])) {
            try {
                $fin = new DateTimeImmutable($json['fin']);
            } catch (Exception $e) {
                return $this->json([
                    'error' => 'Invalid fin datetime format',
                    'details' => $e->getMessage()
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        if ($inicio > $fin) {
            return $this->json([
                'error' => 'Invalid datetime range',
                'details' => 'The start date cannot be after the end date.'
            ], Response::HTTP_BAD_REQUEST);
        }

        if ($inicio != $actividad->getInicio()) {
            $actividad->setInicio($inicio);
        }

        if ($fin != $actividad->getFin()) {
            $actividad->setFin($fin);
        }

        if (isset($json['grado'])) {
            $grado = $gradoRepository->find($json['grado']);

            if (!$grado) {
                return $this->json([
                    'error' => 'Grado not found',
                    'details' => "Grado with id {$json['grado']} not found"
                ], Response::HTTP_BAD_REQUEST);
            }

            if ($grado !== $actividad->getGrado()) {
                $actividad->setGrado($grado);
            }
        }

        if (isset($json['imagenUrl'])) {
            $imagenUrl = $json['imagenUrl'];

            if ($imagenUrl != $actividad->getImagenUrl()) {
                $actividad->setImagenUrl($imagenUrl);
            }
        }

        if (isset($json['voluntarios'])) {
            $voluntarios = new ArrayCollection();

            foreach ($json['voluntarios'] as $idVoluntario) {
                $voluntario = $voluntarioRepository->find($idVoluntario);

                if (!$voluntario) {
                    return $this->json([
                        'error' => 'Voluntario not found',
                        'details' => "Voluntario with id {$idVoluntario} not found"
                    ], Response::HTTP_BAD_REQUEST);
                }

                $voluntarios->add($voluntario);
            }

            $actividad->setVoluntarios($voluntarios);
        }

        if (isset($json['ods'])) {
            $odss = new ArrayCollection();

            foreach ($json['ods'] as $idOds) {
                $ods = $odsRepository->find($idOds);

                if (!$ods) {
                    return $this->json([
                        'error' => 'Ods not found',
                        'details' => "Ods with id {$idOds} not found"
                    ], Response::HTTP_BAD_REQUEST);
                }

                $odss->add($ods);
            }

            $actividad->setOds($odss);
        }

        if (isset($json['tiposActividad'])) {
            $tiposActividad = new ArrayCollection();

            foreach ($json['tiposActividad'] as $idTipoActividad) {
                $tipoActividad = $tipoActividadRepository->find($idTipoActividad);

                if (!$tipoActividad) {
                    return $this->json([
                        'error' => 'TipoActividad not found',
                        'details' => "TipoActividad with id {$idTipoActividad} not found",
                    ], Response::HTTP_BAD_REQUEST);
                }

                $tiposActividad->add($tipoActividad);
            }

            $actividad->setTiposActividad($tiposActividad);
        }

        $actividadRepository->update($actividad);

        return $this->json($actividad, context: [
            'groups' => ['actividad:read']

        ], status: Response::HTTP_ACCEPTED);

    }

    #[Route('/actividad/{id}', name: 'actividad_delete', methods: ['DELETE'])]
    public function delete(
        ActividadRepository $actividadRepository,
        int $id
    ): JsonResponse {
        $actividad = $actividadRepository->find($id);

        if (!$actividad) {
            return $this->json([
                'error' => 'Actividad not found',
                'details' => "Actividad with id $id not found"
            ], Response::HTTP_NOT_FOUND);
        }

        $actividad->setEstado('E');
        $actividadRepository->update($actividad);

        return $this->json($actividad, context: ['groups' => ['actividad:read']]);

    }
}
