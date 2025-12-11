<?php

namespace App\Entity;

use App\Repository\DiaSemanaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: DiaSemanaRepository::class)]
#[ORM\Table(name: 'DIA_SEMANA')]
class DiaSemana
{
    #[ORM\Id]
    #[ORM\Column(name: 'id_dia', type: 'smallint')]
    #[Groups(['diaSemana:read'])]
    private ?int $idDia = null;

    #[ORM\Column(name: 'descripcion', type: 'string', length: 10, unique: true)]
    #[Groups(['diaSemana:read'])]
    private string $descripcion;

    #[ORM\OneToMany(targetEntity: Disponibilidad::class, mappedBy: 'diaSemana')]
    #[Groups(['diaSemana:read'])]
    private Collection $disponibilidades;

    public function __construct()
    {
        $this->disponibilidades = new ArrayCollection();
    }

    public function getIdDia(): ?int
    {
        return $this->idDia;
    }

    public function setIdDia(int $idDia): self
    {
        $this->idDia = $idDia;
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
     * @return Collection<int, Disponibilidad>
     */
    public function getDisponibilidades(): Collection
    {
        return $this->disponibilidades;
    }

}