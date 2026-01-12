<?php

namespace App\Entity;

use App\Repository\TipoActividadRepository;
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
    #[Groups(['tipoActividad:read', 'actividad:read'])]
    private ?int $idTipoActividad = null;

    #[ORM\Column(name: 'descripcion', type: 'string', length: 50)]
    #[Groups(['tipoActividad:read', 'tipoActividad:update', 'actividad:read'])]
    private string $descripcion;

    #[ORM\Column(name: 'imagen_url', type: 'string', length: 255, nullable: true)]
    #[Groups(['tipoActividad:read', 'tipoActividad:update', 'actividad:read'])]
    private ?string $imagenUrl = null;

    #[ORM\ManyToMany(targetEntity: Actividad::class, inversedBy: 'tiposActividad')]
    #[ORM\JoinTable(name: 'ACTIVIDAD_TIPO')]
    #[ORM\JoinColumn(name: 'id_tipo_actividad', referencedColumnName: 'id_tipo_actividad')]
    #[ORM\InverseJoinColumn(name: 'id_actividad', referencedColumnName: 'id_actividad')]
    private Collection $actividades;

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

    public function getImagenUrl(): string
    {
        return $this->imagenUrl;
    }

    public function setImagenUrl(string $imagenUrl): self
    {
        $this->imagenUrl = $imagenUrl;
        return $this;
    }

    public function getActividades(): Collection
    {
        return $this->actividades;
    }

}