<?php

namespace App\Entity;

use App\Repository\GradoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Attribute\Groups;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GradoRepository::class)]
#[ORM\Table(name: 'GRADO')]
class Grado
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(name: 'id_grado', type: 'smallint')]
    #[Groups(['grado:read'])]
    private ?int $idGrado = null;

    #[ORM\Column(name: 'nivel', type: 'string', length: 1)]
    #[Groups(groups: ['grado:read'])]
    private string $nivel;

    #[ORM\Column(name: 'descripcion', type: 'string', length: 50, unique: true)]
    #[Groups(['grado:read'])]
    private string $descripcion;

    // Relación bidireccional: Una entidad tiene un Grado, pero un Grado tiene muchas Actividades.
    #[ORM\OneToMany(targetEntity: Actividad::class, mappedBy: 'grado')]
    private Collection $actividades;

    #[ORM\OneToMany(targetEntity: Voluntario::class, mappedBy: 'grado')]
    private Collection $voluntarios;

    public function __construct()
    {
        $this->actividades = new ArrayCollection();
        $this->voluntarios = new ArrayCollection();
    }

    public function getIdGrado(): ?int
    {
        return $this->idGrado;
    }

    public function getNivel(): string
    {
        return $this->nivel;
    }

    public function setNivel(string $nivel): self
    {
        $this->nivel = $nivel;
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
     * Summary of getActividades
     * @return Actividad[]|Collection
     */
    public function getActividades(): Collection
    {
        return $this->actividades;
    }

    /**
     * Summary of getVoluntarios
     * @return Voluntario[]|Collection
     */
    public function getVoluntarios(): Collection
    {
        return $this->voluntarios;
    }

}