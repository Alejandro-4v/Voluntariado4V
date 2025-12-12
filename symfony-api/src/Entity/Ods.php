<?php

namespace App\Entity;

use App\Repository\OdsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Attribute\Groups;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OdsRepository::class)]
#[ORM\Table(name: 'ODS')]
class Ods
{
    #[ORM\Id]
    #[ORM\Column(name: 'id_ods', type: 'smallint')]
    #[Groups(['ods:read'])]
    private ?int $idOds = null;

    #[ORM\Column(name: 'descripcion', type: 'string', length: 255)]
    #[Groups(['ods:read', 'ods:update'])]
    private string $descripcion;

    #[ORM\Column(name: 'imagen_url', type: 'string', length: 255, nullable: true)]
    #[Groups(['ods:read', 'ods:update'])]
    private ?string $imagen_url = null;

    public function setIdOds(int $idOds): self
    {
        $this->idOds = $idOds;
        return $this;
    }

    public function getIdOds(): ?int
    {
        return $this->idOds;
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
        return $this->imagen_url;
    }

    public function setImagenUrl(string $imagen_url): self
    {
        $this->imagen_url = $imagen_url;
        return $this;
    }
}
