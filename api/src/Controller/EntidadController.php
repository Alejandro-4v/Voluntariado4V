<?php

namespace App\Controller;

use App\Entity\Actividad;
use App\Entity\Entidad;
use App\Repository\EntidadRepository;
use App\Repository\ActividadRepository;

use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class EntidadController extends AbstractController
{
    #[Route('/entidad', name: 'entidad_index', methods: ['GET'])]
    public function index(
        EntidadRepository $entidadRepository,
        Request $request
    ): JsonResponse {
        $filters = $request->query->all();

        /** @var Entidad[] $entidades */
        $entidades = $entidadRepository->findByFilters($filters);

        return $this->json(
            $entidades,
            context: ['groups' => ['entidad:read']]
        );
    }

    #[Route('/entidad/{id}', name: 'entidad_show', methods: ['GET'])]
    public function show(
        EntidadRepository $entidadRepository,
        int $id
    ): JsonResponse {
        /** @var Entidad $entidad */
        $entidad = $entidadRepository->find($id);

        if (!$entidad) {
            return $this->json(
                ['error' => 'Entidad not found'],
                status: Response::HTTP_NOT_FOUND
            );
        }

        return $this->json(
            $entidad,
            context: ['groups' => ['entidad:read']]
        );
    }

    #[Route('/entidad', name: 'entidad_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntidadRepository $entidadRepository,
        ActividadRepository $actividadRepository
    ): JsonResponse {
        $data = $request->getContent();
        $json = json_decode($data, true);

        /** @var Entidad $entidad */
        $entidad = new Entidad();

        if (isset($json['nombre'])) {
            /** @var string $nombre */
            $nombre = $json['nombre'];
            if (empty($nombre)) {
                return $this->json([
                    'error' => 'Invalid nombre',
                    'details' => 'Nombre cannot be empty'
                ], Response::HTTP_BAD_REQUEST);
            }
            $entidad->setNombre($nombre);
        } else {
            return $this->json([
                'error' => 'Missing nombre',
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['nombreResponsable'])) {
            $entidad->setNombreResponsable($json['nombreResponsable']);
        } else {
            return $this->json([
                'error' => 'Missing nombreResponsable',
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['apellidosResponsable'])) {
            $entidad->setApellidosResponsable($json['apellidosResponsable']);
        } else {
            return $this->json([
                'error' => 'Missing apellidosResponsable',
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['contactMail'])) {
            /** @var string $contactMail */
            $contactMail = $json['contactMail'];
            if (!filter_var($contactMail, FILTER_VALIDATE_EMAIL)) {
                return $this->json([
                    'error' => 'Invalid contactMail format'
                ], Response::HTTP_BAD_REQUEST);
            }
            $entidad->setContactMail($contactMail);
        } else {
            return $this->json([
                'error' => 'Missing contactMail',
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['cif'])) {
            $cif = strtoupper(trim($json['cif']));

            if (preg_match('/^(?:[A-Z]\d{8}[A-Z]|[A-Z]\d{8}|\d{8}[A-Z])$/', $cif)) {
                $entidad->setCif($cif);
            } else {
                return $this->json([
                    'error' => 'Invalid cif format'
                ], Response::HTTP_BAD_REQUEST);
            }
        } else {
            $entidad->setCif(null);
        }

        if (isset($json['loginMail'])) {
            /** @var string $loginMail */
            $loginMail = $json['loginMail'];
            if (!empty($loginMail) && !filter_var($loginMail, FILTER_VALIDATE_EMAIL)) {
                return $this->json([
                    'error' => 'Invalid loginMail format'
                ], Response::HTTP_BAD_REQUEST);
            }
            $entidad->setLoginMail($loginMail);
        } else {
            $entidad->setLoginMail(null);
        }

        if (isset($json['passwordHash'])) {
            $entidad->setPasswordHash($json['passwordHash']);
        } else {
            $entidad->setPasswordHash(null);
        }

        if (isset($json['perfilUrl'])) {
            $entidad->setPerfilUrl($json['perfilUrl']);
        } else {
            $entidad->setPerfilUrl(null);
        }

        if (isset($json['fechaRegistro'])) {
            try {
                /** @var DateTimeImmutable $fechaRegistro */
                $fechaRegistro = new DateTimeImmutable($json['fechaRegistro']);
                $entidad->setFechaRegistro($fechaRegistro);
            } catch (\Exception $e) {
                return $this->json([
                    'error' => 'Invalid fechaRegistro datetime format'
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        if (isset($json['actividades'])) {
            /** @var ArrayCollection $actividades */
            $actividades = new ArrayCollection();

            foreach ($json['actividades'] as $idActividad) {
                /** @var Actividad $actividad */
                $actividad = $actividadRepository->find($idActividad);

                if (!$actividad) {
                    return $this->json([
                        'error' => "Actividad with id {$idActividad} not found",
                    ], Response::HTTP_BAD_REQUEST);
                }

                $actividades->add($actividad);
            }

            $entidad->setActividades($actividades);
        } else {
            $entidad->setActividades(new ArrayCollection());
        }

        $entidadRepository->add($entidad);

        return $this->json($entidad, context: ['groups' => ['entidad:read']], status: Response::HTTP_CREATED);
    }

    #[Route(path: '/entidad/{id}', name: 'entidad_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        EntidadRepository $entidadRepository,
        ActividadRepository $actividadRepository
    ): JsonResponse {
        $data = $request->getContent();
        $json = json_decode($data, true);

        /** @var Entidad $entidad */
        $entidad = $entidadRepository->find($id);

        if (!$entidad) {
            return $this->json([
                'error' => 'Entidad not found'
            ], Response::HTTP_NOT_FOUND);
        }

        if (isset($json['nombre'])) {
            /** @var string $nombre */
            $nombre = $json['nombre'];

            if (empty($nombre)) {
                return $this->json([
                    'error' => 'Invalid nombre',
                    'details' => 'Nombre cannot be empty'
                ], Response::HTTP_BAD_REQUEST);
            }

            if ($nombre != $entidad->getNombre()) {
                $entidad->setNombre($nombre);
            }
        }

        if (isset($json['cif'])) {
            $cif = strtoupper(trim($json['cif']));

            if (preg_match('/^(?:[A-Z]\d{8}[A-Z]|[A-Z]\d{8}|\d{8}[A-Z])$/', $cif)) {
                $entidad->setCif($cif);
            } else {
                return $this->json([
                    'error' => 'Invalid cif format'
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        if (isset($json['nombreResponsable'])) {
            /** @var string $nombreResponsable */
            $nombreResponsable = $json['nombreResponsable'];

            if ($nombreResponsable != $entidad->getNombreResponsable()) {
                $entidad->setNombreResponsable($nombreResponsable);
            }
        }

        if (isset($json['apellidosResponsable'])) {
            /** @var string $apellidosResponsable */
            $apellidosResponsable = $json['apellidosResponsable'];

            if ($apellidosResponsable != $entidad->getApellidosResponsable()) {
                $entidad->setApellidosResponsable($apellidosResponsable);
            }
        }

        if (isset($json['fechaRegistro'])) {
            try {
                /** @var DateTimeImmutable $fechaRegistro */
                $fechaRegistro = new DateTimeImmutable($json['fechaRegistro']);

                if ($fechaRegistro != $entidad->getFechaRegistro()) {
                    $entidad->setFechaRegistro($fechaRegistro);
                }
            } catch (\Exception $e) {
                return $this->json([
                    'error' => 'Invalid fechaRegistro datetime format'
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        if (isset($json['contactMail'])) {
            /** @var string $contactMail */
            $contactMail = $json['contactMail'];

            if (!filter_var($contactMail, FILTER_VALIDATE_EMAIL)) {
                return $this->json([
                    'error' => 'Invalid contactMail format'
                ], Response::HTTP_BAD_REQUEST);
            }

            if ($contactMail != $entidad->getContactMail()) {
                $entidad->setContactMail($contactMail);
            }
        }

        if (isset($json['loginMail'])) {
            /** @var ?string $loginMail */
            $loginMail = $json['loginMail'];
            $newLoginMail = empty($loginMail) ? null : $loginMail;

            if ($newLoginMail !== null && !filter_var($newLoginMail, FILTER_VALIDATE_EMAIL)) {
                return $this->json([
                    'error' => 'Invalid loginMail format'
                ], Response::HTTP_BAD_REQUEST);
            }

            if ($newLoginMail != $entidad->getLoginMail()) {
                $entidad->setLoginMail($newLoginMail);
            }
        }

        if (isset($json['passwordHash'])) {
            /** @var ?string $passwordHash */
            $passwordHash = $json['passwordHash'];
            $newPasswordHash = empty($passwordHash) ? null : $passwordHash;

            if ($newPasswordHash != $entidad->getPasswordHash()) {
                $entidad->setPasswordHash($newPasswordHash);
            }
        }

        if (isset($json['perfilUrl'])) {
            /** @var ?string $perfilUrl */
            $perfilUrl = $json['perfilUrl'];
            $newPerfilUrl = empty($perfilUrl) ? null : $perfilUrl;

            if ($newPerfilUrl != $entidad->getPerfilUrl()) {
                $entidad->setPerfilUrl($newPerfilUrl);
            }
        }

        if (isset($json['actividades'])) {
            /** @var ArrayCollection $actividades */
            $actividades = new ArrayCollection();

            foreach ($json['actividades'] as $idActividad) {
                /** @var Actividad $actividad */
                $actividad = $actividadRepository->find($idActividad);

                if (!$actividad) {
                    return $this->json([
                        'error' => "Actividad with id {$idActividad} not found"
                    ], Response::HTTP_BAD_REQUEST);
                }

                $actividades->add($actividad);
            }

            $entidad->setActividades($actividades);
        }

        $entidadRepository->update($entidad);

        return $this->json($entidad, context: [
            'groups' => ['entidad:read']

        ], status: Response::HTTP_ACCEPTED);
    }

    #[Route('/entidad/{id}', name: 'entidad_delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        EntidadRepository $entidadRepository
    ): JsonResponse {
        /** @var Entidad $entidad */
        $entidad = $entidadRepository->find($id);

        if (!$entidad) {
            return $this->json([
                'error' => 'Entidad not found',
            ], Response::HTTP_NOT_FOUND);
        }

        $entidadRepository->remove($entidad);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

}
