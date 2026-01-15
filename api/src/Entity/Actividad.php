<?php

namespace App\Entity;

use App\Repository\ActividadRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ActividadRepository::class)]
#[ORM\Table(name: 'ACTIVIDAD')]
#[ORM\Index(fields: ['nombre'], name: 'IX_ACTIVIDAD_nombre')]
class Actividad
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(name: 'id_actividad', type: 'integer')]
    #[Groups(['actividad:read', 'entidad:read'])]
    private ?int $idActividad = null;

    #[ORM\Column(name: 'nombre', type: 'string', length: 50)]
    #[Groups(['actividad:read', 'actividad:update', 'entidad:read'])]
    private string $nombre;

    #[ORM\Column(name: 'descripcion', type: 'string', length: 400, nullable: true)]
    #[Groups(['actividad:read', 'actividad:update', 'entidad:read'])]
    private ?string $descripcion = null;

    #[ORM\Column(name: 'lugar', type: 'string', length: 255)]
    #[Groups(['actividad:read', 'actividad:update', 'entidad:read'])]
    private string $lugar;

    #[ORM\Column(name: 'plazas', type: 'smallint', nullable: true)]
    #[Groups(['actividad:read', 'actividad:update', 'entidad:read'])]
    private ?int $plazas = null;

    #[ORM\Column(name: 'estado', type: 'string', length: 1, options: ['default' => 'P'])]
    #[Groups(['actividad:read', 'actividad:update', 'entidad:read'])]
    private string $estado = 'P';

    #[ORM\ManyToOne(targetEntity: Entidad::class, inversedBy: 'actividades')]
    #[ORM\JoinColumn(name: 'convoca', referencedColumnName: 'id_entidad', nullable: false)]
    #[Groups(['actividad:read', 'actividad:update'])]
    private ?Entidad $convoca;

    #[ORM\Column(name: 'inicio', type: 'datetime_immutable')]
    #[Groups(['actividad:read', 'actividad:update', 'entidad:read'])]
    private DateTimeImmutable $inicio;

    #[ORM\Column(name: 'fin', type: 'datetime_immutable')]
    #[Groups(['actividad:read', 'actividad:update', 'entidad:read'])]
    private DateTimeImmutable $fin;

    #[ORM\Column(name: 'imagen_url', type: 'string', length: 255, nullable: true)]
    #[Groups(['actividad:read', 'actividad:update', 'entidad:read'])]
    private ?string $imagenUrl = null;

    #[ORM\ManyToOne(targetEntity: Grado::class, inversedBy: 'actividades')]
    #[ORM\JoinColumn(name: 'grado', referencedColumnName: 'id_grado', nullable: true)]
    #[Groups(['actividad:read', 'actividad:update'])]
    private ?Grado $grado = null;

    #[ORM\ManyToMany(targetEntity: TipoActividad::class, inversedBy: 'actividades')]
    #[ORM\JoinTable(name: 'ACTIVIDAD_TIPO')]
    #[ORM\JoinColumn(name: 'id_actividad', referencedColumnName: 'id_actividad')]
    #[ORM\InverseJoinColumn(name: 'id_tipo_actividad', referencedColumnName: 'id_tipo_actividad')]
    #[Groups(['actividad:read', 'actividad:update'])]
    private Collection $tiposActividad;

    #[ORM\ManyToMany(targetEntity: Ods::class, inversedBy: 'actividades')]
    #[ORM\JoinTable(name: 'ACTIVIDAD_ODS')]
    #[ORM\JoinColumn(name: 'id_actividad', referencedColumnName: 'id_actividad')]
    #[ORM\InverseJoinColumn(name: 'id_ods', referencedColumnName: 'id_ods')]
    #[Groups(['actividad:read', 'actividad:update'])]
    private Collection $ods;

    #[ORM\ManyToMany(targetEntity: Voluntario::class, inversedBy: 'actividades')]
    #[ORM\JoinTable(name: 'ACTIVIDAD_VOLUNTARIO')]
    #[ORM\JoinColumn(name: 'id_actividad', referencedColumnName: 'id_actividad')]
    #[ORM\InverseJoinColumn(name: 'nif', referencedColumnName: 'nif')]
    #[Groups(['actividad:read', 'actividad:update'])]
    private Collection $voluntarios;

    public function __construct()
    {
        $this->tiposActividad = new ArrayCollection();
        $this->ods = new ArrayCollection();
        $this->voluntarios = new ArrayCollection();
    }

    public function getIdActividad(): ?int
    {
        return $this->idActividad;
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

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(?string $descripcion): self
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    public function getLugar(): string
    {
        return $this->lugar;
    }

    public function setLugar(string $lugar): self
    {
        $this->lugar = $lugar;

        return $this;
    }

    public function getPlazas(): ?int
    {
        return $this->plazas;
    }

    public function setPlazas(?int $plazas): self
    {
        $this->plazas = $plazas;

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

    public function getConvoca(): ?Entidad
    {
        return $this->convoca;
    }

    public function setConvoca(?Entidad $convoca): self
    {
        $this->convoca = $convoca;

        return $this;
    }

    public function getInicio(): DateTimeImmutable
    {
        return $this->inicio;
    }

    public function setInicio(DateTimeImmutable $inicio): self
    {
        $this->inicio = $inicio;

        return $this;
    }

    public function getFin(): DateTimeImmutable
    {
        return $this->fin;
    }

    public function setFin(DateTimeImmutable $fin): self
    {
        $this->fin = $fin;

        return $this;
    }

    public function getImagenUrl(): ?string
    {
        return $this->imagenUrl;
    }

    public function setImagenUrl(?string $imagenUrl): self
    {
        $this->imagenUrl = $imagenUrl;

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

    public function getTiposActividad(): Collection
    {
        return $this->tiposActividad;
    }

    public function setTiposActividad(Collection $tiposActividad): self
    {
        $this->tiposActividad = $tiposActividad;

        return $this;
    }

    public function getOds(): Collection
    {
        return $this->ods;
    }

    public function setOds(Collection $ods): self
    {
        $this->ods = $ods;

        return $this;
    }


    public function getVoluntarios(): Collection
    {
        return $this->voluntarios;
    }

    public function setVoluntarios(Collection $voluntarios): self
    {
        $this->voluntarios = $voluntarios;

        return $this;
    }

}
