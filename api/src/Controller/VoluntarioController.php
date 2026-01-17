<?php

namespace App\Controller;

use App\Entity\Disponibilidad;
use App\Entity\Voluntario;
use App\Repository\DiaSemanaRepository;
use App\Repository\DisponibilidadRepository;
use App\Repository\GradoRepository;
use App\Repository\TipoActividadRepository;
use App\Repository\VoluntarioRepository;

use Doctrine\Common\Collections\ArrayCollection;

use Doctrine\ORM\Exception\EntityIdentityCollisionException;
use Exception;
use DateTimeImmutable;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;


final class VoluntarioController extends AbstractController
{
    private const ESTADOS_VALIDOS = ['A', 'I', 'V'];

    #[Route('/voluntario', name: 'voluntario_index', methods: ['GET'])]
    public function index(
        VoluntarioRepository $voluntarioRepository,
        Request $request
    ): JsonResponse {
        $filters = $request->query->all();

        $voluntarios = $voluntarioRepository->findByFilters($filters);

        return $this->json(
            $voluntarios,
            context: ['groups' => ['voluntario:read']]
        );
    }

    #[Route('/voluntario/{nif}', name: 'voluntario_show', methods: ['GET'])]
    public function show(
        VoluntarioRepository $voluntarioRepository,
        string $nif
    ): JsonResponse {
        $voluntario = $voluntarioRepository->find($nif);

        if (!$voluntario) {
            return $this->json(
                ['error' => 'Voluntario not found', 'details' => "Voluntario with NIF $nif not found"],
                status: Response::HTTP_NOT_FOUND
            );
        }

        return $this->json(
            $voluntario,
            context: ['groups' => ['voluntario:read']]
        );
    }

    #[Route('/voluntario', name: 'voluntario_create', methods: ['POST'])]
    public function create(
        Request $request,
        VoluntarioRepository $voluntarioRepository,
        GradoRepository $gradoRepository,
        TipoActividadRepository $tipoActividadRepository,
        DiaSemanaRepository $diaSemanaRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (isset($data['nif'])) {
            if ($voluntarioRepository->find($data['nif'])) {
                return $this->json([
                    'error' => 'Voluntario already exists',
                    'details' => "Voluntario with NIF {$data['nif']} already exists"
                ], Response::HTTP_CONFLICT);
            }
        } else {
            return $this->json([
                'error' => 'Missing NIF',
                'details' => 'The field nif is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['mail'])) {
            $existingVoluntario = $voluntarioRepository->findOneBy(['mail' => $data['mail']]);
            if ($existingVoluntario) {
                return $this->json([
                    'error' => 'Email already exists',
                    'details' => "Voluntario with email {$data['mail']} already exists"
                ], Response::HTTP_CONFLICT);
            }
        } else {
            return $this->json([
                'error' => 'Missing mail',
                'details' => 'The field mail is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        $voluntario = new Voluntario();
        $voluntario->setNif($data['nif']);
        $voluntario->setMail($data['mail']);

        if (isset($data['nombre'])) {
            $voluntario->setNombre($data['nombre']);
        } else {
            return $this->json([
                'error' => 'Missing nombre',
                'details' => 'The field nombre is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['apellido1'])) {
            $voluntario->setApellido1($data['apellido1']);
        } else {
            return $this->json([
                'error' => 'Missing apellido1',
                'details' => 'The field apellido1 is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['apellido2'])) {
            $voluntario->setApellido2($data['apellido2']);
        } else {
            $voluntario->setApellido2(null);
        }

        if (isset($data['password'])) {
            $hashedPassword = $passwordHasher->hashPassword(
                $voluntario,
                $data['password']
            );
            $voluntario->setPasswordHash($hashedPassword);
        } else {
            return $this->json([
                'error' => 'Missing password',
                'details' => 'The field password is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['estado'])) {
            $estado = strtoupper($data['estado']);
            if (!\in_array($estado, self::ESTADOS_VALIDOS)) {
                return $this->json([
                    'error' => 'Invalid estado',
                    'details' => 'Estado must be A (Alta), I (Inactivo) or V (Validado)'
                ], Response::HTTP_BAD_REQUEST);
            }
            $voluntario->setEstado($estado);
        } else {
            $voluntario->setEstado('A');
        }

        if (isset($data['grado'])) {
            $grado = $gradoRepository->find($data['grado']);
            if (!$grado) {
                return $this->json([
                    'error' => 'Grado not found',
                    'details' => "Grado with id {$data['grado']} not found"
                ], Response::HTTP_BAD_REQUEST);
            }
            $voluntario->setGrado($grado);
        } else {
            return $this->json([
                'error' => 'Missing grado',
                'details' => 'The field grado is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['perfilUrl'])) {
            $voluntario->setPerfilUrl($data['perfilUrl']);
        }

        if (isset($data['tiposActividad'])) {
            $tiposActividad = new ArrayCollection();
            foreach ($data['tiposActividad'] as $idTipoActividad) {
                $tipoActividad = $tipoActividadRepository->find($idTipoActividad);
                if (!$tipoActividad) {
                    return $this->json([
                        'error' => 'TipoActividad not found',
                        'details' => "TipoActividad with id $idTipoActividad not found"
                    ], Response::HTTP_BAD_REQUEST);
                }
                $tiposActividad->add($tipoActividad);
            }
            $voluntario->setTiposActividad($tiposActividad);
        }

        $disponibilidades = new ArrayCollection();
        if (isset($data['disponibilidades'])) {
            foreach ($data['disponibilidades'] as $dispData) {
                if (!isset($dispData['diaSemana'], $dispData['horaInicio'], $dispData['horaFin'])) {
                    return $this->json([
                        'error' => 'Invalid disponibilidad data',
                        'details' => 'Each disponibilidad must have diaSemana, horaInicio, and horaFin'
                    ], Response::HTTP_BAD_REQUEST);
                }

                $diaSemana = $diaSemanaRepository->find($dispData['diaSemana']);
                if (!$diaSemana) {
                    return $this->json([
                        'error' => 'DiaSemana not found',
                        'details' => "DiaSemana with id {$dispData['diaSemana']} not found"
                    ], Response::HTTP_BAD_REQUEST);
                }

                try {
                    $horaInicio = new DateTimeImmutable($dispData['horaInicio']);
                    $horaFin = new DateTimeImmutable($dispData['horaFin']);
                } catch (Exception $e) {
                    return $this->json([
                        'error' => 'Invalid time format',
                        'details' => 'horaInicio and horaFin must be valid time strings'
                    ], Response::HTTP_BAD_REQUEST);
                }

                if ($horaInicio >= $horaFin) {
                    return $this->json([
                        'error' => 'Invalid time range',
                        'details' => 'horaInicio must be before horaFin'
                    ], Response::HTTP_BAD_REQUEST);
                }

                $disponibilidad = new Disponibilidad();
                $disponibilidad->setDiaSemana($diaSemana);
                $disponibilidad->setHoraInicio($horaInicio);
                $disponibilidad->setHoraFin($horaFin);
                $disponibilidad->setVoluntario($voluntario);

                $disponibilidades->add($disponibilidad);
            }
        }
        $voluntario->setDisponibilidades($disponibilidades);

        try {
            $voluntarioRepository->add($voluntario);
        } catch (EntityIdentityCollisionException $e) {
            return $this->json([
                'error' => 'Availability conflict',
                'details' => 'Multiple availability slots cannot be assigned to the same day for a single volunteer'
            ], Response::HTTP_CONFLICT);
        }

        return $this->json($voluntario, context: ['groups' => ['voluntario:read']], status: Response::HTTP_CREATED);
    }

    #[Route('/voluntario/{nif}', name: 'voluntario_update', methods: ['PUT'])]
    public function update(
        string $nif,
        Request $request,
        VoluntarioRepository $voluntarioRepository,
        GradoRepository $gradoRepository,
        TipoActividadRepository $tipoActividadRepository,
        DiaSemanaRepository $diaSemanaRepository,
        DisponibilidadRepository $disponibilidadRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $voluntario = $voluntarioRepository->find($nif);

        if (!$voluntario) {
            return $this->json([
                'error' => 'Voluntario not found',
                'details' => "Voluntario with NIF $nif not found"
            ], Response::HTTP_NOT_FOUND);
        }

        if (isset($data['mail'])) {
            $existingVoluntario = $voluntarioRepository->findOneBy(['mail' => $data['mail']]);
            if ($existingVoluntario && $existingVoluntario->getNif() !== $voluntario->getNif()) {
                return $this->json([
                    'error' => 'Email already exists',
                    'details' => "Voluntario with email {$data['mail']} already exists"
                ], Response::HTTP_CONFLICT);
            }
            $voluntario->setMail($data['mail']);
        }

        if (isset($data['nombre'])) {
            $voluntario->setNombre($data['nombre']);
        }

        if (isset($data['apellido1'])) {
            $voluntario->setApellido1($data['apellido1']);
        }

        if (isset($data['apellido2'])) {
            $voluntario->setApellido2($data['apellido2']);
        }

        if (isset($data['password'])) {
            $hashedPassword = $passwordHasher->hashPassword(
                $voluntario,
                $data['password']
            );
            $voluntario->setPasswordHash($hashedPassword);
        }

        if (isset($data['estado'])) {
            $estado = strtoupper($data['estado']);
            if (!\in_array($estado, self::ESTADOS_VALIDOS)) {
                return $this->json([
                    'error' => 'Invalid estado',
                    'details' => 'Estado must be A (Alta), I (Inactivo) or V (Validado)'
                ], Response::HTTP_BAD_REQUEST);
            }
            $voluntario->setEstado($estado);
        }

        if (isset($data['grado'])) {
            $grado = $gradoRepository->find($data['grado']);
            if (!$grado) {
                return $this->json([
                    'error' => 'Grado not found',
                    'details' => "Grado with id {$data['grado']} not found"
                ], Response::HTTP_BAD_REQUEST);
            }
            $voluntario->setGrado($grado);
        }

        if (isset($data['perfilUrl'])) {
            $voluntario->setPerfilUrl($data['perfilUrl']);
        }

        if (isset($data['tiposActividad'])) {
            $tiposActividad = new ArrayCollection();
            foreach ($data['tiposActividad'] as $idTipoActividad) {
                $tipoActividad = $tipoActividadRepository->find($idTipoActividad);
                if (!$tipoActividad) {
                    return $this->json([
                        'error' => 'TipoActividad not found',
                        'details' => "TipoActividad with id $idTipoActividad not found"
                    ], Response::HTTP_BAD_REQUEST);
                }
                $tiposActividad->add($tipoActividad);
            }
            $voluntario->setTiposActividad($tiposActividad);
        }

        if (isset($data['disponibilidades'])) {
            foreach ($voluntario->getDisponibilidades() as $disponibilidad) {
                $voluntario->removeDisponibilidad($disponibilidad);
                $disponibilidadRepository->remove($disponibilidad);
            }

            foreach ($data['disponibilidades'] as $dispData) {
                if (!isset($dispData['diaSemana'], $dispData['horaInicio'], $dispData['horaFin'])) {
                    return $this->json([
                        'error' => 'Invalid disponibilidad data',
                        'details' => 'Each disponibilidad must have diaSemana, horaInicio, and horaFin'
                    ], Response::HTTP_BAD_REQUEST);
                }

                $diaSemana = $diaSemanaRepository->find($dispData['diaSemana']);
                if (!$diaSemana) {
                    return $this->json([
                        'error' => 'DiaSemana not found',
                        'details' => "DiaSemana with id {$dispData['diaSemana']} not found"
                    ], Response::HTTP_BAD_REQUEST);
                }

                try {
                    $horaInicio = new DateTimeImmutable($dispData['horaInicio']);
                    $horaFin = new DateTimeImmutable($dispData['horaFin']);
                } catch (Exception $e) {
                    return $this->json([
                        'error' => 'Invalid time format',
                        'details' => 'horaInicio and horaFin must be valid time strings'
                    ], Response::HTTP_BAD_REQUEST);
                }

                if ($horaInicio >= $horaFin) {
                    return $this->json([
                        'error' => 'Invalid time range',
                        'details' => 'horaInicio must be before horaFin'
                    ], Response::HTTP_BAD_REQUEST);
                }

                $disponibilidad = new Disponibilidad();
                $disponibilidad->setDiaSemana($diaSemana);
                $disponibilidad->setHoraInicio($horaInicio);
                $disponibilidad->setHoraFin($horaFin);
                $disponibilidad->setVoluntario($voluntario);

                $voluntario->addDisponibilidad($disponibilidad);
            }
        }

        $voluntarioRepository->update($voluntario);

        return $this->json($voluntario, context: ['groups' => ['voluntario:read']]);
    }

    #[Route('/voluntario/{nif}', name: 'voluntario_delete', methods: ['DELETE'])]
    public function delete(
        string $nif,
        VoluntarioRepository $voluntarioRepository
    ): JsonResponse {
        $voluntario = $voluntarioRepository->find($nif);

        if (!$voluntario) {
            return $this->json([
                'error' => 'Voluntario not found',
                'details' => "Voluntario with NIF $nif not found"
            ], Response::HTTP_NOT_FOUND);
        }

        $voluntario->setEstado('I');
        $voluntarioRepository->update($voluntario);

        return $this->json($voluntario, context: ['groups' => ['voluntario:read']]);
    }
}
