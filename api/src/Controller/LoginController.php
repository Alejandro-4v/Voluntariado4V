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
            $user = $voluntarioRepository->findOneBy(['mail' => $loginMail]);
            if (!$user) {
                $user = $entidadRepository->findOneBy(['loginMail' => $loginMail]);
            }
            if (!$user) {
                $user = $administradorRepository->findOneBy(['loginMail' => $loginMail]);
            }
        }

        if ($user instanceof UserInterface) {
            error_log("DEBUG LOGIN: User found: " . $user->getUserIdentifier());
            error_log("DEBUG LOGIN: Raw password: '" . $password . "'");
            error_log("DEBUG LOGIN: Stored hash: '" . $user->getPassword() . "'");

            $isValid = $passwordHasher->isPasswordValid($user, $password);
            error_log("DEBUG LOGIN: Password valid: " . ($isValid ? 'YES' : 'NO'));

            if ($isValid) {
                return $this->json(['token' => $JWTManager->create($user)]);
            }
        } else {
            error_log("DEBUG LOGIN: User not found for mail: " . $loginMail);
        }

        return $this->json(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
    }
}
