<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Attribute\Groups;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\GradoRepository;

#[ORM\Entity(repositoryClass: GradoRepository::class)]
#[ORM\Table(name: 'GRADO')]
class Grado
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(name: 'id_grado', type: 'smallint')]
    #[Groups(['grado:read', 'actividad:read'])]
    private ?int $idGrado = null;

    #[ORM\Column(name: 'nivel', type: 'string', length: 1)]
    #[Groups(groups: ['grado:read', 'grado:update', 'actividad:read'])]
    private string $nivel;

    #[ORM\Column(name: 'descripcion', type: 'string', length: 50, unique: true)]
    #[Groups(['grado:read', 'grado:update', 'actividad:read'])]
    private string $descripcion;

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

}