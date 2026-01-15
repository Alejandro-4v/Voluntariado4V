<?php

namespace App\Entity;

use App\Repository\EntidadRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use DateTimeImmutable;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: EntidadRepository::class)]
#[ORM\Table(name: 'ENTIDAD')]
class Entidad implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(name: 'id_entidad', type: 'smallint')]
    #[Groups(['entidad:read', 'actividad:read'])]
    private ?int $idEntidad = null;

    #[ORM\Column(name: 'cif', type: 'string', length: 10, unique: true, nullable: true)]
    #[Groups(['entidad:read', 'actividad:read'])]
    private ?string $cif = null;

    #[ORM\Column(name: 'nombre', type: 'string', length: 50, unique: true)]
    #[Groups(['entidad:read', 'actividad:read'])]
    private string $nombre;

    #[ORM\Column(name: 'nombre_responsable', type: 'string', length: 30)]
    #[Groups(['entidad:read', 'actividad:read'])]
    private string $nombreResponsable;

    #[ORM\Column(name: 'apellidos_responsable', type: 'string', length: 40)]
    #[Groups(['entidad:read', 'actividad:read'])]
    private string $apellidosResponsable;

    #[ORM\Column(name: 'fecha_registro', type: 'datetime_immutable')]
    #[Groups(['entidad:read'])]
    private DateTimeImmutable $fechaRegistro;

    #[ORM\Column(name: 'contact_mail', type: 'string', length: 255)]
    #[Groups(['entidad:read', 'actividad:read'])]
    private string $contactMail;

    #[ORM\Column(name: 'login_mail', type: 'string', length: 255, nullable: true)]
    #[Groups(['entidad:read', 'entidad:login'])]
    private ?string $loginMail = null;

    #[ORM\Column(name: 'password_hash', type: 'string', length: 255, nullable: true)]
    #[Groups(['entidad:read', 'entidad:login'])]
    private ?string $passwordHash = null;

    #[ORM\Column(name: 'perfil_url', type: 'string', length: 255, nullable: true)]
    #[Groups(['entidad:read', 'actividad:read'])]
    private ?string $perfilUrl = null;

    #[ORM\OneToMany(targetEntity: Actividad::class, mappedBy: 'convoca')]
    #[Groups(['entidad:read'])]
    private Collection $actividades;

    public function __construct()
    {
        $this->fechaRegistro = new DateTimeImmutable();
        $this->actividades = new ArrayCollection();
    }

    public function getIdEntidad(): ?int
    {
        return $this->idEntidad;
    }

    public function getCif(): ?string
    {
        return $this->cif;
    }

    public function setCif(?string $cif): self
    {
        $this->cif = $cif;
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

    public function getNombreResponsable(): string
    {
        return $this->nombreResponsable;
    }

    public function setNombreResponsable(string $nombreResponsable): self
    {
        $this->nombreResponsable = $nombreResponsable;
        return $this;
    }

    public function getApellidosResponsable(): string
    {
        return $this->apellidosResponsable;
    }

    public function setApellidosResponsable(string $apellidosResponsable): self
    {
        $this->apellidosResponsable = $apellidosResponsable;
        return $this;
    }

    public function getFechaRegistro(): DateTimeImmutable
    {
        return $this->fechaRegistro;
    }

    public function setFechaRegistro(DateTimeImmutable $fechaRegistro): self
    {
        $this->fechaRegistro = $fechaRegistro;
        return $this;
    }

    public function getContactMail(): string
    {
        return $this->contactMail;
    }

    public function setContactMail(string $contactMail): self
    {
        $this->contactMail = $contactMail;
        return $this;
    }

    public function getLoginMail(): ?string
    {
        return $this->loginMail;
    }

    public function setLoginMail(?string $loginMail): self
    {
        $this->loginMail = $loginMail;
        return $this;
    }

    public function getPasswordHash(): ?string
    {
        return $this->passwordHash;
    }

    public function setPasswordHash(?string $passwordHash): self
    {
        $this->passwordHash = $passwordHash;
        return $this;
    }

    public function getPerfilUrl(): string
    {
        return $this->perfilUrl;
    }

    public function setPerfilUrl(?string $perfilUrl): self
    {
        $this->perfilUrl = $perfilUrl;
        return $this;
    }

    public function getActividades(): Collection
    {
        return $this->actividades;
    }

    public function setActividades(Collection $actividades): self
    {
        $this->actividades = $actividades;
        return $this;
    }

    public function getRoles(): array
    {
        return ['ROLE_ENTIDAD'];
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
    }

    public function getUserIdentifier(): string
    {
        return $this->loginMail;
    }

    public function getPassword(): ?string
    {
        return $this->passwordHash;
    }

}
