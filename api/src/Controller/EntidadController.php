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
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

final class EntidadController extends AbstractController
{
    #[Route('/entidad', name: 'entidad_index', methods: ['GET'])]
    public function index(
        EntidadRepository $entidadRepository,
        Request           $request
    ): JsonResponse
    {
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
        int               $id
    ): JsonResponse
    {
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
        Request                     $request,
        EntidadRepository           $entidadRepository,
        ActividadRepository         $actividadRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse
    {
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
            if ($entidadRepository->findOneBy(['nombre' => $nombre])) {
                return $this->json(['error' => 'Entidad with this nombre already exists'], Response::HTTP_CONFLICT);
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

            if (preg_match('/^[A-Z]\d{7}[A-Z]$/', $cif)) {
                if ($entidadRepository->findOneBy(['cif' => $cif])) {
                    return $this->json(['error' => 'Entidad with this CIF already exists'], Response::HTTP_CONFLICT);
                }
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

            if (empty($loginMail)) {
                $loginMail = null;
            }

            if ($loginMail !== null) {
                if (!filter_var($loginMail, FILTER_VALIDATE_EMAIL)) {
                    return $this->json([
                        'error' => 'Invalid loginMail format'
                    ], Response::HTTP_BAD_REQUEST);
                }
                if ($entidadRepository->findOneBy(['loginMail' => $loginMail])) {
                    return $this->json(['error' => 'Entidad with this login email already exists'], Response::HTTP_CONFLICT);
                }
            }
            $entidad->setLoginMail($loginMail);
        } else {
            $entidad->setLoginMail(null);
        }

        if (isset($json['password'])) {
            $hashedPassword = $passwordHasher->hashPassword($entidad, $json['password']);
            $entidad->setPasswordHash($hashedPassword);
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

        return $this->json($entidad, status: Response::HTTP_CREATED, context: ['groups' => ['entidad:read']]);
    }

    #[Route(path: '/entidad/{id}', name: 'entidad_update', methods: ['PUT'])]
    public function update(
        int                         $id,
        Request                     $request,
        EntidadRepository           $entidadRepository,
        ActividadRepository         $actividadRepository,
        UserPasswordHasherInterface $passwordHasher
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
                $existingEntidad = $entidadRepository->findOneBy(['nombre' => $nombre]);
                if ($existingEntidad && $existingEntidad->getIdEntidad() !== $entidad->getIdEntidad()) {
                    return $this->json(['error' => 'Entidad with this nombre already exists'], Response::HTTP_CONFLICT);
                }
                $entidad->setNombre($nombre);
            }
        }

        if (isset($json['cif'])) {
            $cif = strtoupper(trim($json['cif']));

            if (preg_match('/^[A-Z]\d{7}[A-Z]$/', $cif)) {
                if ($cif != $entidad->getCif()) {
                    $existingEntidad = $entidadRepository->findOneBy(['cif' => $cif]);
                    if ($existingEntidad && $existingEntidad->getIdEntidad() !== $entidad->getIdEntidad()) {
                        return $this->json(['error' => 'Entidad with this CIF already exists'], Response::HTTP_CONFLICT);
                    }
                    $entidad->setCif($cif);
                }
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
                if ($newLoginMail !== null) {
                    $existingEntidad = $entidadRepository->findOneBy(['loginMail' => $newLoginMail]);
                    if ($existingEntidad && $existingEntidad->getIdEntidad() !== $entidad->getIdEntidad()) {
                        return $this->json(['error' => 'Entidad with this login email already exists'], Response::HTTP_CONFLICT);
                    }
                }
                $entidad->setLoginMail($newLoginMail);
            }
        }

        if (isset($json['password'])) {
            $hashedPassword = $passwordHasher->hashPassword($entidad, $json['password']);
            $entidad->setPasswordHash($hashedPassword);
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
        int               $id,
        EntidadRepository $entidadRepository
    ): JsonResponse
    {
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
