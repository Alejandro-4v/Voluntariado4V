<?php

namespace App\Controller;

use App\Entity\Administrador;
use App\Repository\AdministradorRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

final class AdministradorController extends AbstractController
{
    #[Route('/administrador', name: 'administrador_index', methods: ['GET'])]
    public function index(AdministradorRepository $administradorRepository): JsonResponse
    {
        $administradores = $administradorRepository->findAll();

        return $this->json($administradores, context: ['groups' => ['administrador:read']]);
    }

    #[Route('/administrador/{loginMail}', name: 'administrador_show', methods: ['GET'])]
    public function show(
        AdministradorRepository $administradorRepository,
        string $loginMail
    ): JsonResponse {
        $administrador = $administradorRepository->find($loginMail);

        if (!$administrador) {
            return $this->json(['error' => 'Administrador not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($administrador, context: ['groups' => ['administrador:read']]);
    }

    #[Route('/administrador', name: 'administrador_create', methods: ['POST'])]
    public function create(
        Request $request,
        AdministradorRepository $administradorRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if ($administradorRepository->find($data['loginMail'])) {
            return $this->json(['error' => 'Administrador with this email already exists'], Response::HTTP_CONFLICT);
        }

        $administrador = new Administrador();
        $administrador->setLoginMail($data['loginMail']);
        $administrador->setNombre($data['nombre']);
        $administrador->setApellido1($data['apellido1']);
        $administrador->setApellido2($data['apellido2'] ?? null);
        $administrador->setPerfilUrl($data['perfilUrl'] ?? null);

        $hashedPassword = $passwordHasher->hashPassword($administrador, $data['password']);
        $administrador->setPasswordHash($hashedPassword);

        $administradorRepository->add($administrador);

        return $this->json($administrador, Response::HTTP_CREATED, context: ['groups' => ['administrador:read']]);
    }

    #[Route('/administrador/{loginMail}', name: 'administrador_update', methods: ['PUT'])]
    public function update(
        string $loginMail,
        Request $request,
        AdministradorRepository $administradorRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $administrador = $administradorRepository->find($loginMail);

        if (!$administrador) {
            return $this->json(['error' => 'Administrador not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['nombre'])) {
            $administrador->setNombre($data['nombre']);
        }
        if (isset($data['apellido1'])) {
            $administrador->setApellido1($data['apellido1']);
        }
        if (isset($data['apellido2'])) {
            $administrador->setApellido2($data['apellido2']);
        }
        if (isset($data['perfilUrl'])) {
            $administrador->setPerfilUrl($data['perfilUrl']);
        }
        if (isset($data['password'])) {
            $hashedPassword = $passwordHasher->hashPassword($administrador, $data['password']);
            $administrador->setPasswordHash($hashedPassword);
        }

        $administradorRepository->update($administrador);

        return $this->json($administrador, context: ['groups' => ['administrador:read']]);
    }

    #[Route('/administrador/{loginMail}', name: 'administrador_delete', methods: ['DELETE'])]
    public function delete(
        string $loginMail,
        AdministradorRepository $administradorRepository
    ): JsonResponse {
        $administrador = $administradorRepository->find($loginMail);

        if (!$administrador) {
            return $this->json(['error' => 'Administrador not found'], Response::HTTP_NOT_FOUND);
        }

        $administradorRepository->remove($administrador);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}

