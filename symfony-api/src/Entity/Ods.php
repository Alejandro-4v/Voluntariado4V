<?php

namespace App\Entity;

use App\Repository\OdsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: OdsRepository::class)]
#[ORM\Table(name: 'ODS')]
class Ods
{
    #[ORM\Id]
    #[ORM\Column(name: 'id_ods', type: 'smallint')]
    #[Groups(['ods:read'])]
    private ?int $idOds = null;

    #[ORM\Column(name: 'descripcion', type: 'string', length: 50)]
    #[Groups(['ods:read'])]
    private string $descripcion;
    
    // Relación Inversa (ManyToMany) con Actividad, mapeada por 'ods' en Actividad.php
    #[ORM\ManyToMany(targetEntity: Actividad::class, mappedBy: 'ods')]
    private Collection $actividades;


    public function __construct()
    {
        $this->actividades = new ArrayCollection();
    }

    public function getIdOds(): ?int
    {
        return $this->idOds;
    }

    public function setIdOds(int $idOds): self
    {
        $this->idOds = $idOds;
        return $this;
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
    
}