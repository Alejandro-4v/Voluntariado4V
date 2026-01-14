<?php

namespace App\Controller;

use App\Entity\DiaSemana;
use App\Entity\Disponibilidad;
use App\Entity\Grado;
use App\Entity\TipoActividad;
use App\Entity\Voluntario;
use App\Repository\DiaSemanaRepository;
use App\Repository\DisponibilidadRepository;
use App\Repository\GradoRepository;
use App\Repository\TipoActividadRepository;
use App\Repository\VoluntarioRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

final class VoluntarioController extends AbstractController
{
    #[Route('/voluntario', name: 'voluntario_index', methods: ['GET'])]
    public function index(
        VoluntarioRepository $voluntarioRepository,
        Request $request
    ): JsonResponse {
        $filters = $request->query->all();

        /** @var Voluntario[] $voluntarios */
        $voluntarios = $voluntarioRepository->findByFilters($filters); // Call findByFilters

        return $this->json(
            $voluntarios,
            context: ['groups' => ['voluntario:read', 'disponibilidad:read']]
        );
    }

    #[Route('/voluntario/{nif}', name: 'voluntario_show', methods: ['GET'])]
    public function show(
        VoluntarioRepository $voluntarioRepository,
        string $nif
    ): JsonResponse {
        /** @var Voluntario $voluntario */
        $voluntario = $voluntarioRepository->find($nif);

        if (!$voluntario) {
            return $this->json(
                ['error' => 'Voluntario not found'],
                status: Response::HTTP_NOT_FOUND
            );
        }

        return $this->json(
            $voluntario,
            context: ['groups' => ['voluntario:read', 'disponibilidad:read']]
        );
    }

    #[Route('/voluntario', name: 'voluntario_create', methods: ['POST'])]
    public function create(
        Request $request,
        VoluntarioRepository $voluntarioRepository,
        GradoRepository $gradoRepository,
        TipoActividadRepository $tipoActividadRepository,
        DiaSemanaRepository $diaSemanaRepository,
        DisponibilidadRepository $disponibilidadRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if ($voluntarioRepository->find($data['nif'])) {
            return $this->json(['error' => 'Voluntario with this NIF already exists'], Response::HTTP_CONFLICT);
        }

        $voluntario = new Voluntario();
        $voluntario->setNif($data['nif']);
        $voluntario->setNombre($data['nombre']);
        $voluntario->setApellido1($data['apellido1']);
        $voluntario->setApellido2($data['apellido2'] ?? null);
        $voluntario->setMail($data['mail']);
        $voluntario->setPerfilUrl($data['perfilUrl'] ?? null);

        $hashedPassword = $passwordHasher->hashPassword($voluntario, $data['password']);
        $voluntario->setPasswordHash($hashedPassword);

        /** @var Grado $grado */
        $grado = $gradoRepository->find($data['grado']);
        if (!$grado) {
            return $this->json(['error' => 'Grado not found'], Response::HTTP_BAD_REQUEST);
        }
        $voluntario->setGrado($grado);

        if (isset($data['tiposActividad'])) {
            $tipos = new ArrayCollection();
            foreach ($data['tiposActividad'] as $tipoId) {
                /** @var TipoActividad $tipo */
                $tipo = $tipoActividadRepository->find($tipoId);
                if ($tipo) {
                    $tipos->add($tipo);
                }
            }
            $voluntario->setTiposActividad($tipos);
        }

        $voluntarioRepository->add($voluntario);

        if (isset($data['disponibilidades'])) {
            foreach ($data['disponibilidades'] as $dispData) {
                /** @var DiaSemana $dia */
                $dia = $diaSemanaRepository->find($dispData['idDia']);
                if ($dia) {
                    $disponibilidad = new Disponibilidad();
                    $disponibilidad->setVoluntario($voluntario);
                    $disponibilidad->setDiaSemana($dia);
                    $disponibilidad->setHoraInicio(new DateTimeImmutable($dispData['horaInicio']));
                    $disponibilidad->setHoraFin(new DateTimeImmutable($dispData['horaFin']));
                    $disponibilidadRepository->add($disponibilidad);
                }
            }
        }

        return $this->json($voluntario, Response::HTTP_CREATED, context: ['groups' => ['voluntario:read', 'disponibilidad:read']]);
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
        /** @var Voluntario $voluntario */
        $voluntario = $voluntarioRepository->find($nif);
        if (!$voluntario) {
            return $this->json(['error' => 'Voluntario not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['nombre'])) {
            $voluntario->setNombre($data['nombre']);
        }
        if (isset($data['apellido1'])) {
            $voluntario->setApellido1($data['apellido1']);
        }
        if (isset($data['apellido2'])) {
            $voluntario->setApellido2($data['apellido2']);
        }
        if (isset($data['mail'])) {
            $voluntario->setMail($data['mail']);
        }
        if (isset($data['password'])) {
            $hashedPassword = $passwordHasher->hashPassword($voluntario, $data['password']);
            $voluntario->setPasswordHash($hashedPassword);
        }
        if (isset($data['perfilUrl'])) {
            $voluntario->setPerfilUrl($data['perfilUrl']);
        }
        if (isset($data['estado'])) {
            $voluntario->setEstado($data['estado']);
        }

        if (isset($data['grado'])) {
            /** @var Grado $grado */
            $grado = $gradoRepository->find($data['grado']);
            if (!$grado) {
                return $this->json(['error' => 'Grado not found'], Response::HTTP_BAD_REQUEST);
            }
            $voluntario->setGrado($grado);
        }

        if (isset($data['tiposActividad'])) {
            $tipos = new ArrayCollection();
            foreach ($data['tiposActividad'] as $tipoId) {
                /** @var TipoActividad $tipo */
                $tipo = $tipoActividadRepository->find($tipoId);
                if ($tipo) {
                    $tipos->add($tipo);
                }
            }
            $voluntario->setTiposActividad($tipos);
        }

        // Clear existing disponibilidades and add new ones
        foreach ($voluntario->getDisponibilidades() as $disp) {
            $disponibilidadRepository->remove($disp);
        }

        if (isset($data['disponibilidades'])) {
            foreach ($data['disponibilidades'] as $dispData) {
                /** @var DiaSemana $dia */
                $dia = $diaSemanaRepository->find($dispData['idDia']);
                if ($dia) {
                    $disponibilidad = new Disponibilidad();
                    $disponibilidad->setVoluntario($voluntario);
                    $disponibilidad->setDiaSemana($dia);
                    $disponibilidad->setHoraInicio(new DateTimeImmutable($dispData['horaInicio']));
                    $disponibilidad->setHoraFin(new DateTimeImmutable($dispData['horaFin']));
                    $disponibilidadRepository->add($disponibilidad);
                }
            }
        }

        $voluntarioRepository->update($voluntario);

        return $this->json($voluntario, context: ['groups' => ['voluntario:read', 'disponibilidad:read']]);
    }

    #[Route('/voluntario/{nif}', name: 'voluntario_delete', methods: ['DELETE'])]
    public function delete(
        string $nif,
        VoluntarioRepository $voluntarioRepository
    ): JsonResponse {
        /** @var Voluntario $voluntario */
        $voluntario = $voluntarioRepository->find($nif);
        if (!$voluntario) {
            return $this->json(['error' => 'Voluntario not found'], Response::HTTP_NOT_FOUND);
        }

        $voluntario->setEstado('I'); // Set estado to Inactivo
        $voluntarioRepository->update($voluntario);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
