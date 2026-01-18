<?php

namespace App\EventListener;

use App\Entity\Entidad;
use App\Entity\Voluntario;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

#[AsEventListener(event: 'lexik_jwt_authentication.on_jwt_created')]
final class JWTCreatedListener
{
    public function __invoke(JWTCreatedEvent $event): void
    {
        $payload = $event->getData();
        $user = $event->getUser();

        if ($user instanceof Voluntario) {
            $payload['nif'] = $user->getNif();
            $payload['roles'] = $user->getRoles(); // Ensure roles are present
        } elseif ($user instanceof Entidad) {
            $payload['id_entidad'] = $user->getIdEntidad();
            $payload['roles'] = $user->getRoles();
        } else {
            // Admin or other users
            $payload['roles'] = $user->getRoles();
        }

        $event->setData($payload);
    }
}
