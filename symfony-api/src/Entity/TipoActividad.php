<?php

namespace App\Entity;

use App\Repository\TipoActividadRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: TipoActividadRepository::class)]
#[ORM\Table(name: 'TIPO_ACTIVIDAD')]
class TipoActividad
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(name: 'id_tipo_actividad', type: 'smallint')]
    private ?int $idTipoActividad = null;

    #[ORM\Column(name: 'descripcion', type: 'string', length: 20)]
    private string $descripcion;

    // Relación Inversa (ManyToMany) con Actividad, mapeada por 'tiposActividad' en Actividad.php
    #[ORM\ManyToMany(targetEntity: Actividad::class, mappedBy: 'tiposActividad')]
    private Collection $actividades;

    #[ORM\ManyToMany(targetEntity: Voluntario::class, mappedBy: 'tiposActividad')]
    private Collection $voluntarios;

    public function __construct()
    {
        $this->actividades = new ArrayCollection();
        $this->voluntarios = new ArrayCollection();
    }

    public function getIdTipoActividad(): ?int
    {
        return $this->idTipoActividad;
    }

    public function getDescripcion(): string
    {
        return $this->descripcion;
    }

    public function setDescripcion(string $descripcion): self
    {
        $this->descripcion = $descripcion;
        return $this;
    }

    /**
     * @return Collection<int, Actividad>
     */
    public function getActividades(): Collection
    {
        return $this->actividades;
    }

    /**
     * @return Collection<int, Voluntario>
     */
    public function getVoluntarios(): Collection
    {
        return $this->voluntarios;
    }

}