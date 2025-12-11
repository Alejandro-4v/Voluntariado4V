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
    #[Groups(['actividad: read'])]
    private ?int $idActividad = null;

    #[ORM\Column(name: 'nombre', type: 'string', length: 50)]
    #[Groups(['actividad: read'])]
    private string $nombre;

    #[ORM\Column(name: 'descripcion', type: 'string', length: 400, nullable: true)]
    #[Groups(['actividad: read'])]
    private ?string $descripcion = null;

    #[ORM\Column(name: 'estado', type: 'string', length: 1, options: ['default' => 'P'])]
    #[Groups(['actividad: read'])]
    private string $estado = 'P';

    #[ORM\ManyToOne(targetEntity: Entidad::class, inversedBy: 'actividades')]
    #[ORM\JoinColumn(name: 'convoca', referencedColumnName: 'id_entidad', nullable: false)]
    #[Groups(['actividad: read'])]
    private ?Entidad $convoca = null;

    #[ORM\Column(name: 'inicio', type: 'datetime_immutable')]
    #[Groups(['actividad: read'])]
    private DateTimeImmutable $inicio;

    #[ORM\Column(name: 'fin', type: 'datetime_immutable')]
    #[Groups(['actividad: read'])]
    private DateTimeImmutable $fin;

    #[ORM\Column(name:'image_url', type: 'string', length:255, nullable: true)]
    #[Groups(['actividad:read'])]
    private ?string $image_url = null;


    // Mapeo ManyToOne a GRADO (clave foránea 'grado')
    // El campo 'grado' en la DB es un TINYINT, pero su valor semántico es el nivel.
    #[ORM\ManyToOne(targetEntity: Grado::class, inversedBy: 'actividades')]
    #[ORM\JoinColumn(name: 'grado', referencedColumnName: 'id_grado', nullable: false)]
    private ?Grado $grado = null;
    
    // --- Relación ManyToMany con TIPO_ACTIVIDAD (Tabla puente ACTIVIDAD_TIPO) ---
    // Esta es la parte "propietaria" de la relación
    #[ORM\ManyToMany(targetEntity: TipoActividad::class, inversedBy: 'actividades')]
    #[ORM\JoinTable(name: 'ACTIVIDAD_TIPO')] // Nombre de la tabla puente
    #[ORM\JoinColumn(name: 'id_actividad', referencedColumnName: 'id_actividad')]
    #[ORM\InverseJoinColumn(name: 'id_tipo_actividad', referencedColumnName: 'id_tipo_actividad')]
    private Collection $tiposActividad;
    
    // --- Relación ManyToMany con ODS (Tabla puente ACTIVIDAD_ODS) ---
    // Esta es la parte "propietaria" de la relación
    #[ORM\ManyToMany(targetEntity: Ods::class, inversedBy: 'actividades')]
    #[ORM\JoinTable(name: 'ACTIVIDAD_ODS')] // Nombre de la tabla puente
    #[ORM\JoinColumn(name: 'id_actividad', referencedColumnName: 'id_actividad')]
    #[ORM\InverseJoinColumn(name: 'id_ods', referencedColumnName: 'id_ods')]
    #[Groups(['actividad:read'])]
    private Collection $ods;


    public function __construct()
    {
        // Inicializar las colecciones ManyToMany
        $this->tiposActividad = new ArrayCollection();
        $this->ods = new ArrayCollection();
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
    
    public function getGrado(): ?Grado
    {
        return $this->grado;
    }

    public function setGrado(?Grado $grado): self
    {
        $this->grado = $grado;
        return $this;
    }

    /**
     * @return Collection<int, TipoActividad>
     */
    public function getTiposActividad(): Collection
    {
        return $this->tiposActividad;
    }

    /**
     * @return Collection<int, Ods>
     */
    public function getOds(): Collection
    {
        return $this->ods;
    }
    
}