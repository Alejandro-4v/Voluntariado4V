<?php

namespace App\Entity;

use App\Repository\AdministradorRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: AdministradorRepository::class)]
#[ORM\Table(name: 'ADMINISTRADOR')]
class Administrador
{

    #[ORM\Id]
    #[ORM\Column(name: 'login_mail', type: 'string', length: 255)]
    #[Groups(['administrador:read', 'administrador:login'])]
    private ?string $loginMail = null;

    #[ORM\Column(name: 'password_hash', type: 'string', length: 255)]
    #[Groups(['administrador:read', 'administrador:login'])]
    private string $passwordHash;

    #[ORM\Column(name: 'nombre', type: 'string', length: 40)]
    #[Groups(['administrador:read'])]
    private string $nombre;

    #[ORM\Column(name: 'apellido_1', type: 'string', length: 40)]
    #[Groups(['administrador:read'])]
    private string $apellido1;

    #[ORM\Column(name: 'apellido_2', type: 'string', length: 40, nullable: true)]
    #[Groups(['administrador:read'])]
    private ?string $apellido2 = null;

    #[ORM\Column(name: 'perfil_url', type: 'string', length: 255, nullable: true)]
    #[Groups(['administrador:read'])]
    private ?string $perfil_url = null;

    public function getLoginMail(): ?string
    {
        return $this->loginMail;
    }

    public function setLoginMail(string $loginMail): self
    {
        $this->loginMail = $loginMail;
        return $this;
    }

    public function getPasswordHash(): string
    {
        return $this->passwordHash;
    }

    public function setPasswordHash(string $passwordHash): self
    {
        $this->passwordHash = $passwordHash;
        return $this;
    }

    public function getNombre(): string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): self
    {
        $this->nombre = $nombre;
        return $this;
    }

    public function getApellido1(): string
    {
        return $this->apellido1;
    }

    public function setApellido1(string $apellido1): self
    {
        $this->apellido1 = $apellido1;
        return $this;
    }

    public function getApellido2(): ?string
    {
        return $this->apellido2;
    }

    public function setApellido2(?string $apellido2): self
    {
        $this->apellido2 = $apellido2;
        return $this;
    }

    public function getPerfilUrl(): string
    {
        return $this->perfil_url;
    }

    public function setPerfilUrl(string $perfil_url): self
    {
        $this->perfil_url = $perfil_url;
        return $this;
    }

}