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

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;


final class ActividadController extends AbstractController
{
    #[Route('/actividad', name: 'actividad_index', methods: ['GET'])]
    public function index(
        ActividadRepository $actividadRepository
    ): JsonResponse {
        /** @var Actividad[] $actividades */
        $actividades = $actividadRepository->findAll();

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
        /** @var Actividad $actividad */
        $actividad = $actividadRepository->find($id);

        if (!$actividad) {
            return $this->json(
                ['error' => 'Actividad not found'],
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

        /** @var Actividad $actividad */
        $actividad = new Actividad();

        if (isset($json['nombre'])) {
            $actividad->setNombre($json['nombre']);
        } else {
            return $this->json([
                'error' => 'Missing nombre',
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['descripcion'])) {
            $actividad->setDescripcion($json['descripcion']);
        } else {
            $actividad->setDescripcion(null);
        }

        if (isset($json['estado'])) {
            /** @var string $estado*/
            $estado = $json['estado'];
            if (!\in_array($estado, ['A', 'F', 'P', 'C', 'R', 'E'])) {
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
            /** @var Entidad $entidad */
            $entidad = $entidadRepository->find($json['convoca']);

            if (!$entidad) {
                return $this->json([
                    'error' => "Entidad with id {$json['convoca']} not found"
                ], Response::HTTP_BAD_REQUEST);
            }

            $actividad->setConvoca($entidad);
        } else {
            return $this->json([
                'error' => 'Missing entidad',
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            /** @var DateTimeImmutable $inicio */
            $inicio = new DateTimeImmutable($json['inicio']);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Invalid inicio datetime format'
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            /** @var DateTimeImmutable $fin */
            $fin = new DateTimeImmutable($json['fin']);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Invalid fin datetime format'
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
            /** @var Grado $grado*/
            $grado = $gradoRepository->find($json['grado']);

            $actividad->setGrado($grado);
        } else {
            return $this->json([
                'error' => 'Missing grado',
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['imagenUrl'])) {
            /** @var string $imagenUrl */
            $imagenUrl = $json['imagenUrl'];

            $actividad->setImagenUrl($imagenUrl);
        } else {
            $actividad->setImagenUrl(null);
        }

        if (isset($json['voluntarios'])) {
            /** @var ArrayCollection $voluntarios */
            $voluntarios = new ArrayCollection();

            foreach ($json["voluntarios"] as $idVoluntario) {
                /** @var Voluntario $voluntario */
                $voluntario = $voluntarioRepository->find($idVoluntario);

                if (!$voluntario) {
                    return $this->json([
                        'error' => "Voluntario with id {$idVoluntario} not found",
                    ], Response::HTTP_BAD_REQUEST);
                }

                $voluntarios->add($voluntario);
            }

            $actividad->setVoluntarios($voluntarios);
        } else {
            $actividad->setVoluntarios(new ArrayCollection());
        }

        if (isset($json['ods'])) {
            /** @var ArrayCollection $ods */
            $odss = new ArrayCollection();

            foreach ($json['ods'] as $idOds) {
                $ods = $odsRepository->find($idOds);

                if (!$ods) {
                    return $this->json([
                        'error' => "Ods with id {$idOds} not found",
                    ], Response::HTTP_BAD_REQUEST);
                }

                $odss->add($ods);
            }

            $actividad->setOds($odss);

        } else {
            $actividad->setOds(new ArrayCollection());
        }

        if (isset($json['tiposActividad'])) {
            /** @var ArrayCollection $tiposActividad */
            $tiposActividad = new ArrayCollection();

            foreach ($json['tiposActividad'] as $idTipoActividad) {
                /** @var TipoActividad $tipoActividad */
                $tipoActividad = $tipoActividadRepository->find($idTipoActividad);

                if (!$tipoActividad) {
                    return $this->json([
                        'error' => "TipoActividad with id {$idTipoActividad} not found",
                    ], Response::HTTP_BAD_REQUEST);
                }

                $tiposActividad->add($tipoActividad);
            }

            $actividad->setTiposActividad($tiposActividad);
        } else {
            $actividad->setTiposActividad(new ArrayCollection());
        }

        $actividadRepository->add($actividad);

        return $this->json($actividad, context: ['groups' => ['actividad:read']], status: Response::HTTP_CREATED);

    }

    #[Route(path: '/actividad', name: 'actividad_update', methods: ['PUT'])]
    public function update(
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

        if (!isset($json['idActividad'])) {
            return $this->json([
                'error' => 'Missing ID',
                'details' => 'PUT request must include idActividad'
            ], Response::HTTP_BAD_REQUEST);
        }

        $actividad = $actividadRepository->find($json['idActividad']);

        if (!$actividad) {
            return $this->json([
                'error' => 'Actividad not found'
            ], Response::HTTP_NOT_FOUND);
        }

        if (isset($json['nombre'])) {
            /** @var string $nombre */
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
            /** @var string $descripcion */
            $descripcion = $json['descripcion'];

            if ($descripcion != $actividad->getDescripcion()) {
                $actividad->setDescripcion($descripcion);
            }
        }

        if (isset($json['estado'])) {
            /** @var string $estado */
            $estado = strtoupper($json['estado']);

            if ($estado === '') {
                return $this->json([
                    'error' => 'Invalid estado',
                    'details' => 'Estado cannot be empty'
                ], Response::HTTP_BAD_REQUEST);
            }

            if ($estado != $actividad->getEstado()) {
                if (!\in_array($estado, ['A', 'F', 'P', 'C', 'R', 'E'])) {
                    return $this->json([
                        'error' => 'Invalid estado',
                        'details' => 'Estado must be one of A, F, P, C, R, E'
                    ], Response::HTTP_BAD_REQUEST);
                }
            }

            $actividad->setEstado($estado);

        }

        if (isset($json['convoca'])) {
            /** @var Entidad $entidad */
            $entidad = $entidadRepository->find($json['convoca']);

            if (!$entidad) {
                return $this->json([
                    'error' => "Entidad with id {$json['convoca']} not found"
                ], Response::HTTP_BAD_REQUEST);
            }

            if ($entidad != $actividad->getConvoca()) {
                $actividad->setConvoca($entidad);
            }
        }

        /** @var DateTimeImmutable $inicio */
        $inicio = $actividad->getInicio();

        /** @var DateTimeImmutable $fin */
        $fin = $actividad->getFin();

        if (isset($json['inicio'])) {
            try {
                /** @var DateTimeImmutable $inicio */
                $inicio = new DateTimeImmutable($json['inicio']);
            } catch (\Exception $e) {
                return $this->json([
                    'error' => 'Invalid inicio datetime format'
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        if (isset($json['fin'])) {
            try {
                /** @var DateTimeImmutable $fin */
                $fin = new DateTimeImmutable($json['fin']);
            } catch (\Exception $e) {
                return $this->json([
                    'error' => 'Invalid fin datetime format'
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
            $actividad->setInfin($fin);
        }

        if (isset($json['grado'])) {
            /** @var Grado $grado */
            $grado = $gradoRepository->find($json['grado']);

            if (!$grado) {
                return $this->json([
                    'error' => "Grado with id {$json['grado']} not found"
                ], Response::HTTP_BAD_REQUEST);
            }

            if ($grado != $actividad->getGrado()) {
                $actividad->setGrado($grado);
            }
        }

        if (isset($json['imagenUrl'])) {
            /** @var string $imagenUrl */
            $imagenUrl = $json['imagenUrl'];

            if ($imagenUrl != $actividad->getImagenUrl()) {
                $actividad->setImagenUrl($imagenUrl);
            }
        }

        if (isset($json['voluntarios'])) {
            /** @var ArrayCollection $voluntarios */
            $voluntarios = new ArrayCollection();

            foreach ($json['voluntarios'] as $idVoluntario) {
                /** @var Voluntario $voluntario */
                $voluntario = $voluntarioRepository->find($idVoluntario);

                if (!$voluntario) {
                    return $this->json([
                        'error' => "Voluntario with id {$idVoluntario} not found"
                    ], Response::HTTP_BAD_REQUEST);
                }

                $voluntarios->add($voluntario);
            }

            $actividad->setVoluntarios($voluntarios);
        }

        if (isset($json['ods'])) {
            /** @var ArrayCollection $odss */
            $odss = new ArrayCollection();

            foreach ($json['ods'] as $idOds) {
                /** @var Ods $ods*/
                $ods = $odsRepository->find($idOds);

                if (!$ods) {
                    return $this->json([
                        'error' => "Ods with id {$idOds} not found"
                    ], Response::HTTP_BAD_REQUEST);
                }

                $odss->add($ods);
            }

            $actividad->setOds($odss);
        }

        if (isset($json['tiposActividad'])) {
            /** @var ArrayCollection $tiposActividad */
            $tiposActividad = new ArrayCollection();

            foreach ($json['tiposActividad'] as $idTipoActividad) {
                /** @var TipoActividad $tipoActividad */
                $tipoActividad = $tipoActividadRepository->find($idTipoActividad);

                if (!$tipoActividad) {
                    return $this->json([
                        'error' => "TipoActividad with id {$idTipoActividad} not found",
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
        /** @var Actividad $actividad */
        $actividad = $actividadRepository->find($id);

        if (!$actividad) {
            return $this->json([
                'error' => 'Actividad not found',
            ], Response::HTTP_NOT_FOUND);
        }

        $actividad->setEstado('E');

        return $this->json($actividad, context: ['groups' => ['actividad:read']]);

    }
}