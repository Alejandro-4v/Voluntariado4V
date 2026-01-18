<?php

namespace App\Entity;

use App\Repository\VoluntarioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: VoluntarioRepository::class)]
#[ORM\Table(name: 'VOLUNTARIO')]
#[ORM\Index(columns: ['nombre', 'apellido_1', 'apellido_2'], name: 'IX_VOLUNTARIO_nombre_completo')]
class Voluntario implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\Column(name: 'nif', type: 'string', length: 10)]
    #[Groups(['voluntario:read', 'actividad:read'])]
    private ?string $nif;

    #[ORM\Column(name: 'nombre', type: 'string', length: 40)]
    #[Groups(['voluntario:read', 'actividad:read'])]
    private string $nombre;

    #[ORM\Column(name: 'apellido_1', type: 'string', length: 40)]
    #[Groups(['voluntario:read', 'actividad:read'])]
    private string $apellido1;

    #[ORM\Column(name: 'apellido_2', type: 'string', length: 40, nullable: true)]
    #[Groups(['voluntario:read', 'actividad:read'])]
    private ?string $apellido2 = null;

    #[ORM\ManyToOne(targetEntity: Grado::class, inversedBy: 'voluntarios')]
    #[ORM\JoinColumn(name: 'grado', referencedColumnName: 'id_grado', nullable: false)]
    #[Groups(['voluntario:read', 'actividad:read'])]
    private ?Grado $grado;

    #[ORM\Column(name: 'mail', type: 'string', length: 255, unique: true)]
    #[Groups(['voluntario:read', 'voluntario: login', 'actividad:read'])]
    private string $mail;

    #[ORM\Column(name: 'password_hash', type: 'string', length: 255)]
    #[Groups(['voluntario:read', 'voluntario: login'])]
    private string $passwordHash;

    #[ORM\Column(name: 'estado', type: 'string', length: 1, options: ['default' => 'P'])]
    #[Groups(['voluntario:read'])]
    private string $estado = 'P';

    #[ORM\Column(name: 'perfil_url', type: 'string', length: 255, nullable: true)]
    #[Groups(['voluntario:read', 'actividad:read'])]
    private ?string $perfilUrl = null;

    #[ORM\OneToMany(targetEntity: Disponibilidad::class, mappedBy: 'voluntario', cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['voluntario:read'])]
    private Collection $disponibilidades;

    #[ORM\ManyToMany(targetEntity: TipoActividad::class, inversedBy: 'voluntarios')]
    #[ORM\JoinTable(name: 'VOLUNTARIO_TIPO')]
    #[ORM\JoinColumn(name: 'nif', referencedColumnName: 'nif')]
    #[ORM\InverseJoinColumn(name: 'id_tipo_actividad', referencedColumnName: 'id_tipo_actividad')]
    #[Groups(['voluntario:read'])]
    private Collection $tiposActividad;

    #[ORM\ManyToMany(targetEntity: Actividad::class, mappedBy: 'voluntarios')]
    private Collection $actividades;

    public function __construct()
    {
        $this->disponibilidades = new ArrayCollection();
        $this->tiposActividad = new ArrayCollection();
        $this->actividades = new ArrayCollection();
    }

    public function getNif(): ?string
    {
        return $this->nif;
    }

    public function setNif(string $nif): self
    {
        $this->nif = $nif;
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

    public function getGrado(): ?Grado
    {
        return $this->grado;
    }

    public function setGrado(?Grado $grado): self
    {
        $this->grado = $grado;
        return $this;
    }

    public function getMail(): string
    {
        return $this->mail;
    }

    public function setMail(string $mail): self
    {
        $this->mail = $mail;
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

    public function getEstado(): string
    {
        return $this->estado;
    }

    public function setEstado(string $estado): self
    {
        $this->estado = $estado;
        return $this;
    }

    public function getPerfilUrl(): string
    {
        return $this->perfilUrl;
    }

    public function setPerfilUrl(string $perfilUrl): self
    {
        $this->perfilUrl = $perfilUrl;
        return $this;
    }

    public function getDisponibilidades(): Collection
    {
        return $this->disponibilidades;
    }

    public function getTiposActividad(): Collection
    {
        return $this->tiposActividad;
    }

    public function getActividades(): Collection
    {
        return $this->actividades;
    }

    public function setTiposActividad(Collection $tiposActividad): self
    {
        $this->tiposActividad = $tiposActividad;
        return $this;
    }

    public function getRoles(): array
    {
        return ['ROLE_VOLUNTARIO'];
    }

    public function eraseCredentials(): void
    {
        // No sensitive data to clear
    }

    public function getUserIdentifier(): string
    {
        return $this->mail;
    }

    public function setDisponibilidades(Collection $disponibilidades): self
    {
        $this->disponibilidades = $disponibilidades;
        return $this;
    }

    public function addDisponibilidad(Disponibilidad $disponibilidad): self
    {
        if (!$this->disponibilidades->contains($disponibilidad)) {
            $this->disponibilidades[] = $disponibilidad;
            $disponibilidad->setVoluntario($this);
        }

        return $this;
    }

    public function removeDisponibilidad(Disponibilidad $disponibilidad): self
    {
        if ($this->disponibilidades->removeElement($disponibilidad)) {
            if ($disponibilidad->getVoluntario() === $this) {
                $disponibilidad->setVoluntario(null);
            }
        }

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->passwordHash;
    }
}
