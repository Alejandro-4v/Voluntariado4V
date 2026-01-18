<?php

namespace App\Controller;

use App\Repository\AdministradorRepository;
use App\Repository\EntidadRepository;
use App\Repository\VoluntarioRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\UserInterface;

final class LoginController extends AbstractController
{
    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request,
        VoluntarioRepository $voluntarioRepository,
        EntidadRepository $entidadRepository,
        AdministradorRepository $administradorRepository,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $JWTManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $type = $request->query->get('usuario');

        if (!isset($data['loginMail']) || !isset($data['password'])) {
            return $this->json(['error' => 'Missing credentials'], Response::HTTP_BAD_REQUEST);
        }

        $loginMail = $data['loginMail'];
        $password = $data['password'];
        $user = null;

        if ($type === 'voluntario') {
            $user = $voluntarioRepository->findOneBy(['mail' => $loginMail]);
        } elseif ($type === 'entidad') {
            $user = $entidadRepository->findOneBy(['loginMail' => $loginMail]);
        } elseif ($type === 'administrador') {
            $user = $administradorRepository->findOneBy(['loginMail' => $loginMail]);
        } else {
            return $this->json([
                'error' => 'Invalid or missing user type. Available types: voluntario, entidad, administrador'
            ], Response::HTTP_BAD_REQUEST);
        }

        if ($user instanceof UserInterface && $passwordHasher->isPasswordValid($user, $password)) {
            $userData = [
                'email' => $loginMail,
                'role' => match ($type) {
                    'voluntario' => 'volunteer',
                    'entidad' => 'entity',
                    'administrador' => 'admin',
                    default => 'volunteer'
                }
            ];

            if ($type === 'voluntario') {
                $userData['nif'] = $user->getNif();
                $userData['name'] = $user->getNombre() . ' ' . $user->getApellido1();
                $userData['gradeId'] = $user->getGrado()->getIdGrado();
            } elseif ($type === 'entidad') {
                $userData['id'] = $user->getIdEntidad();
                $userData['cif'] = $user->getCif();
                $userData['name'] = $user->getNombre();
            } elseif ($type === 'administrador') {
                $userData['name'] = $user->getNombre();
            }

            return $this->json([
                'token' => $JWTManager->create($user),
                'user' => $userData
            ]);
        }

        error_log("Invalid credentials");
        return $this->json(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
    }
}
