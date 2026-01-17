<?php

namespace App\Controller;

use App\Entity\Entidad;
use App\Repository\EntidadRepository;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;

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
        Request $request
    ): JsonResponse {
        if (!$this->isGranted('IS_AUTHENTICATED_FULLY')) {
            throw $this->createAccessDeniedException('Access denied');
        }
        $filters = $request->query->all();

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
        if (!$this->isGranted('IS_AUTHENTICATED_FULLY')) {
            throw $this->createAccessDeniedException('Access denied');
        }
        $entidad = $entidadRepository->find($id);

        if (!$entidad) {
            return $this->json(
                ['error' => 'Entidad not found', 'details' => "Entidad with id $id not found"],
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
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        if (!$this->isGranted('ROLE_ADMINISTRADOR')) {
            throw $this->createAccessDeniedException('Access denied');
        }
        $json = json_decode($request->getContent(), true);

        $entidad = new Entidad();

        if (isset($json['nombre'])) {
            if ($entidadRepository->findOneBy(['nombre' => $json['nombre']])) {
                return $this->json([
                    'error' => 'Entidad already exists',
                    'details' => "Entidad with nombre {$json['nombre']} already exists"
                ], Response::HTTP_CONFLICT);
            }
            $entidad->setNombre($json['nombre']);
        } else {
            return $this->json([
                'error' => 'Missing nombre',
                'details' => 'The field nombre is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['cif'])) {
            if (!preg_match('/^[A-Z][0-9]{7}[A-Z0-9]$/', $json['cif'])) {
                return $this->json([
                    'error' => 'Invalid CIF format',
                    'details' => 'CIF must consist of a letter, followed by 7 digits, and a control character'
                ], Response::HTTP_BAD_REQUEST);
            }
            if ($entidadRepository->findOneBy(['cif' => $json['cif']])) {
                return $this->json([
                    'error' => 'CIF already exists',
                    'details' => "Entidad with CIF {$json['cif']} already exists"
                ], Response::HTTP_CONFLICT);
            }
            $entidad->setCif($json['cif']);
        } else {
            return $this->json([
                'error' => 'Missing CIF',
                'details' => 'The field cif is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['nombreResponsable'])) {
            $entidad->setNombreResponsable($json['nombreResponsable']);
        } else {
            return $this->json([
                'error' => 'Missing nombreResponsable',
                'details' => 'The field nombreResponsable is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['apellidosResponsable'])) {
            $entidad->setApellidosResponsable($json['apellidosResponsable']);
        } else {
            return $this->json([
                'error' => 'Missing apellidosResponsable',
                'details' => 'The field apellidosResponsable is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['contactMail'])) {
            if (!filter_var($json['contactMail'], FILTER_VALIDATE_EMAIL)) {
                return $this->json([
                    'error' => 'Invalid email format',
                    'details' => 'contactMail must be a valid email address'
                ], Response::HTTP_BAD_REQUEST);
            }
            $entidad->setContactMail($json['contactMail']);
        } else {
            return $this->json([
                'error' => 'Missing contactMail',
                'details' => 'The field contactMail is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['loginMail'])) {
            if (!filter_var($json['loginMail'], FILTER_VALIDATE_EMAIL)) {
                return $this->json([
                    'error' => 'Invalid email format',
                    'details' => 'loginMail must be a valid email address'
                ], Response::HTTP_BAD_REQUEST);
            }
            if ($entidadRepository->findOneBy(['loginMail' => $json['loginMail']])) {
                return $this->json([
                    'error' => 'Login email already exists',
                    'details' => "Entidad with loginMail {$json['loginMail']} already exists"
                ], Response::HTTP_CONFLICT);
            }
            $entidad->setLoginMail($json['loginMail']);
        } else {
            return $this->json([
                'error' => 'Missing loginMail',
                'details' => 'The field loginMail is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['password'])) {
            $hashedPassword = $passwordHasher->hashPassword(
                $entidad,
                $json['password']
            );
            $entidad->setPasswordHash($hashedPassword);
        } else {
            return $this->json([
                'error' => 'Missing password',
                'details' => 'The field password is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($json['perfilUrl'])) {
            $entidad->setPerfilUrl($json['perfilUrl']);
        } else {
            $entidad->setPerfilUrl(null);
        }

        $entidadRepository->add($entidad);

        return $this->json($entidad, context: ['groups' => ['entidad:read']], status: Response::HTTP_CREATED);
    }

    #[Route('/entidad/{id}', name: 'entidad_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        EntidadRepository $entidadRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $user = $this->getUser();
        if (!$this->isGranted('ROLE_ADMINISTRADOR')) {
            if (!($user instanceof \App\Entity\Entidad) || $user->getIdEntidad() !== $id) {
                throw $this->createAccessDeniedException('Access denied');
            }
        }
        $json = json_decode($request->getContent(), true);
        $entidad = $entidadRepository->find($id);

        if (!$entidad) {
            return $this->json([
                'error' => 'Entidad not found',
                'details' => "Entidad with id $id not found"
            ], Response::HTTP_NOT_FOUND);
        }

        if (isset($json['nombre'])) {
            $existing = $entidadRepository->findOneBy(['nombre' => $json['nombre']]);
            if ($existing && $existing->getIdEntidad() !== $id) {
                return $this->json([
                    'error' => 'Entidad already exists',
                    'details' => "Entidad with nombre {$json['nombre']} already exists"
                ], Response::HTTP_CONFLICT);
            }
            $entidad->setNombre($json['nombre']);
        }

        if (isset($json['cif'])) {
            if (!preg_match('/^[A-Z][0-9]{7}[A-Z0-9]$/', $json['cif'])) {
                return $this->json([
                    'error' => 'Invalid CIF format',
                    'details' => 'CIF must consist of a letter, followed by 7 digits, and a control character'
                ], Response::HTTP_BAD_REQUEST);
            }
            $existing = $entidadRepository->findOneBy(['cif' => $json['cif']]);
            if ($existing && $existing->getIdEntidad() !== $id) {
                return $this->json([
                    'error' => 'CIF already exists',
                    'details' => "Entidad with CIF {$json['cif']} already exists"
                ], Response::HTTP_CONFLICT);
            }
            $entidad->setCif($json['cif']);
        }

        if (isset($json['nombreResponsable'])) {
            $entidad->setNombreResponsable($json['nombreResponsable']);
        }

        if (isset($json['apellidosResponsable'])) {
            $entidad->setApellidosResponsable($json['apellidosResponsable']);
        }

        if (isset($json['contactMail'])) {
            if (!filter_var($json['contactMail'], FILTER_VALIDATE_EMAIL)) {
                return $this->json([
                    'error' => 'Invalid email format',
                    'details' => 'contactMail must be a valid email address'
                ], Response::HTTP_BAD_REQUEST);
            }
            $entidad->setContactMail($json['contactMail']);
        }

        if (isset($json['loginMail'])) {
            if (!filter_var($json['loginMail'], FILTER_VALIDATE_EMAIL)) {
                return $this->json([
                    'error' => 'Invalid email format',
                    'details' => 'loginMail must be a valid email address'
                ], Response::HTTP_BAD_REQUEST);
            }
            $existing = $entidadRepository->findOneBy(['loginMail' => $json['loginMail']]);
            if ($existing && $existing->getIdEntidad() !== $id) {
                return $this->json([
                    'error' => 'Login email already exists',
                    'details' => "Entidad with loginMail {$json['loginMail']} already exists"
                ], Response::HTTP_CONFLICT);
            }
            $entidad->setLoginMail($json['loginMail']);
        }

        if (isset($json['password'])) {
            $hashedPassword = $passwordHasher->hashPassword(
                $entidad,
                $json['password']
            );
            $entidad->setPasswordHash($hashedPassword);
        }

        if (isset($json['perfilUrl'])) {
            $entidad->setPerfilUrl($json['perfilUrl']);
        }

        $entidadRepository->update($entidad);

        return $this->json($entidad, context: ['groups' => ['entidad:read']]);
    }

    #[Route('/entidad/{id}', name: 'entidad_delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        EntidadRepository $entidadRepository
    ): JsonResponse {
        $user = $this->getUser();
        if (!$this->isGranted('ROLE_ADMINISTRADOR')) {
            if (!($user instanceof \App\Entity\Entidad) || $user->getIdEntidad() !== $id) {
                throw $this->createAccessDeniedException('Access denied');
            }
        }
        $entidad = $entidadRepository->find($id);

        if (!$entidad) {
            return $this->json([
                'error' => 'Entidad not found',
                'details' => "Entidad with id $id not found"
            ], Response::HTTP_NOT_FOUND);
        }

        $entidadRepository->remove($entidad);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
